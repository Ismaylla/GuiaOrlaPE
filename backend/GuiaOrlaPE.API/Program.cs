using GuiaOrlaPE.API.Repository.Implementation;
using GuiaOrlaPE.API.Repository.Intefaces;
using GuiaOrlaPE.API.Service.Implementation;
using GuiaOrlaPE.API.Service.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (builder.Environment.IsEnvironment("Testing"))
    {
        options.UseSqlite(builder.Configuration.GetConnectionString("TesteDefaultConnection"));
    }
    else
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
        options.ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }
});

// Associado a interface à classe concreta UserRepository
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBusinessRepository, BusinessRepository>();

builder.Services.AddScoped<IBusinessService, BusinessService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// ---------------------------------------------------------------------------
// Sincronização Absoluta com a Chave do Appsettings e NextAuth
// ---------------------------------------------------------------------------
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("A chave JWT não está configurada.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,      // Permite a flexibilidade exigida pelo NextAuth local
        ValidateAudience = false,    // Evita conflitos de portas entre localhost:3000 e 5148
        ValidateLifetime = true,     // Mantém a expiração de 120 minutos ativa e segura
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});
// ---------------------------------------------------------------------------

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "GuiaOrla API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira o token JWT desta forma: Bearer SEU_TOKEN_AQUI"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Origens permitidas para CORS. Em produção/CasaOS, defina a variável de
// ambiente Cors__AllowedOrigins (ex.: "http://192.168.0.50:3000"). Aceita
// múltiplas origens separadas por vírgula ou ponto-e-vírgula.
var corsOrigins = builder.Configuration["Cors:AllowedOrigins"]
    ?.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

if (corsOrigins is null || corsOrigins.Length == 0)
{
    corsOrigins = new[] { "http://localhost:3000" };
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins(corsOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// Aplica migrations ou garante que o banco esteja criado
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // EnsureCreated cria o banco e as tabelas com a estrutura exata 
    // das suas classes C# atuais, sem precisar de migrações.
    db.Database.EnsureCreated();
}

app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "GuiaOrla API v1");
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

// ADICIONADO: Ativa o suporte físico para servir arquivos binários (imagens da pasta wwwroot)
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }