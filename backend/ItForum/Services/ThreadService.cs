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

        public Thread FindWithCreatedByTagsAndReplies(int id)
        {
            return DbSet.Include(x => x.CreatedBy)
                .Include(x => x.ThreadTags).ThenInclude(x => x.Tag)
                .Include(x => x.Posts).ThenInclude(x => x.CreatedBy)
                .Include(x => x.Posts).ThenInclude(x => x.Replies).ThenInclude(x => x.CreatedBy)
                .Include(x => x.Topic).ThenInclude(x => x.Parent)
                .Include(x => x.Topic).ThenInclude(x => x.Managements)
                .Include(x => x.Posts).ThenInclude(x => x.Votes)
                .SingleOrDefault(x => x.Id == id);
        }

        public Thread FindWithPosts(int id)
        {
            return DbSet.Include(x => x.Posts).SingleOrDefault(x => x.Id == id);
        }

        public void SetApprovalStatus(int userId, Thread thread, ApprovalStatus approvalStatus)
        {
            thread.ApprovalStatusModifiedById = userId;
            thread.ApprovalStatus = ApprovalStatus.Approved;
        }

        public IEnumerable<Thread> FindPending()
        {
            return DbSet.Include(x => x.CreatedBy)
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