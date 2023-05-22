using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarSpeed.Data.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CarSpeeds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TimeOfRecord = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Speed = table.Column<int>(type: "int", nullable: false),
                    CarRegistrationNumber = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarSpeeds", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CarSpeeds_TimeOfRecord",
                table: "CarSpeeds",
                column: "TimeOfRecord");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarSpeeds");
        }
    }
}
