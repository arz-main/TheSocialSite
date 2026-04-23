namespace TheSocialSite.Domain.Models.Course
{
    public class CreateChapterDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public int CourseId { get; set; }
        public int Order { get; set; }
    }
}
