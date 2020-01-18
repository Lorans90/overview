using System;

namespace Overview.Models
{
    public class Receive
    {
        public int Id { get; set; }

        public string Value { get; set; }

        public DateTime TimeStamp { get; set; }

        public int TargetId { get; set; }
    }
}