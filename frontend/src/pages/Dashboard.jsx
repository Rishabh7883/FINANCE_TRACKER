import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

const COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444'
];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get('/api/dashboard/summary');
      setData(res.data);
    } catch (err) {
      console.error('Dashboard load failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '60px'
          }}
        >
          <div
            className="spinner"
            style={{
              width: '40px',
              height: '40px',
              borderWidth: '4px'
            }}
          />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page-container">
        <div className="glass-card">
          <h3>Unable to load dashboard data</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* Welcome Section */}
      <div
        className="glass-card"
        style={{
          marginBottom: '24px'
        }}
      >
        <h2>Financial Overview</h2>
        <p>
          Track your income, expenses and financial progress.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-grid">

        <div className="glass-card">
          <h4>Total Income</h4>

          <h2
            style={{
              color: '#10b981',
              marginTop: '12px'
            }}
          >
            ₹{Number(data.totalIncome || 0).toLocaleString()}
          </h2>
        </div>

        <div className="glass-card">
          <h4>Total Expense</h4>

          <h2
            style={{
              color: '#ef4444',
              marginTop: '12px'
            }}
          >
            ₹{Number(data.totalExpense || 0).toLocaleString()}
          </h2>
        </div>

        <div className="glass-card">
          <h4>Current Balance</h4>

          <h2
            style={{
              color: '#6366f1',
              marginTop: '12px'
            }}
          >
            ₹{Number(data.balance || 0).toLocaleString()}
          </h2>
        </div>

      </div>

      {/* Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginTop: '24px'
        }}
      >

        <div className="glass-card">
          <h3>Expense Distribution</h3>

          {data.categoryDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categoryDistribution}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  outerRadius={100}
                  label
                >
                  {data.categoryDistribution.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No expense data available.</p>
          )}
        </div>

        <div className="glass-card">
          <h3>Monthly Trend</h3>

          {data.monthlyTrends?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="monthLabel" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No trend data available.</p>
          )}
        </div>

      </div>

      {/* Recent Transactions */}
      <div
        className="glass-card"
        style={{
          marginTop: '24px'
        }}
      >
        <h3>Recent Transactions</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {data.recentTransactions?.length > 0 ? (
              data.recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.title}</td>

                  <td>{tx.category?.name}</td>

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
                    {tx.type === 'INCOME' ? '+' : '-'}₹
                    {Number(tx.amount).toLocaleString()}
                  </td>

                  <td>{tx.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: 'center',
                    padding: '20px'
                  }}
                >
                  No transactions found
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;