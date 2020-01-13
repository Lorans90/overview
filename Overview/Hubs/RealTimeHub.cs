using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace template.Hubs
{
    public interface IRealTimeHub
    {
        Task BroadcastMessage(object message);
    }
    public class RealTimeHub : Hub<IRealTimeHub>
    {
        public void BroadcastMessage(object value)
        {
            Clients.All.BroadcastMessage(value);
        }
    }
}