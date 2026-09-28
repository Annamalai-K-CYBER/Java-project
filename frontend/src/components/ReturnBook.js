import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReturnBook({ apiBase }) {
  const [issueRecords, setIssueRecords] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchIssuedRecords();
  }, []);

  const fetchIssuedRecords = async () => {
    try {
      const res = await axios.get(`${apiBase}/issues/issued`);
      setIssueRecords(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching issued records:', error);
      setIssueRecords([]);
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}/issues/return`, {
        issueId: parseInt(selectedIssue),
        returnDate: returnDate || new Date().toISOString().split('T')[0]
      });
      setMessage(res.data.message);
      setMessageType('success');
      setSelectedIssue('');
      setReturnDate('');
      setTimeout(() => setMessage(''), 5000);
      fetchIssuedRecords();
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Return a Book</h2>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{message}</div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Return Book</h3>
        <form onSubmit={handleReturn}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Select Issue Record</label>
            <select value={selectedIssue} onChange={(e) => setSelectedIssue(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="">-- Choose an Issue Record --</option>
              {issueRecords.map(record => (
                <option key={record.id} value={record.id}>
                  {record.bookTitle || 'N/A'} → {record.studentName || 'N/A'} (Due: {record.dueDate})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Return Date</label>
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <p className="text-sm text-gray-500 mb-3">💰 Fine: $1.00 per day after the due date. Calculated automatically.</p>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">Return Book</button>
        </form>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Issue Records</h3>
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Book</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Student</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Issue Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Due Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Return Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Fine</th>
            </tr>
          </thead>
          <tbody>
            {issueRecords.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200">{record.id}</td>
                <td className="px-4 py-3 border-b border-gray-200">{record.bookTitle || 'N/A'}</td>
                <td className="px-4 py-3 border-b border-gray-200">{record.studentName || 'N/A'}</td>
                <td className="px-4 py-3 border-b border-gray-200">{record.issueDate}</td>
                <td className="px-4 py-3 border-b border-gray-200">{record.dueDate}</td>
                <td className="px-4 py-3 border-b border-gray-200">{record.returnDate || 'Not returned'}</td>
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
      </div>
    </div>
  );
}

export default ReturnBook;
