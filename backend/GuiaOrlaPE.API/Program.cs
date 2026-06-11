// using GuiaOrlaPE.API.Repository.Implementation;
// using GuiaOrlaPE.API.Repository.Intefaces;
// using GuiaOrlaPE.API.Service.Implementation;
// using GuiaOrlaPE.API.Service.Interfaces;
// using Microsoft.AspNetCore.Authentication.JwtBearer; // ADICIONADO
// using Microsoft.EntityFrameworkCore;
// using Microsoft.IdentityModel.Tokens; // ADICIONADO
// using Microsoft.OpenApi.Models;
// using System.Text; // ADICIONADO

// var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddControllers();

// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// builder.Services.AddScoped<IUserRepository, UserRepository>();
// builder.Services.AddScoped<IBusinessRepository, BusinessRepository>();

// builder.Services.AddScoped<IBusinessService, BusinessService>();
// builder.Services.AddScoped<IUserService, UserService>();
// builder.Services.AddScoped<ITokenService, TokenService>();

// // ---------------------------------------------------------------------------
// // ADICIONADO: Configuração de Esquema de Autenticação JWT Bearer Padrão
// // ---------------------------------------------------------------------------
// var jwtKey = builder.Configuration["Jwt:Key"] ?? "ChaveSuperSecretaETrancadaDoGuiaOrlaPE2026";
// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuer = true,
//         ValidateAudience = true,
//         ValidateLifetime = true,
//         ValidateIssuerSigningKey = true,
//         ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "GuiaOrlaAPI",
//         ValidAudience = builder.Configuration["Jwt:Audience"] ?? "GuiaOrlaFrontend",
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
//     };
// });
// // ---------------------------------------------------------------------------

// builder.Services.AddEndpointsApiExplorer();

// builder.Services.AddSwaggerGen(options =>
// {
//     options.SwaggerDoc("v1", new OpenApiInfo
//     {
//         Title = "GuiaOrla API",
//         Version = "v1"
//     });

//     options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//     {
//         Name = "Authorization",
//         Type = SecuritySchemeType.ApiKey,
//         Scheme = "Bearer",
//         BearerFormat = "JWT",
//         In = ParameterLocation.Header,
//         Description = "Insira o token JWT desta forma: Bearer SEU_TOKEN_AQUI"
//     });

//     options.AddSecurityRequirement(new OpenApiSecurityRequirement
//     {
//         {
//             new OpenApiSecurityScheme
//             {
//                 Reference = new OpenApiReference
//                 {
//                     Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
//                     Id = "Bearer"
//                 }
//             },
//             Array.Empty<string>()
//         }
//     });
// });

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowFrontend",
//         policy =>
//         {
//             policy
//                 .WithOrigins("http://localhost:3000")
//                 .AllowAnyHeader()
//                 .AllowAnyMethod();
//         });
// });

// var app = builder.Build();

// app.UseSwagger();

// app.UseSwaggerUI(options =>
// {
//     options.SwaggerEndpoint("/swagger/v1/swagger.json", "GuiaOrla API v1");
// });

// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

// app.UseCors("AllowFrontend");

// app.UseHttpsRedirection();

// // Mantidos os middlewares de validação na ordem correta do pipeline
// app.UseAuthentication(); 
// app.UseAuthorization();

// app.MapControllers();

// app.Run();
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
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBusinessRepository, BusinessRepository>();

builder.Services.AddScoped<IBusinessService, BusinessService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITokenService, TokenService>();

// ---------------------------------------------------------------------------
// CORRIGIDO: Sincronização Absoluta com a Chave do Appsettings e NextAuth
// ---------------------------------------------------------------------------
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SUA_CHAVE_SUPER_SECRETA_COM_NO_MINIMO_32_CARACTERES";

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

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

app.UseHttpsRedirection();

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();