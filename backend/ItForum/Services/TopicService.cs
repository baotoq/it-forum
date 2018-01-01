using System.Collections.Generic;
using System.Linq;
using ItForum.Data;
using ItForum.Data.Domains;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class TopicService : Service<Topic>
    {
        public TopicService(TdtGameContext context) : base(context)
        {
        }

        public IEnumerable<Topic> FindWithSubTopicsAndThreads(int level)
        {
            return DbSet.AsNoTracking().Include(x => x.SubTopics).ThenInclude(x => x.Threads)
                .Where(x => x.Level == level && x.DateDeleted == null);
        }

        public Topic FindWithSubTopics(int id)
        {
            return DbSet.Include(x => x.SubTopics)
                .SingleOrDefault(x => x.Id == id && x.DateDeleted == null);
        }

        public Topic FindWithManaments(int id)
        {
            return DbSet.AsNoTracking()
                .Include(x => x.Managements)
                .SingleOrDefault(x => x.Id == id);
        }

        public IEnumerable<Thread> FindTopicThreads(int id)
        {
            return Context.Threads.AsNoTracking()
                .Include(x => x.CreatedBy)
                .Where(x => x.TopicId == id);
        }

        public IEnumerable<Thread> FindTopicThreads(int id, ApprovalStatus approvalStatus)
        {
            return Context.Threads.AsNoTracking()
                .Include(x => x.CreatedBy)
                .Where(x => x.TopicId == id && x.ApprovalStatus == approvalStatus);
        }

        public IEnumerable<Thread> FindTopicThreadsWithPosts(int id)
        {
            return Context.Threads.AsNoTracking()
                .Include(x => x.CreatedBy)
                .Include(x => x.Posts)
                .Where(x => x.TopicId == id);
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