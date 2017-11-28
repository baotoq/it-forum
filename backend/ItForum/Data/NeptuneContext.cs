using System;
using System.Linq;
using System.Threading.Tasks;
using ItForum.Data.Domains;
using ItForum.Data.Entities.Core;
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
            modelBuilder.Entity<User>().HasQueryFilter(x => x.DateDeleted == null);
            modelBuilder.Entity<Topic>().HasQueryFilter(x => x.DateDeleted == null);
            modelBuilder.Entity<Discussion>().HasQueryFilter(x => x.DateDeleted == null);
            modelBuilder.Entity<Thread>().HasQueryFilter(x => x.DateDeleted == null);
            modelBuilder.Entity<Post>().HasQueryFilter(x => x.DateDeleted == null);
            modelBuilder.Entity<Tag>().HasQueryFilter(x => x.DateDeleted == null);

            modelBuilder.Entity<ThreadTag>(buildAction =>
            {
                buildAction.HasKey(x => new {x.ThreadId, x.TagId});

                buildAction.HasOne(x => x.Thread)
                    .WithMany(x => x.ThreadTags)
                    .HasForeignKey(x => x.ThreadId)
                    .OnDelete(DeleteBehavior.Cascade);

                buildAction.HasOne(x => x.Tag)
                    .WithMany(x => x.ThreadTags)
                    .HasForeignKey(x => x.TagId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
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
            foreach (var entry in ChangeTracker.Entries().Where(x => x.Entity is ITimeStampEntity))
            {
                var entity = (ITimeStampEntity) entry.Entity;
                switch (entry.State)
                {
                    case EntityState.Added:
                        if (entity.DateCreated == null)
                            entity.DateCreated = DateTime.Now;
                        if (entity.DateModified == null)
                            entity.DateModified = DateTime.Now;
                        break;
                    case EntityState.Modified:
                        if (entity.DateModified == null)
                            entity.DateModified = DateTime.Now;
                        break;
                    case EntityState.Deleted:
                        entry.State = EntityState.Modified;
                        entity.DateDeleted = DateTime.Now;
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