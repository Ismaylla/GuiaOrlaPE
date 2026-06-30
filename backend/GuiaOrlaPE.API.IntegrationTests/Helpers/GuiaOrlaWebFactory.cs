using System.Collections.Generic;
using System.Data.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Data.Sqlite;
using GuiaOrlaPE.API;
using GuiaOrlaPE.API.Domain.Entities;

namespace GuiaOrlaPE.API.IntegrationTests.Helpers
{
    public class GuiaOrlaWebFactory : WebApplicationFactory<Program>
    {
        private readonly SqliteConnection _connection;

        public GuiaOrlaWebFactory()
        {
            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");

            // JWT fake config
            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.Sources.Clear();

                config.AddInMemoryCollection(new Dictionary<string, string>
{
                    { "Jwt:Key", "TEST_SECRET_KEY_123456789_EXTRA_LONG_ENOUGH" },
                    { "Jwt:Issuer", "TestIssuer" },
                    { "Jwt:Audience", "TestAudience" },
                    { "Jwt:ExpiresInMinutes", "120" }
                });
            });

            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));

                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlite(_connection));

                var sp = services.BuildServiceProvider();

                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                db.Database.EnsureCreated();
            });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);

            if (disposing)
                _connection.Dispose();
        }
    }
}