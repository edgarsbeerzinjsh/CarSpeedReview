namespace CarCountAndSpeedReviewApp.Models
{
    public class Paging
    {
        const int maxPageSize = 20;
        public int Page { get; set; } = 1;

        private int _itemsPerPage = 20;
        public int ItemsPerPage
        {
            get
            {
                return _itemsPerPage;
            }
            set
            {
                _itemsPerPage = (value > maxPageSize) ? maxPageSize : value;
            }
        }
    }
}
