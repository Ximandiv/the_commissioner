using TC_API.Models;

public class CommissionRequest
{
    public string Name { get; set; } = string.Empty;
    public DateTime DeadlineAt { get; set; } = DateTime.MinValue;
}