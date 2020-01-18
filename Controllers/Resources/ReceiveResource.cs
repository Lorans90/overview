using System;

namespace Overview.Controllers.Resources
{
    public class ReceiveResource
    {
        public int? Id { get; set; }
        public string Value { get; set; }

        public DateTime TimeStamp { get; set; }

        public int TargetId { get; set; }
    }
}