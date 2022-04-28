using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Udemy.Data;
using Udemy.Helpers;
using Udemy.Interface;
using Udemy.Services;
using Udemy.SignalR;

namespace Udemy.Extension
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services, IConfiguration config)
        {
            services.AddSingleton<PresenceTracker>();
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            //services.AddScoped<IUserRepository, UserRepository>();
            //services.AddScoped<ILikesRepository, LikesRepository>();
            //services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<LogUserActivity>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

            services.AddDbContext<DataContext>(option => option.UseSqlServer(config.GetConnectionString("DefaultConnection")));
            services.AddControllers();

            return services;
        }
    }
}
