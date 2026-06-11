using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Collections.Generic;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Models.Friendship;
using TheSocialSite.Domain.Models.Response;
using Azure.Core;
using TheSocialSite.Domain.Entities.Friendship;
using System.Reflection.Metadata.Ecma335;

namespace TheSocialSite.Business.Core
{
    public class FriendshipActions
    {
        public FriendshipActionResponse RequestFollowExecution(string senderId, string receiverId)
        {
            using (var context = new AppDbContext())
            {
                //Check if exist user whom send request
                var receiver = context.Users.FirstOrDefault(u => u.Id == receiverId);
                if (receiver == null) {
                    return new FriendshipActionResponse
                    {
                        IsValid = false,
                        Message = "User not found"
                    };
                }

                //check if request already exist
                var existingRequest = context.Friendships.FirstOrDefault(f => f.SenderId == senderId && f.ReceiverId == receiverId && f.Status == FriendshipStatus.Pending);
                if (existingRequest != null) {
                    return new FriendshipActionResponse
                    {
                        IsValid = false,
                        Message = "Friend request already exists"
                    };
                }

                //create request
                var friendship = new FriendshipData
                {
                    SenderId = senderId,
                    ReceiverId = receiverId,
                    Status = FriendshipStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };

                //add to Db
                context.Friendships.Add(friendship);
                context.SaveChanges();
                return new FriendshipActionResponse
            {
                IsValid = true,
                Message = "Friend request sent successfully"
            };
            }
            // Implementation for sending a friend request
            // This would involve creating a new Friendship entity in the database
            // and returning a response indicating success or failure
            
        }

        public List<FriendshipResponseDto> GetFriendsListExecution(string userId)
        {
            using (var context = new AppDbContext())
            {
                var friends = context.Friendships
                    .Include(f=>f.Sender)
                    .Include(f=>f.Receiver)
                    .Where(f=>
                    (f.SenderId == userId || f.ReceiverId == userId) &&
                    f.Status == FriendshipStatus.Accepted)
                    .Select(f=>new FriendshipResponseDto
                    {
                        FriendId = f.SenderId == userId? f.ReceiverId : f.SenderId,
                        Username = f.SenderId == userId? f.Receiver.Username : f.Sender.Username,
                        AvatarUrl = f.SenderId == userId? f.Receiver.AvatarUrl : f.Sender.AvatarUrl,
                        Bio = f.SenderId == userId? f.Receiver.Bio : f.Sender.Bio,
                        Status = f.Status.ToString(),
                        CreatedAt = f.CreatedAt,
                        UpdatedAt = f.UpdatedAt
                    })
                    .ToList();
                    return friends;
            }
            // Implementation for retrieving a user's friends list
            // This would involve querying the database for all accepted friendships involving the user
            // and returning a list of friends with their details
        }

        public List<FriendshipResponseDto> GetPendingRequestsExecution(string userId)
        {
            using (var context = new AppDbContext())
            {
                var pendingRequests = context.Friendships
                    .Include(f=>f.Sender)
                    .Where(f=>f.ReceiverId == userId && f.Status == FriendshipStatus.Pending)
                    .Select(f=>new FriendshipResponseDto
                    {
                        FriendId = f.SenderId,
                        Username = f.Sender.Username,
                        AvatarUrl = f.Sender.AvatarUrl,
                        Bio = f.Sender.Bio,
                        Status = f.Status.ToString(),
                        CreatedAt = f.CreatedAt,
                        UpdatedAt = f.UpdatedAt
                    })
                    .ToList();
                    return pendingRequests;
            }
            // Implementation for retrieving a user's pending friend requests
            // This would involve querying the database for all pending friendships where the user is the receiver
            // and returning a list of pending requests with the sender's details
        }

        public FriendshipActionResponse AcceptFriendRequestExecution(string requestId, string userId)
        {
            using (var context = new AppDbContext())
            {
                var request = context.Friendships.FirstOrDefault(f => f.Id == requestId && f.ReceiverId == userId);
                if (request == null) {
                    return new FriendshipActionResponse
                    {
                        IsValid = false,
                        Message = "Friend request not found"
                    };
                }

                request.Status = FriendshipStatus.Accepted;
                request.UpdatedAt = DateTime.UtcNow;
                context.SaveChanges();

                return new FriendshipActionResponse
                {
                    IsValid = true,
                    Message = "Friend request accepted successfully"
                };
            }
            // Implementation for accepting a friend request
            // This would involve updating the status of the existing Friendship entity in the database
            // and returning a response indicating success or failure
        }

        public FriendshipActionResponse DeclineFriendRequestExecution(string requestId, string userId)
        {
            using (var context = new AppDbContext())
            {
                var request = context.Friendships.FirstOrDefault(f => f.Id == requestId && f.ReceiverId == userId);
                if (request == null) {
                    return new FriendshipActionResponse
                    {
                        IsValid = false,
                        Message = "Friend request not found"
                    };
                }

                request.Status = FriendshipStatus.Declined;
                request.UpdatedAt = DateTime.UtcNow;
                context.SaveChanges();

                return new FriendshipActionResponse
                {
                    IsValid = true,
                    Message = "Friend request declined successfully"
                };
            }
            // Implementation for declining a friend request
            // This would involve updating the status of the existing Friendship entity in the database
            // and returning a response indicating success or failure
        }

        public FriendshipActionResponse RemoveFriendExecution(string userId, string friendId)
        {
            using (var context = new AppDbContext())
            {
                var friendship = context.Friendships.FirstOrDefault(f => (
                    (f.SenderId == userId && f.ReceiverId == friendId) || 
                    (f.SenderId == friendId && f.ReceiverId == userId)) && 
                    f.Status == FriendshipStatus.Accepted);
                if (friendship == null) {
                    return new FriendshipActionResponse
                    {
                        IsValid = false,
                        Message = "Friendship not found"
                    };
                }

                context.Friendships.Remove(friendship);
                context.SaveChanges();

                return new FriendshipActionResponse
                {
                    IsValid = true,
                    Message = "Friend removed successfully"
                };
            }
            // Implementation for removing a friend
            // This would involve deleting the existing Friendship entity from the database
            // and returning a response indicating success or failure
        }
    }
}