import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', roll_no: '', phone_number: '' });
  const [error, setError] = useState('');

  const API_URL = (typeof window !== 'undefined' && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
    ? "http://127.0.0.1:8000/api/students"
    : "/api/students";

  // 1. Fetch Students from Backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Add New Student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(API_URL, formData);
      setFormData({ name: '', roll_no: '', phone_number: '' }); // Clear Form
      fetchStudents(); // Refresh List
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!");
    }
  };

  // 4. Delete Student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStudents(); // Refresh List
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>School Management Mini System</h2>
      
      {/* Student Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', background: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
        <h3>Add New Student</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '10px' }}>
          <input type="text" name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
          <input type="text" name="roll_no" placeholder="Roll Number" value={formData.roll_no} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
          <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required style={{ padding: '5px' }} />
        </div>
        <button type="submit" style={{ padding: '5px 15px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>Add Student</button>
      </form>

      {/* Student List Table */}
      <h3>Student List</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>ID</th>
            <th>Name</th>
            <th>Roll No</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No students found.</td></tr>
          ) : (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.roll_no}</td>
                <td>{student.phone_number}</td>
                <td>
                  <button onClick={() => handleDelete(student.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;