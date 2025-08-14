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
    //private readonly IMemoryCache _cache;
    //private const string CACHE_KEY_PREFIX = "Commissions_";

    public CommissionController(
        ILogger<CommissionController> logger,
        CommissionContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpPost]
    public IActionResult CreateCommission([FromBody] CommissionRequest request)
    {
        if (string.IsNullOrEmpty(request.ClientName))
            return BadRequest("Commission name cannot be empty.");
        else if (request.ClientName.Length >= 50)
            return BadRequest("Commission client name cannot be or exceed 50 characters.");

        if (string.IsNullOrEmpty(request.Name))
            return BadRequest("Commission name cannot be empty.");
        else if (request.Name.Length >= 100)
            return BadRequest("Commission name cannot be or exceed 100 characters.");

        if (request.Price < 0)
            return BadRequest("Commission price cannot be negative");

        if (request.Currency.Length <= 0 || request.Currency.Length > 3)
            return BadRequest("Commission currency must not be empty nor have more than 3 characters");

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
    public IActionResult GetCommissions(string timezone, int pageNumber = 1, int pageSize = 10)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1 || pageSize > 10) pageSize = 10;

        var totalCount = _context.Commissions.Count();
        if (totalCount == 0)
            return NotFound("No commissions found.");

        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        // Commented while user-coms relation is finished to employ strategy according to CRUD actions

        //var cacheKey = $"{CACHE_KEY_PREFIX}_{pageNumber}_{pageSize}";
        //if (_cache.TryGetValue(cacheKey, out CommissionListResponse? cachedResponse)
        //    && cachedResponse is not null)
        //{
        //    _logger.LogInformation("Returning cached response for page {PageNumber}, size {PageSize}", pageNumber, pageSize);
        //    return Ok(cachedResponse);
        //}

        var commissions = _context.Commissions
            .OrderBy(c => c.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CommissionResponse(c))
            .ToList();

        // Create list to add commissions that have been updated to later replace it
        var commissionsToUpdate = new List<CommissionResponse>();
        foreach (var commission in commissions)
        {
            var existingCommission = _context.Commissions.Find(commission.Id);
            if (existingCommission != null && existingCommission.State != CommissionStateEnum.Completed)
            {
                var deadlineDate = DateOnly.TryParseExact(existingCommission.DeadlineAt,
                                                          "yyyy-MM-dd",
                                                          CultureInfo.InvariantCulture,
                                                          DateTimeStyles.None,
                                                          out var parsedDate)
                                   ? parsedDate
                                   : DateOnly.MinValue;
                if (deadlineDate != DateOnly.MinValue)
                {
                    try
                    {
                        var dateTimeZone = DateTimeZoneProviders.Tzdb[timezone];
                        // Get current time in the CLIENT's timezone
                        var nowInClientZone = SystemClock.Instance.GetCurrentInstant().InZone(dateTimeZone);
                        var todayInClientZone = nowInClientZone.Date;
                        // Convert DateOnly to LocalDate for comparison
                        var deadlineLocalDate = new LocalDate(deadlineDate.Year, deadlineDate.Month, deadlineDate.Day);
                        // Now you can compare LocalDate with LocalDate
                        if (deadlineLocalDate <= todayInClientZone)
                        {
                            existingCommission.State = CommissionStateEnum.Late;
                            _context.SaveChanges();

                            // Create a new commission response from the updated commission
                            var updatedCommissionResponse = new CommissionResponse(existingCommission);
                            // Add it to the list of updated
                            commissionsToUpdate.Add(updatedCommissionResponse);

                            _logger.LogInformation("Commission {CommissionId} marked as late", existingCommission.Id);
                        }
                    }
                    catch (DateTimeZoneNotFoundException)
                    {
                        _logger.LogWarning("Invalid timezone for commission {CommissionId}", commission.Id);
                    }
                }
            }
        }

        // Check if updated list to late is empty if not, update the commissions list
        if (commissionsToUpdate.Count > 0)
        {
            foreach (var updatedCommission in commissionsToUpdate)
            {
                var index = commissions.FindIndex(c => c.Id == updatedCommission.Id);
                if (index != -1)
                {
                    commissions[index] = updatedCommission;
                }
            }
        }

        var response = new CommissionListResponse(
            totalCount,
            pageNumber,
            pageSize,
            totalPages,
            commissions);

        //_cache.Set(cacheKey, response, TimeSpan.FromMinutes(5));

        return Ok(response);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateCommission(string id, [FromBody] CommissionRequest updatedCommission)
    {
        var idGuid = Guid.TryParse(id, out var parsedId) ? parsedId : Guid.Empty;
        if (idGuid == Guid.Empty)
            return BadRequest("Invalid commission ID.");

        var existingCommission = _context.Commissions.Find(idGuid);
        if (existingCommission == null)
            return NotFound("Commission not found.");

        if (!string.IsNullOrEmpty(updatedCommission.ClientName)
            && updatedCommission.ClientName.Length >= 50)
            return BadRequest("Commission client name cannot be or exceed 50 characters.");
        if (!string.IsNullOrEmpty(updatedCommission.Name)
                && updatedCommission.Name.Length >= 100)
            return BadRequest("Commission name cannot be or exceed 100 characters.");
        if (!string.IsNullOrEmpty(updatedCommission.Currency)
                && (updatedCommission.Currency.Length <= 0 || updatedCommission.Currency.Length > 3))
            return BadRequest("Commission currency must not be empty nor have more than 3 characters");

        bool isLate = false;
        if (!string.IsNullOrEmpty(updatedCommission.DeadlineAt))
        {
            var deadlineDate = DateOnly.TryParseExact(updatedCommission.DeadlineAt,
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
                var dateTimeZone = DateTimeZoneProviders.Tzdb[updatedCommission.Timezone];

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
        }
        else
        {
            // if no changes to deadline check if it's late to update it automatically
            var existingDeadline = DateOnly.TryParseExact(existingCommission.DeadlineAt,
                                                          "yyyy-MM-dd",
                                                          CultureInfo.InvariantCulture,
                                                          DateTimeStyles.None,
                                                          out var existingParsedDate)
                                  ? existingParsedDate
                                  : DateOnly.MinValue;
            if (existingDeadline != DateOnly.MinValue)
                return BadRequest("Invalid deadline date");

            try
            {
                var dateTimeZone = DateTimeZoneProviders.Tzdb[updatedCommission.Timezone];
                // Get current time in the CLIENT's timezone
                var nowInClientZone = SystemClock.Instance.GetCurrentInstant().InZone(dateTimeZone);
                var todayInClientZone = nowInClientZone.Date;
                // Convert DateOnly to LocalDate for comparison
                var existingDeadlineLocalDate = new LocalDate(existingDeadline.Year, existingDeadline.Month, existingDeadline.Day);
                // Now you can compare LocalDate with LocalDate
                if (existingDeadlineLocalDate <= todayInClientZone)
                    isLate = true;
            }
            catch (DateTimeZoneNotFoundException)
            {
                return BadRequest("Invalid timezone.");
            }
        }

        existingCommission.Update(updatedCommission, isLate);

        _context.SaveChanges();
        _logger.LogInformation("Commission updated: {CommissionId}", id);
        return Ok(new CommissionResponse(existingCommission));
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
