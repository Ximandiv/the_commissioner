namespace TC_API.Models;

public class Commission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public CommissionStateEnum State { get; set; } = CommissionStateEnum.Created;
    public string DeadlineAt { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Commission()
    {
        
    }

    public Commission(CommissionRequest req)
    {
        Name = req.Name;
        DeliveryAddress = req.DeliveryAddress;
        DeadlineAt = req.DeadlineAt;
    }
}
