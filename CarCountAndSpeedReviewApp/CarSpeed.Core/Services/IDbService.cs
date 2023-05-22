namespace CarSpeed.Core.Services
{
    public interface IDbService<T> where T : class
    {
        void Create(T entity);
        void CreateBatch (IEnumerable<T> entities);
        void Update(T entity);
        void Delete(T entity);
        IEnumerable<T> GetAll();
        IEnumerable<T> GetFiltered(Func<T, bool> filter);
        void ClearAll();
    }
}
