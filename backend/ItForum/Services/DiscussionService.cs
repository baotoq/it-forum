using System.Collections.Generic;
using System.Linq;
using ItForum.Data;
using ItForum.Data.Domains;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class DiscussionService : Service<Discussion>
    {
        public DiscussionService(NeptuneContext context) : base(context)
        {
        }

        public override Discussion FindById(object id)
        {
            return DbSet.Include(x => x.Threads).ThenInclude(x => x.CreatedBy)
                .Include(x => x.Threads).ThenInclude(x => x.Posts)
                .SingleOrDefault(x => x.Id == (int) id);
        }

        public override IEnumerable<Discussion> GetAll()
        {
            return DbSet.Include(x => x.Threads).ThenInclude(x => x.CreatedBy);
        }

        public List<Discussion> FinByTopic(int topicId)
        {
            return DbSet.Where(x => x.Topic.Id == topicId).ToList();
        }
    }
}