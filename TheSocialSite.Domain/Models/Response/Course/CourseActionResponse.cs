using System.Collections.Generic;
using TheSocialSite.Domain.Models.Course;

namespace TheSocialSite.Domain.Models.Response.Course
{
    public class CourseActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public CourseDto? CourseDto { get; set; }
        public List<CourseDto>? CourseDtos { get; set; }
    }
}
