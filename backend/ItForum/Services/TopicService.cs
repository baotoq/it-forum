using System.Collections.Generic;
using System.Linq;
using ItForum.Data;
using ItForum.Data.Domains;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class TopicService : Service<Topic>
    {
        public TopicService(NeptuneContext context) : base(context)
        {
        }

        public override Topic FindById(object id)
        {
            return DbSet.Include(x => x.Discussions)
                .SingleOrDefault(x => x.Id == (int) id);
        }

        public override IEnumerable<Topic> GetAll()
        {
            return DbSet.Include(x => x.Discussions);
        }
    }
}