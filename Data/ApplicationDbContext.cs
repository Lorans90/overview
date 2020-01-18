using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using System.Threading;
using System;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Overview.Models;
using Overview.Extensions;
using Overview.Data.Configurations;
using Overview.Models.SeedWork;

namespace Overview.Data
{
    public class ApplicationDbContext : DbContext, IUnitOfWork
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public virtual DbSet<User> Users { set; get; }
        public virtual DbSet<Role> Roles { set; get; }
        public virtual DbSet<UserRole> UserRoles { get; set; }
        public virtual DbSet<UserToken> UserTokens { get; set; }
        public virtual DbSet<Receive> Receives { get; set; }
     
        protected override void OnModelCreating(ModelBuilder builder)
        {
            // it should be placed here, otherwise it will rewrite the following settings!
            base.OnModelCreating(builder);

            builder.ApplyAllConfigurations();

            // This should be placed here, at the end.
            builder.AddAuditableShadowProperties();
        }

        public void AddRange<TEntity>(IEnumerable<TEntity> entities) where TEntity : class
        {
            Set<TEntity>().AddRange(entities);
        }

        public void ExecuteSqlCommand(string query)
        {
            Database.ExecuteSqlRaw(query);
        }

        public void ExecuteSqlCommand(string query, params object[] parameters)
        {
            Database.ExecuteSqlRaw(query, parameters);
        }

        public T GetShadowPropertyValue<T>(object entity, string propertyName) where T : IConvertible
        {
            var value = this.Entry(entity).Property(propertyName).CurrentValue;
            return value != null
                ? (T)Convert.ChangeType(value, typeof(T), CultureInfo.InvariantCulture)
                : default(T);
        }

        public object GetShadowPropertyValue(object entity, string propertyName)
        {
            return this.Entry(entity).Property(propertyName).CurrentValue;
        }

        public void MarkAsChanged<TEntity>(TEntity entity) where TEntity : class
        {
            Update(entity);
        }

        public void RemoveRange<TEntity>(IEnumerable<TEntity> entities) where TEntity : class
        {
            Set<TEntity>().RemoveRange(entities);
        }

        private bool HasHttpContext()
        {
            var serviceProvider = this.GetInfrastructure<IServiceProvider>();
            var httpContextAccessor = serviceProvider.GetService(typeof(IHttpContextAccessor));
            return httpContextAccessor != null;
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            if( HasHttpContext())
            {
                ChangeTracker.DetectChanges();

                BeforeSaveTriggers();

                // for performance reasons, to avoid calling DetectChanges() again.
                ChangeTracker.AutoDetectChangesEnabled = false;
                var result = base.SaveChanges(acceptAllChangesOnSuccess);
                ChangeTracker.AutoDetectChangesEnabled = true;
                return result;
            }
            else
            {
                var result = base.SaveChanges(acceptAllChangesOnSuccess);
                return result;
            }
        }

        public override int SaveChanges()
        {
            if (HasHttpContext())
            {
                ChangeTracker.DetectChanges();

                BeforeSaveTriggers();

                // for performance reasons, to avoid calling DetectChanges() again.
                ChangeTracker.AutoDetectChangesEnabled = false;

                var result = base.SaveChanges();
                ChangeTracker.AutoDetectChangesEnabled = true;
                return result;
            }
            else
            {
                var result = base.SaveChanges();
                return result;
            }
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            if (HasHttpContext())
            {
                ChangeTracker.DetectChanges();

                BeforeSaveTriggers();

                // for performance reasons, to avoid calling DetectChanges() again.
                ChangeTracker.AutoDetectChangesEnabled = false;

                var result = base.SaveChangesAsync(cancellationToken);
                ChangeTracker.AutoDetectChangesEnabled = true;
                return result;
            }
            else
            {
                var result = base.SaveChangesAsync(cancellationToken);
                return result;
            }
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess,
            CancellationToken cancellationToken = new CancellationToken())
        {
            if (HasHttpContext())
            {
                ChangeTracker.DetectChanges();

                BeforeSaveTriggers();

                // for performance reasons, to avoid calling DetectChanges() again.
                ChangeTracker.AutoDetectChangesEnabled = false;

                var result = base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
                ChangeTracker.AutoDetectChangesEnabled = true;
                return result;
            }
            else
            {
                var result = base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
                return result;
            }
        }

        private void BeforeSaveTriggers()
        {
            ValidateEntities();
            SetShadowProperties();
        }

        private void SetShadowProperties()
        {
            // we can't use constructor injection anymore, because we are using the `AddDbContextPool<>`
            var httpContextAccessor = this.GetService<IHttpContextAccessor>();
            httpContextAccessor.CheckArgumentIsNull(nameof(httpContextAccessor));
            ChangeTracker.SetAuditableEntityPropertyValues(httpContextAccessor);
        }

        private void ValidateEntities()
        {
            var errors = this.GetValidationErrors();
            if (!string.IsNullOrWhiteSpace(errors))
            {
                // we can't use constructor injection anymore, because we are using the `AddDbContextPool<>`
                var loggerFactory = this.GetService<ILoggerFactory>();
                loggerFactory.CheckArgumentIsNull(nameof(loggerFactory));
                var logger = loggerFactory.CreateLogger<ApplicationDbContext>();
                logger.LogError(errors);
                throw new InvalidOperationException(errors);
            }
        }
    }
}