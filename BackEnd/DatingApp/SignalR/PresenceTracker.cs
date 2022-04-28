using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Udemy.SignalR
{
    public class PresenceTracker
    {
        /// S17E05
        /// we will add two method to add the user to the Dictionary when they connected and disconnected
        /// and B/C the user can open his account from more then one browser 
        /// and evre time he git a new id from Hub so we will sava the values in list of string
        private static readonly Dictionary<string, List<string>> OnlineUsers = new Dictionary<string, List<string>>();

        public Task<bool> UserConnected(string username, string connectionId)
        {
            /// first we lock the dictionary 
            /// B/C if we have a concurrent user(another user) try to update we will have a problem
            /// so the dictionary until we finsh for check if we have a key of the current login user
            /// and if it is then we add a connection  Id 
            /// otherwithe we are going to create a new dictionary for this username
            bool isOnline = false;
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(username))
                {
                    OnlineUsers[username].Add(connectionId);
                }
                else
                {
                    OnlineUsers.Add(username, new List<string> { connectionId });
                    isOnline = true;
                }
            }
            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            bool isOffline = false;
            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);

                OnlineUsers[username].Remove(connectionId);

                if(OnlineUsers[username].Count == 0)
                {
                    OnlineUsers.Remove(username);
                    isOffline = true;
                }
            }
            return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;

            lock (OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }

        /// this method will send notification to the user if he got a new message and he is online
        public Task<List<string>> GetConnectionForUser(string username)
        {
            List<string> connectionIds;
            lock (OnlineUsers)
            {
                connectionIds = OnlineUsers.GetValueOrDefault(username);
            }
            return Task.FromResult(connectionIds);
        }
    }
}
