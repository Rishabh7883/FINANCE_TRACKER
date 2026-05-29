import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';

const PAGE_SIZE = 10;

const Transactions = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const loadCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
    } catch {
      showToast('Failed to load categories', 'error');
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const params = {
        page,
        size: PAGE_SIZE,
        sortBy: 'date',
        sortDir: 'desc'
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await api.get('/api/transactions', {
        params
      });

      setTransactions(res.data.content);
      setTotal(res.data.totalElements);

    } catch (err) {
      showToast(
        'Failed to load transactions',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchTransactions();
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete transaction?')) return;

    try {
      await api.delete(`/api/transactions/${id}`);

      showToast(
        'Transaction deleted',
        'success'
      );

      fetchTransactions();

    } catch {
      showToast(
        'Delete failed',
        'error'
      );
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="page-container">

      {/* Header */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}
      >
        <h2>Transactions</h2>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditItem(null);
            setModalOpen(true);
          }}
        >
          + Add Transaction
        </button>
      </div>

      {/* Filters */}

      <div
        className="glass-card"
        style={{
          marginBottom: '24px'
        }}
      >
        <h3>Filters</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(180px,1fr))',
            gap: '12px',
            marginTop: '16px'
          }}
        >
          <input
            className="form-control"
            placeholder="Search..."
            value={filters.search}
            onChange={e =>
              setFilters({
                ...filters,
                search: e.target.value
              })
            }
          />

          <select
            className="form-control"
            value={filters.type}
            onChange={e =>
              setFilters({
                ...filters,
                type: e.target.value
              })
            }
          >
            <option value="">
              All Types
            </option>

            <option value="INCOME">
              Income
            </option>

            <option value="EXPENSE">
              Expense
            </option>
          </select>

          <select
            className="form-control"
            value={filters.category}
            onChange={e =>
              setFilters({
                ...filters,
                category: e.target.value
              })
            }
          >
            <option value="">
              All Categories
            </option>

            {categories.map(cat => (
              <option
                key={cat.id}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="form-control"
            value={filters.startDate}
            onChange={e =>
              setFilters({
                ...filters,
                startDate: e.target.value
              })
            }
          />

          <input
            type="date"
            className="form-control"
            value={filters.endDate}
            onChange={e =>
              setFilters({
                ...filters,
                endDate: e.target.value
              })
            }
          />

          <button
            className="btn btn-primary"
            onClick={handleSearch}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="glass-card">

        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '40px'
            }}
          >
            <div
              className="spinner"
              style={{
                width: '40px',
                height: '40px'
              }}
            />
          </div>
        ) : (
          <table className="data-table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {transactions.length > 0 ? (
                transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>

                    <td>
                      <div>
                        <strong>
                          {tx.title}
                        </strong>

                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.7
                          }}
                        >
                          {tx.description}
                        </div>
                      </div>
                    </td>

                    <td>
                      {tx.category?.name}
                    </td>

                    <td>
                      <span
                        style={{
                          color:
                            tx.type === 'INCOME'
                              ? '#10b981'
                              : '#ef4444',
                          fontWeight: '600'
                        }}
                      >
                        {tx.type}
                      </span>
                    </td>

                    <td
                      style={{
                        color:
                          tx.type === 'INCOME'
                            ? '#10b981'
                            : '#ef4444',
                        fontWeight: '600'
                      }}
                    >
                      {tx.type === 'INCOME'
                        ? '+'
                        : '-'}
                      ₹
                      {Number(
                        tx.amount
                      ).toLocaleString()}
                    </td>

                    <td>

                      <button
                        className="btn btn-secondary"
                        style={{
                          marginRight: '8px'
                        }}
                        onClick={() => {
                          setEditItem(tx);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleDelete(tx.id)
                        }
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: 'center',
                      padding: '30px'
                    }}
                  >
                    No transactions found
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        )}

      </div>

      {/* Pagination */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '24px'
        }}
      >
        <button
          className="btn btn-secondary"
          disabled={page === 0}
          onClick={() =>
            setPage(prev => prev - 1)
          }
        >
          Previous
        </button>

        <span>
          Page {page + 1} of{' '}
          {Math.max(totalPages, 1)}
        </span>

        <button
          className="btn btn-secondary"
          disabled={
            page >= totalPages - 1
          }
          onClick={() =>
            setPage(prev => prev + 1)
          }
        >
          Next
        </button>
      </div>

      <TransactionForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchTransactions}
        editTransaction={editItem}
      />

    </div>
  );
};

export default Transactions;