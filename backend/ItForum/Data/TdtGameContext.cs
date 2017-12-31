using System;
using System.Linq;
using System.Threading.Tasks;
using ItForum.Data.Domains;
using ItForum.Data.Entities.Core;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Data
{
    public class TdtGameContext : DbContext
    {
        public TdtGameContext(DbContextOptions<TdtGameContext> options)
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

            modelBuilder.Entity<Thread>(e =>
            {
                e.HasQueryFilter(th => th.DateDeleted == null);

                e.HasOne(p => p.CreatedBy)
                    .WithMany(u => u.Threads)
                    .HasForeignKey(p => p.CreatedById);

                e.HasOne(th => th.ApprovalStatusModifiedBy)
                    .WithMany(u => u.ApprovalStatusModifiedThreads)
                    .HasForeignKey(th => th.ApprovalStatusModifiedById);
            });

            modelBuilder.Entity<Post>(e =>
            {
                e.HasQueryFilter(p => p.DateDeleted == null);

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
    }
}