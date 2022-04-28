using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Udemy.DTO;
using Udemy.Extension;
using Udemy.Interface;
using Udemy.Models;

namespace Udemy.SignalR
{
    public class MessageHub: Hub
    {
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;
        private readonly IHubContext<PresenceHub> presenceHub;
        private readonly PresenceTracker tracker;

        public MessageHub(IMapper mapper,
                IUnitOfWork unitOfWork, IHubContext<PresenceHub> presenceHub,
                    PresenceTracker tracker)
        {
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            this.presenceHub = presenceHub;
            this.tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group = await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);
            var messages = await unitOfWork.MessageRepository
                .GetMessageThread(Context.User.GetUsername(), otherUser);

            if (unitOfWork.HasChanges()) await unitOfWork.Complete();
       
            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User.GetUsername();
            if (username == createMessageDto.RecipientUsername.ToLower())
            {
                throw new HubException("You Cannot send message to yourself");
            }

            var sender = await unitOfWork.UserRepository.GetUserByUSernameAsync(username);
            var recipient = await unitOfWork.UserRepository.GetUserByUSernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) throw new HubException("Not Found");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await unitOfWork.MessageRepository.GetMessageGroup(groupName);

            if (group.Connections.Any(x=> x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await tracker.GetConnectionForUser(recipient.UserName);
                if(connections != null)
                {
                    await presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                        new { username = sender.UserName, knownAs = sender.KnownAs });
                }
            }

            unitOfWork.MessageRepository.AddMessage(message);

            if (await unitOfWork.Complete())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", mapper.Map<MessageDto>(message));
            }
        }
        #region Adding & Remove User From Group
        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await unitOfWork.MessageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

            if (group == null)
            {
                group = new Group(groupName);
                unitOfWork.MessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if(await unitOfWork.Complete()) return group;

            throw new HubException("Failed to join the group");
        }

        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            unitOfWork.MessageRepository.RemoveConnection(connection);
            if (await unitOfWork.Complete()) return group;

            throw new HubException("Faild to remove from group");
        }

        #endregion

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}
