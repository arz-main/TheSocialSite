using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.Comment;
using TheSocialSite.Domain.Models.Comment;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Interfaces
{
    public interface ICommentInteractAction
    {
        CommentActionResponse GetCommentsByPostIdAction(string postId);

        CommentActionResponse GetCommentById(string commentId);

        CommentActionResponse CreateCommentAction(string postId, string content, string userId);

        DefaultActionResponse UpdateCommentAction(string commentId, string userId, string newContent);

        DefaultActionResponse DeleteCommentAction(string commentId, string userId);
    }
}

