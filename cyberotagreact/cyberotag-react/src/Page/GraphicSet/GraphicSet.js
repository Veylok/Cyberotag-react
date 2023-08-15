import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './graphicset.css';
import Sidebar from '../Sidebar/Sidebar';

const Graphicset = () => {
  const [graphicsets, setGraphicsets] = useState([]);
  const [newGraphicset, setNewGraphicset] = useState({
    graphicsetname: '',
    branchid: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchNames, setBranchNames] = useState({});

  useEffect(() => {
    fetchGraphicsets();
    fetchBranches();
  }, []);

  const fetchGraphicsets = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Graphicset/GraphicsetsWithBranchNames');
      setGraphicsets(response.data);

      const branchNamesMap = response.data.reduce((acc, graphicset) => {
        acc[graphicset.branchid] = graphicset.branch.branchname; // Burada grafik setine bağlı şubenin adını aldık
        return acc;
      }, {});
      setBranchNames(branchNamesMap);
    } catch (error) {
      console.error('Grafik Seti verilerini alma hatası:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Branch'); // Varsayılan olarak /api/Branch endpoint'i kullanılıyor, gerekirse uygun endpoint ile değiştirin
      setBranches(response.data);
    } catch (error) {
      console.error('Şube verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewGraphicset({ ...newGraphicset, [name]: value });
  };

  const addGraphicset = async () => {
    try {
      await axios.post('https://localhost:7282/api/Graphicset', newGraphicset);
      setNewGraphicset({
        graphicsetname: '',
        branchid: null,
      });
      fetchGraphicsets();
    } catch (error) {
      console.error('Grafik Seti ekleme hatası:', error);
    }
  };

  const deleteGraphicset = async (graphicsetId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Graphicset/${graphicsetId}`);
      fetchGraphicsets();
    } catch (error) {
      console.error('Grafik Seti silme hatası:', error);
    }
  };

  const updateGraphicset = async (graphicsetId, updatedGraphicset) => {
    try {
      await axios.put(`https://localhost:7282/api/Graphicset/${graphicsetId}`, updatedGraphicset);
      setNewGraphicset({
        graphicsetname: '',
        branchid: null,
      });
      setIsEditMode(false);
      fetchGraphicsets();
    } catch (error) {
      console.error('Grafik Seti güncelleme hatası:', error);
    }
  };

  const handleUpdate = (graphicsetId) => {
    const graphicsetToUpdate = graphicsets.find((graphicset) => graphicset.graphicsetid === graphicsetId);
    setNewGraphicset(graphicsetToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateGraphicset(newGraphicset.graphicsetid, newGraphicset);
    } else {
      addGraphicset();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="graphicset-list">
        <h2>Grafik Setleri</h2>
        {graphicsets.length === 0 ? (
          <p>Grafik Setleri yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Grafik Seti ID</th>
                <th>Grafik Seti Adı</th>
                
                <th>Şube Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {graphicsets.map((graphicset) => (
                <tr key={graphicset.graphicsetid}>
                  <td>{graphicset.graphicsetid}</td>
                  <td>{graphicset.graphicsetname}</td>
                
                  <td>{branchNames[graphicset.branchid]}</td> {/* Şube adını burada yazdırıyoruz */}
                  <td>
                    <button onClick={() => deleteGraphicset(graphicset.graphicsetid)}>Sil</button>
                    <button onClick={() => handleUpdate(graphicset.graphicsetid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="graphicset-form">
        <h2>{isEditMode ? 'Grafik Seti Güncelle' : 'Yeni Grafik Seti Ekle'}</h2>
        <div>
          <input
            type="text"
            name="graphicsetname"
            value={newGraphicset.graphicsetname}
            onChange={handleInputChange}
            placeholder="Grafik Seti Adı"
          />
          <select
            name="branchid"
            value={newGraphicset.branchid || ''}
            onChange={handleInputChange}
            placeholder="Şube ID"
          >
            <option value="">Şube Seçin</option>
            {branches.map((branch) => (
              <option key={branch.branchid} value={branch.branchid}>
                {branch.branchname}
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

export default Graphicset;
