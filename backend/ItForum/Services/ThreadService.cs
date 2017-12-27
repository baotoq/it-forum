using System.Collections.Generic;
using System.Linq;
using ItForum.Data;
using ItForum.Data.Domains;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class ThreadService : Service<Thread>
    {
        public ThreadService(NeptuneContext context) : base(context)
        {
        }

        public Thread FindWithCreatedByAndTags(int id)
        {
            return DbSet.AsNoTracking().Include(x => x.CreatedBy)
                .Include(x => x.ThreadTags).ThenInclude(x => x.Tag)
                .Include(x => x.Topic.Parent)
                .Include(x => x.Topic.Managements)
                .Include(x => x.Posts).ThenInclude(x => x.Votes)
                .SingleOrDefault(x => x.Id == id);
        }

        public IEnumerable<Post> FindThreadPostsWithReplies(int id)
        {
            return DbSet.AsNoTracking().Include(x => x.CreatedBy)
                .Include(x => x.Posts).ThenInclude(x => x.CreatedBy)
                .Include(x => x.Posts).ThenInclude(x => x.Replies).ThenInclude(x => x.CreatedBy)
                .SingleOrDefault(x => x.Id == id)?.Posts;
        }

        public IEnumerable<Post> FindThreadPosts(int id)
        {
            return DbSet.AsNoTracking().Include(x => x.CreatedBy)
                .Include(x => x.ApprovalStatusModifiedBy)
                .Include(x => x.Posts).ThenInclude(x => x.CreatedBy)
                .SingleOrDefault(x => x.Id == id)?.Posts;
        }

        public int CountPendings(int id)
        {
            return Context.Posts.AsNoTracking()
                .Count(x => x.ThreadId == id && x.ApprovalStatus == ApprovalStatus.Pending);
        }

        public Thread FindWithPosts(int id)
        {
            return DbSet.Include(x => x.Posts).SingleOrDefault(x => x.Id == id);
        }

        public void SetApprovalStatus(int userId, Thread thread, ApprovalStatus approvalStatus)
        {
            thread.ApprovalStatusModifiedById = userId;
            thread.ApprovalStatus = approvalStatus;
        }

        public IEnumerable<Thread> FindPending()
        {
            return DbSet.AsNoTracking().Include(x => x.CreatedBy)
                .Include(x => x.Posts)
                .Include(x => x.Topic)
                .Include(x => x.ThreadTags).ThenInclude(x => x.Tag)
                .Where(x => x.ApprovalStatus == ApprovalStatus.Pending);
        }

        public void IncreaseNumberOfPosts(int? id)
        {
            if (id == null) return;
            var thread = FindById(id);
            thread.NumberOfPosts += 1;
        }

        public void DecreaseNumberOfPosts(int? id)
        {
            if (id == null) return;
            var thread = FindById(id);
            thread.NumberOfPosts -= 1;
        }
    }
}