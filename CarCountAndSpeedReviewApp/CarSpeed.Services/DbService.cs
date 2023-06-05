using CarSpeed.Core.Services;
using CarSpeed.Data;
using Microsoft.EntityFrameworkCore;

namespace CarSpeed.Services
{
    public class DbService<T> : IDbService<T> where T : class
    {
        protected readonly ICarSpeedDbContext _context;

        public DbService (ICarSpeedDbContext context)
        {
            _context = context;
        }

        public void Create(T entity)
        {
            _context.Set<T>().Add(entity);
            _context.SaveChanges();
        }

        public void CreateBatch(IEnumerable<T> entities)
        {
            _context.Set<T>().AddRange(entities);
            _context.SaveChanges();
        }

        public void Update(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
            _context.SaveChanges();
        }

        public virtual IEnumerable<T> GetAll()
        {
            return _context.Set<T>();
        }

        public virtual IEnumerable<T> GetFiltered(Func<T, bool> filter)
        {
            return _context.Set<T>().Where(filter);
        }

        public void ClearAll()
        {
            _context.Set<T>().RemoveRange(_context.Set<T>());
            //_context.SaveChanges();
        }
    }
}
