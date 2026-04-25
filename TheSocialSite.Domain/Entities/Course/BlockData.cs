using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheSocialSite.Domain.Entities.Course
{
    public enum BlockType
    {
        Text,
        Video,
        Image,
        PracticeSession
    }

    public class BlockData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public BlockType Type { get; set; }

        [Required]
        public int LessonId { get; set; }

        [ForeignKey("LessonId")]
        public LessonData Lesson { get; set; }

        [Required]
        public int Order { get; set; }

        // Text
        public string? TextContent { get; set; }

        // Video
        [MaxLength(500)]
        public string? VideoUrl { get; set; }
        public int? DurationSeconds { get; set; }

        // Image
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        [MaxLength(300)]
        public string? Caption { get; set; }
        // Practice Session
        public string? PracticeConfig { get; set; }
    }
}
