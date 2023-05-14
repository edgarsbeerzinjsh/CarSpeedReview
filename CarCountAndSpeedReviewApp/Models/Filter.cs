namespace CarCountAndSpeedReviewApp.Models
{
    public class Filter
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public int? MinimalSpeed { get; set; }
    }
}
