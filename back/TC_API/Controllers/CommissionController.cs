using Microsoft.AspNetCore.Mvc;
using System.Globalization;
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
    public IActionResult GetCommissions(int pageNumber = 1, int pageSize = 10)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1 || pageSize > 10) pageSize = 10;

        var totalCount = _context.Commissions.Count();
        if (totalCount == 0)
            return NotFound("No commissions found.");

        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var commissions = _context.Commissions
            .OrderBy(c => c.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CommissionResponse(c))
            .ToList();

        var response = new CommissionListResponse(
            totalCount,
            pageNumber,
            pageSize,
            totalPages,
            commissions);

        return Ok(response);
    }

    [HttpPost]
    public IActionResult CreateCommission([FromBody] CommissionRequest request)
    {
        if(string.IsNullOrEmpty(request.Name))
            return BadRequest("Commission name cannot be empty.");
        else if(request.Name.Length >= 100)
            return BadRequest("Commission name cannot be or exceed 100 characters.");

        var deadlineDate = DateOnly.TryParseExact(request.DeadlineAt,
                                                  "yyyy-MM-dd",
                                                  CultureInfo.InvariantCulture,
                                                  DateTimeStyles.None,
                                                  out var parsedDate)
                            ? parsedDate
                            : DateOnly.MinValue;
        if (deadlineDate <= DateOnly.FromDateTime(DateTime.UtcNow)
            || deadlineDate == DateOnly.MinValue)
            return BadRequest("Deadline cannot be in same day or past.");

        var commission = new Commission(request);

        _context.Commissions.Add(commission);
        _context.SaveChanges();
        _logger.LogInformation("Commission created: {CommissionId}", commission.Id);

        var response = new CommissionResponse(commission);

        return CreatedAtAction(nameof(GetCommissions), new { id = commission.Id }, response);
    }
}
