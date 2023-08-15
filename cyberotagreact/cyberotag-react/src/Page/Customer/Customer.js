import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './customer.css';
import Sidebar from '../Sidebar/Sidebar';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    customername: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Customer');
      setCustomers(response.data);
    } catch (error) {
      console.error('Müşteri verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const addCustomer = async () => {
    try {
      await axios.post('https://localhost:7282/api/Customer', newCustomer);
      setNewCustomer({
        customername: '',
      });
      fetchCustomers();
    } catch (error) {
      console.error('Müşteri ekleme hatası:', error);
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Customer/${customerId}`);
      fetchCustomers();
    } catch (error) {
      console.error('Müşteri silme hatası:', error);
    }
  };

  const updateCustomer = async (customerId, updatedCustomer) => {
    try {
      await axios.put(`https://localhost:7282/api/Customer/${customerId}`, updatedCustomer);
      setNewCustomer({
        customername: '',
      });
      setIsEditMode(false);
      fetchCustomers();
    } catch (error) {
      console.error('Müşteri güncelleme hatası:', error);
    }
  };

  const handleUpdate = (customerId) => {
    const customerToUpdate = customers.find((customer) => customer.customerid === customerId);
    setNewCustomer(customerToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateCustomer(newCustomer.customerid, newCustomer);
    } else {
      addCustomer();
    }
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="customer-list">
        <h2>Müşteriler</h2>
        {customers.length === 0 ? (
          <p>Müşteriler yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Müşteri Adı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerid}>
                  <td>{customer.customername}</td>
                  <td>
                    <button onClick={() => deleteCustomer(customer.customerid)}>Sil</button>
                    <button onClick={() => handleUpdate(customer.customerid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="customer-form">
        <h2>{isEditMode ? 'Müşteri Güncelle' : 'Yeni Müşteri Ekle'}</h2>
        <div>
          <input
            type="text"
            name="customername"
            value={newCustomer.customername}
            onChange={handleInputChange}
            placeholder="Müşteri Adı"
          />
          <button onClick={handleAddOrUpdate}>
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customer;
