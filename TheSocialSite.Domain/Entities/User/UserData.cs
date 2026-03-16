using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheSocialSite.Domain.Entities.User
{
    public class UserData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; }

        [Required]
        [MaxLength(256)] // hashed password length
        public string Password { get; set; }

        [Required]
        public UserRole Role { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [MaxLength(250)]
        public string? Avatar { get; set; }

        [MaxLength(500)]
        public string? Bio { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        [MaxLength(150)]
        public string? Website { get; set; }

        // i dont know how this works
        //public UserSocialMedia? SocialLinks { get; set; }
        //public ICollection<UserFollowData>? Followers { get; set; }
        //public ICollection<UserFollowData>? Following { get; set; }

        public int PostsCount { get; set; }

        [Required]
        public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
    }
}