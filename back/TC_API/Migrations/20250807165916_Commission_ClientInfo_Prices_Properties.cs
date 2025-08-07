using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TC_API.Migrations
{
    /// <inheritdoc />
    public partial class Commission_ClientInfo_Prices_Properties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClientName",
                table: "Commissions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "Commissions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Commissions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientName",
                table: "Commissions");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "Commissions");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Commissions");
        }
    }
}
