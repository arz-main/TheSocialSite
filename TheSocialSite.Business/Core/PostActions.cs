using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.DataAccess;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Post;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Core
{
    public class PostActions
    {
        public PostActions() { }
        public PostActionResponse GetAllPostsActionExecution()
        {
            using (var postContext = new AppDbContext())
            {
                var posts = postContext.Posts
                    .Include(p => p.Author)
                    .Select(p => new PostDto
                    {
                        Id = p.Id,
                        AuthorId = p.AuthorId,
                        AuthorAvatarUrl = p.Author.AvatarUrl,
                        AuthorUsername = p.Author.Username,
                        Status = p.Status,
                        Likes = p.Likes,
                        Title = p.Title,
                        ImageUrl = p.ImageUrl,
                        Category = p.Category,
                        Description = p.Description,
                        CreatedAt = p.CreatedAt
                    })
                    .ToList();

                return new PostActionResponse
                {
                    IsValid = true,
                    Message = "All posts have been retrieved",
                    PostDtos = posts
                };
            }
        }

        public PostActionResponse GetPostByIdActionExecution(string postId)
        {
            using (var _appDbContext = new AppDbContext())
            {
                var p = _appDbContext.Posts
                    .Include(p => p.Author)
                    .FirstOrDefault(p => p.Id == postId);
                if (p == null)
                {
                    return new PostActionResponse
                    {
                        IsValid = false,
                        Message = "Post not found"
                    };
                }
                var returnedPost = new PostDto
                {
                    Id = p.Id,
                    AuthorAvatarUrl = p.Author.AvatarUrl,
                    AuthorUsername = p.Author.Username,
                    AuthorId = p.AuthorId,
                    Status = p.Status,
                    Likes = p.Likes,
                    Title = p.Title,
                    ImageUrl = p.ImageUrl,
                    Category = p.Category,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt
                };

                return new PostActionResponse
                {
                    IsValid = true,
                    Message = "Post has been obtained",
                    PostDto = returnedPost
                };
            }
        }

        public PostActionResponse GetUserPostsActionExecution(string id)
        {
            using (var postContext = new AppDbContext())
            {
                var posts = postContext.Posts
                    .Include(p => p.Author)
                    .Where(p => p.AuthorId == id).ToList();
                return new PostActionResponse
                {
                    IsValid = true,
                    Message = "User posts have been obtained",
                    PostDtos = posts.Select(p => new PostDto
                    {
                        Id = p.Id,
                        AuthorUsername = p.Author.Username,
                        AuthorId = p.AuthorId,
                        AuthorAvatarUrl = p.Author.AvatarUrl,
                        Status = p.Status,
                        Likes = p.Likes,
                        Title = p.Title,
                        ImageUrl = p.ImageUrl,
                        Category = p.Category,
                        Description = p.Description,
                        CreatedAt = p.CreatedAt
                    }).ToList()
                };
            }
        }

        public PostActionResponse CreatePostActionExecution(CreatePostDto postData, string userId)
        {
            if (postData == null)
            {
                return new PostActionResponse
                {
                    IsValid = false,
                    Message = "No data provided"
                };
            }

            if (string.IsNullOrWhiteSpace(postData.Title))
            {
                return new PostActionResponse
                {
                    IsValid = false,
                    Message = "Title is required"
                };
            }

            using (var appDbContext = new AppDbContext())
            {
                // Find the user
                var author = appDbContext.Users.FirstOrDefault(u => u.Id == userId);
                if (author == null)
                {
                    return new PostActionResponse
                    {
                        IsValid = false,
                        Message = "Invalid user"
                    };
                }

                // Create the post with Author navigation property
                var postEntity = new PostData
                {
                    Title = postData.Title,
                    Description = postData.Description,
                    ImageUrl = postData.ImageUrl,
                    Category = postData.Category,
                    AuthorId = author.Id,
                    Author = author,               // <- navigation property
                    CreatedAt = DateTime.UtcNow,
                    Status = PostStatus.Draft,
                    Likes = 0
                };

                appDbContext.Posts.Add(postEntity);
                appDbContext.SaveChanges();
            }

            return new PostActionResponse
            {
                IsValid = true,
                Message = "Post created successfully"
            };
        }

        public PostActionResponse DeletePostActionExecution(string id)
        {
            using (var _appDbContext = new AppDbContext())
            {
                var post = _appDbContext.Posts.FirstOrDefault(p => p.Id == id);
                if (post == null)
                {
                    return new PostActionResponse
                    {
                        IsValid = false,
                        Message = "Post not found"
                    };
                }
                _appDbContext.Posts.Remove(post);
                _appDbContext.SaveChanges();
                return new PostActionResponse
                {
                    IsValid = true,
                    Message = "Post deleted successfully"
                };
            }
        }
    }
}
