using System;
using System.Linq;
using AutoMapper;
using Overview.Controllers.Resources;
using Overview.Models;

namespace Overview.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserResource>()
                .ForMember(dest => dest.UserRoles,
                    opt => opt.MapFrom(src => String.Join(", ", src.UserRoles.Select(ur => ur.Role.Name).ToArray())))
                .ForMember(
                    dest => dest.Roles,
                    opt => opt.MapFrom(src => src.UserRoles.Select(ur => new Role
                    {
                        Name = ur.Role.Name,
                        Id = ur.Role.Id
                    }
                                       )));
            CreateMap<SaveUserResource, User>();
            CreateMap<ReceiveResource, Receive>();
        }
    }
}