using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TC_API.Controllers;
using TC_API.Database;
using TC_API.Models;
using Moq;
using Microsoft.Extensions.Configuration;

public class CommissionControllerTest
{
    private static string GetTestConnectionString()
    {
        var config = new ConfigurationBuilder()
            .AddUserSecrets<CommissionControllerTest>()
            .Build();

        return config.GetConnectionString("TestCommissionDb")!;
    }

    [Fact]
    public void CreateCommission_ValidRequest_IntegrationTest()
    {
        // Arrange
        var connectionString = GetTestConnectionString();
        var options = new DbContextOptionsBuilder<CommissionContext>()
            .UseNpgsql(connectionString)
            .Options;

        // Ensure database is created and clean
        using (var setupContext = new CommissionContext(options))
        {
            setupContext.Database.EnsureDeleted();
            setupContext.Database.EnsureCreated();
        }

        using var context = new CommissionContext(options);
        var loggerMock = new Mock<ILogger<CommissionController>>();
        var controller = new CommissionController(loggerMock.Object, context);

        var request = new CommissionRequest("Test Commission",
            "123 Test St, Test City, TC 12345",
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)).ToString("MM-dd-yyyy"));

        // Act
        var result = controller.CreateCommission(request);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        var commission = Assert.IsType<CommissionResponse>(createdResult.Value);

        Assert.Equal(request.Name, commission.Name);
        Assert.Equal(request.DeadlineAt, commission.DeadlineAt);
        Assert.NotEqual(Guid.Empty, commission.Id);
    }
}
