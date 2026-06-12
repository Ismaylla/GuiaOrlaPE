using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuiaOrlaPE.API.Migrations
{
    /// <inheritdoc />
    public partial class AddWifiField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Wifi",
                table: "businesses",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Wifi",
                table: "businesses");
        }
    }
}
