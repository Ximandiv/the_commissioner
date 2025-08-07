public class CommissionRequest
{
    public string ClientName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public decimal Price { get; set; } = 0.0m;
    public string Currency { get; set; } = "USD"; // Default currency
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