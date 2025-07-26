namespace TC_API.Models;

public class CommissionListResponse
{
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public List<CommissionResponse> Items { get; set; } = new List<CommissionResponse>();
    public CommissionListResponse(
        int totalCount,
        int pageNumber,
        int pageSize,
        int totalPages,
        List<CommissionResponse> items)
    {
        TotalCount = totalCount;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalPages = totalPages;
        Items = items;
    }
}
