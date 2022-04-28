using Microsoft.EntityFrameworkCore.Migrations;

namespace Udemy.Migrations
{
    public partial class ChangeSernderUsernameToSenderUsername : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SernderUsername",
                table: "Messages",
                newName: "SenderUsername");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SenderUsername",
                table: "Messages",
                newName: "SernderUsername");
        }
    }
}
