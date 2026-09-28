import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookList({ apiBase }) {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [totalCopies, setTotalCopies] = useState(3);
  const [category, setCategory] = useState('');
  const [searchField, setSearchField] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${apiBase}/books`);
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    }
  };
  

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBase}/books`, {
        title, author, isbn: isbn || `ISBN-${Date.now()}`, totalCopies: parseInt(totalCopies), category: category || 'General'
      });
      setMessage('Book added successfully!');
      setMessageType('success');
      setTitle('');
      setAuthor('');
      setIsbn('');
      setTotalCopies(3);
      setCategory('');
      fetchBooks();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding book: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEditBook = async (book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setTotalCopies(book.totalCopies);
    setCategory(book.category || '');
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiBase}/books/${editingId}`, {
        title, author, isbn, totalCopies: parseInt(totalCopies), category: category || 'General'
      });
      setMessage('Book updated successfully!');
      setMessageType('success');
      setEditingId(null);
      setTitle('');
      setAuthor('');
      setIsbn('');
      setTotalCopies(3);
      setCategory('');
      fetchBooks();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating book: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setIsbn('');
    setTotalCopies(3);
    setCategory('');
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${apiBase}/books/search/${searchField}/${searchQuery}`);
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error searching:', error);
      fetchBooks();
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBase}/books/${id}`);
      setMessage('Book deleted successfully!');
      setMessageType('success');
      fetchBooks();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting book');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Catalogue</h2>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{message}</div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{editingId ? 'Edit Book' : 'Add New Book'}</h3>
        <form onSubmit={editingId ? handleUpdateBook : handleAddBook}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">ISBN</label>
            <input value={isbn} onChange={(e) => setIsbn(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Total Copies</label>
            <input type="number" value={totalCopies} onChange={(e) => setTotalCopies(e.target.value)} min="1" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">{editingId ? 'Update Book' : 'Add Book'}</button>
            {editingId && (
              <button type="button" className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors" onClick={handleCancelEdit}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Books</h3>
        <div className="flex gap-3 mb-4">
          <select value={searchField} onChange={(e) => setSearchField(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="category">Category</option>
          </select>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" />
          <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Search</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Books ({books.length})</h3>
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Author</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">ISBN</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Available</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Total</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200">{book.id}</td>
                <td className="px-4 py-3 border-b border-gray-200">{book.title}</td>
                <td className="px-4 py-3 border-b border-gray-200">{book.author}</td>
                <td className="px-4 py-3 border-b border-gray-200">{book.isbn}</td>
                <td className="px-4 py-3 border-b border-gray-200">{book.category}</td>
                <td className="px-4 py-3 border-b border-gray-200"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">{book.availableCopies}</span></td>
                <td className="px-4 py-3 border-b border-gray-200">{book.totalCopies}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors mr-1" onClick={() => handleEditBook(book)}>Edit</button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors" onClick={() => handleDelete(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookList;
