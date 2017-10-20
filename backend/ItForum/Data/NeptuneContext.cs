using System;
using System.Linq;
using System.Threading.Tasks;
using ItForum.Data.Domains;
using ItForum.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Data
{
    public class NeptuneContext : DbContext
    {
        public NeptuneContext(DbContextOptions<NeptuneContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Topic> Topics { get; set; }

        public DbSet<Discussion> Discussions { get; set; }

        public DbSet<Thread> Threads { get; set; }

        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            AddTimestamps();
            return await base.SaveChangesAsync();
        }

        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries().Where(x =>
                x.Entity is Entity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entity in entities)
            {
                var e = (Entity) entity.Entity;
                if (entity.State == EntityState.Added && e.CreatedDate == null)
                    e.CreatedDate = DateTime.Now;
                if (e.UpdatedDate == null)
                    e.UpdatedDate = DateTime.Now;
            }
        }
    }
}