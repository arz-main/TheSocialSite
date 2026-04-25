using TheSocialSite.Domain.Entities.Course;

namespace TheSocialSite.Domain.Models.Course
{
    public class CreateBlockDto
    {
        public BlockType Type { get; set; }
        public int LessonId { get; set; }
        public int Order { get; set; }

        // Text
        public string? TextContent { get; set; }

        // Video
        public string? VideoUrl { get; set; }
        public int? DurationSeconds { get; set; }

        // Image
        public string? ImageUrl { get; set; }
        public string? Caption { get; set; }

        // PracticeSession
        public string? PracticeConfig { get; set; }
    }
}
