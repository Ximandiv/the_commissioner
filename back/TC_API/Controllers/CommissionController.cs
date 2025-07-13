using Microsoft.AspNetCore.Mvc;
using TC_API.Database;
using TC_API.Models;

namespace TC_API.Controllers;

[ApiController]
[Route("[controller]")]
public class CommissionController : ControllerBase
{
    private readonly ILogger<CommissionController> _logger;
    private readonly CommissionContext _context;

    public CommissionController(
        ILogger<CommissionController> logger,
        CommissionContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet]
    public IActionResult GetCommissions()
    {
        // This is a placeholder for the actual implementation.
        return Ok(new List<string> { "Commission1", "Commission2" });
    }

    [HttpPost]
    public IActionResult CreateCommission([FromBody] CommissionRequest request)
    {
        if(string.IsNullOrEmpty(request.Name))
            return BadRequest("Commission name cannot be empty.");
        if(request.DeadlineAt < DateTime.UtcNow)
            return BadRequest("Deadline cannot be in the past.");

        Commission commission = new(request);

        _context.Commissions.Add(commission);
        _context.SaveChanges();
        _logger.LogInformation("Commission created: {CommissionId}", commission.Id);

        return CreatedAtAction(nameof(GetCommissions), new { id = commission.Id }, commission);
    }
}
