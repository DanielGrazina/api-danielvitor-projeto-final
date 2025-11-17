using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StoreApi.Migrations
{
    /// <inheritdoc />
    public partial class AddUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "Users",
                newName: "Email");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Users",
                newName: "PasswordHash");
        }
    }
}
