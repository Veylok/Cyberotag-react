import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './branch.css';
import Sidebar from '../Sidebar/Sidebar';

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({
    branchname: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Branch');
      setBranches(response.data);
    } catch (error) {
      console.error('Şube verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBranch({ ...newBranch, [name]: value });
  };

  const addBranch = async () => {
    try {
      await axios.post('https://localhost:7282/api/Branch', newBranch);
      setNewBranch({
        branchname: '',
      });
      fetchBranches();
    } catch (error) {
      console.error('Şube ekleme hatası:', error);
    }
  };

  const deleteBranch = async (branchId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Branch/${branchId}`);
      fetchBranches();
    } catch (error) {
      console.error('Şube silme hatası:', error);
    }
  };

  const updateBranch = async (branchId, updatedBranch) => {
    try {
      await axios.put(`https://localhost:7282/api/Branch/${branchId}`, updatedBranch);
      setNewBranch({
        branchname: '',
      });
      setIsEditMode(false);
      fetchBranches();
    } catch (error) {
      console.error('Şube güncelleme hatası:', error);
    }
  };

  const handleUpdate = (branchId) => {
    const branchToUpdate = branches.find((branch) => branch.branchid === branchId);
    setNewBranch(branchToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateBranch(newBranch.branchid, newBranch);
    } else {
      addBranch();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="branch-list">
        <h2>Şubeler</h2>
        {branches.length === 0 ? (
          <p>Şubeler yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Şube Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.branchid}>
                  <td>{branch.branchname}</td>
                  <td>
                    <button onClick={() => deleteBranch(branch.branchid)}>Sil</button>
                    <button onClick={() => handleUpdate(branch.branchid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="branch-form">
        <h2>{isEditMode ? 'Şube Güncelle' : 'Yeni Şube Ekle'}</h2>
        <div>
          <input
            type="text"
            name="branchname"
            value={newBranch.branchname}
            onChange={handleInputChange}
            placeholder="Şube Adı"
          />
          <button onClick={handleAddOrUpdate}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Branch;
