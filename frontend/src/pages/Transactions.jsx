import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import TransactionForm from '../components/TransactionForm';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 10;

const Transactions = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/api/transactions', { params: { page, size: PAGE_SIZE } });
      setTransactions(res.data.content);
      setTotal(res.data.totalElements);
    } catch (err) {
      showToast('Failed to load transactions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/api/transactions/${id}`);
      showToast('Transaction removed.', 'success');
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Delete failed.';
      showToast(msg, 'error');
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (tx) => {
    setEditItem(tx);
    setModalOpen(true);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="page-container">
      <h2>Transactions</h2>
      <button className="btn btn-primary" onClick={openAdd} style={{ marginBottom: '12px' }}>Add Transaction</button>
      {loading ? (
        <div className="spinner" style={{ width: '30px', height: '30px', borderWidth: '3px' }} />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td>{tx.amount.toFixed(2)}</td>
                <td>{tx.type}</td>
                <td>{tx.category?.name || ''}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(tx)} style={{ marginRight: '6px' }}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tx.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Pagination Controls */}
      <div className="pagination-controls" style={{ marginTop: '12px' }}>
        <button className="btn btn-sm" onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>Prev</button>
        <span style={{ margin: '0 8px' }}>Page {page + 1} of {totalPages}</span>
        <button className="btn btn-sm" onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))} disabled={page >= totalPages - 1}>Next</button>
      </div>
      <TransactionForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        editTransaction={editItem}
      />
    </div>
  );
};

export default Transactions;
