import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './assignment.css'; // CSS dosyanızın adını buraya göre güncelleyin
import Sidebar from '../Sidebar/Sidebar';

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [operations, setOperations] = useState([]);
  const [operators, setOperators] = useState([]);

  const [newAssignment, setNewAssignment] = useState({
    
    operationid: null,
    operatorid: null
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchAssignments();
    fetchOperations();
    fetchOperators();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Assignment');
      setAssignments(response.data);
    } catch (error) {
      console.error('Assignment verilerini alma hatası:', error);
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

  const fetchOperators = async () => {
    try {
      const response = await axios.get('https://localhost:7282/api/Operator');
      setOperators(response.data);
    } catch (error) {
      console.error('Operatör verilerini alma hatası:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const addAssignment = async () => {
    try {
      await axios.post('https://localhost:7282/api/Assignment', newAssignment);
      setNewAssignment({
        
        operationid: null,
        operatorid: null
      });
      fetchAssignments();
    } catch (error) {
      console.error('Assignment ekleme hatası:', error);
    }
  };

  const deleteAssignment = async (assignmentId) => {
    try {
      await axios.delete(`https://localhost:7282/api/Assignment/${assignmentId}`);
      fetchAssignments();
    } catch (error) {
      console.error('Assignment silme hatası:', error);
    }
  };

  const updateAssignment = async (assignmentId, updatedAssignment) => {
    try {
      await axios.put(`https://localhost:7282/api/Assignment/${assignmentId}`, updatedAssignment);
      setNewAssignment({
        
        operationid: null,
        operatorid: null
      });
      setIsEditMode(false);
      fetchAssignments();
    } catch (error) {
      console.error('Assignment güncelleme hatası:', error);
    }
  };

  const handleUpdate = (assignmentId) => {
    const assignmentToUpdate = assignments.find((assignment) => assignment.assignmentid === assignmentId);
    setNewAssignment(assignmentToUpdate);
    setIsEditMode(true);
  };

  const handleAddOrUpdate = () => {
    if (isEditMode) {
      updateAssignment(newAssignment.assignmentid, newAssignment);
    } else {
      addAssignment();
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="assignment-list">
        <h2>Assignments</h2>
        {assignments.length === 0 ? (
          <p>Assignments yükleniyor...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Assignment ID</th>
                <th>Operation ID</th>
                <th>Operator ID</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
            {assignments.map((assignment) => (
  <tr key={assignment.assignmentid}>
    <td>{assignment.assignmentid}</td>
    <td>{assignment.operationid}</td>
    <td>{operators.find(op => op.operatorid === assignment.operatorid)?.operatorname}</td> {/* Operatör adını göster */}
    <td>
      <button onClick={() => deleteAssignment(assignment.assignmentid)}>Sil</button>
      <button onClick={() => handleUpdate(assignment.assignmentid)}>Güncelle</button>
    </td>
  </tr>
))}

            </tbody>
          </table>
        )}
      </div>

      <div className="assignment-form">
        <h2>{isEditMode ? 'Assignment Güncelle' : 'Yeni Assignment Ekle'}</h2>
        <div>
          <select
            name="operationid"
            value={newAssignment.operationid}
            onChange={handleInputChange}
          >
            <option value="">Operasyon Seç</option>
            {operations.map((operation) => (
              <option key={operation.operationid} value={operation.operationid}>
                {operation.operationid}
              </option>
            ))}
          </select>

          <select
  name="operatorid"
  value={newAssignment.operatorid}
  onChange={handleInputChange}
>
  <option value="">Operatör Seç</option>
  {operators.map((operator) => (
    <option key={operator.operatorid} value={operator.operatorid}>
      {operator.operatorname} {/* Operatörün adını göster */}
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

export default Assignment;
