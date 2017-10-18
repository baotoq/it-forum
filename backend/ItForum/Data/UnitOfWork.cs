using System.Threading.Tasks;

namespace ItForum.Data
{
    public class UnitOfWork
    {
        private readonly NeptuneContext _context;

        public UnitOfWork(NeptuneContext context)
        {
            _context = context;
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}