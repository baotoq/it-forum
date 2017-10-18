using System.Linq;
using ItForum.Data;
using ItForum.Data.Domains;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class CommentService : Service<Comment>
    {
        public CommentService(NeptuneContext context) : base(context)
        {
        }

        public override Comment FindById(object id)
        {
            return DbSet.Include(x => x.User)
                .Include(x => x.CommentVotes)
                .SingleOrDefault(x => x.Id == (int) id);
        }

        public void Add(CommentVote vote)
        {
            Context.CommentVotes.Add(vote);
        }

        public void Remove(CommentVote vote)
        {
            Context.CommentVotes.Remove(vote);
        }

        public CommentVote FindVote(int commentId, int userId)
        {
            return Context.CommentVotes.SingleOrDefault(x => x.CommentId == commentId && x.UserId == userId);
        }
    }
}