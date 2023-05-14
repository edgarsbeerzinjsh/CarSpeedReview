using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarCountAndSpeedReviewApp.Migrations
{
    /// <inheritdoc />
    public partial class CarRegistrationRename : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CarRegistrationNumber",
                table: "RoadEntries",
                newName: "CarRegistration");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CarRegistration",
                table: "RoadEntries",
                newName: "CarRegistrationNumber");
        }
    }
}
