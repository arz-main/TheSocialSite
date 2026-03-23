using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TheSocialSite.DataAccess.Migrations.User
{
    /// <inheritdoc />
    public partial class AddSocialLinksFlag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SocialLinks_HasSocialLinks",
                table: "Users",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SocialLinks_HasSocialLinks",
                table: "Users");
        }
    }
}
