using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuiaOrlaPE.API.Migrations
{
    /// <inheritdoc />
    public partial class VersaoFinalCampos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Apaguei os comandos AddColumn porque as colunas já existem no banco.
            // Deixo este método vazio apenas para registrar que a migração foi aplicada.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Mantive o Down vazio também para evitar problemas ao reverter.
        }
    }
}