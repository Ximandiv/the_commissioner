using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TC_API.Migrations
{
    /// <inheritdoc />
    public partial class Commission_Address : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "DeadlineAt",
                table: "Commissions",
                type: "text",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<string>(
                name: "DeliveryAddress",
                table: "Commissions",
                type: "character varying(60)",
                maxLength: 60,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveryAddress",
                table: "Commissions");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeadlineAt",
                table: "Commissions",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
