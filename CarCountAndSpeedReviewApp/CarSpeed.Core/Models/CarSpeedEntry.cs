namespace CarSpeed.Core.Models
{
    public class CarSpeedEntry
    {
        public int Id { get; set; }
        public DateTime TimeOfRecord { get; set; }
        public int Speed { get; set; }
        public string CarRegistrationNumber { get; set; } = string.Empty;
    }
}
