import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userspending.css';
import { useNavigate } from 'react-router-dom';

const UserSpending = () => {
  const [spendings, setSpendings] = useState([]);
  const [spendingTypes, setSpendingTypes] = useState([]);
  const [ setDocuments] = useState([]);
  const navigate = useNavigate();
  const [newSpending, setNewSpending] = useState({
    operationid: null,
    spendingtypeid: null,
    spendingamount: '',
    spendingdate: '',
    operatorid: null,
  });
  const [newDocument, setNewDocument] = useState({
    spendingid: null,
    documentFile: null,
  });
  const [operations, setOperations] = useState([]);
  const [operators, setOperators] = useState([]);

  useEffect(() => {
    fetchSpendings();
    fetchSpendingTypes();
    fetchDocuments();
    fetchOperations();
    fetchOperators();
  }, []);

  const fetchOperations = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Operation');
      setOperations(response.data);
    } catch (error) {
      console.error('Operasyon verilerini alma hatası:', error);
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

  const fetchSpendingTypes = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/SpendingType');
      setSpendingTypes(response.data);
    } catch (error) {
      console.error('Harcama Türleri verilerini alma hatası:', error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapma işlemi sırasında bir hata oluştu:', error);
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

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Document');
      setDocuments(response.data);
    } catch (error) {
      console.error('Belge verilerini alma hatası:', error);
    }
  };

  const handleSpendingInputChange = (event) => {
    const { name, value } = event.target;
    setNewSpending({ ...newSpending, [name]: value });
  };

  const handleDocumentInputChange = (event) => {
    const { name, value } = event.target;
    setNewDocument({ ...newDocument, [name]: value });
  };

  const handleImageInputChange = (event) => {
    const file = event.target.files[0];
    setNewDocument({ ...newDocument, documentFile: file });
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

  const addDocument = async () => {
    try {
      const formData = new FormData();
      formData.append('spendingid', newDocument.spendingid);
      formData.append('documentFile', newDocument.documentFile);

      await axios.post('https://localhost:7282/api/Document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNewDocument({
        spendingid: null,
        documentFile: null,
      });

      fetchDocuments();
    } catch (error) {
      console.error('Belge ekleme hatası:', error);
    }
  };

  return (
    <div className="container">
      {/* ... (diğer içerik) */}
      
      <div className="spending-form">
        <h2>Yeni Harcama Ekle</h2>
        <div>
          <select
            name="operationid"
            value={newSpending.operationid || ''}
            onChange={handleSpendingInputChange}
          >
            <option value="">Operasyon Seç</option>
            {operations.map((operation) => (
              <option key={operation.operationid} value={operation.operationid}>
                {operation.operationid}
              </option>
            ))}
          </select>
          <select
            name="spendingtypeid"
            value={newSpending.spendingtypeid || ''}
            onChange={handleSpendingInputChange}
          >
            <option value="">Harcama Tipi Seç</option>
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
            onChange={handleSpendingInputChange}
            placeholder="Harcama Tutarı"
          />
          <input
            type="date"
            name="spendingdate"
            value={newSpending.spendingdate}
            onChange={handleSpendingInputChange}
          />
          <select
            name="operatorid"
            value={newSpending.operatorid || ''}
            onChange={handleSpendingInputChange}
          >
            <option value="">Operatör Seç</option>
            {operators.map((operator) => (
              <option key={operator.operatorid} value={operator.operatorid}>
                {operator.operatorname}
              </option>
            ))}
          </select>
          <button onClick={addSpending}>Ekle</button>
        </div>
      </div>
      
      <div className="document-form">
        <h2>Yeni Belge Ekle</h2>
        <div>
          <select
            name="spendingid"
            value={newDocument.spendingid || ''}
            onChange={handleDocumentInputChange}
          >
            <option value="">Harcama Seç</option>
            {spendings.map((spending) => (
              <option key={spending.spendingid} value={spending.spendingid}>
                {spending.spendingid}
              </option>
            ))}
          </select>
          <input
            type="file"
            name="documentFile"
            accept=".jpg, .jpeg, .png, .gif"
            onChange={handleImageInputChange}
          />
          <button onClick={addDocument}>Ekle</button>
        </div>
      </div>
      
     
      
      <span className="logout-button" onClick={handleLogout}>Çıkış Yap</span>
    </div>
  );
};

export default UserSpending;
