import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './operation.css';
import Sidebar from '../Sidebar/Sidebar';

const Operation = () => {
  
  const [operations, setOperations] = useState([]);
  const [newOperation, setNewOperation] = useState({
    date: '',
    startingtime: '',
    endingtime: '',
    branchid: null,
    cityid: null,
    customerid: null,
    channelid: null,
    directorid: null,
    graphicsetid: null,
    facilityid: null,
  });
  const handleShowValues = () => {
    console.log("Tarih:", newOperation.date);
    console.log("Başlangıç Saati:", newOperation.startingtime);
    console.log("Bitiş Saati:", newOperation.endingtime);
    console.log("Şehir ID:", newOperation.cityid);
    console.log("Şube ID:", newOperation.branchid);
    console.log("Müşteri ID:", newOperation.customerid);
    console.log("Kanal ID:", newOperation.channelid);
    console.log("Yönetici ID:", newOperation.directorid);
    console.log("Grafik Seti ID:", newOperation.graphicsetid);
    console.log("Tesis ID:", newOperation.facilityid);
  };
  const [isEditMode, setIsEditMode] = useState(false);

  const [branches, setBranches] = useState([]); 
  const [branchNames, setBranchNames] = useState({});

  const [cities, setCities] = useState([]); 
  const [cityNames, setCityNames] = useState({});

  const [customers, setCustomers] = useState([]); 
  const [customerNames, setCustomerNames] = useState({});

  const [channels, setChannels] = useState([]); 
  const [channelNames, setChannelNames] = useState({}); 

  const [directors, setDirectors] = useState([]); 
  const [directorNames, setDirectorNames] = useState({});

  const [graphicsets, setGraphicsets] = useState([]); 
  const [graphicsetNames, setGraphicsetNames] = useState({});
  
  const [facilities, setFacilities] = useState([]); 
  const [facilityNames, setFacilityNames] = useState({});    
  

  useEffect(() => {
    fetchOperations();
    fetchCities();
    fetchBranches();
    fetchCustomers();
    fetchChannels();
    fetchDirectors();
    fetchGraphicsets();
    fetchFacilities();
    
  }, []);

  const fetchOperations = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Operation');
      setOperations(response.data);
    } catch (error) {
      console.error('Operasyon verilerini alma hatası:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Branch');
      setBranches(response.data);
      const branchNamesMap = response.data.reduce((acc, Branch) => {
        acc[Branch.branchid] = Branch.branchname;
        return acc;
      }, {});
      setBranchNames(branchNamesMap);
    } catch (error) {
      console.error('Şube verilerini alma hatası:', error);
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

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Customer');
      setCustomers(response.data);
      const customerNamesMap = response.data.reduce((acc, customer) => {
        acc[customer.customerid] = customer.customername;
        return acc;
      }, {});
      setCustomerNames(customerNamesMap);
    } catch (error) {
      console.error('Müşteri verilerini alma hatası:', error);
    }
  };
  
  const fetchChannels = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Channel');
      setChannels(response.data);
      const channelNamesMap = response.data.reduce((acc, channel) => {
        acc[channel.channelid] = channel.channelname;
        return acc;
      }, {});
      setChannelNames(channelNamesMap);
    } catch (error) {
      console.error('Kanal verilerini alma hatası:', error);
    }
  };
  
  const fetchDirectors = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Director');
      setDirectors(response.data);
      const directorNamesMap = response.data.reduce((acc, director) => {
        acc[director.directorid] = director.directorname;
        return acc;
      }, {});
      setDirectorNames(directorNamesMap);
    } catch (error) {
      console.error('Yönetici verilerini alma hatası:', error);
    }
  };
  
  const fetchGraphicsets = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Graphicset');
      setGraphicsets(response.data);
      const graphicsetNamesMap = response.data.reduce((acc, graphicset) => {
        acc[graphicset.graphicsetid] = graphicset.graphicsetname;
        return acc;
      }, {});
      setGraphicsetNames(graphicsetNamesMap);
    } catch (error) {
      console.error('Grafik Seti verilerini alma hatası:', error);
      console.error('Hata Ayrıntıları:', error.response); // Burada hata ayrıntılarını yazdırın
    }
  };
  
  const fetchFacilities = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Facility');
      setFacilities(response.data);
      const facilityNamesMap = response.data.reduce((acc, facility) => {
        acc[facility.facilityid] = facility.facilityname;
        return acc;
      }, {});
      setFacilityNames(facilityNamesMap);
    } catch (error) {
      console.error('Tesis verilerini alma hatası:', error);
    }
  };

  const fetchFacilitiesByCity = async (cityid) => {
    try {
      const response = await axios.get(`https://localhost:7282/api/Facility/FilterByCity/${cityid}`);
      const facilitiesInCity = response.data;
  
      if (facilitiesInCity.length === 0) {
        // Eğer belirli bir şehirde hiç tesis yoksa, boş tesis listesi kullanılmalı.
        setFacilities([]);
      } else {
        setFacilities(facilitiesInCity);
        const facilityNamesMap = facilitiesInCity.reduce((acc, facility) => {
          acc[facility.facilityid] = facility.facilityname;
          return acc;
        }, {});
        setFacilityNames(facilityNamesMap);
      }
    } catch (error) {
      console.error('Tesis verilerini alma hatası:', error);
    }
  };
  const fetchGraphicsetsByBranch = async (branchId) => {
    try {
      const response = await axios.get(`https://localhost:7282/api/Graphicset/GraphicsetsByBranch/${branchId}`);
      const graphicsetsInBranch = response.data;

      if (graphicsetsInBranch.length === 0) {
        setGraphicsets([]);
      } else {
        setGraphicsets(graphicsetsInBranch);
      }
    } catch (error) {
      console.error('Grafik Seti verilerini alma hatası:', error);
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewOperation({ ...newOperation, [name]: value });
  
    if (name === 'cityid') {
      fetchFacilitiesByCity(value);
    }
  };
 
  
  // Şube seçimi yapıldığında çağrılacak fonksiyon
  const handleBranchSelect = (event) => {
    const selectedBranchId = event.target.value;
    setNewOperation({ ...newOperation, branchid: selectedBranchId }); // Operasyon nesnesine de atanıyor
    fetchGraphicsetsByBranch(selectedBranchId);
  };

  const addOperation = async () => {
    try {
      await axios.post('https://localhost:7282/api/Operation', newOperation);
      setNewOperation({
        date: '',
        startingtime: '',
        endingtime: '',
        branchid: null,
        cityid: null,
        customerid: null,
        channelid: null,
        directorid: null,
        graphicsetid: null,
        facilityid: null,
      });
      fetchOperations();
    } catch (error) {
      console.error('Operasyon ekleme hatası:', error);
    }
  };

  const deleteOperation = async (operationId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Operation/${operationId}`);
      fetchOperations();
    } catch (error) {
      console.error('Operasyon silme hatası:', error);
    }
  };

  const updateOperation = async (operationId, updatedOperation) => {
    try {
      await axios.put(`https://localhost:7282/api/Operation/${operationId}`, updatedOperation);
      setNewOperation({
        date: '',
        startingtime: '',
        endingtime: '',
        branchid: null,
        cityid: null,
        customerid: null,
        channelid: null,
        directorid: null,
        graphicsetid: null,
        facilityid: null,
      });
      setIsEditMode(false);
      fetchOperations();
    } catch (error) {
      console.error('Operasyon güncelleme hatası:', error);
    }
  };

  const handleUpdate = (operationId) => {
    const operationToUpdate = operations.find((operation) => operation.operationid === operationId);
    setNewOperation(operationToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateOperation(newOperation.operationid, newOperation);
    } else {
      addOperation();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="operation-list">
        <h2>Operasyonlar</h2>
        {operations.length === 0 ? (
          <p>Operasyonlar yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Operasyon ID</th>
                <th>Tarih</th>
                <th>Başlangıç Saati</th>
                <th>Bitiş Saati</th>
                <th>Şube ID</th>
                <th>Şehir ID</th>
                <th>Müşteri ID</th>
                <th>Kanal ID</th>
                <th>Yönetici ID</th>
                <th>Grafik Seti ID</th>
                <th>Tesis ID</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((operation) => (
                <tr key={operation.operationid}>
                  <td>{operation.operationid}</td>
                  <td>{operation.date}</td>
                  <td>{operation.startingtime}</td>
                  <td>{operation.endingtime}</td>
                  <td>{branchNames[operation.branchid]}</td>
                  <td>{cityNames[operation.cityid]}</td>
                  <td>{customerNames[operation.customerid]}</td>
                  <td>{channelNames[operation.channelid]}</td>
                  <td>{directorNames[operation.directorid]}</td>
                  <td>{graphicsetNames[operation.graphicsetid]}</td>
                  <td>{facilityNames[operation.facilityid]}</td>
                  <td>
                    <button onClick={() => deleteOperation(operation.operationid)}>Sil</button>
                    <button onClick={() => handleUpdate(operation.operationid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="operation-form">
        <h2>{isEditMode ? 'Operasyon Güncelle' : 'Yeni Operasyon Ekle'}</h2>
        <div>
          <input
            type="date"
            name="date"
            value={newOperation.date}
            onChange={handleInputChange}
          />
        <input
  type="time"
  name="startingtime"
  value={newOperation.startingtime}
  onChange={handleInputChange}
  step="1" // Saat-dakika-saniye formatını kullanmak için step değerini 1 olarak ayarlayın
/>
<input
  type="time"
  name="endingtime"
  value={newOperation.endingtime}
  onChange={handleInputChange}
  step="1" // Saat-dakika-saniye formatını kullanmak için step değerini 1 olarak ayarlayın
/>

          <select
            name="cityid"
            value={newOperation.cityid || ''}
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
          <select name="branchid" value={newOperation.branchid || ''} onChange={handleBranchSelect}>
    <option value="">Şube Seçin</option>
    {branches.map((branch) => (
      <option key={branch.branchid} value={branch.branchid}>
        {branch.branchname}
      </option>
    ))}
  </select>
          <select
            name="customerid"
            value={newOperation.customerid || ''}
            onChange={handleInputChange}
            placeholder="Müşteri ID"
          >
            <option value="">Müşteri Seçin</option>
            {customers.map((customer) => (
              <option key={customer.customerid} value={customer.customerid}>
                {customerNames[customer.customerid]}
              </option>
            ))}
          </select>
          <select
            name="channelid"
            value={newOperation.channelid || ''}
            onChange={handleInputChange}
            placeholder="Kanal ID"
          >
            <option value="">Kanal Seçin</option>
            {channels.map((channel) => (
              <option key={channel.channelid} value={channel.channelid}>
                {channelNames[channel.channelid]}
              </option>
            ))}
          </select>
          <select
            name="directorid"
            value={newOperation.directorid || ''}
            onChange={handleInputChange}
            placeholder="Yönetici ID"
          >
            <option value="">Yönetici Seçin</option>
            {directors.map((director) => (
              <option key={director.directorid} value={director.directorid}>
                {directorNames[director.directorid]}
              </option>
            ))}
          </select>
          <select name="graphicsetid" value={newOperation.graphicsetid || ''} onChange={handleInputChange}>
    <option value="">Grafik Seti Seçin</option>
    {graphicsets.map((graphicset) => (
      <option key={graphicset.graphicsetid} value={graphicset.graphicsetid}>
        {graphicset.graphicsetname}
      </option>
    ))}
  </select>
          <select
            name="facilityid"
            value={newOperation.facilityid || ''}
            onChange={handleInputChange}
            placeholder="Tesis ID"
          >
            <option value="">Tesis Seçin</option>
            {facilities.map((facility) => (
              <option key={facility.facilityid} value={facility.facilityid}>
                {facilityNames[facility.facilityid]}
              </option>
            ))}
          </select>
          <button onClick={handleShowValues}>Değerleri Göster</button>
          <button onClick={handleAddOrUpdate}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Operation;
