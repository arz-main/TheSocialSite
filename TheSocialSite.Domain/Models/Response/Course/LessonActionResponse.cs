using System.Collections.Generic;
using TheSocialSite.Domain.Models.Course;

namespace TheSocialSite.Domain.Models.Response.Course
{
    public class LessonActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public LessonDto? LessonDto { get; set; }
        public List<LessonDto>? LessonDtos { get; set; }
    }
}
