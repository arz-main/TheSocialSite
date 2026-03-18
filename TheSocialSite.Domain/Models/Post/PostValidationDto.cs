using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Post
{
    public class PostValidationDto
    {
        public string PostId { get; set; }
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; }

    }
}
