using System.Collections.Generic;
using System.Linq;
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

        public IEnumerable<Post> FindPending()
        {
            return DbSet.Include(x => x.CreatedBy)
                .Include(x => x.Thread)
                .Where(x => x.Thread.ApprovalStatus == ApprovalStatus.Approved)
                .Where(x => x.ApprovalStatus == ApprovalStatus.Pending).Take(100);
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
            post.ApprovalStatus = approvalStatus;
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