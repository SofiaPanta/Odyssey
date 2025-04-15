import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/PackingList.css';
import TripTab from '../components/TripTab';
import TripHeader from '../components/TripHeader';

const PackingList = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [packingItems, setPackingItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState({ name: '', category: '' });

  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', category: '' });

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const tripRes = await axios.get(`/api/trips/${tripId}`, { headers });
        setTrip(tripRes.data);

        const res = await axios.get(`/api/trips/${tripId}/packing`, { headers });
        setPackingItems(res.data);

        const cats = [...new Set(res.data.map(i => i.category?.toLowerCase()).filter(Boolean))];
        setCategories(cats);
      } catch (err) {
        setError('Failed to fetch packing list.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  const updateCategories = (cat) => {
    const lc = cat.toLowerCase();
    if (lc && !categories.includes(lc)) {
      setCategories(prev => [...prev, lc]);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const { name, category } = newItem;
    const token = localStorage.getItem('token');
    if (!name.trim()) return;

    try {
      const res = await axios.post(`/api/trips/${tripId}/packing`, {
        name: name.trim(),
        category: category.trim().toLowerCase()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPackingItems(prev => [...prev, res.data]);
      updateCategories(category);
      setNewItem({ name: '', category: category.trim().toLowerCase() });
    } catch (err) {
      setError('Failed to add item.');
      console.error(err);
    }
  };

  const handleToggleItem = async (itemId, isPacked) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/trips/${tripId}/packing/${itemId}/toggle`, {
        packed: !isPacked
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPackingItems(prev =>
        prev.map(item => item._id === itemId ? { ...item, isPacked: !item.isPacked } : item)
      );
    } catch (err) {
      setError('Failed to toggle item.');
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/trips/${tripId}/packing/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPackingItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      setError('Failed to delete item.');
      console.error(err);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item._id);
    setEditFormData({ name: item.name, category: item.category || '' });
  };

  const handleSaveEdit = async (id) => {
    const { name, category } = editFormData;
    if (!name.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/trips/${tripId}/packing/${id}`, {
        name: name.trim(),
        category: category.trim().toLowerCase()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPackingItems(prev =>
        prev.map(item => item._id === id ? { ...item, ...res.data } : item)
      );
      updateCategories(category);
      setEditingItem(null);
    } catch (err) {
      setError('Failed to save edit.');
      console.error(err);
    }
  };

  const handleAISuggestions = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiSuggestions('');
    setAiError('');

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();

      if (data.result) {
        setAiSuggestions(data.result);
      } else {
        throw new Error('No suggestions returned.');
      }
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const totalItems = packingItems.length;
  const packedItems = packingItems.filter(i => i.isPacked).length;
  const progress = totalItems ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <div className="packing-container">
       <TripHeader />
      <TripTab />
      {error && <div className="error-message">{error}</div>}

      <div className="packing-header">
        <h1>Packing List</h1>
        <div className="packing-progress">
          <span>{packedItems} of {totalItems} packed ({progress}%)</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleAddItem} className="add-item-form">
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={newItem.name}
          onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newItem.category}
          onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value }))}
          list="categories"
        />
        <datalist id="categories">
          {categories.map((cat, idx) => <option key={idx} value={cat} />)}
        </datalist>
        <button type="submit">Add Item</button>
      </form>

      {categories.map(category => (
        <div key={category}>
          <h3>{category}</h3>
          <ul>
            {packingItems.filter(i => i.category === category).map(item => (
              <li key={item._id}>
                {editingItem === item._id ? (
                  <>
                    <input name="name" value={editFormData.name} onChange={e => setEditFormData(prev => ({ ...prev, name: e.target.value }))} />
                    <input name="category" value={editFormData.category} onChange={e => setEditFormData(prev => ({ ...prev, category: e.target.value }))} />
                    <button onClick={() => handleSaveEdit(item._id)}>Save</button>
                    <button onClick={() => setEditingItem(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={item.isPacked}
                      onChange={() => handleToggleItem(item._id, item.isPacked)}
                    />
                    {item.name}
                    <button onClick={() => handleEditClick(item)}>✏️</button>
                    <button onClick={() => handleDeleteItem(item._id)}>🗑️</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="ai-suggestions-section">
        <h3>AI Packing Suggestions</h3>
        <input
          type="text"
          value={aiPrompt}
          onChange={e => setAiPrompt(e.target.value)}
          placeholder="Suggest packing items for a weekend trip..."
        />
        <button onClick={handleAISuggestions}>
          {aiLoading ? 'Loading...' : 'Get Suggestions'}
        </button>
        {aiError && <div className="error-message">{aiError}</div>}
        {aiSuggestions && <pre>{aiSuggestions}</pre>}
      </div>
    </div>
  );
};

export default PackingList;
