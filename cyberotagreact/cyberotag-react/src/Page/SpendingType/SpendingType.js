import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './spendingtype.css';
import Sidebar from '../Sidebar/Sidebar';

const Spendingtype = () => {
  const [spendingtypes, setSpendingtypes] = useState([]);
  const [newSpendingtype, setNewSpendingtype] = useState({
    spendingtypename: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchSpendingtypes();
  }, []);

  const fetchSpendingtypes = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Spendingtype');
      setSpendingtypes(response.data);
    } catch (error) {
      console.error('Harcama Türü verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSpendingtype({ ...newSpendingtype, [name]: value });
  };

  const addSpendingtype = async () => {
    try {
      await axios.post('https://localhost:7282/api/Spendingtype', newSpendingtype);
      setNewSpendingtype({ spendingtypename: '' });
      fetchSpendingtypes();
    } catch (error) {
      console.error('Harcama Türü ekleme hatası:', error);
    }
  };

  const deleteSpendingtype = async (spendingtypeId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Spendingtype/${spendingtypeId}`);
      fetchSpendingtypes();
    } catch (error) {
      console.error('Harcama Türü silme hatası:', error);
    }
  };

  const updateSpendingtype = async (spendingtypeId, updatedSpendingtype) => {
    try {
      await axios.put(`https://localhost:7282/api/Spendingtype/${spendingtypeId}`, updatedSpendingtype);
      setNewSpendingtype({ spendingtypename: '' });
      setIsEditMode(false);
      fetchSpendingtypes();
    } catch (error) {
      console.error('Harcama Türü güncelleme hatası:', error);
    }
  };

  const handleUpdate = (spendingtypeId) => {
    const spendingtypeToUpdate = spendingtypes.find((spendingtype) => spendingtype.spendingtypeid === spendingtypeId);
    setNewSpendingtype(spendingtypeToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateSpendingtype(newSpendingtype.spendingtypeid, newSpendingtype);
    } else {
      addSpendingtype();
    }
  };

  return ( 
    <div className="container">
      <Sidebar/>
      <div className="spendingtype-list">
        <h2>Harcama Türleri</h2>
        {spendingtypes.length === 0 ? (
          <p>Harcama Türleri yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Harcama Türü ID</th>
                <th>Harcama Türü Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {spendingtypes.map((spendingtype) => (
                <tr key={spendingtype.spendingtypeid}>
                  <td>{spendingtype.spendingtypeid}</td>
                  <td>{spendingtype.spendingtypename}</td>
                  <td>
                    <button onClick={() => deleteSpendingtype(spendingtype.spendingtypeid)}>Sil</button>
                    <button onClick={() => handleUpdate(spendingtype.spendingtypeid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="spendingtype-form">
        <h2>{isEditMode ? 'Harcama Türü Güncelle' : 'Yeni Harcama Türü Ekle'}</h2>
        <div>
          <input
            type="text"
            name="spendingtypename"
            value={newSpendingtype.spendingtypename}
            onChange={handleInputChange}
            placeholder="Harcama Türü Adı"
          />
          <button onClick={handleAddOrUpdate}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Spendingtype;
