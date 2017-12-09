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

        public DbSet<Thread> Threads { get; set; }

        public DbSet<Post> Posts { get; set; }

        public DbSet<Tag> Tags { get; set; }

        public DbSet<Vote> Votes { get; set; }

        public DbSet<Management> Managements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasQueryFilter(x => x.DateDeleted == null);
            modelBuilder.Entity<Thread>().HasQueryFilter(x => x.DateDeleted == null);
            modelBuilder.Entity<Tag>().HasQueryFilter(x => x.DateDeleted == null);

            modelBuilder.Entity<Post>(e =>
            {
                e.HasQueryFilter(x => x.DateDeleted == null);

                e.HasOne(p => p.CreatedBy)
                    .WithMany(u => u.Posts)
                    .HasForeignKey(p => p.CreatedById);

                e.HasOne(p => p.ApprovalStatusModifiedBy)
                    .WithMany(u => u.ApprovalStatusModifiedPosts)
                    .HasForeignKey(p => p.ApprovalStatusModifiedById);
            });

            modelBuilder.Entity<Topic>(e =>
            {
                e.HasQueryFilter(x => x.DateDeleted == null);

                e.HasOne(p => p.Parent)
                    .WithMany(s => s.SubTopics)
                    .HasForeignKey(p => p.ParentId);
            });

            modelBuilder.Entity<ThreadTag>(e =>
            {
                e.HasKey(x => new {x.ThreadId, x.TagId});

                e.HasOne(x => x.Thread)
                    .WithMany(x => x.ThreadTags)
                    .HasForeignKey(x => x.ThreadId);

                e.HasOne(x => x.Tag)
                    .WithMany(x => x.ThreadTags)
                    .HasForeignKey(x => x.TagId);
            });

            modelBuilder.Entity<Vote>(e =>
            {
                e.HasKey(x => new {x.PostId, x.UserId});

                e.HasOne(x => x.Post)
                    .WithMany(x => x.Votes)
                    .HasForeignKey(x => x.PostId);

                e.HasOne(x => x.User)
                    .WithMany(x => x.Votes)
                    .HasForeignKey(x => x.UserId);
            });

            modelBuilder.Entity<Management>(e =>
            {
                e.HasKey(x => new {x.TopicId, x.UserId});

                e.HasOne(x => x.Topic)
                    .WithMany(x => x.Managements)
                    .HasForeignKey(x => x.TopicId);

                e.HasOne(x => x.User)
                    .WithMany(x => x.Managements)
                    .HasForeignKey(x => x.UserId);
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