import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { USA_STOCKS, CASABLANCA_STOCKS, ETFS, ALL_ASSETS } from './data/assets';
import { getStockPrice, getMultiplePrices } from './api/finnhub';
import './App.css';

function Dashboard() {
  const [investments, setInvestments] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    asset: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
  });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState({
    market: 'all',
    sector: 'all',
    country: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [view, setView] = useState('overview');
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const pieChartRef = useRef(null);
  const pieChartInstanceRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('investments');
    if (saved) {
      try {
        setInvestments(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load investments:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

  // Fetch live prices
  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      const uniqueTickers = [
        ...new Set(investments.map((inv) => {
          const asset = ALL_ASSETS.find((a) => a.id === inv.asset);
          return asset?.ticker;
        })),
      ].filter(Boolean);

      if (uniqueTickers.length > 0) {
        const fetchedPrices = await getMultiplePrices(uniqueTickers);
        setPrices(fetchedPrices);
      }
      setLoading(false);
    };

    if (investments.length > 0) {
      fetchPrices();
      // Refresh prices every 30 seconds
      const interval = setInterval(fetchPrices, 30000);
      return () => clearInterval(interval);
    }
  }, [investments]);

  // Portfolio value chart
  useEffect(() => {
    if (chartRef.current && investments.length > 0) {
      const filteredData = applyFilters(investments);
      const groupedByDate = {};
      
      filteredData.forEach((inv) => {
        if (!groupedByDate[inv.date]) groupedByDate[inv.date] = 0;
        groupedByDate[inv.date] += inv.amount;
      });

      const dates = Object.keys(groupedByDate).sort();
      const cumulative = [];
      let sum = 0;
      
      dates.forEach((date) => {
        sum += groupedByDate[date];
        cumulative.push(sum);
      });

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Cumulative Investment (€)',
              data: cumulative,
              borderColor: '#378ADD',
              backgroundColor: 'rgba(55, 138, 221, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: '#378ADD',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => '€' + value.toLocaleString(),
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [investments, filter]);

  // Allocation pie chart
  useEffect(() => {
    if (pieChartRef.current && investments.length > 0) {
      const filteredData = applyFilters(investments);
      const byMarket = {};
      
      filteredData.forEach((inv) => {
        const asset = ALL_ASSETS.find((a) => a.id === inv.asset);
        if (asset) {
          if (!byMarket[asset.market]) byMarket[asset.market] = 0;
          byMarket[asset.market] += inv.amount;
        }
      });

      const labels = Object.keys(byMarket);
      const data = Object.values(byMarket);
      const colors = {
        'USA': '#378ADD',
        'ETF': '#1D9E75',
        'Casablanca': '#BA7517',
      };

      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }

      pieChartInstanceRef.current = new Chart(pieChartRef.current, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: labels.map((label) => colors[label] || '#999'),
              borderColor: ['#fff'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: { padding: 20, font: { size: 14 } },
            },
          },
        },
      });
    }

    return () => {
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }
    };
  }, [investments, filter]);

  const applyFilters = (data) => {
    return data.filter((inv) => {
      const asset = ALL_ASSETS.find((a) => a.id === inv.asset);
      if (!asset) return false;
      if (filter.market !== 'all' && asset.market !== filter.market) return false;
      if (filter.sector !== 'all' && asset.sector !== filter.sector) return false;
      if (filter.country !== 'all' && asset.country !== filter.country) return false;
      if (filter.dateFrom && inv.date < filter.dateFrom) return false;
      if (filter.dateTo && inv.date > filter.dateTo) return false;
      return true;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.asset || !formData.amount) return;

    if (editId) {
      setInvestments(
        investments.map((inv) =>
          inv.id === editId ? { ...inv, ...formData, amount: parseFloat(formData.amount) } : inv
        )
      );
      setEditId(null);
    } else {
      setInvestments([
        ...investments,
        {
          ...formData,
          id: Date.now(),
          amount: parseFloat(formData.amount),
        },
      ]);
    }
    setFormData({
      asset: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      quantity: '',
    });
  };

  const deleteInvestment = (id) => {
    setInvestments(investments.filter((inv) => inv.id !== id));
  };

  const editInvestment = (inv) => {
    setFormData({
      asset: inv.asset,
      amount: inv.amount.toString(),
      date: inv.date,
      quantity: inv.quantity || '',
    });
    setEditId(inv.id);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Asset', 'Ticker', 'Amount', 'Current Price', 'Market Value', 'Market', 'Country'];
    const rows = investments.map((inv) => {
      const asset = ALL_ASSETS.find((a) => a.id === inv.asset);
      const currentPrice = prices[asset.ticker] || 'N/A';
      const marketValue = prices[asset.ticker] ? (inv.amount * prices[asset.ticker]).toFixed(2) : 'N/A';
      return [inv.date, asset.name, asset.ticker, inv.amount, currentPrice, marketValue, asset.market, asset.country];
    });
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `portfolio-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const filteredData = applyFilters(investments);
  const totalInvested = Math.round(filteredData.reduce((sum, inv) => sum + inv.amount, 0) * 100) / 100;
  
  // Calculate portfolio value with live prices
  let portfolioValue = 0;
  filteredData.forEach((inv) => {
    const asset = ALL_ASSETS.find((a) => a.id === inv.asset);
    if (asset && prices[asset.ticker]) {
      portfolioValue += inv.amount * prices[asset.ticker];
    } else {
      portfolioValue += inv.amount; // Fallback to cost if price not available
    }
  });
  portfolioValue = Math.round(portfolioValue * 100) / 100;

  const profitLoss = portfolioValue - totalInvested;
  const profitLossPercent = totalInvested > 0 ? ((profitLoss / totalInvested) * 100).toFixed(2) : 0;

  const byMarket = {};
  const byCountry = {};
  const bySector = {};

  filteredData.forEach((inv) => {
    const asset = ALL_ASSETS.find((a) => a.id === inv.asset);
    if (asset) {
      byMarket[asset.market] = (byMarket[asset.market] || 0) + inv.amount;
      byCountry[asset.country] = (byCountry[asset.country] || 0) + inv.amount;
      bySector[asset.sector] = (bySector[asset.sector] || 0) + inv.amount;
    }
  });

  const sectors = Object.keys(bySector)
    .sort((a, b) => bySector[b] - bySector[a])
    .slice(0, 8);

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>💼 Global Investment Portfolio</h1>
          <p>Track USA stocks, Casablanca Bourse, and ETFs with live prices</p>
        </div>

        {/* View Tabs */}
        <div className="tabs">
          <button className={`tab ${view === 'overview' ? 'active' : ''}`} onClick={() => setView('overview')}>
            Overview
          </button>
          <button className={`tab ${view === 'analysis' ? 'active' : ''}`} onClick={() => setView('analysis')}>
            Analysis
          </button>
          <button className={`tab ${view === 'transactions' ? 'active' : ''}`} onClick={() => setView('transactions')}>
            Transactions
          </button>
        </div>

        {view === 'overview' && (
          <>
            {/* Summary Cards */}
            <div className="metrics-grid">
              <div className="metric-card">
                <p className="metric-label">Total Invested</p>
                <p className="metric-value">€{totalInvested.toLocaleString()}</p>
              </div>
              <div className="metric-card">
                <p className="metric-label">Portfolio Value (Live)</p>
                <p className="metric-value" style={{ color: profitLoss >= 0 ? '#1D9E75' : '#c92a2a' }}>
                  €{portfolioValue.toLocaleString()}
                </p>
              </div>
              <div className="metric-card">
                <p className="metric-label">Profit / Loss</p>
                <p className="metric-value" style={{ color: profitLoss >= 0 ? '#1D9E75' : '#c92a2a' }}>
                  €{profitLoss.toLocaleString()} ({profitLossPercent}%)
                </p>
              </div>
              <div className="metric-card">
                <p className="metric-label">Total Transactions</p>
                <p className="metric-value">{filteredData.length}</p>
              </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div style={{ 
                textAlign: 'center', 
                padding: '1.5rem', 
                background: 'rgba(55, 138, 221, 0.05)',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(55, 138, 221, 0.1)'
              }}>
                <p style={{ color: '#378ADD', fontWeight: 600, fontSize: '15px' }}>
                  📡 Fetching live prices...
                </p>
              </div>
            )}

            {/* Form */}
            <div className="card">
              <h2>Add Investment</h2>
              <form onSubmit={handleSubmit} className="form-grid">
                <select
                  value={formData.asset}
                  onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                  required
                >
                  <option value="">Select Asset</option>
                  <optgroup label="🇺🇸 USA Stocks">
                    {USA_STOCKS.map((stock) => (
                      <option key={stock.id} value={stock.id}>
                        {stock.ticker} - {stock.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🇲🇦 Casablanca Bourse">
                    {CASABLANCA_STOCKS.map((stock) => (
                      <option key={stock.id} value={stock.id}>
                        {stock.ticker} - {stock.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📈 ETFs">
                    {ETFS.map((etf) => (
                      <option key={etf.id} value={etf.id}>
                        {etf.ticker} - {etf.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Amount (€)"
                  required
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
                <div className="button-group">
                  <button type="submit" className="btn btn-primary">
                    {editId ? '✏️ Update' : '➕ Add Investment'}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditId(null);
                        setFormData({
                          asset: '',
                          amount: '',
                          date: new Date().toISOString().split('T')[0],
                          quantity: '',
                        });
                      }}
                    >
                      ✕ Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Charts */}
            {investments.length > 0 && (
              <div className="charts-grid">
                <div className="card">
                  <h2>Portfolio Growth</h2>
                  <div className="chart-container">
                    <canvas ref={chartRef}></canvas>
                  </div>
                </div>
                <div className="card">
                  <h2>Market Allocation</h2>
                  <div className="chart-container">
                    <canvas ref={pieChartRef}></canvas>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {view === 'analysis' && (
          <>
            {/* Filters */}
            <div className="card">
              <h2>Filters & Export</h2>
              <div className="form-grid">
                <select value={filter.market} onChange={(e) => setFilter({ ...filter, market: e.target.value })}>
                  <option value="all">All Markets</option>
                  <option value="USA">USA Stocks</option>
                  <option value="Casablanca">Casablanca Bourse</option>
                  <option value="ETF">ETFs</option>
                </select>
                <select value={filter.country} onChange={(e) => setFilter({ ...filter, country: e.target.value })}>
                  <option value="all">All Countries</option>
                  <option value="United States">United States</option>
                  <option value="Morocco">Morocco</option>
                </select>
                <select value={filter.sector} onChange={(e) => setFilter({ ...filter, sector: e.target.value })}>
                  <option value="all">All Sectors</option>
                  {[...new Set(ALL_ASSETS.map((a) => a.sector))].map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filter.dateFrom}
                  onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
                />
                <input
                  type="date"
                  value={filter.dateTo}
                  onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
                />
                <button onClick={exportToCSV} className="btn btn-secondary">
                  📥 Export CSV
                </button>
              </div>
            </div>

            {/* Analysis Cards */}
            {filteredData.length > 0 && (
              <div className="breakdown-grid">
                <div className="card">
                  <h3>By Market</h3>
                  {Object.entries(byMarket).map(([market, amount]) => (
                    <div key={market} className="breakdown-item">
                      <div className="breakdown-header">
                        <span>
                          {market === 'USA' ? '🇺🇸' : market === 'Casablanca' ? '🇲🇦' : '📈'} {market}
                        </span>
                        <span className="amount">€{Math.round(amount * 100) / 100}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(amount / totalInvested) * 100}%`,
                            backgroundColor:
                              market === 'USA' ? '#378ADD' : market === 'Casablanca' ? '#BA7517' : '#1D9E75',
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <h3>By Country</h3>
                  {Object.entries(byCountry)
                    .sort((a, b) => b[1] - a[1])
                    .map(([country, amount]) => (
                      <div key={country} className="breakdown-item">
                        <div className="breakdown-header">
                          <span>{country === 'United States' ? '🇺🇸' : '🇲🇦'} {country}</span>
                          <span className="amount">€{Math.round(amount * 100) / 100}</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${(amount / totalInvested) * 100}%`,
                              backgroundColor: country === 'United States' ? '#378ADD' : '#BA7517',
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="card">
                  <h3>Top Sectors</h3>
                  {sectors.map((sector) => (
                    <div key={sector} className="breakdown-item">
                      <div className="breakdown-header">
                        <span>{sector}</span>
                        <span className="amount">€{Math.round(bySector[sector] * 100) / 100}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${(bySector[sector] / totalInvested) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {view === 'transactions' && (
          <>
            {/* Transactions Table */}
            {filteredData.length > 0 && (
              <div className="card table-card">
                <h2>All Transactions with Live Prices</h2>
                <div className="table-wrapper">
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Asset</th>
                        <th>Ticker</th>
                        <th>Cost (€)</th>
                        <th>Current Price</th>
                        <th>Market Value</th>
                        <th>P&L</th>
                        <th>Market</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((inv) => {
                          const asset = ALL_ASSETS.find((a) => a.id === inv.asset);
                          const currentPrice = prices[asset?.ticker];
                          const marketValue = currentPrice ? inv.amount * currentPrice : inv.amount;
                          const pnl = currentPrice ? marketValue - inv.amount : 0;
                          const pnlPercent = currentPrice ? ((pnl / inv.amount) * 100).toFixed(2) : 0;

                          return (
                            <tr key={inv.id}>
                              <td>{inv.date}</td>
                              <td>{asset?.name}</td>
                              <td className="ticker">{asset?.ticker}</td>
                              <td className="amount">€{Math.round(inv.amount * 100) / 100}</td>
                              <td>{currentPrice ? '€' + currentPrice.toFixed(2) : '—'}</td>
                              <td className="amount">€{Math.round(marketValue * 100) / 100}</td>
                              <td style={{ color: pnl >= 0 ? '#1D9E75' : '#c92a2a', fontWeight: 600 }}>
                                {currentPrice ? `€${pnl.toFixed(2)} (${pnlPercent}%)` : '—'}
                              </td>
                              <td>{asset?.market}</td>
                              <td className="actions">
                                <button className="btn-small btn-edit" onClick={() => editInvestment(inv)} title="Edit this investment">
                                  ✏️ Edit
                                </button>
                                <button className="btn-small btn-delete" onClick={() => deleteInvestment(inv.id)} title="Delete this investment">
                                  🗑️ Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {investments.length === 0 && (
              <div className="empty-state">
                <p>📊 No investments yet. Add your first investment in the Overview tab!</p>
              </div>
            )}
          </>
        )}

        {investments.length === 0 && view === 'overview' && (
          <div className="empty-state">
            <p>🎯 Start building your global portfolio! Add your first investment above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
