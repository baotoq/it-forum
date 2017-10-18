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

        public override Post FindById(object id)
        {
            return DbSet.Include(x => x.User)
                .Include(x => x.PostVotes)
                .Include(x => x.Comments).ThenInclude(x => x.CommentVotes)
                .Include(x => x.Comments).ThenInclude(x => x.User)
                .SingleOrDefault(x => x.Id == (int) id);
        }

        public void Add(PostVote vote)
        {
            Context.PostVotes.Add(vote);
        }

        public void Remove(PostVote vote)
        {
            Context.PostVotes.Remove(vote);
        }

        public PostVote FindVote(int postId, int userId)
        {
            return Context.PostVotes.SingleOrDefault(x => x.PostId == postId && x.UserId == userId);
        }
    }
}