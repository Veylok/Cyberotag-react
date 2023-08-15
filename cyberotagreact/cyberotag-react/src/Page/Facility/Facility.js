import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './facility.css';
import Sidebar from '../Sidebar/Sidebar';

const Facility = () => {
  const [facilities, setFacilities] = useState([]);
  const [newFacility, setNewFacility] = useState({
    facilityname: '',
    cityid: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [cities, setCities] = useState([]); 
  const [cityNames, setCityNames] = useState({}); 
  

  useEffect(() => {
    fetchFacilities();
    fetchCities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Facility/ShowFacilitiesWithCityNames');
      setFacilities(response.data);
    } catch (error) {
      console.error('Tesis verilerini alma hatası:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/City');
      setCities(response.data);
      const cityNamesMap = response.data.reduce((acc, city) => {
        acc[city.cityid] = city.cityname;
        return acc;
      }, {});
      setCityNames(cityNamesMap);
    } catch (error) {
      console.error('Şehir verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewFacility({ ...newFacility, [name]: value });
  };

  const addFacility = async () => {
    try {
      await axios.post('https://localhost:7282/api/Facility', newFacility);
      setNewFacility({
        facilityname: '',
        cityid: null,
      });
      fetchFacilities();
    } catch (error) {
      console.error('Tesis ekleme hatası:', error);
    }
  };

  const deleteFacility = async (facilityId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Facility/${facilityId}`);
      fetchFacilities();
    } catch (error) {
      console.error('Tesis silme hatası:', error);
    }
  };

  const updateFacility = async (facilityId, updatedFacility) => {
    try {
      await axios.put(`https://localhost:7282/api/Facility/${facilityId}`, updatedFacility);
      setNewFacility({
        facilityname: '',
        cityid: null,
      });
      setIsEditMode(false);
      fetchFacilities();
    } catch (error) {
      console.error('Tesis güncelleme hatası:', error);
    }
  };

  const handleUpdate = (facilityId) => {
    const facilityToUpdate = facilities.find((facility) => facility.facilityid === facilityId);
    setNewFacility(facilityToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateFacility(newFacility.facilityid, newFacility);
    } else {
      addFacility();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="facility-list">
        <h2>Tesisler</h2>
        {facilities.length === 0 ? (
          <p>Tesisler yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tesis ID</th>
                <th>Tesis Adı</th>
                <th>Şehir Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr key={facility.facilityid}>
                  <td>{facility.facilityid}</td>
                  <td>{facility.facilityname}</td>
                  <td>{cityNames[facility.cityid]}</td>
                  <td>
                    <button onClick={() => deleteFacility(facility.facilityid)}>Sil</button>
                    <button onClick={() => handleUpdate(facility.facilityid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="facility-form">
        <h2>{isEditMode ? 'Tesis Güncelle' : 'Yeni Tesis Ekle'}</h2>
        <div>
          <input
            type="text"
            name="facilityname"
            value={newFacility.facilityname}
            onChange={handleInputChange}
            placeholder="Tesis Adı"
          />
          <select
            name="cityid"
            value={newFacility.cityid || ''}
            onChange={handleInputChange}
            placeholder="Şehir ID"
          >
            <option value="">Şehir Seçin</option>
            {cities.map((city) => (
              <option key={city.cityid} value={city.cityid}>
                {city.cityname}
              </option>
            ))}
          </select>
          <button onClick={handleAddOrUpdate}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Facility;
