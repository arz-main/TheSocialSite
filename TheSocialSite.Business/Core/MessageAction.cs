using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using TheSocialSite.Domain.Models.Message;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Core
{
    public class MessageAction : Hub
    {
        // Called when a user opens a conversation
        public async Task JoinConversation(string conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        }

        // Called when a user closes/leaves a conversation
        public async Task LeaveConversation(string conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
        }

        public async Task<MessageActionResponse> SendMessageActionExecution(MessageDto messageData)
        {
            var messageId = Guid.NewGuid().ToString();

            // Only send to users in this conversation group
            await Clients.Group(messageData.ConversationId).SendAsync(
                "ReceiveMessage",
                messageData.ConversationId,
                messageData.User,
                messageData.Message,
                messageId
            );

            return new MessageActionResponse
            {
                IsValid = true,
                Message = "Message sent successfully",
                MessageId = messageId
            };
        }
    }
}