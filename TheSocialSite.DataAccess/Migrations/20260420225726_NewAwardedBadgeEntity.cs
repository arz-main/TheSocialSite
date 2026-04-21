using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TheSocialSite.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class NewAwardedBadgeEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserBadges");

            migrationBuilder.CreateTable(
                name: "AwardedBadges",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BadgeTemplateId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EarnedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AwardedBadges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AwardedBadges_BadgeTemplates_BadgeTemplateId",
                        column: x => x.BadgeTemplateId,
                        principalTable: "BadgeTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AwardedBadges_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AwardedBadges_BadgeTemplateId",
                table: "AwardedBadges",
                column: "BadgeTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_AwardedBadges_UserId",
                table: "AwardedBadges",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AwardedBadges");

            migrationBuilder.CreateTable(
                name: "UserBadges",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BadgeTemplateId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EarnedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBadges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBadges_BadgeTemplates_BadgeTemplateId",
                        column: x => x.BadgeTemplateId,
                        principalTable: "BadgeTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserBadges_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserBadges_BadgeTemplateId",
                table: "UserBadges",
                column: "BadgeTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBadges_UserId",
                table: "UserBadges",
                column: "UserId");
        }
    }
}
