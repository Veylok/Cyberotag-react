import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './document.css';
import Sidebar from '../Sidebar/Sidebar';

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [spendingOptions, setSpendingOptions] = useState([]);
  const [newDocument, setNewDocument] = useState({
    spendingid: null,
    documentFile: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchDocuments();
    fetchSpendingOptions();
  }, []);

  const fetchSpendingOptions = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/spending'); // Change this URL as needed
      setSpendingOptions(response.data);
    } catch (error) {
      console.error('Harcama seçeneklerini alma hatası:', error);
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

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setNewDocument({ ...newDocument, [name]: name === 'documentFile' ? files[0] : value });
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

  const deleteDocument = async (documentId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Document/${documentId}`);
      fetchDocuments();
    } catch (error) {
      console.error('Belge silme hatası:', error);
    }
  };

  const handleUpdate = (documentId) => {
    const documentToUpdate = documents.find((document) => document.documentid === documentId);
    setNewDocument({
      ...documentToUpdate,
      documentFile: null,
    });
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateDocument(newDocument.documentid, newDocument);
    } else {
      addDocument();
    }
  };

  const updateDocument = async (documentId, updatedDocument) => {
    try {
      const formData = new FormData();
      formData.append('spendingid', updatedDocument.spendingid);
      
      // Eğer yeni bir belge resmi yüklendi ise, formData'e ekle
      if (updatedDocument.documentFile) {
        formData.append('documentFile', updatedDocument.documentFile);
      }
  
      await axios.put(`https://localhost:7282/api/Document/${documentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setNewDocument({
        spendingid: null,
        documentFile: null,
      });
  
      setIsEditMode(false);
      fetchDocuments();
    } catch (error) {
      console.error('Belge güncelleme hatası:', error);
    }
  };
  

  return (
    <div className="container">
      <Sidebar/>
      <div className="document-list">
        <h2>Belgeler</h2>
        {documents.length === 0 ? (
          <p>Belgeler yükleniyor...</p>
        ) : (
          <ul className="document-ul">
            {documents.map((document) => (
              <li key={document.documentid} className="document-li">
                <p>Belge ID: {document.documentid}</p>
                <p>Harcama ID: {document.spendingid}</p>
                {document.documentimg && (
                  <img src={`data:image/jpeg;base64,${document.documentimg}`} alt={`Belge ${document.documentid}`} className="document-image" />
                )}
                <div className="button-group">
                  <button onClick={() => deleteDocument(document.documentid)} className="delete-button">Sil</button>
                  <button onClick={() => handleUpdate(document.documentid)} className="update-button">Güncelle</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="document-form">
        <h2>{isEditMode ? 'Belge Güncelle' : 'Yeni Belge Ekle'}</h2>
        <div>
          <label>Harcama ID:</label>
          <select
            name="spendingid"
            value={newDocument.spendingid || ''}
            onChange={handleInputChange}
            placeholder="Harcanan ID"
            className="input-field"
          >
            <option value="" disabled>
              Harcama ID Seçin
            </option>
            {spendingOptions.map((option) => (
              <option key={option.spendingid} value={option.spendingid}>
                {option.spendingid}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Belge:</label>
          <input type="file" name="documentFile" onChange={handleInputChange} className="input-field" />
        </div>
        <button onClick={handleAddOrUpdate} className="add-button">
          {isEditMode ? 'Güncelle' : 'Ekle'}
        </button>
      </div>
    </div>
  );
};

export default Document;
