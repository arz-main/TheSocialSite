using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.DataAccess;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Models.Post;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.DataAccess.Context;

namespace TheSocialSite.Business.Core
{
    public class PostActions
    {
        public PostActions() { }
        public PostData[] GetAllPostsActionExecution()
        {
            using (var postContext = new PostContext())
            {
                return postContext.Posts.ToArray();
            }
        }
        public ActionResponse PostCreationActionExecution(PostCreationDto postData)
        {
            if (postData == null)
            {
                return new ActionResponse
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
                    Author = postData.Author,
                    ImageUrl = postData.ImageUrl,
                    ReferenceUrl = postData.ReferenceUrl,
                    Category = postData.Category,
                    Duration = postData.Duration,
                    ShowWithReference = postData.ShowWithReference
                };

                postContext.Posts.Add(postEntity);
                postContext.SaveChanges();
            };
            return new ActionResponse
            {
                IsValid = true,
                Message = "Post created successfully"
            };
        }
    }
}
