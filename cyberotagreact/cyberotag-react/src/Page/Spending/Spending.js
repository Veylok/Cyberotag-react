import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './spending.css';
import Sidebar from '../Sidebar/Sidebar';

const Spending = () => {
  const [spendings, setSpendings] = useState([]);
  const [spendingTypes, setSpendingTypes] = useState([]);
  const [operators, setOperators] = useState([]);
  const [operations, setOperations] = useState([]);
  const [newSpending, setNewSpending] = useState({
    operationid: null,
    spendingtypeid: null,
    spendingamount: '',
    spendingdate: '',
    operatorid: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchSpendings();
    fetchSpendingTypes();
    fetchOperators();
    fetchOperations();
  }, []);

  const fetchSpendingTypes = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/SpendingType');
      setSpendingTypes(response.data);
    } catch (error) {
      console.error('Harcama Türleri verilerini alma hatası:', error);
    }
  };

  const fetchSpendings = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Spending');
      setSpendings(response.data);
    } catch (error) {
      console.error('Harcama verilerini alma hatası:', error);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Operator');
      setOperators(response.data);
    } catch (error) {
      console.error('Operatör verilerini alma hatası:', error);
    }
  };

  const fetchOperations = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Operation');
      setOperations(response.data);
    } catch (error) {
      console.error('Operasyon verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSpending({ ...newSpending, [name]: value });
  };

  const addSpending = async () => {
    try {
      await axios.post('https://localhost:7282/api/Spending', newSpending);
      setNewSpending({
        operationid: null,
        spendingtypeid: null,
        spendingamount: '',
        spendingdate: '',
        operatorid: null,
      });
      fetchSpendings();
    } catch (error) {
      console.error('Harcama ekleme hatası:', error);
    }
  };

  const deleteSpending = async (spendingId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Spending/${spendingId}`);
      fetchSpendings();
    } catch (error) {
      console.error('Harcama silme hatası:', error);
    }
  };

  const updateSpending = async (spendingId, updatedSpending) => {
    try {
      await axios.put(`https://localhost:7282/api/Spending/${spendingId}`, updatedSpending);
      setNewSpending({
        operationid: null,
        spendingtypeid: null,
        spendingamount: '',
        spendingdate: '',
        operatorid: null,
      });
      setIsEditMode(false);
      fetchSpendings();
    } catch (error) {
      console.error('Harcama güncelleme hatası:', error);
    }
  };

  const handleUpdate = (spendingId) => {
    const spendingToUpdate = spendings.find((spending) => spending.spendingid === spendingId);
    setNewSpending(spendingToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateSpending(newSpending.spendingid, newSpending);
    } else {
      addSpending();
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="spending-list">
        <h2>Harcamalar</h2>
        {spendings.length === 0 ? (
          <p>Harcamalar yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Harcama ID</th>
                <th>Operasyon ID</th>
                <th>Harcama Türü ID</th>
                <th>Harcama Tutarı</th>
                <th>Harcama Tarihi</th>
                <th>Operatör ID</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {spendings.map((spending) => (
                <tr key={spending.spendingid}>
                  <td>{spending.spendingid}</td>
                  <td>{spending.operationid}</td>
                  <td>
                  {spendingTypes.find((spendingType)=> spendingType.spendingtypeid === spending.spendingtypeid)?.spendingtypename || '-'}
                  </td>
              <td>{spending.spendingamount}</td>
                  <td>{spending.spendingdate}</td>
                  <td>
        
        {operators.find((operator) => operator.operatorid === spending.operatorid)?.operatorname || '-'}
      </td>
                  <td>
                    <button onClick={() => deleteSpending(spending.spendingid)}>Sil</button>
                    <button onClick={() => handleUpdate(spending.spendingid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="spending-form">
        <h2>{isEditMode ? 'Harcama Güncelle' : 'Yeni Harcama Ekle'}</h2>
        <div>
          <select
            name="operationid"
            value={newSpending.operationid || ''}
            onChange={handleInputChange}
          >
            <option value="">Operasyon Seçin</option>
            {operations.map((operation) => (
              <option key={operation.operationid} value={operation.operationid}>
                {operation.operationid}
              </option>
            ))}
          </select>
          <select
            name="spendingtypeid"
            value={newSpending.spendingtypeid || ''}
            onChange={handleInputChange}
          >
            <option value="">Harcama Türü Seçin</option>
            {spendingTypes.map((type) => (
              <option key={type.spendingtypeid} value={type.spendingtypeid}>
                {type.spendingtypename}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="spendingamount"
            value={newSpending.spendingamount}
            onChange={handleInputChange}
            placeholder="Harcama Tutarı"
          />
          <input
            type="date"
            name="spendingdate"
            value={newSpending.spendingdate}
            onChange={handleInputChange}
          />
          <select
            name="operatorid"
            value={newSpending.operatorid || ''}
            onChange={handleInputChange}
          >
            <option value="">Operatör Seçin</option>
            {operators.map((operator) => (
              <option key={operator.operatorid} value={operator.operatorid}>
                {operator.operatorname}
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

export default Spending;
