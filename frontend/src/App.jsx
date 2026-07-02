import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', roll_no: '', phone_number: '' });
  const [error, setError] = useState('');

  const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
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
      setFormData({ name: '', roll_no: '', phone_number: '' }); // Form clear karne ke liye
      fetchStudents(); // List refresh karne ke liye
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!");
    }
  };

  // 4. Delete Student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStudents(); // List refresh karne ke liye
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  return (
    <div className="app-container">
      <h2 className="header">School Management Mini System</h2>
      
      {/* Student Form */}
      <div className="form-container">
        <h3>Add New Student</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            <input type="text" name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} required className="form-input" />
            <input type="text" name="roll_no" placeholder="Roll Number" value={formData.roll_no} onChange={handleChange} required className="form-input" />
            <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required className="form-input" />
          </div>
          <button type="submit" className="submit-btn">Add Student</button>
        </form>
      </div>

      {/* Student List Table */}
      <div className="student-list">
        <h3>Student List</h3>
        <table className="student-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Roll No</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.roll_no}</td>
                  <td>{student.phone_number}</td>
                  <td><button onClick={() => handleDelete(student.id)} className="delete-btn">Delete</button></td>
                </tr>
              )) : ( <tr><td colSpan="5" style={{ textAlign: 'center' }}>No students found.</td></tr> )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;