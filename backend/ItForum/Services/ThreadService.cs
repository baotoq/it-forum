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
                .Include(x => x.Posts).ThenInclude(x => x.Votes)
                .SingleOrDefault(x => x.Id == id);
        }

        public IEnumerable<Thread> GetUnapprove()
        {
            return null;
        }
    }
}