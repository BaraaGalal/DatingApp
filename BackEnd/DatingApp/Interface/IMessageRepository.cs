using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Udemy.DTO;
using Udemy.Helpers;
using Udemy.Models;

namespace Udemy.Interface
{
    public interface IMessageRepository
    {
        void AddGroup(Group group);
        void RemoveConnection(Connection connection);
        Task<Connection> GetConnection(string connectionId);
        Task<Group> GetMessageGroup(string groupName);
        Task<Group> GetGroupForConnection(string connectionId);
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message> GetMessage(int id);
        Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername);
        //Task<bool> SaveAllAsync();
    }
}
