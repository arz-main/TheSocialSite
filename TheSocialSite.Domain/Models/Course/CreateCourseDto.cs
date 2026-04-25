namespace TheSocialSite.Domain.Models.Course
{
    public class CreateCourseDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string? ThumbnailUrl { get; set; }
    }
}
