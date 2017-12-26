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

        public IEnumerable<Topic> FindByLevel(int level)
        {
            return DbSet.Where(x => x.Level == level);
        }

        public IEnumerable<Topic> FindWithThreads()
        {
            return DbSet.Include(x => x.Threads);
        }

        public IEnumerable<Topic> FindWithSubTopicsAndThreads(int level)
        {
            return DbSet.AsNoTracking().Include(x => x.SubTopics).ThenInclude(x => x.Threads)
                .Where(x => x.Level == level);
        }

        public Topic FindWithSubTopics(int id)
        {
            return DbSet.Include(x => x.SubTopics)
                .SingleOrDefault(x => x.Id == id);
        }

        public Topic FindWithManaments(int id)
        {
            return DbSet.AsNoTracking()
                .Include(x => x.Managements)
                .SingleOrDefault(x => x.Id == id);
        }

        public IEnumerable<Thread> FindTopicThreads(int id)
        {
            return DbSet.AsNoTracking()
                .Include(x => x.Threads).ThenInclude(x => x.CreatedBy)
                .SingleOrDefault(x => x.Id == id)?.Threads;
        }

        public IEnumerable<Thread> FindTopicThreadsWithPosts(int id)
        {
            return DbSet.AsNoTracking()
                .Include(x => x.Threads).ThenInclude(x => x.CreatedBy)
                .Include(x => x.Threads).ThenInclude(x => x.Posts)
                .SingleOrDefault(x => x.Id == id)?.Threads;
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