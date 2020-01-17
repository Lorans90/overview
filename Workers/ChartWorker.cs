using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Overview.Hubs;

namespace Overview.Workers
{
    public class ChartWorker : BackgroundService
    {
        private readonly ILogger<ChartWorker> _logger;
        IHubContext<RealTimeHub, IRealTimeHub> _hubContext;

        public ChartWorker(ILogger<ChartWorker> logger, IHubContext<RealTimeHub, IRealTimeHub> hubContext)
        {
            _logger = logger;
            _hubContext = hubContext;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                Random r = new Random();
                int randomVal1 = r.Next(20, 100);
                int randomVal2 = r.Next(75, 85);
                int randomVal3 = r.Next(20, 42);
                int randomVal4 = r.Next(90, 100);
                var machines = new
                {
                    machine1 = randomVal1,
                    machine2 = randomVal2,
                    machine3 = randomVal3,
                    machine4 = randomVal4,
                };

                // await _hubContext.Clients.All.BroadcastMessage(machines);
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}