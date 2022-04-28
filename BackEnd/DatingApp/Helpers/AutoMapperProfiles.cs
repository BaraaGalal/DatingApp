using AutoMapper;
using System.Linq;
using Udemy.DTO;
using Udemy.Extension;
using Udemy.Models;

namespace Udemy.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(ww => ww.PhotoUrl, opt => opt.MapFrom(src =>
                    src.photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(ww => ww.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(ww => ww.SenderPhotoUrl, opt => opt.MapFrom(srs => 
                    srs.Sender.photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(ww => ww.RecipientPhotoUrl, opt => opt.MapFrom(srs =>
                    srs.Recipient.photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}
