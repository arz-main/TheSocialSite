using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Models.Post;

namespace TheSocialSite.Domain.Models.Response
{
    public class PostActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public PostDto? PostDto{ get; set; }
        public List<PostDto>? PostDtos { get; set; }
    }
}
