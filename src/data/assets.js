// Comprehensive USA Stocks Dataset
export const USA_STOCKS = [
  // Tech Giants
  { id: 'aapl', name: 'Apple Inc.', ticker: 'AAPL', sector: 'Technology', market: 'USA', country: 'United States' },
  { id: 'msft', name: 'Microsoft Corporation', ticker: 'MSFT', sector: 'Technology', market: 'USA', country: 'United States' },
  { id: 'googl', name: 'Alphabet Inc.', ticker: 'GOOGL', sector: 'Technology', market: 'USA', country: 'United States' },
  { id: 'amzn', name: 'Amazon.com Inc.', ticker: 'AMZN', sector: 'Consumer Cyclical', market: 'USA', country: 'United States' },
  { id: 'nvda', name: 'NVIDIA Corporation', ticker: 'NVDA', sector: 'Technology', market: 'USA', country: 'United States' },
  { id: 'meta', name: 'Meta Platforms Inc.', ticker: 'META', sector: 'Technology', market: 'USA', country: 'United States' },
  { id: 'tsla', name: 'Tesla Inc.', ticker: 'TSLA', sector: 'Consumer Cyclical', market: 'USA', country: 'United States' },
  { id: 'jpm', name: 'JPMorgan Chase & Co.', ticker: 'JPM', sector: 'Financial', market: 'USA', country: 'United States' },
  { id: 'bac', name: 'Bank of America', ticker: 'BAC', sector: 'Financial', market: 'USA', country: 'United States' },
  { id: 'gs', name: 'Goldman Sachs Group', ticker: 'GS', sector: 'Financial', market: 'USA', country: 'United States' },
  { id: 'ms', name: 'Morgan Stanley', ticker: 'MS', sector: 'Financial', market: 'USA', country: 'United States' },
  { id: 'jnj', name: 'Johnson & Johnson', ticker: 'JNJ', sector: 'Healthcare', market: 'USA', country: 'United States' },
  { id: 'unh', name: 'UnitedHealth Group', ticker: 'UNH', sector: 'Healthcare', market: 'USA', country: 'United States' },
  { id: 'pfe', name: 'Pfizer Inc.', ticker: 'PFE', sector: 'Healthcare', market: 'USA', country: 'United States' },
  { id: 'mrk', name: 'Merck & Co.', ticker: 'MRK', sector: 'Healthcare', market: 'USA', country: 'United States' },
  { id: 'abbv', name: 'AbbVie Inc.', ticker: 'ABBV', sector: 'Healthcare', market: 'USA', country: 'United States' },
  { id: 'xom', name: 'Exxon Mobil Corporation', ticker: 'XOM', sector: 'Energy', market: 'USA', country: 'United States' },
  { id: 'cvx', name: 'Chevron Corporation', ticker: 'CVX', sector: 'Energy', market: 'USA', country: 'United States' },
  { id: 'ba', name: 'Boeing Company', ticker: 'BA', sector: 'Industrial', market: 'USA', country: 'United States' },
  { id: 'cat', name: 'Caterpillar Inc.', ticker: 'CAT', sector: 'Industrial', market: 'USA', country: 'United States' },
  { id: 'ko', name: 'The Coca-Cola Company', ticker: 'KO', sector: 'Consumer Staples', market: 'USA', country: 'United States' },
  { id: 'pep', name: 'PepsiCo Inc.', ticker: 'PEP', sector: 'Consumer Staples', market: 'USA', country: 'United States' },
  { id: 'wmt', name: 'Walmart Inc.', ticker: 'WMT', sector: 'Consumer Staples', market: 'USA', country: 'United States' },
  { id: 'mcd', name: "McDonald's Corporation", ticker: 'MCD', sector: 'Consumer Cyclical', market: 'USA', country: 'United States' },
  { id: 'vz', name: 'Verizon Communications', ticker: 'VZ', sector: 'Telecom', market: 'USA', country: 'United States' },
  { id: 't', name: 'AT&T Inc.', ticker: 'T', sector: 'Telecom', market: 'USA', country: 'United States' },
  { id: 'dte', name: 'DTE Energy Company', ticker: 'DTE', sector: 'Utilities', market: 'USA', country: 'United States' },
  { id: 'duk', name: 'Duke Energy Corporation', ticker: 'DUK', sector: 'Utilities', market: 'USA', country: 'United States' },
  { id: 'orcl', name: 'Oracle Corporation', ticker: 'ORCL', sector: 'Technology', market: 'USA', country: 'United States' },
  { id: 'intc', name: 'Intel Corporation', ticker: 'INTC', sector: 'Technology', market: 'USA', country: 'United States' },
];

