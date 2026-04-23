using System.Collections.Generic;

namespace TheSocialSite.Domain.Models.Course
{
    public class LessonDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public int ChapterId { get; set; }
        public int Order { get; set; }
        public List<BlockDto>? Blocks { get; set; }
    }
}
