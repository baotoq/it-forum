using System.Collections.Generic;
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

        public Post FindWithCreatedBy(object id)
        {
            return DbSet.Include(x => x.CreatedBy)
                .SingleOrDefault(x => x.Id == (int) id);
        }

        public IEnumerable<Post> GetPending()
        {
            return DbSet.Include(x => x.CreatedBy).Where(x => x.ApprovalStatus == ApprovalStatus.Pending);
        }
    }
}