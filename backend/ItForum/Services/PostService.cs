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

        public IEnumerable<Post> GetPending()
        {
            return DbSet.Include(x => x.CreatedBy).Where(x => x.ApprovalStatus == ApprovalStatus.Pending);
        }

        public Post FindWithVotes(int id)
        {
            return DbSet.Include(x => x.Votes).SingleOrDefault(x => x.Id == id);
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