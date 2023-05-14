namespace CarCountAndSpeedReviewApp.Models
{
    public class RoadEntries
    {
        public int Id { get; set; }
        public DateTime TimeOfRecord { get; set; }
        public int Speed { get; set; }
        public string CarRegistration { get; set; }
    }
}
