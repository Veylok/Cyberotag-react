import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './director.css';
import Sidebar from '../Sidebar/Sidebar';

const Director = () => {
  const [directors, setDirectors] = useState([]);
  const [newDirector, setNewDirector] = useState({
    directorname: '',
    directorsurname: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Director');
      setDirectors(response.data);
    } catch (error) {
      console.error('Yönetmen verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDirector({ ...newDirector, [name]: value });
  };

  const addDirector = async () => {
    try {
      await axios.post('https://localhost:7282/api/Director', newDirector);
      setNewDirector({
        directorname: '',
        directorsurname: '',
      });
      fetchDirectors();
    } catch (error) {
      console.error('Yönetmen ekleme hatası:', error);
    }
  };

  const deleteDirector = async (directorId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Director/${directorId}`);
      fetchDirectors();
    } catch (error) {
      console.error('Yönetmen silme hatası:', error);
    }
  };

  const updateDirector = async (directorId, updatedDirector) => {
    try {
      await axios.put(`https://localhost:7282/api/Director/${directorId}`, updatedDirector);
      setNewDirector({
        directorname: '',
        directorsurname: '',
      });
      setIsEditMode(false);
      fetchDirectors();
    } catch (error) {
      console.error('Yönetmen güncelleme hatası:', error);
    }
  };

  const handleUpdate = (directorId) => {
    const directorToUpdate = directors.find((director) => director.directorid === directorId);
    setNewDirector(directorToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateDirector(newDirector.directorid, newDirector);
    } else {
      addDirector();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="director-list">
        <h2>Yönetmenler</h2>
        {directors.length === 0 ? (
          <p>Yönetmenler yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Yönetmen Adı</th>
                <th>Yönetmen Soyadı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {directors.map((director) => (
                <tr key={director.directorid}>
                  <td>{director.directorname}</td>
                  <td>{director.directorsurname}</td>
                  <td>
                    <button onClick={() => deleteDirector(director.directorid)}>Sil</button>
                    <button onClick={() => handleUpdate(director.directorid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="director-form">
        <h2>{isEditMode ? 'Yönetmen Güncelle' : 'Yeni Yönetmen Ekle'}</h2>
        <div>
          <input
            type="text"
            name="directorname"
            value={newDirector.directorname}
            onChange={handleInputChange}
            placeholder="Yönetmen Adı"
          />
          <input
            type="text"
            name="directorsurname"
            value={newDirector.directorsurname}
            onChange={handleInputChange}
            placeholder="Yönetmen Soyadı"
          />
          <button onClick={handleAddOrUpdate}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Director;
