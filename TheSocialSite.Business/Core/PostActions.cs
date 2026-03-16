using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.DataAccess;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.Post;
using TheSocialSite.Domain.Models.Post;

namespace TheSocialSite.Business.Core
{
    public class PostActions
    {
        private readonly DbSession _dbSession;
        public PostActions()
        {
            _dbSession = new DbSession();
        }
        public PostData[] GetAllPostsActionExecution()
        {
            using (var postContext = _dbSession.PostContext())
            {
                return postContext.Posts.ToArray();
            }
        }
        public PostValidationDto CreatePostActionExecution(CreatePostDto postData)
        {
            if (postData == null)
            {
                return new PostValidationDto
                {
                    IsValid = false,
                    ErrorMessage = "No data provided"
                };
            }
            PostData postEntity;
            using (var postContext = _dbSession.PostContext())
            {
                postEntity = new PostData
                {
                    Title = postData.Title,
                    Description = postData.Description,
                    ImageUrl = postData.ImageUrl,
                    ReferenceUrl = postData.ReferenceUrl,
                    Category = postData.Category,
                    Duration = postData.Duration,
                    ShowWithReference = postData.ShowWithReference
                };

                postContext.Posts.Add(postEntity);
                postContext.SaveChanges();
            };
            return new PostValidationDto
            {
                PostId = postEntity.Id,
                IsValid = true,
                ErrorMessage = null
            };
        }
    }
}
