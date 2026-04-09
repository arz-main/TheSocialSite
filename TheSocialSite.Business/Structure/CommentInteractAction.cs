using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.Comment;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Structure
{
    public class CommentInteractAction : CommentActions, ICommentInteractAction
    {
        public CommentActionResponse GetCommentsByPostIdAction(string postId)
        {
            return GetCommentsByPostIdActionExecution(postId);
        }

        public CommentActionResponse GetCommentById(string commentId)
        {
            return GetCommentsByIdExecution(commentId);
        }

        public CommentActionResponse CreateCommentAction(string postId, string content, string userId)
        {
            return CreateCommentActionExecution(postId, content, userId);
        }

        public CommentActionResponse UpdateCommentAction(string commentId, string userId, string newContent)
        {
            return UpdateCommentActionExecution(commentId, userId, newContent);
        }

        public CommentActionResponse DeleteCommentAction(string commentId, string userId)
        {
            return DeleteCommentActionExecution(commentId, userId);
        }
    }
}
