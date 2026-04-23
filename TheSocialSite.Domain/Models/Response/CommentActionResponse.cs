using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Models.Comment;

namespace TheSocialSite.Domain.Models.Response
{
    public class CommentActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public List<CommentDto>? CommentDtos { get; set; } // get many
        public CommentDto? CommentDto { get; set; } // get one 
    }
}
