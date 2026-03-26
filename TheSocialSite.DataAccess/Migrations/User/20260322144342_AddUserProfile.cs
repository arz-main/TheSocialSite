using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TheSocialSite.DataAccess.Migrations.User
{
    /// <inheritdoc />
    public partial class AddUserProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SocialLinks_DeviantArt",
                table: "Users",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SocialLinks_Discord",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SocialLinks_Pinterest",
                table: "Users",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SocialLinks_Twitter",
                table: "Users",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SocialLinks_YouTube",
                table: "Users",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SocialLinks_DeviantArt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SocialLinks_Discord",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SocialLinks_Pinterest",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SocialLinks_Twitter",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SocialLinks_YouTube",
                table: "Users");
        }
    }
}
