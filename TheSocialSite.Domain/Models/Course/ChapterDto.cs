using System.Collections.Generic;

namespace TheSocialSite.Domain.Models.Course
{
    public class ChapterDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public int CourseId { get; set; }
        public int Order { get; set; }
        public List<LessonDto>? Lessons { get; set; }
    }
}
