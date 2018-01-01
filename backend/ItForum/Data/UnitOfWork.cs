using System;
using System.Linq;
using System.Threading.Tasks;
using ItForum.Data.Entities;
using ItForum.Data.Entities.Core;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Data
{
    public class UnitOfWork
    {
        private readonly TdtGameContext _context;

        public UnitOfWork(TdtGameContext context)
        {
            _context = context;
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public int SaveChanges()
        {
            OnBeforeSaving();
            return _context.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            OnBeforeSaving();
            return await _context.SaveChangesAsync();
        }

        private void OnBeforeSaving()
        {
            foreach (var entry in _context.ChangeTracker.Entries().Where(x => x.Entity is ITimeStampEntity))
            {
                var entity = (ITimeStampEntity) entry.Entity;
                switch (entry.State)
                {
                    case EntityState.Added:
                        entity.DateCreated = DateTime.Now;
                        break;
                }
            }
        }
    }
}