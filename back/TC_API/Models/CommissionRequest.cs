using TC_API.Models;

public class CommissionRequest
{
    public string Name { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public string DeadlineAt { get; set; } = string.Empty;
    public string Timezone { get; set; } = string.Empty;

    public CommissionRequest()
    {
        
    }

    public CommissionRequest(string name,
        string deliveryAddress,
        string deadlineAt)
    {
        Name = name;
        DeliveryAddress = deliveryAddress;
        DeadlineAt = deadlineAt;
    }
}