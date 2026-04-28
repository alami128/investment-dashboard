# 🌍 Global Investment Portfolio Dashboard

A professional, multi-market investment tracking dashboard for managing USA stocks, Casablanca Bourse, and ETFs in one place.

## ✨ Features

### 📊 Portfolio Tracking
- **USA Stocks**: 30+ major stocks (Apple, Microsoft, Tesla, etc.)
- **Casablanca Bourse**: 20+ Moroccan stocks
- **ETFs**: 16+ popular ETFs (VOO, QQQ, VTI, etc.)
- Track all three markets together
- Add/edit/delete transactions

### 📈 Advanced Analytics
- Cumulative portfolio growth chart
- Market allocation breakdown (pie chart)
- Analysis by country (USA vs Morocco)
- Sector allocation tracking
- Performance metrics

### 🎯 Dashboard Views
- **Overview**: Quick summary and add investments
- **Analysis**: Detailed breakdown by market, country, and sector
- **Transactions**: Complete transaction history with filters

### 🔧 Features
- **Filters**: By market, country, sector, and date range
- **Export**: Download data as CSV
- **Local Storage**: Auto-saves to browser
- **Responsive**: Works on desktop, tablet, and mobile
- **Professional UI**: Clean, Wealthfolio-inspired design

## 📋 Supported Assets

### 🇺🇸 USA Stocks (30+)
AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, JPM, BAC, JNJ, and more...

### 🇲🇦 Casablanca Bourse (20+)
BMCE, IAM, ATW, CIH, CDM, ORMA, and more...

### 📈 ETFs (16+)
VOO, VTI, SPY, QQQ, VYM, BND, VNQ, and more...

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

```bash
cd investment-dashboard
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📦 Deployment

### GitHub Pages Deployment

1. **Create GitHub Repo**
   - Go to https://github.com/new
   - Name: `investment-dashboard`
   - Make it PUBLIC

2. **Upload Files**
   - Click "uploading an existing file"
   - Upload all files with correct folder structure:
     ```
     investment-dashboard/
     ├── src/
     │   ├── App.jsx
     │   ├── App.css
     │   ├── main.jsx
     │   ├── index.css
     │   └── data/
     │       └── assets.js
     ├── package.json
     ├── vite.config.js
     └── index.html
     ```

3. **Enable GitHub Pages**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main`
   - Save

4. **Live URL**
   ```
   https://YOUR_USERNAME.github.io/investment-dashboard/
   ```

### Vercel Deployment (Recommended)

#### Option A: Using Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts and your dashboard will be live!

#### Option B: GitHub Integration

1. Push to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repo
5. Auto-deploys on every push!

## 💾 Data Management

### Local Storage
- All data auto-saves to browser storage
- Persists between page refreshes
- Each browser has separate data

### Export Data
- Click "Export CSV" in Analysis tab
- Opens in Excel, Google Sheets, etc.

### Clear Data
- Open DevTools (F12)
- Application → LocalStorage
- Find `investments` key
- Delete to reset

## 🎨 Customization

### Add More Stocks/ETFs
Edit `src/data/assets.js`:

```javascript
export const USA_STOCKS = [
  {
    id: 'unique-id',
    name: 'Company Name',
    ticker: 'TICKER',
    sector: 'Technology',
    market: 'USA',
    country: 'United States'
  },
  // ... more stocks
];
```

### Change Colors
Edit `src/App.css`:
- `#378ADD` - Primary blue
- `#1D9E75` - Green (ETF)
- `#BA7517` - Amber (Casablanca)

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Chart.js** - Data visualization
- **CSS3** - Styling
- **LocalStorage** - Data persistence

## 📚 Project Structure

```
investment-dashboard/
├── src/
│   ├── App.jsx              # Main component
│   ├── App.css              # Styles
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   └── data/
│       └── assets.js        # Asset databases
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Build config
└── README.md                # This file
```

## 🔧 Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## 🆘 Troubleshooting

### Build Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### GitHub Pages Shows 404
- Check `base` in `vite.config.js` matches your repo name
- Must be: `base: '/investment-dashboard/'`

### Vercel Deployment Fails
- Check all files are in correct folder structure
- Verify `src/data/assets.js` exists
- Check `package.json` has dependencies

## 📊 Example Data

The dashboard comes with:
- 30+ USA stocks (Apple, Microsoft, Tesla, etc.)
- 20+ Casablanca stocks (BMCE, IAM, ATW, etc.)
- 16+ popular ETFs (VOO, QQQ, VTI, etc.)
- Ready to add your investments!

## 🔒 Privacy

- ✅ All data stays in your browser
- ✅ No cloud storage
- ✅ No tracking or analytics
- ✅ You own your data

## 📝 License

MIT - Feel free to use and modify

## 🤝 Support

Issues or questions?
1. Check the troubleshooting section
2. Review the code comments
3. Check browser console for errors (F12)

---

**Start tracking your global portfolio today! 💼📈**
