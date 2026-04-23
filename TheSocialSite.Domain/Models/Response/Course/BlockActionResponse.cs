using System.Collections.Generic;
using TheSocialSite.Domain.Models.Course;

namespace TheSocialSite.Domain.Models.Response.Course
{
    public class BlockActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public BlockDto? BlockDto { get; set; }
        public List<BlockDto>? BlockDtos { get; set; }
    }
}
