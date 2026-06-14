using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuiaOrlaPE.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCardImageUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CardImageUrl",
                table: "businesses",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CardImageUrl",
                table: "businesses");
        }
    }
}
