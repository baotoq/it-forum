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

        public Topic FindWithThreadsCreatedBy(int id)
        {
            return DbSet.Include(x => x.Threads).ThenInclude(x => x.CreatedBy)
                .SingleOrDefault(x => x.Id == id);
        }

        public void IncreaseNumberOfThreads(int? id)
        {
            if (id == null) return;
            var topic = FindById(id);
            topic.NumberOfThreads += 1;
        }

        public void DecreaseNumberOfThreads(int? id)
        {
            if (id == null) return;
            var topic = FindById(id);
            topic.NumberOfThreads -= 1;
        }
    }
}