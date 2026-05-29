import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

/**
 * Props:
 *  - isOpen: boolean – whether modal is visible
 *  - onClose: () => void – close handler
 *  - onSuccess: () => void – callback after successful create/update
 *  - editTransaction: object | null – transaction data for editing, null for create
 */
const TransactionForm = ({ isOpen, onClose, onSuccess, editTransaction }) => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    date: '',
    description: '',
    amount: '',
    type: 'EXPENSE',
    categoryId: ''
  });
  const [loading, setLoading] = useState(false);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        showToast('Failed to load categories.', 'error');
      }
    };
    fetchCategories();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editTransaction) {
      setForm({
        date: editTransaction.date?.slice(0, 10) || '', // keep YYYY-MM-DD
        description: editTransaction.description || '',
        amount: editTransaction.amount?.toString() || '',
        type: editTransaction.type || 'EXPENSE',
        categoryId: editTransaction.category?.id || ''
      });
    } else {
      setForm({ date: '', description: '', amount: '', type: 'EXPENSE', categoryId: '' });
    }
  }, [editTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.description || !form.amount || !form.categoryId) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      if (editTransaction) {
        await api.put(`/api/transactions/${editTransaction.id}`, {
          ...form,
          amount: parseFloat(form.amount)
        });
        showToast('Transaction updated.', 'success');
      } else {
        await api.post('/api/transactions', {
          ...form,
          amount: parseFloat(form.amount)
        });
        showToast('Transaction added.', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="glass-card modal-content animate-slide-up">
        <h3>{editTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date</label>
            <input type="date" id="date" name="date" className="form-control" value={form.date} onChange={handleChange} disabled={loading} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <input type="text" id="description" name="description" className="form-control" placeholder="What was it for?" value={form.description} onChange={handleChange} disabled={loading} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount</label>
            <input type="number" step="0.01" id="amount" name="amount" className="form-control" placeholder="0.00" value={form.amount} onChange={handleChange} disabled={loading} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="type">Type</label>
            <select id="type" name="type" className="form-control" value={form.type} onChange={handleChange} disabled={loading}>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="categoryId">Category</label>
            <select id="categoryId" name="categoryId" className="form-control" value={form.categoryId} onChange={handleChange} disabled={loading} required>
              <option value="" disabled>Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginLeft: '12px' }}>
              {loading ? <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : (editTransaction ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
