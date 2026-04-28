using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.Comment;
using TheSocialSite.Domain.Models.Comment;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Core
{
    public class CommentActions
    {
        // Get all comments for a specific post
        public CommentActionResponse GetCommentsByPostIdActionExecution(string postId)
        {
            using (var context = new AppDbContext())
            {
                var comments = context.Comments
                    .Include(c => c.Author)
                    .Where(c => c.PostId == postId)
                    .OrderBy(c => c.CreatedAt)
                    .ToList();

                return new CommentActionResponse
                {
                    IsValid = true,
                    Message = "Comments fetched successfully",
                    CommentDtos = comments.Select(c => new CommentDto
                    {
                        Id = c.Id,
                        PostId = c.PostId,
                        AuthorId = c.AuthorId,
                        AuthorAvatarUrl = c.Author?.AvatarUrl,
                        AuthorUsername = c.Author?.Username,
                        Content = c.Content,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt
                    }).ToList()
                };
            }
        }

        // Get a single comment by its ID
        public CommentActionResponse GetCommentsByIdExecution(string commentId)
        {
            using (var context = new AppDbContext())
            {
                var comment = context.Comments
                    .Include(c => c.Author)
                    .FirstOrDefault(c => c.Id == commentId);

                if (comment == null)
                    return new CommentActionResponse
                    {
                        IsValid = false,
                        Message = "Comment not found",
                        CommentDtos = new List<CommentDto>()
                    };

                return new CommentActionResponse
                {
                    IsValid = true,
                    Message = "Comment fetched successfully",
                    CommentDto = new CommentDto {
                        Id = comment.Id,
                        PostId = comment.PostId,
                        AuthorId = comment.AuthorId,
                        AuthorAvatarUrl = comment.Author?.AvatarUrl,
                        AuthorUsername = comment.Author?.Username,
                        Content = comment.Content,
                        CreatedAt = comment.CreatedAt,
                        UpdatedAt = comment.UpdatedAt
                    }
                };
            }
        }

        // Create a new comment
        public CommentActionResponse CreateCommentActionExecution(string postId, string content, string userId)
        {
            if (string.IsNullOrWhiteSpace(content))
                return new CommentActionResponse { IsValid = false, Message = "Comment cannot be empty" };

            using (var context = new AppDbContext())
            {
                var comment = new CommentData
                {
                    PostId = postId,
                    AuthorId = userId,
                    Content = content,
                    CreatedAt = DateTime.UtcNow
                };

                context.Comments.Add(comment);
                context.SaveChanges();

                var author = context.Users.FirstOrDefault(u => u.Id == userId);

                return new CommentActionResponse
                {
                    IsValid = true,
                    Message = "Comment created successfully",
                    CommentDto = new CommentDto
                    {
                        Id = comment.Id,
                        PostId = comment.PostId,
                        AuthorId = comment.AuthorId,
                        AuthorUsername = author?.Username,
                        AuthorAvatarUrl = author?.AvatarUrl,
                        Content = comment.Content,
                        CreatedAt = comment.CreatedAt
                    }
                };
            }
        }

        // Update a comment (only by the author)
        public CommentActionResponse UpdateCommentActionExecution(string commentId, string userId, string newContent)
        {
            using (var context = new AppDbContext())
            {
                var comment = context.Comments.FirstOrDefault(c => c.Id == commentId);
                if (comment == null)
                    return new CommentActionResponse { IsValid = false, Message = "Comment not found" };

                if (comment.AuthorId != userId)
                    return new CommentActionResponse { IsValid = false, Message = "Not authorized to edit this comment" };

                comment.Content = newContent;
                comment.UpdatedAt = DateTime.UtcNow;

                context.SaveChanges();
                return new CommentActionResponse { IsValid = true, Message = "Comment updated successfully" };
            }
        }

        // Delete a comment (only by the author)
        public CommentActionResponse DeleteCommentActionExecution(string commentId, string userId)
        {
            using (var context = new AppDbContext())
            {
                var comment = context.Comments.FirstOrDefault(c => c.Id == commentId);
                if (comment == null)
                    return new CommentActionResponse { IsValid = false, Message = "Comment not found" };

                if (comment.AuthorId != userId)
                    return new CommentActionResponse { IsValid = false, Message = "Not authorized to delete this comment" };

                context.Comments.Remove(comment);
                context.SaveChanges();
                return new CommentActionResponse { IsValid = true, Message = "Comment deleted successfully" };
            }
        }
    }
}