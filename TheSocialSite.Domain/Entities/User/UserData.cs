using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TheSocialSite.Domain.Entities.SocialMedia;

namespace TheSocialSite.Domain.Entities.User
{
    public enum Role
    {
        User,
        Admin
    }
    public class UserData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(256)] // hashed password length
        public  string Password { get; set; } = string.Empty;

        [Required]
        public Role Role { get; set; } = Role.User;

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(max)")]
        public string? AvatarUrl { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Bio { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Location { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Website { get; set; } = string.Empty;

        public SocialMediaData? SocialMedia { get; set; }

        [Required]
        public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
    }
}