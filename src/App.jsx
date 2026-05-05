import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { USA_STOCKS, CASABLANCA_STOCKS, ETFS, ALL_ASSETS } from './data/assets';
import { getMultiplePrices } from './api/finnhub';
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
  const [view, setView] = useState('investments');
  const [timePeriod, setTimePeriod] = useState('ALL');
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

  // Portfolio value chart with time period filtering
  useEffect(() => {
    if (chartRef.current && investments.length > 0) {
      let filteredData = applyFilters(investments);
      
      // Apply time period filter
      const now = new Date();
      let dateFrom = new Date();
      
      switch(timePeriod) {
        case '1k': dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
        case '1m': dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
        case '3m': dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
        case '6m': dateFrom = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000); break;
        case 'YTD': dateFrom = new Date(now.getFullYear(), 0, 1); break;
        case '1Y': dateFrom = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break;
        case '5Y': dateFrom = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000); break;
        case 'ALL': dateFrom = new Date(0); break;
        default: dateFrom = new Date(0);
      }
      
      filteredData = filteredData.filter(inv => new Date(inv.date) >= dateFrom);
      
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

      const gradient = chartRef.current.getContext('2d').createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(55, 138, 221, 0.15)');
      gradient.addColorStop(1, 'rgba(55, 138, 221, 0.01)');

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Portfolio Value',
              data: cumulative,
              borderColor: '#378ADD',
              backgroundColor: gradient,
              tension: 0.4,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointBackgroundColor: '#378ADD',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => '€' + (value / 1000).toFixed(0) + 'k',
              },
              grid: {
                color: 'rgba(0,0,0,0.05)',
              },
            },
            x: {
              grid: {
                display: false,
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
  }, [investments, filter, timePeriod]);

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
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-logo" title="Dashboard">
          💼
        </div>
        <div className="sidebar-nav">
          <button 
            className={`nav-icon ${view === 'investments' ? 'active' : ''}`}
            onClick={() => setView('investments')}
            title="Investments"
          >
            📈
            <span className="sr-only">Investments</span>
          </button>
          <button 
            className={`nav-icon ${view === 'analysis' ? 'active' : ''}`}
            onClick={() => setView('analysis')}
            title="Analysis"
          >
            📊
            <span className="sr-only">Analysis</span>
          </button>
          <button 
            className={`nav-icon ${view === 'add' ? 'active' : ''}`}
            onClick={() => setView('add')}
            title="Add Investment"
          >
            ➕
            <span className="sr-only">Add investment</span>
          </button>
          <button 
            className={`nav-icon ${view === 'transactions' ? 'active' : ''}`}
            onClick={() => setView('transactions')}
            title="Transactions"
          >
            📋
            <span className="sr-only">Transactions</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <div className="header-top">
          <h1>{view === 'investments' ? 'Investments' : view === 'analysis' ? 'Analysis' : view === 'add' ? 'Add Investment' : 'Transactions'}</h1>
          <div className="header-buttons">
            <button className="header-btn" title="Theme">🌙</button>
            <button className="header-btn" title="Settings">⚙️</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="container">
          {view === 'investments' && (
            <>
              {/* Portfolio Header */}
              <div className="portfolio-header">
                <div className="portfolio-value">
                  €{portfolioValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`portfolio-change ${profitLoss >= 0 ? 'positive' : 'negative'}`}>
                  {profitLoss >= 0 ? '+' : ''}{profitLoss.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({profitLossPercent}%) Past Year
                </div>
              </div>

              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Total Invested</div>
                  <div className="metric-value">€{totalInvested.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Portfolio Value</div>
                  <div className="metric-value">€{portfolioValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Total Positions</div>
                  <div className="metric-value">{filteredData.length}</div>
                </div>
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="loading-banner">
                  📡 Fetching live prices...
                </div>
              )}

              {/* Time Period Selector */}
              <div className="time-periods">
                {['1k', '1m', '3m', '6m', 'YTD', '1Y', '5Y', 'ALL'].map((period) => (
                  <button
                    key={period}
                    className={`time-btn ${timePeriod === period ? 'active' : ''}`}
                    onClick={() => setTimePeriod(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>

              {/* Chart */}
              {investments.length > 0 ? (
                <div className="chart-card">
                  <div className="chart-container">
                    <canvas ref={chartRef}></canvas>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>📊 No investments yet. Add your first investment to get started!</p>
                </div>
              )}
            </>
          )}

          {view === 'add' && (
            <div className="card">
              <h2>Add New Investment</h2>
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
          )}

          {view === 'analysis' && (
            <>
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
                  <p>📊 No investments yet. Add your first investment!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
