using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Overview.Data;
using Overview.Models;
using Overview.Extensions;

namespace Overview.Services
{
    public interface IRolesService
    {
        Task<List<Role>> FindUserRolesAsync(int userId);
        Task<bool> IsUserInRole(int userId, string roleName);
        Task<List<User>> FindUsersInRoleAsync(string roleName);
        Task<List<Role>> GetAllRoles();
    }

    public class RolesService : IRolesService
    {
        private readonly IUnitOfWork _uow;
        private readonly DbSet<Role> _roles;
        private readonly DbSet<User> _users;

        public RolesService(IUnitOfWork uow)
        {
            _uow = uow;
            _uow.CheckArgumentIsNull(nameof(_uow));

            _roles = _uow.Set<Role>();
            _users = _uow.Set<User>();
        }

        public Task<List<Role>> FindUserRolesAsync(int userId)
        {
            var userRolesQuery = from role in _roles
                                 from userRoles in role.UserRoles
                                 where userRoles.UserId == userId
                                 select role;

            return userRolesQuery.OrderBy(x => x.Name).ToListAsync();
        }

        public async Task<bool> IsUserInRole(int userId, string roleName)
        {
            var userRolesQuery = from role in _roles
                                 where role.Name == roleName
                                 from user in role.UserRoles
                                 where user.UserId == userId
                                 select role;
            var userRole = await userRolesQuery.FirstOrDefaultAsync().ConfigureAwait(false);
            return userRole != null;
        }

        public Task<List<User>> FindUsersInRoleAsync(string roleName)
        {
            var roleUserIdsQuery = from role in _roles
                                   where role.Name == roleName
                                   from user in role.UserRoles
                                   select user.UserId;
            return _users.Where(user => roleUserIdsQuery.Contains(user.Id))
                         .ToListAsync();
        }
        
        public async Task<List<Role>> GetAllRoles()
        {
            return await _roles.ToListAsync();
        }

    }
}