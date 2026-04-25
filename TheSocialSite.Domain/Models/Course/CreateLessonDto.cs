namespace TheSocialSite.Domain.Models.Course
{
    public class CreateLessonDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public int ChapterId { get; set; }
        public int Order { get; set; }
    }
}
