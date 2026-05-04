// using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc; //pentru controllere si API-uri
using TheSocialSite.AspNetCore.SignalR; //pentru notificari in timp real
using TheSocialSite.Business; //logica aplicatiei
using TheSocialSite.DataAccess.Context; //salvarea relatiilor in DB
using TheSocialSite.Models.Friendship; //cerere de prietenie
using TheSocialSite.Models.Response.FriendshipActionResponse; //cerere raspuns

namespace TheSocialSite.Api.Controllers
{
    [Route("api/friendship")]
    [ApiController]

    public class FriendshipController : ControllerBase
    {}
}