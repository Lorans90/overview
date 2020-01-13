using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Overview.Controllers.Resources;
using Overview.Data;
using Overview.Extensions;
using Overview.Models;

namespace Overview.Services
{
    public interface IUsersService
    {
        Task<string> GetSerialNumberAsync(int userId);
        Task<User> FindUserAsync(string username, string password);
        Task<User> FindUserAsync(int userId);
        Task UpdateUserLastActivityDateAsync(int userId);
        Task<QueryResultResource<UserResource>> GetAllUsersAsync(QueryObject queryObject);
        Task<UserResource> CreateUserAsync(SaveUserResource saveUserResource);
        Task<SaveUserResource> UpdateUserAsync(int userId, SaveUserResource saveUserResource);
        int GetCurrentUserId();
        Task<User> GetCurrentUserAsync();
        Task<(bool Succeeded, string Error)> ChangePasswordAsync(User user, string currentPassword, string newPassword);
        Task<bool> ResetPasswordAsync(User user, string newPassword);
    }

    public class UsersService : IUsersService
    {
        private readonly IUnitOfWork _uow;
        private readonly DbSet<User> _users;
        private readonly DbSet<UserRole> _userRoles;
        private readonly ISecurityService _securityService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IMapper mapper;

        public UsersService(IUnitOfWork uow, ISecurityService securityService, IMapper mapper, IHttpContextAccessor contextAccessor)
        {
            _uow = uow;
            _uow.CheckArgumentIsNull(nameof(_uow));

            _users = _uow.Set<User>();
            _userRoles = _uow.Set<UserRole>();

            _securityService = securityService;
            _securityService.CheckArgumentIsNull(nameof(_securityService));

            _contextAccessor = contextAccessor;
            _contextAccessor.CheckArgumentIsNull(nameof(_contextAccessor));

            this.mapper = mapper;
        }

        public async Task<User> FindUserAsync(int userId)
        {
            if (userId == 0)
            {
                return await Task.FromResult<User>(null);
            }

            return await _users.FindAsync(userId);
        }

        public async Task<User> FindUserAsync(string username, string password)
        {
            var user = await _users.SingleOrDefaultAsync(x => x.Username == username);

            if (user != null)
            {
                var passwordHash = _securityService.GetSha256Hash(password, user.Salt);
                if (user.Password == passwordHash)
                {
                    return user;
                }
            }

            return null;
        }

        public async Task<string> GetSerialNumberAsync(int userId)
        {
            var user = await FindUserAsync(userId).ConfigureAwait(false);
            return user.SerialNumber;
        }

        private async Task<User> GetUserAsync(int userId)
        {
            return await _users.Where(u => u.Id == userId).Include(u => u.UserRoles).ThenInclude(ur => ur.Role).SingleAsync();
        }

        public async Task UpdateUserLastActivityDateAsync(int userId)
        {
            var user = await FindUserAsync(userId).ConfigureAwait(false);
            if (user.LastLoggedIn != null)
            {
                var updateLastActivityDate = TimeSpan.FromMinutes(2);
                var currentUtc = DateTimeOffset.UtcNow;
                var timeElapsed = currentUtc.Subtract(user.LastLoggedIn.Value);
                if (timeElapsed < updateLastActivityDate)
                {
                    return;
                }
            }

            user.LastLoggedIn = DateTimeOffset.UtcNow;
            await _uow.SaveChangesAsync().ConfigureAwait(false);
        }

        public async Task<QueryResultResource<UserResource>> GetAllUsersAsync(QueryObject queryObject)
        {
            return await _users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                               .Select(u => mapper.Map<User, UserResource>(u))
                               .AsQueryable()
                               .ApplyQueryObject(queryObject);
        }


        public async Task<UserResource> CreateUserAsync(SaveUserResource saveUserResource)
        {
            var user = mapper.Map<SaveUserResource, User>(saveUserResource);
            user.Password = new Guid().ToString();
            user.Salt = new Guid().ToString();
            _users.Add(user);

            // Add roles
            foreach (var resourceRole in saveUserResource.Roles)
            {
                user.UserRoles.Add(new UserRole
                {
                    RoleId = resourceRole.Id,
                    User = user
                });
            }

            await _uow.SaveChangesAsync();

            //Reload user with roles, because  mapping uses Role object
            user = await GetUserAsync(user.Id);

            return mapper.Map<User, UserResource>(user);
        }

        public async Task<SaveUserResource> UpdateUserAsync(int userId, SaveUserResource saveUserResource)
        {
            var user = await _users.Include(u => u.UserRoles).FirstOrDefaultAsync(u => u.Id == userId);

            // Add new roles
            foreach (var resourceRole in saveUserResource.Roles)
            {
                var roleExist = user.UserRoles.FirstOrDefault(ur => ur.RoleId == resourceRole.Id);
                if (roleExist == null)
                {
                    user.UserRoles.Add(new UserRole
                    {
                        RoleId = resourceRole.Id,
                        User = user
                    });
                }
            }

            // remove deleted roles 
            foreach (var role in user.UserRoles)
            {
                var roleRemoved = saveUserResource.Roles.FirstOrDefault(resourceRole => resourceRole.Id == role.RoleId);
                if (roleRemoved == null)
                {
                    _userRoles.Remove(role);
                }
            }

            mapper.Map<SaveUserResource, User>(saveUserResource, user);
            await _uow.SaveChangesAsync();

            return saveUserResource;
        }

        public Task<User> GetCurrentUserAsync()
        {
            var userId = GetCurrentUserId();
            return FindUserAsync(userId);
        }

        public int GetCurrentUserId()
        {
            var claimsIdentity = _contextAccessor.HttpContext.User.Identity as ClaimsIdentity;
            var userDataClaim = claimsIdentity?.FindFirst(ClaimTypes.UserData);
            var userId = userDataClaim?.Value;
            return string.IsNullOrWhiteSpace(userId) ? 0 : int.Parse(userId);
        }

        public async Task<(bool Succeeded, string Error)> ChangePasswordAsync(User user, string currentPassword, string newPassword)
        {
            var currentPasswordHash = _securityService.GetSha256Hash(currentPassword, user.Salt);
            if (user.Password != currentPasswordHash)
            {
                return (false, "Current password is wrong.");
            }

            user.Salt = _securityService.GetSalt();
            user.Password = _securityService.GetSha256Hash(newPassword, user.Salt);
            user.SerialNumber = Guid.NewGuid().ToString("N"); // expire other logins.
            await _uow.SaveChangesAsync();
            return (true, string.Empty);
        }

        public async Task<bool> ResetPasswordAsync(User user, string newPassword)
        {
            user.Salt = _securityService.GetSalt();
            user.Password = _securityService.GetSha256Hash(newPassword, user.Salt);
            user.SerialNumber = Guid.NewGuid().ToString("N"); // expire other logins.
            await _uow.SaveChangesAsync();
            return true;
        }



    }
}