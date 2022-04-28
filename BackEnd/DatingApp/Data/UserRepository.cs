using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Udemy.DTO;
using Udemy.Helpers;
using Udemy.Interface;
using Udemy.Models;

namespace Udemy.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<PagedList<MemberDto>> GetMemberAsync(UserParams userParams)
        {
            var query = context.Users.AsQueryable();

            query = query.Where(ww => ww.UserName != userParams.CurrentUsername);
            query = query.Where(ww => ww.Gender == userParams.Gender);

            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(ww => ww.DateOfBirth >= minDob && ww.DateOfBirth <= maxDob);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(o => o.created),
                // the Underscore is the default value of the switch expressions
                _ => query.OrderByDescending(o => o.LastActive)
            };

            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(mapper
                .ConfigurationProvider).AsNoTracking(),
                    userParams.PageNumber, userParams.PageSize);

        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await context.Users
                .Where(ww => ww.UserName == username)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<AppUser> GetUserByIDAsync(int id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUSernameAsync(string username)
        {
            return await context.Users.Include(p => p.photos)
                .SingleOrDefaultAsync(ww => ww.UserName == username);
        }

        public async Task<string> GetUserGender(string username)
        {
            return await context.Users.Where(ww => ww.UserName == username)
                .Select(ww => ww.Gender).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await context.Users.Include(p => p.photos).ToListAsync();
        }

        //public async Task<bool> SaveAllAsync()
        //{
        //    return await context.SaveChangesAsync() > 0;
        //}

        public void Update(AppUser user)
        {
            context.Entry(user).State = EntityState.Modified;
        }
    }
}
