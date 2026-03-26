using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Message
{
    public class MessageDto
    {
        public string Message { get; set; }
        public string User { get; set;  }
        public string ConversationId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
