using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using NodaTime;
using NodaTime.TimeZones;
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
    private readonly IMemoryCache _cache;
    private const string CACHE_KEY_PREFIX = "Commissions_";

    public CommissionController(
        ILogger<CommissionController> logger,
        CommissionContext context,
        IMemoryCache cache)
    {
        _logger = logger;
        _context = context;
        _cache = cache;
    }

    [HttpPost]
    public IActionResult CreateCommission([FromBody] CommissionRequest request)
    {
        if (string.IsNullOrEmpty(request.Name))
            return BadRequest("Commission name cannot be empty.");
        else if (request.Name.Length >= 100)
            return BadRequest("Commission name cannot be or exceed 100 characters.");

        var deadlineDate = DateOnly.TryParseExact(request.DeadlineAt,
                                                  "yyyy-MM-dd",
                                                  CultureInfo.InvariantCulture,
                                                  DateTimeStyles.None,
                                                  out var parsedDate)
                            ? parsedDate
                            : DateOnly.MinValue;

        if (deadlineDate == DateOnly.MinValue)
            return BadRequest("Invalid deadline date");

        try
        {
            var dateTimeZone = DateTimeZoneProviders.Tzdb[request.Timezone];

            // Get current time in the CLIENT's timezone
            var nowInClientZone = SystemClock.Instance.GetCurrentInstant().InZone(dateTimeZone);
            var todayInClientZone = nowInClientZone.Date;

            // Convert DateOnly to LocalDate for comparison
            var deadlineLocalDate = new LocalDate(deadlineDate.Year, deadlineDate.Month, deadlineDate.Day);

            // Now you can compare LocalDate with LocalDate
            if (deadlineLocalDate <= todayInClientZone)
                return BadRequest("Deadline cannot be in same day or past.");
        }
        catch (DateTimeZoneNotFoundException)
        {
            return BadRequest("Invalid timezone.");
        }

        var commission = new Commission(request);

        _context.Commissions.Add(commission);
        _context.SaveChanges();

        _logger.LogInformation("Commission created: {CommissionId}", commission.Id);

        var response = new CommissionResponse(commission);

        return CreatedAtAction(nameof(GetCommissions), new { id = commission.Id }, response);
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

        var cacheKey = $"{CACHE_KEY_PREFIX}_{pageNumber}_{pageSize}";
        if (_cache.TryGetValue(cacheKey, out CommissionListResponse? cachedResponse)
            && cachedResponse is not null)
        {
            _logger.LogInformation("Returning cached response for page {PageNumber}, size {PageSize}", pageNumber, pageSize);
            return Ok(cachedResponse);
        }

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

        _cache.Set(cacheKey, response, TimeSpan.FromMinutes(5));

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCommission(string id)
    {
        var idGuid = Guid.TryParse(id, out var parsedId) ? parsedId : Guid.Empty;
        var commission = _context.Commissions.Find(idGuid);
        if (commission == null)
            return NotFound("Commission not found.");

        _context.Commissions.Remove(commission);
        _context.SaveChanges();

        _logger.LogInformation("Commission deleted: {CommissionId}", id);
        return NoContent();
    }
}