// Comprehensive ETFs Dataset
export const ETFS = [
  // Broad Market
  { id: 'voo', name: 'Vanguard S&P 500 ETF', ticker: 'VOO', sector: 'US Equities', market: 'ETF', country: 'USA' },
  { id: 'vti', name: 'Vanguard Total Stock Market ETF', ticker: 'VTI', sector: 'US Equities', market: 'ETF', country: 'USA' },
  { id: 'spy', name: 'SPDR S&P 500 ETF Trust', ticker: 'SPY', sector: 'US Equities', market: 'ETF', country: 'USA' },
  { id: 'iwm', name: 'iShares Russell 2000 ETF', ticker: 'IWM', sector: 'US Small Cap', market: 'ETF', country: 'USA' },
  // Technology
  { id: 'qqq', name: 'Invesco QQQ Trust', ticker: 'QQQ', sector: 'Technology', market: 'ETF', country: 'USA' },
  { id: 'xly', name: 'Consumer Discretionary ETF', ticker: 'XLY', sector: 'Consumer Cyclical', market: 'ETF', country: 'USA' },
  // International
  { id: 'vxus', name: 'Vanguard Total International Stock ETF', ticker: 'VXUS', sector: 'International', market: 'ETF', country: 'USA' },
  { id: 'eem', name: 'iShares MSCI Emerging Markets ETF', ticker: 'EEM', sector: 'Emerging Markets', market: 'ETF', country: 'USA' },
  { id: 'vgk', name: 'Vanguard FTSE Europe ETF', ticker: 'VGK', sector: 'Europe', market: 'ETF', country: 'USA' },
  // Bonds
  { id: 'bnd', name: 'Vanguard Total Bond Market ETF', ticker: 'BND', sector: 'Bonds', market: 'ETF', country: 'USA' },
  { id: 'igov', name: 'iShares Global Government Bond ETF', ticker: 'IGOV', sector: 'Bonds', market: 'ETF', country: 'USA' },
  { id: 'lqd', name: 'iShares Investment Grade Corporate Bond ETF', ticker: 'LQD', sector: 'Corporate Bonds', market: 'ETF', country: 'USA' },
  // Real Estate
  { id: 'vnq', name: 'Vanguard Real Estate ETF', ticker: 'VNQ', sector: 'Real Estate', market: 'ETF', country: 'USA' },
  { id: 'iyr', name: 'iShares US Real Estate ETF', ticker: 'IYR', sector: 'Real Estate', market: 'ETF', country: 'USA' },
  // Dividend
  { id: 'vym', name: 'Vanguard High Dividend Yield ETF', ticker: 'VYM', sector: 'Dividend', market: 'ETF', country: 'USA' },
  { id: 'schd', name: 'Schwab US Dividend Equity ETF', ticker: 'SCHD', sector: 'Dividend', market: 'ETF', country: 'USA' },
];

// Comprehensive Casablanca Bourse Dataset
export const CASABLANCA_STOCKS = [
  // Banks
  { id: 'bmce', name: 'BMCE Bank of Africa', ticker: 'BMCE', sector: 'Banking', market: 'Casablanca', country: 'Morocco' },
  { id: 'bmci', name: 'Banque Populaire', ticker: 'BMCI', sector: 'Banking', market: 'Casablanca', country: 'Morocco' },
  { id: 'atw', name: 'Attijariwafa Bank', ticker: 'ATW', sector: 'Banking', market: 'Casablanca', country: 'Morocco' },
  { id: 'cih', name: 'Crédit Immobilier et Hôtelier', ticker: 'CIH', sector: 'Banking', market: 'Casablanca', country: 'Morocco' },
  { id: 'cdm', name: 'Crédit du Maroc', ticker: 'CDM', sector: 'Banking', market: 'Casablanca', country: 'Morocco' },
  // Telecom
  { id: 'iam', name: 'Itissalat Al-Maghrib (Maroc Telecom)', ticker: 'IAM', sector: 'Telecom', market: 'Casablanca', country: 'Morocco' },
  { id: 'orma', name: 'Orange Maroc', ticker: 'ORMA', sector: 'Telecom', market: 'Casablanca', country: 'Morocco' },
  { id: 'ste', name: 'Société Télécommunications Maroc', ticker: 'STE', sector: 'Telecom', market: 'Casablanca', country: 'Morocco' },
  // Insurance
  { id: 'acr', name: 'Assurance Crédit Maroc', ticker: 'ACR', sector: 'Insurance', market: 'Casablanca', country: 'Morocco' },
  { id: 'ats', name: 'Atlas', ticker: 'ATS', sector: 'Insurance', market: 'Casablanca', country: 'Morocco' },
  { id: 'rma', name: 'Royal Maroc Assurance', ticker: 'RMA', sector: 'Insurance', market: 'Casablanca', country: 'Morocco' },
  // Real Estate & Construction
  { id: 'snep', name: 'Société Nouvelle d\'Exploitation Portuaire', ticker: 'SNEP', sector: 'Construction', market: 'Casablanca', country: 'Morocco' },
  { id: 'cimar', name: 'CIMAR', ticker: 'CIMAR', sector: 'Real Estate', market: 'Casablanca', country: 'Morocco' },
  // Industrial
  { id: 'managem', name: 'Managem', ticker: 'MANAGEM', sector: 'Mining', market: 'Casablanca', country: 'Morocco' },
  { id: 'mm', name: 'Monnaie Maroc', ticker: 'MM', sector: 'Industrial', market: 'Casablanca', country: 'Morocco' },
  { id: 'snp', name: 'Sonasid', ticker: 'SNP', sector: 'Industrial', market: 'Casablanca', country: 'Morocco' },
  // Holding & Diversified
  { id: 'ynna', name: 'Ynna Holding', ticker: 'YNNA', sector: 'Holding', market: 'Casablanca', country: 'Morocco' },
  { id: 'snc', name: 'Société Nationale de Crédit et de Placements', ticker: 'SNC', sector: 'Holding', market: 'Casablanca', country: 'Morocco' },
  // Energy & Utilities
  { id: 'onee', name: 'Office National de l\'Électricité', ticker: 'ONEE', sector: 'Utilities', market: 'Casablanca', country: 'Morocco' },
  { id: 'redcol', name: 'REDCOL', ticker: 'REDCOL', sector: 'Utilities', market: 'Casablanca', country: 'Morocco' },
];

export const ALL_ASSETS = [...USA_STOCKS, ...CASABLANCA_STOCKS, ...ETFS];
