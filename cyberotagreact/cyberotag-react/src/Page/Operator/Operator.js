import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './operator.css'; 
import Sidebar from '../Sidebar/Sidebar';

const Operator = () => {
  const [operators, setOperators] = useState([]);
  const [newOperator, setNewOperator] = useState({
    operatorname: '',
    operatorsurname: '',
    operatorphonenumber: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Operator');
      setOperators(response.data);
    } catch (error) {
      console.error('Operatörleri alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewOperator({ ...newOperator, [name]: value });
  };

  const addOperator = async () => {
    try {
      await axios.post('https://localhost:7282/api/Operator', newOperator);
      setNewOperator({
        operatorname: '',
        operatorsurname: '',
        operatorphonenumber: '',
      });
      fetchOperators();
    } catch (error) {
      console.error('Operatör ekleme hatası:', error);
    }
  };

  const deleteOperator = async (operatorId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Operator/${operatorId}`);
      fetchOperators();
    } catch (error) {
      console.error('Operatör silme hatası:', error);
    }
  };

  const updateOperator = async (operatorId, updatedOperator) => {
    try {
      await axios.put(`https://localhost:7282/api/Operator/${operatorId}`, updatedOperator);
      setNewOperator({
        operatorname: '',
        operatorsurname: '',
        operatorphonenumber: '',
      });
      setIsEditMode(false);
      fetchOperators();
    } catch (error) {
      console.error('Operatör güncelleme hatası:', error);
    }
  };

  const handleUpdate = (operatorId) => {
    const operatorToUpdate = operators.find((operator) => operator.operatorid === operatorId);
    setNewOperator(operatorToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateOperator(newOperator.operatorid, newOperator);
    } else {
      addOperator();
    }
  };

  return (
    <div className="container">
      <div className="operator-list">
      <Sidebar/>
        <h2>Operatörler</h2>
        {operators.length === 0 ? (
          <p>Kullanıcılar yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Soyad</th>
                <th>Telefon Numarası</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((operator) => (
                <tr key={operator.operatorid}>
                  <td>{operator.operatorname}</td>
                  <td>{operator.operatorsurname}</td>
                  <td>{operator.operatorphonenumber}</td>
                  <td>
                    <button onClick={() => deleteOperator(operator.operatorid)}>Sil</button>
                    <button onClick={() => handleUpdate(operator.operatorid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="operator-form">
        <h2>{isEditMode ? 'Operatörü Güncelle' : 'Yeni Operatör Ekle'}</h2>
        <div>
          <input
            type="text"
            name="operatorname"
            value={newOperator.operatorname}
            onChange={handleInputChange}
            placeholder="Ad"
          />
          <input
            type="text"
            name="operatorsurname"
            value={newOperator.operatorsurname}
            onChange={handleInputChange}
            placeholder="Soyad"
          />
          <input
            type="text"
            name="operatorphonenumber"
            value={newOperator.operatorphonenumber}
            onChange={handleInputChange}
            placeholder="Telefon Numarası"
          />
          <button onClick={handleAddOrUpdate}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Operator;
