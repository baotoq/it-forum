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
            modelBuilder.Entity<Entity>().HasQueryFilter(x => x.DeletedDate == null);
        }

        public override int SaveChanges()
        {
            OnBeforeSaving();
            return base.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            OnBeforeSaving();
            return await base.SaveChangesAsync();
        }

        private void OnBeforeSaving()
        {
            foreach (var entry in ChangeTracker.Entries().Where(x => x.Entity is Entity))
            {
                var entity = (Entity) entry.Entity;
                switch (entry.State)
                {
                    case EntityState.Added:
                        if (entity.CreatedDate == null)
                            entity.CreatedDate = DateTime.Now;
                        if (entity.UpdatedDate == null)
                            entity.UpdatedDate = DateTime.Now;
                        break;
                    case EntityState.Modified:
                        if (entity.UpdatedDate == null)
                            entity.UpdatedDate = DateTime.Now;
                        break;
                    case EntityState.Deleted:
                        entry.State = EntityState.Modified;
                        entity.DeletedDate = DateTime.Now;
                        break;
                    case EntityState.Detached:
                        break;
                    case EntityState.Unchanged:
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }
    }
}