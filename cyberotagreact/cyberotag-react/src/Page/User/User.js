import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';

const User = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [newUser, setNewUser] = useState({
    
    username: '',
    password: '',
    roleid: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Role'); // Rol endpointi
      setRoles(response.data);
    } catch (error) {
      console.error('Rol verilerini alma hatası:', error);
    }
  };

  
const fetchUsers = async () => {
  try {
    const response = await axios.get('https://localhost:7282/api/User');
    setUsers(response.data);
  } catch (error) {
    console.error('Kullanıcı verilerini alma hatası:', error);
  }
};
  
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const addUser = async () => {
    try {
      await axios.post('https://localhost:7282/api/User', newUser);
      setNewUser({
        
        username: '',
        password: '',
        roleid: null,
      });
      fetchUsers();
    } catch (error) {
      console.error('Kullanıcı ekleme hatası:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://localhost:7282/api/User/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Kullanıcı silme hatası:', error);
    }
  };

  const updateUser = async (userId, updatedUser) => {
    try {
      await axios.put(`https://localhost:7282/api/User/${userId}`, updatedUser);
      setNewUser({
        
        username: '',
        password: '',
        roleid: null,
      });
      setIsEditMode(false);
      fetchUsers();
    } catch (error) {
      console.error('Kullanıcı güncelleme hatası:', error);
    }
  };

  const handleUpdate = (userId) => {
    const userToUpdate = users.find((user) => user.userid === userId);
    setNewUser(userToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateUser(newUser.userid, newUser);
    } else {
      addUser();
    }
  };
  const getRoleNameById = (roleId) => {
    const role = roles.find((role) => role.roleid === roleId);
    return role ? role.rolename : '';
  };

  return (
    <div className="container">
      <Sidebar/>
      <div className="user-list">
        <h2>Kullanıcılar</h2>
        {users.length === 0 ? (
          <p>Kullanıcılar yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Kullanıcı ID</th>
                <th>Kullanıcı Adı</th>
                <th>Şifre</th>
                <th>Rol</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userid}>
                  <td>{user.userid}</td>
                  <td>{user.username}</td>
                  <td>{user.password}</td>
                  <td>{getRoleNameById(user.roleid)}</td>
                  <td>
                    <button onClick={() => deleteUser(user.userid)}>Sil</button>
                    <button onClick={() => handleUpdate(user.userid)}>Güncelle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="user-form">
        <h2>{isEditMode ? 'Kullanıcı Güncelle' : 'Yeni Kullanıcı Ekle'}</h2>
        <div>
          
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            placeholder="Kullanıcı Adı"
          />
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Şifre"
          />
          <select
            name="roleid"
            value={newUser.roleid || ''}
            onChange={handleInputChange}
          >
            <option value="">Rol Seçin</option>
            {roles.map((role) => (
              <option key={role.roleid} value={role.roleid}>
                {role.rolename}
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

export default User;
