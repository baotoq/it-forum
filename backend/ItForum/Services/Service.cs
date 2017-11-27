using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using ItForum.Data;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class Service<TEntity> where TEntity : class
    {
        protected readonly NeptuneContext Context;

        protected Service(NeptuneContext context)
        {
            Context = context;
            DbSet = Context.Set<TEntity>();
        }

        protected DbSet<TEntity> DbSet { get; }

        public virtual TEntity FindById(object id)
        {
            return DbSet.Find(id);
        }

        public virtual IEnumerable<TEntity> FindBy(Expression<Func<TEntity, bool>> predicate)
        {
            return DbSet.Where(predicate);
        }

        public virtual TEntity SingleOrDefault(Expression<Func<TEntity, bool>> predicate)
        {
            return DbSet.SingleOrDefault(predicate);
        }

        public void Add(TEntity entity)
        {
            DbSet.Add(entity);
        }

        public void AddRange(IEnumerable<TEntity> entities)
        {
            DbSet.AddRange(entities);
        }

        public async Task AddAsync(TEntity entity)
        {
            await DbSet.AddAsync(entity);
        }

        public async Task AddRangeAsync(IEnumerable<TEntity> entities)
        {
            await DbSet.AddRangeAsync(entities);
        }

        public void Update(TEntity entity)
        {
            Context.Entry(entity).State = EntityState.Modified;
        }

        public void Remove(TEntity entity)
        {
            DbSet.Remove(entity);
        }

        public void RemoveRange(IEnumerable<TEntity> entities)
        {
            DbSet.RemoveRange(entities);
        }

        public void Attach(TEntity entity)
        {
            DbSet.Attach(entity);
        }

        public virtual IEnumerable<TEntity> GetAll()
        {
            return DbSet.AsEnumerable();
        }

        public int Count()
        {
            return DbSet.Count();
        }

        public bool Any(Expression<Func<TEntity, bool>> predicate)
        {
            return DbSet.Any(predicate);
        }

        public IEnumerable<TEntity> OrderBy<TKey>(Expression<Func<TEntity, TKey>> keySelector)
        {
            return DbSet.OrderBy(keySelector);
        }

        public IEnumerable<TEntity> OrderByDescending<TKey>(Expression<Func<TEntity, TKey>> keySelector)
        {
            return DbSet.OrderByDescending(keySelector);
        }

        public virtual List<TEntity> ToList()
        {
            return GetAll().ToList();
        }
    }
}