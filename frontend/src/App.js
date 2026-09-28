import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from './components/BookList';
import StudentList from './components/StudentList';
import IssueBook from './components/IssueBook';
import ReturnBook from './components/ReturnBook';
import Dashboard from './components/Dashboard';
import './App.css';

const API_BASE = 'http://localhost:8080/api';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const pages = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'books', label: 'Books' },
    { id: 'students', label: 'Students' },
    { id: 'issue', label: 'Issue Book' },
    { id: 'return', label: 'Return Book' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">📚 LibroTrack</h1>
        <div className="flex gap-5">
          {pages.map(page => (
            <button
              key={page.id}
              className={`px-4 py-2 border border-white rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white hover:text-blue-600 ${activePage === page.id ? 'bg-white text-blue-600' : ''}`}
              onClick={() => setActivePage(page.id)}
            >
              {page.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activePage === 'dashboard' && <Dashboard apiBase={API_BASE} />}
        {activePage === 'books' && <BookList apiBase={API_BASE} />}
        {activePage === 'students' && <StudentList apiBase={API_BASE} />}
        {activePage === 'issue' && <IssueBook apiBase={API_BASE} />}
        {activePage === 'return' && <ReturnBook apiBase={API_BASE} />}
      </div>
    </div>
  );
}

export default App;
