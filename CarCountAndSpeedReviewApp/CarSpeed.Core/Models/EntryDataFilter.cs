namespace CarSpeed.Core.Models
{
    public class EntryDataFilter
    {
        public DateTime DateFrom { get; set; } = DateTime.MinValue;
        public DateTime DateTo { get; set; } = DateTime.MaxValue;
        public int MinimalSpeed { get; set; } = 0;
    }
}
