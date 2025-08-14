namespace TC_API.Models;

public class Commission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ClientName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public decimal Price { get; set; } = 0.0m;
    public string Currency { get; set; } = "USD"; // Default currency
    public CommissionStateEnum State { get; set; } = CommissionStateEnum.Created;
    public string DeadlineAt { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Commission()
    {
        
    }

    public Commission(CommissionRequest req)
    {
        ClientName = req.ClientName;
        Name = req.Name;
        DeliveryAddress = req.DeliveryAddress;
        Price = req.Price;
        Currency = req.Currency;
        DeadlineAt = req.DeadlineAt;
    }

    public void Update(CommissionRequest req, bool isLate)
    {
        ClientName = string.IsNullOrEmpty(req.ClientName) ? ClientName : req.ClientName;
        Name = string.IsNullOrEmpty(req.Name) ? Name : req.Name;
        DeliveryAddress = string.IsNullOrEmpty(req.DeliveryAddress) ? DeliveryAddress : req.DeliveryAddress;
        Price = req.Price <= 0 ? Price : req.Price;
        Currency = string.IsNullOrEmpty(req.Currency) ? Currency : req.Currency;
        DeadlineAt = string.IsNullOrEmpty(req.DeadlineAt) ? DeadlineAt : req.DeadlineAt;

        State = isLate ? CommissionStateEnum.Late 
            : Enum.TryParse<CommissionStateEnum>(req.State, true, out var state) ? state : State;
    }
}
