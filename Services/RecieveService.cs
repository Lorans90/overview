using System;
using System.Collections.Generic;
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
    public interface IRecievesService
    {
        Task<List<Receive>> GetAllReceives();
        Task<Receive> CreateReceiveAsync(ReceiveResource receive);
    }

    public class ReceivesService : IRecievesService
    {
        private readonly IUnitOfWork _uow;
        private readonly DbSet<Receive> _recieves;
        private readonly IMapper mapper;

        public ReceivesService(IUnitOfWork uow,  IMapper mapper)
        {
            _uow = uow;
            _uow.CheckArgumentIsNull(nameof(_uow));

            _recieves = _uow.Set<Receive>();
            this.mapper = mapper;
        }

     
        public async Task<List<Receive>> GetAllReceives()
        {
            return await _recieves.ToListAsync();
        }
        


        public async Task<Receive> CreateReceiveAsync(ReceiveResource receiveResource)
        {
            var receiveModel = mapper.Map<ReceiveResource, Receive>(receiveResource);
            _recieves.Add(receiveModel);
            await _uow.SaveChangesAsync();
            return receiveModel;
        }

     }
}