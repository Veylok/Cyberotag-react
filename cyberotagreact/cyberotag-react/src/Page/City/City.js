import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './city.css';
import Sidebar from '../Sidebar/Sidebar';

const City = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState({
    cityname: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/City');
      setCities(response.data);
    } catch (error) {
      console.error('Şehir verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCity({ ...newCity, [name]: value });
  };

  const addCity = async () => {
    try {
      await axios.post('https://localhost:7282/api/City', newCity);
      setNewCity({
        cityname: '',
      });
      fetchCities();
    } catch (error) {
      console.error('Şehir ekleme hatası:', error);
    }
  };

  const deleteCity = async (cityId) => {
    try {
      await axios.delete(`https://localhost:7282/api/City/${cityId}`);
      fetchCities();
    } catch (error) {
      console.error('Şehir silme hatası:', error);
    }
  };

  const updateCity = async (cityId, updatedCity) => {
    try {
      await axios.put(`https://localhost:7282/api/City/${cityId}`, updatedCity);
      setNewCity({
        cityname: '',
      });
      setIsEditMode(false);
      fetchCities();
    } catch (error) {
      console.error('Şehir güncelleme hatası:', error);
    }
  };

  const handleUpdate = (cityId) => {
    const cityToUpdate = cities.find((city) => city.cityid === cityId);
    setNewCity(cityToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateCity(newCity.cityid, newCity);
    } else {
      addCity();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="city-list">
        <h2>Şehirler</h2>
        {cities.length === 0 ? (
          <p>Şehirler yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Şehir Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.cityid}>
                  <td>{city.cityname}</td>
                  <td>
                    <button onClick={() => deleteCity(city.cityid)}>Sil</button>
                    <button onClick={() => handleUpdate(city.cityid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="city-form">
        <h2>{isEditMode ? 'Şehir Güncelle' : 'Yeni Şehir Ekle'}</h2>
        <div>
          <input
            type="text"
            name="cityname"
            value={newCity.cityname}
            onChange={handleInputChange}
            placeholder="Şehir Adı"
          />
          <button onClick={handleAddOrUpdate}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default City;
