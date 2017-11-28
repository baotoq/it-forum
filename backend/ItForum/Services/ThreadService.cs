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

        public override Thread FindById(object id)
        {
            return DbSet.Include(x => x.CreatedBy)
                .Include(x => x.Posts).ThenInclude(x => x.CreatedBy)
                .Include(x => x.ThreadTags).ThenInclude(x => x.Tag)
                .Include("Posts.Replies.CreatedBy")
                .SingleOrDefault(x => x.Id == (int) id);
        }
    }
}