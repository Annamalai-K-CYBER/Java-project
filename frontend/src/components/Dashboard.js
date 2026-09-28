import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ apiBase }) {
  const [stats, setStats] = useState({ books: 0, students: 0, issued: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksRes, studentsRes, issuesRes] = await Promise.all([
        axios.get(`${apiBase}/books`),
        axios.get(`${apiBase}/students`),
        axios.get(`${apiBase}/issues/issued`)
      ]);
      setStats({
        books: booksRes.data.length,
        students: studentsRes.data.length,
        issued: issuesRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 text-center shadow-md">
          <h3 className="text-3xl font-bold text-blue-600">{stats.books}</h3>
          <p className="text-gray-500 mt-2">Total Books</p>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-md">
          <h3 className="text-3xl font-bold text-blue-600">{stats.students}</h3>
          <p className="text-gray-500 mt-2">Registered Students</p>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-md">
          <h3 className="text-3xl font-bold text-blue-600">{stats.issued}</h3>
          <p className="text-gray-500 mt-2">Currently Issued</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
