import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './channel.css';
import Sidebar from '../Sidebar/Sidebar';

const Channel = () => {
  const [channels, setChannels] = useState([]);
  const [newChannel, setNewChannel] = useState({
    channelname: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Channel');
      setChannels(response.data);
    } catch (error) {
      console.error('Kanal verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewChannel({ ...newChannel, [name]: value });
  };

  const addChannel = async () => {
    try {
      await axios.post('https://localhost:7282/api/Channel', newChannel);
      setNewChannel({
        channelname: '',
      });
      fetchChannels();
    } catch (error) {
      console.error('Kanal ekleme hatası:', error);
    }
  };

  const deleteChannel = async (channelId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Channel/${channelId}`);
      fetchChannels();
    } catch (error) {
      console.error('Kanal silme hatası:', error);
    }
  };

  const updateChannel = async (channelId, updatedChannel) => {
    try {
      await axios.put(`https://localhost:7282/api/Channel/${channelId}`, updatedChannel);
      setNewChannel({
        channelname: '',
      });
      setIsEditMode(false);
      fetchChannels();
    } catch (error) {
      console.error('Kanal güncelleme hatası:', error);
    }
  };

  const handleUpdate = (channelId) => {
    const channelToUpdate = channels.find((channel) => channel.channelid === channelId);
    setNewChannel(channelToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateChannel(newChannel.channelid, newChannel);
    } else {
      addChannel();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="channel-list">
        <h2>Kanallar</h2>
        {channels.length === 0 ? (
          <p>Kanallar yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Kanal Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => (
                <tr key={channel.channelid}>
                  <td>{channel.channelname}</td>
                  <td>
                    <button onClick={() => deleteChannel(channel.channelid)}>Sil</button>
                    <button onClick={() => handleUpdate(channel.channelid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="channel-form">
        <h2>{isEditMode ? 'Kanal Güncelle' : 'Yeni Kanal Ekle'}</h2>
        <div>
          <input
            type="text"
            name="channelname"
            value={newChannel.channelname}
            onChange={handleInputChange}
            placeholder="Kanal Adı"
          />
          <button onClick={handleAddOrUpdate}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Channel;
