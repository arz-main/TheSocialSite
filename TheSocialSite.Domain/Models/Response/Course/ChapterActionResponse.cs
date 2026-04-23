using System.Collections.Generic;
using TheSocialSite.Domain.Models.Course;

namespace TheSocialSite.Domain.Models.Response.Course
{
    public class ChapterActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public ChapterDto? ChapterDto { get; set; }
        public List<ChapterDto>? ChapterDtos { get; set; }
    }
}
