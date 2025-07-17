namespace TC_API.Models;

public class CommissionResponse
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public string Status { get; set; } = CommissionStateEnum.Created.ToString();
    public string DeadlineAt { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public CommissionResponse(Commission commission)
    {
        Id = commission.Id;
        Name = commission.Name;

        var stateString = commission.State.ToString().Replace('_', ' ');
        Status = stateString switch
        {
            "Created" => "Creado",
            "In Progress" => "En Progreso",
            "Completed" => "Completado",
            "Cancelled" => "Cancelado",
            "Failed" => "Fallido",
            "On Hold" => "En Espera",
            _ => stateString
        };

        DeliveryAddress = commission.DeliveryAddress;
        DeadlineAt = commission.DeadlineAt;
        CreatedAt = commission.CreatedAt;
        UpdatedAt = commission.UpdatedAt;
    }
}
