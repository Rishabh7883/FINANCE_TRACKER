import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const Categories = () => {
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    type: 'EXPENSE'
  });

  const loadCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      showToast(
        'Failed to load categories',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.name.trim()) {
      showToast(
        'Category name is required',
        'error'
      );
      return;
    }

    try {
      await api.post('/api/categories', {
        name: form.name,
        type: form.type
      });

      showToast(
        'Category created successfully',
        'success'
      );

      setForm({
        name: '',
        type: 'EXPENSE'
      });

      loadCategories();

    } catch (err) {
      showToast(
        err.response?.data?.message ||
          'Failed to create category',
        'error'
      );
    }
  };

  const incomeCategories = categories.filter(
    cat => cat.type === 'INCOME'
  );

  const expenseCategories = categories.filter(
    cat => cat.type === 'EXPENSE'
  );

  return (
    <div className="page-container">

      {/* Header */}

      <div
        style={{
          marginBottom: '24px'
        }}
      >
        <h2>Categories</h2>
        <p>
          Manage your income and expense categories.
        </p>
      </div>

      {/* Add Category */}

      <div
        className="glass-card"
        style={{
          marginBottom: '24px'
        }}
      >
        <h3>Add New Category</h3>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: '16px'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '2fr 1fr auto',
              gap: '12px'
            }}
          >

            <input
              type="text"
              className="form-control"
              placeholder="Category Name"
              value={form.name}
              onChange={e =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />

            <select
              className="form-control"
              value={form.type}
              onChange={e =>
                setForm({
                  ...form,
                  type: e.target.value
                })
              }
            >
              <option value="EXPENSE">
                Expense
              </option>

              <option value="INCOME">
                Income
              </option>
            </select>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Add
            </button>

          </div>
        </form>
      </div>

      {/* Categories */}

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '50px'
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(350px,1fr))',
            gap: '24px'
          }}
        >

          {/* Income */}

          <div className="glass-card">

            <h3
              style={{
                color: '#10b981'
              }}
            >
              Income Categories
            </h3>

            <div
              style={{
                marginTop: '16px'
              }}
            >
              {incomeCategories.length > 0 ? (
                incomeCategories.map(cat => (
                  <div
                    key={cat.id}
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      marginBottom: '10px',
                      border:
                        '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px'
                    }}
                  >
                    <span>{cat.name}</span>

                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {cat.system
                        ? 'SYSTEM'
                        : 'CUSTOM'}
                    </span>
                  </div>
                ))
              ) : (
                <p>No income categories.</p>
              )}
            </div>

          </div>

          {/* Expense */}

          <div className="glass-card">

            <h3
              style={{
                color: '#ef4444'
              }}
            >
              Expense Categories
            </h3>

            <div
              style={{
                marginTop: '16px'
              }}
            >
              {expenseCategories.length > 0 ? (
                expenseCategories.map(cat => (
                  <div
                    key={cat.id}
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      marginBottom: '10px',
                      border:
                        '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px'
                    }}
                  >
                    <span>{cat.name}</span>

                    <span
                      style={{
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {cat.system
                        ? 'SYSTEM'
                        : 'CUSTOM'}
                    </span>
                  </div>
                ))
              ) : (
                <p>No expense categories.</p>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Categories;