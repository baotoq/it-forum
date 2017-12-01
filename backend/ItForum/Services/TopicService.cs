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
            return DbSet.Include(x => x.Threads)
                .SingleOrDefault(x => x.Id == (int) id);
        }

        public override IEnumerable<Topic> FindAll()
        {
            return DbSet.Include(x => x.Threads);
        }

        public IEnumerable<Topic> FindParent()
        {
            return DbSet.Where(x => x.ParentId == null);
        }

        public IEnumerable<Topic> FindWithThreads()
        {
            return DbSet.Include(x => x.Threads);
        }

        public IEnumerable<Topic> FindParentWithSubTopicsAndThreads()
        {
            return DbSet.Include(x => x.SubTopics).ThenInclude(x => x.Threads)
                .Where(x => x.ParentId == null);
        }

        public Topic FindWithSubTopics(int id)
        {
            return DbSet.Include(x => x.SubTopics)
                .SingleOrDefault(x => x.Id == id);
        }

        public Topic FindWithThreadsCreatedByAndPosts(int id)
        {
            return DbSet.Include(x => x.Threads).ThenInclude(x => x.CreatedBy)
                .Include(x => x.Threads).ThenInclude(x => x.Posts)
                .SingleOrDefault(x => x.Id == id);
        }
    }
}