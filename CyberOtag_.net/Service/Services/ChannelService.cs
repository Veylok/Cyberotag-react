using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;

namespace DbAccess.Services
{
    public class ChannelService
    {
        private readonly TaslakContext _dbContext;

        public ChannelService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Channel> GetAllChannels()
        {
            return _dbContext.Channels.ToList();
        }

        public Channel GetChannelById(int channelId)
        {
            return _dbContext.Channels.FirstOrDefault(c => c.Channelid == channelId);
        }

        public void AddChannel(Channel channel)
        {
            _dbContext.Channels.Add(channel);
            _dbContext.SaveChanges();
        }

        public void UpdateChannel(Channel updatedChannel)
        {
            var existingChannel = _dbContext.Channels.FirstOrDefault(c => c.Channelid == updatedChannel.Channelid);
            if (existingChannel != null)
            {
                existingChannel.Channelname = updatedChannel.Channelname;
               
                _dbContext.SaveChanges();
            }
        }

        public void DeleteChannel(int channelId)
        {
            var channelToDelete = _dbContext.Channels.FirstOrDefault(c => c.Channelid == channelId);
            if (channelToDelete != null)
            {
                _dbContext.Channels.Remove(channelToDelete);
                _dbContext.SaveChanges();
            }
        }
    }
}
