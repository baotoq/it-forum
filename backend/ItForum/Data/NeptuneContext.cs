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

        public DbSet<Tag> Tags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Entity>().HasQueryFilter(x => x.DeletedDate == null);

            modelBuilder.Entity<ThreadTag>()
                .HasKey(x => new {x.ThreadId, x.TagId});

            modelBuilder.Entity<ThreadTag>()
                .HasOne(x => x.Thread)
                .WithMany(x => x.ThreadTags)
                .HasForeignKey(x => x.ThreadId);

            modelBuilder.Entity<ThreadTag>()
                .HasOne(x => x.Tag)
                .WithMany(x => x.ThreadTags)
                .HasForeignKey(x => x.TagId);
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
            foreach (var entry in ChangeTracker.Entries().Where(x => x.Entity is TimeStampEntity))
            {
                var entity = (TimeStampEntity) entry.Entity;
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