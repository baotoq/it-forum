using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ItForum.Data;
using ItForum.Data.Domains;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class PostService : Service<Post>
    {
        public PostService(NeptuneContext context) : base(context)
        {
        }

        public Post FindWithCreatedBy(object id)
        {
            return DbSet.Include(x => x.CreatedBy)
                .SingleOrDefault(x => x.Id == (int) id);
        }

        public IEnumerable<Post> GetPending()
        {
            return DbSet.Include(x => x.CreatedBy).Where(x => x.ApprovalStatus == ApprovalStatus.Pending);
        }

        public async Task<IEnumerable<Post>> GetPending(User user)
        {
            var tasks = new List<Task<Topic>>();
            user.Managements.ForEach(m => tasks.Add(Context.Topics.SingleOrDefaultAsync(t => t.Id == m.TopicId)));
            var topics = await Task.WhenAll(tasks);
            return DbSet.Include(x => x.CreatedBy)
                .Where(x => x.ApprovalStatus == ApprovalStatus.Pending && topics.Any(t => t.Id == x.Thread.Topic.Id));
        }

        public Post FindWithVotes(int id)
        {
            return DbSet.Include(x => x.Votes).SingleOrDefault(x => x.Id == id);
        }

        public Post FindWithThread(int id)
        {
            return DbSet.Include(x => x.Thread).SingleOrDefault(x => x.Id == id);
        }

        public void SetApprovalStatus(int userId, Post post, ApprovalStatus approvalStatus)
        {
            post.ApprovalStatusModifiedById = userId;
            post.ApprovalStatus = ApprovalStatus.Approved;
        }

        public void Add(Vote vote)
        {
            Context.Votes.Add(vote);
        }

        public void Remove(Vote vote)
        {
            Context.Votes.Remove(vote);
        }

        public Vote FindVote(int postId, int userId)
        {
            return Context.Votes.SingleOrDefault(x => x.PostId == postId && x.UserId == userId);
        }
    }
}