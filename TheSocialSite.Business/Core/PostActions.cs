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
        public List<PostData> GetAllPostsActionExecution()
        {
            using (var postContext = new PostContext())
            {
                return postContext.Posts.ToList();
            }
        }

        public List<PostData> GetUserPostsActionExecution(string id)
        {
            using (var postContext = new PostContext())
            {
                return postContext.Posts.Where(p => p.AuthorId == id).ToList();
            }
        }

        public DefaultActionResponse PostCreationActionExecution(PostCreationDto postData, string userId, string username)
        {
            if (postData == null)
            {
                return new DefaultActionResponse
                {
                    IsValid = false,
                    Message = "No data provided"
                };
            }

            using (var postContext = new PostContext())
            {
                var postEntity = new PostData
                {
                    Title = postData.Title,
                    Description = postData.Description,
                    Author = username,
                    ImageUrl = postData.ImageUrl,
                    ReferenceUrl = postData.ReferenceUrl,
                    Category = postData.Category,
                    Duration = postData.Duration,
                    ShowWithReference = postData.ShowWithReference,
                    AuthorId = userId,
                };

                postContext.Posts.Add(postEntity);
                postContext.SaveChanges();
            };
            return new DefaultActionResponse
            {
                IsValid = true,
                Message = "Post created successfully"
            };
        }
    }
}
