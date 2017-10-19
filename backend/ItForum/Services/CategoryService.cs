using System.Collections.Generic;
using System.Linq;
using ItForum.Data;
using ItForum.Data.Domains;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class CategoryService : Service<Category>
    {
        public CategoryService(NeptuneContext context) : base(context)
        {
        }

        public override Category FindById(object id)
        {
            return DbSet.Include(x => x.Topics)
                .SingleOrDefault(x => x.Id == (int) id);
        }

        public override IEnumerable<Category> GetAll()
        {
            return DbSet.Include(x => x.Topics);
        }
    }
}