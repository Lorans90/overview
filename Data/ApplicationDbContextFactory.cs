using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Overview.Data
{
    /// <summary>
    /// Only used by EF Tooling
    /// </summary>
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var basePath = Directory.GetCurrentDirectory();
            Console.WriteLine($"Using `{basePath}` as the BasePath");
            var configuration = new ConfigurationBuilder()
                                    .SetBasePath(basePath)
                                    .AddJsonFile("appsettings.json")
                                    .Build();
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            builder.UseSqlServer(connectionString);
            return new ApplicationDbContext(builder.Options);
        }
    }
}