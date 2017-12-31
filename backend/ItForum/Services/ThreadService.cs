using System.Collections.Generic;
using System.Linq;
using ItForum.Data;
using ItForum.Data.Domains;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class ThreadService : Service<Thread>
    {
        public ThreadService(TdtGameContext context) : base(context)
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

        public IEnumerable<Thread> FindBy(string searchString, int? topicId, List<int> tags)
        {
            var data = DbSet.Include(x => x.ThreadTags).ThenInclude(x => x.Tag)
                .Include(x => x.CreatedBy)
                .Include(x => x.Topic).Where(x => x.ApprovalStatus == ApprovalStatus.Approved);

            if (tags.Count != 0)
                data = data.Where(x => x.ThreadTags.Any(tt => tags.Contains(tt.TagId)));

            if (topicId != null)
                data = data.Where(x => x.TopicId == topicId);

            if (!string.IsNullOrEmpty(searchString))
                data = data.Where(x => x.Title.Contains(searchString));

            //var postCount = context.Entry(blog)
            //    .Collection(b => b.Posts)
            //    .Query()
            //    .Count();

            return data;
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