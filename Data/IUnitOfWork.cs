using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Overview.Data
{
    public interface IUnitOfWork : IDisposable
    {
        DbSet<TEntity> Set<TEntity>() where TEntity : class;
        void AddRange<TEntity>(IEnumerable<TEntity> entities) where TEntity : class;
        void RemoveRange<TEntity>(IEnumerable<TEntity> entities) where TEntity : class;
        void MarkAsChanged<TEntity>(TEntity entity) where TEntity : class;
        
        // to query on auditable entities 
        T GetShadowPropertyValue<T>(object entity, string propertyName) where T : IConvertible;
        object GetShadowPropertyValue(object entity, string propertyName);

        void ExecuteSqlCommand(string query);
        void ExecuteSqlCommand(string query, params object[] parameters);

        int SaveChanges(bool acceptAllChangesOnSuccess);
        int SaveChanges();
        Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess,
            CancellationToken cancellationToken = new CancellationToken());
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken());
    }
}