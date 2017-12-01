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
            return DbSet.Include(x => x.CreatedBy)
                .SingleOrDefault(x => x.Id == (int) id);
        }

        public Post FindWithCreatedByAndQuotes(object id)
        {
            return DbSet.Include(x => x.CreatedBy)
                .Include(x => x.Quotes).ThenInclude(x => x.CreatedBy)
                .SingleOrDefault(x => x.Id == (int) id);
        }
    }
}