import React, { useState, useEffect } from 'react';
import axios from 'axios';

function IssueBook({ apiBase }) {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchStudents();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${apiBase}/books`);
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${apiBase}/students`);
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}/issues`, {
        bookId: parseInt(selectedBook),
        studentId: parseInt(selectedStudent)
      });
      setMessage(res.data.message);
      setMessageType('success');
      setSelectedBook('');
      setSelectedStudent('');
      setTimeout(() => setMessage(''), 5000);
      fetchBooks();
      fetchStudents();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Issue a Book</h2>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{message}</div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Issue Book to Student</h3>
        <form onSubmit={handleIssue}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Select Book</label>
            <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="">-- Choose a Book --</option>
              {books.map(book => (
                <option key={book.id} value={book.id} disabled={book.availableCopies <= 0}>
                  {book.title} by {book.author} (Available: {book.availableCopies})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Select Student</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="">-- Choose a Student --</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name} ({student.studentId})</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-500 mb-3">📅 Due date will be automatically set to 14 days from today.</p>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Issue Book</button>
        </form>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Currently Issued Books</h3>
        <IssuedBooks apiBase={apiBase} />
      </div>
    </div>
  );
}

function IssuedBooks({ apiBase }) {
  const [issuedBooks, setIssuedBooks] = useState([]);

  useEffect(() => {
    fetchIssued();
  }, []);

  const fetchIssued = async () => {
    try {
      const res = await axios.get(`${apiBase}/issues/issued`);
      setIssuedBooks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error:', error);
      setIssuedBooks([]);
    }
  };

  return (
    <table className="w-full border-collapse mt-4">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Book</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Student</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Issue Date</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Due Date</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Status</th>
<th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Fine</th>
        </tr>
      </thead>
      <tbody>
        {issuedBooks.map(record => (
          <tr key={record.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 border-b border-gray-200">{record.bookTitle || 'N/A'}</td>
            <td className="px-4 py-3 border-b border-gray-200">{record.studentName || 'N/A'}</td>
            <td className="px-4 py-3 border-b border-gray-200">{record.issueDate}</td>
            <td className="px-4 py-3 border-b border-gray-200">{record.dueDate}</td>
            <td className="px-4 py-3 border-b border-gray-200"><span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">Issued</span></td>
            <td className="px-4 py-3 border-b border-gray-200">
              {record.fineAmount > 0
                ? <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">${record.fineAmount.toFixed(2)}</span>
                : <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">$0.00</span>
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default IssueBook;
