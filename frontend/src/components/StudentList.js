import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentList({ apiBase }) {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${apiBase}/students`);
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBase}/students`, { name, email, studentId });
      setMessage('Student registered successfully!');
      setMessageType('success');
      setName('');
      setEmail('');
      setStudentId('');
      fetchStudents();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error registering student');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBase}/students/${id}`);
      setMessage('Student deleted successfully!');
      setMessageType('success');
      fetchStudents();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting student');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Management</h2>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{message}</div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Register New Student</h3>
        <form onSubmit={handleAddStudent}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Student ID</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Register Student</button>
        </form>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Students ({students.length})</h3>
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Student ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200">{student.id}</td>
                <td className="px-4 py-3 border-b border-gray-200">{student.name}</td>
                <td className="px-4 py-3 border-b border-gray-200">{student.email}</td>
                <td className="px-4 py-3 border-b border-gray-200">{student.studentId}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors" onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;
