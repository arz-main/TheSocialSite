using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Domain.Entities.SocialMedia
{
    public class SocialMediaData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [MaxLength(150)]
        public string? Twitter { get; set; }

        [MaxLength(150)]
        public string? Pinterest { get; set; }

        [MaxLength(150)]
        public string? DeviantArt { get; set; }

        [MaxLength(150)]
        public string? YouTube { get; set; }

        [MaxLength(150)]
        public string? Discord { get; set; }

        // Foreign key to UserData
        [Required]
        public string UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public UserData User { get; set; } = null!;
    }
}