using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using DbAccess.DBModels;
using DbAccess.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelController : ControllerBase
    {
        private readonly ChannelService _channelService;

        public ChannelController(ChannelService channelService)
        {
            _channelService = channelService;
        }

        [HttpGet]
        public IActionResult GetAllChannels()
        {
            List<Channel> allChannels = _channelService.GetAllChannels();
            return Ok(allChannels);
        }

        [HttpGet("{channelId}")]
        public IActionResult GetChannelById(int channelId)
        {
            Channel channelData = _channelService.GetChannelById(channelId);
            if (channelData == null)
            {
                return NotFound();
            }
            return Ok(channelData);
        }

        [HttpPost]
        public IActionResult AddChannel([FromBody] Channel channelToAdd)
        {
            _channelService.AddChannel(channelToAdd);
            return Ok();
        }

        [HttpPut("{channelId}")]
        public IActionResult UpdateChannel(int channelId, [FromBody] Channel updatedChannel)
        {
            if (_channelService.GetChannelById(channelId) == null)
            {
                return NotFound();
            }
            updatedChannel.Channelid = channelId;
            _channelService.UpdateChannel(updatedChannel);
            return Ok();
        }

        [HttpDelete("{channelId}")]
        public IActionResult DeleteChannel(int channelId)
        {
            if (_channelService.GetChannelById(channelId) == null)
            {
                return NotFound();
            }
            _channelService.DeleteChannel(channelId);
            return Ok();
        }
    }
}
