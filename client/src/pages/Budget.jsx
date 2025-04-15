import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Budget.css';
import TripTab from '../components/TripTab';
import TripHeader from '../components/TripHeader';

const Budget = () => {
  const { tripId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', amount: '' });
  const [budgetGoal, setBudgetGoal] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/trips/${tripId}/budget`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(res.data);
      } catch (err) {
        console.error('Error fetching expenses', err);
        setError('Failed to load expenses');
      }
    };

    fetchExpenses();
  }, [tripId]);

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = budgetGoal - totalSpent;
  const percentSpent = budgetGoal > 0 ? Math.min((totalSpent / budgetGoal) * 100, 100) : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.category || !form.amount) return;

    const token = localStorage.getItem('token');
    const expenseData = { ...form, amount: Number(form.amount) };

    try {
      if (editingId) {
        const res = await axios.put(`/api/budget/${editingId}`, expenseData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(expenses.map(exp => (exp._id === editingId ? res.data : exp)));
        setEditingId(null);
      } else {
        const res = await axios.post(`/api/trips/${tripId}/budget`, expenseData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses([...expenses, res.data]);
      }

      setForm({ name: '', category: '', amount: '' });
    } catch (err) {
      console.error('Failed to save expense', err);
      setError('Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/budget/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(expenses.filter(e => e._id !== id));
      if (id === editingId) {
        setEditingId(null);
        setForm({ name: '', category: '', amount: '' });
      }
    } catch (err) {
      console.error('Failed to delete expense', err);
      setError('Could not delete entry');
    }
  };

  const handleEdit = (exp) => {
    setForm({
      name: exp.name,
      category: exp.category,
      amount: exp.amount
    });
    setEditingId(exp._id);
  };

  const handleBudgetGoalChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBudgetGoal(value);
    }
  };

  return (
    <div className="budget-container">
       <TripHeader />
      <TripTab />

      <h1 className="section-title">Budget</h1>

      <div className="budget-summary">
        <div className="budget-bar">
          <div className="budget-fill" style={{ width: `${percentSpent}%` }}></div>
        </div>
        <div className="budget-labels">
          <span>€{totalSpent} spent</span>
          <span>€{remaining} remaining of €{budgetGoal}</span>
        </div>
        <div className="budget-goal-input">
          <label>Set Total Budget: </label>
          <input
            type="number"
            value={budgetGoal}
            onChange={handleBudgetGoalChange}
            min="0"
          />
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="budget-form">
        <input
          type="text"
          name="name"
          placeholder="Expense name"
          value={form.name}
          onChange={handleChange}
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Category</option>
          <option value="Accommodation">Accommodation</option>
          <option value="Transportation">Transportation</option>
          <option value="Food">Food</option>
          <option value="Attraction">Attraction</option>
        </select>
        <input
          type="number"
          name="amount"
          placeholder="0.00"
          value={form.amount}
          onChange={handleChange}
        />
        <button onClick={handleAddOrUpdate}>
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>

      <div className="expenses-list">
        {expenses.map((exp) => (
          <div className="expense-item" key={exp._id}>
            <div className="expense-info">
              <strong>{exp.name}</strong>
              <div>{exp.category}</div>
            </div>
            <div className="expense-amount">
              €{exp.amount}
              <button onClick={() => handleEdit(exp)}>✏️</button>
              <button onClick={() => handleDelete(exp._id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Budget;
