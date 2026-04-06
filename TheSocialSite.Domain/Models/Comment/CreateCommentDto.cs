using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Comment
{
    public class CreateCommentDto
    {
        [Required]
        public string PostId { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Content { get; set; }
    }

}
