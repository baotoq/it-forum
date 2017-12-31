using System.Collections.Generic;
using System.Linq;
using ItForum.Data;
using ItForum.Data.Domains;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class TagService : Service<Tag>
    {
        public TagService(TdtGameContext context) : base(context)
        {
        }

        public IEnumerable<Tag> FindWithThreadTags()
        {
            return DbSet.AsNoTracking()
                .Include(x => x.ThreadTags)
                .Where(x => x.DateDeleted == null);
        }

        public IEnumerable<Tag> FindDeleted()
        {
            return DbSet.AsNoTracking()
                .Include(x => x.ThreadTags)
                .Where(x => x.DateDeleted != null);
        }
    }
}