using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuiaOrlaPE.API.Migrations
{
    /// <inheritdoc />
    public partial class AddComodidadesExplorer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Acessibilidade",
                table: "businesses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Cadeira",
                table: "businesses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Cartao",
                table: "businesses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Chuveiro",
                table: "businesses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Estacionamento",
                table: "businesses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PetFriendly",
                table: "businesses",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Acessibilidade",
                table: "businesses");

            migrationBuilder.DropColumn(
                name: "Cadeira",
                table: "businesses");

            migrationBuilder.DropColumn(
                name: "Cartao",
                table: "businesses");

            migrationBuilder.DropColumn(
                name: "Chuveiro",
                table: "businesses");

            migrationBuilder.DropColumn(
                name: "Estacionamento",
                table: "businesses");

            migrationBuilder.DropColumn(
                name: "PetFriendly",
                table: "businesses");
        }
    }
}
