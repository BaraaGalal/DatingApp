using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Udemy.DTO;
using Udemy.Helpers;
using Udemy.Models;

namespace Udemy.Interface
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        //Task<bool> SaveAllAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIDAsync(int id);
        Task<AppUser> GetUserByUSernameAsync(string username);
        Task<PagedList<MemberDto>> GetMemberAsync(UserParams userParams);
        Task<MemberDto> GetMemberAsync(string username);
        Task<string> GetUserGender(string username);

    }
}
