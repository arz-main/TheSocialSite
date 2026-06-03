using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Domain.Entities.Friendship
{
    public enum FriendshipStatus
        {Pending,
        Accepted,
        Declined}
    public class FriendshipData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        /*temporar*/ public string Id { get; set; } = string.Empty;

        [Required]
        /*temporar*/ public string SenderId { get; set; } = string.Empty;
        [ForeignKey("SenderId")]
        /*temporar*/ public UserData? Sender { get; set; }

        [Required]
        /*temporar*/ public string ReceiverId { get; set; } = string.Empty;
        [ForeignKey("ReceiverId")]
        /*temporar*/ public UserData? Receiver { get; set; }

         //Statutul cererii
        [Required]
        public FriendshipStatus Status { get; set; }

        [Required]
        public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}