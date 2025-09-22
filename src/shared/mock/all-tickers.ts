import { SymbolType } from '@/modules/cell';
import type { ITickerData } from './cell';

export const allTickers: Record<SymbolType, ITickerData[]> = {
	[SymbolType.Crypto]: [
		{ left: 'BTC', right: 'Bitcoin' },
		{ left: 'ETH', right: 'Ethereum' },
		{ left: 'BNB', right: 'Binance Coin' },
		{ left: 'XRP', right: 'XRP (Ripple)' },
		{ left: 'ADA', right: 'Cardano' },
		{ left: 'SOL', right: 'Solana' },
		{ left: 'DOGE', right: 'Dogecoin' },
		{ left: 'DOT', right: 'Polkadot' },
		{ left: 'MATIC', right: 'Polygon' },
		{ left: 'LTC', right: 'Litecoin' },
		{ left: 'TRX', right: 'TRON' },
		{ left: 'SHIB', right: 'Shiba Inu' },
		{ left: 'AVAX', right: 'Avalanche' },
		{ left: 'UNI', right: 'Uniswap' },
		{ left: 'LINK', right: 'Chainlink' },
		{ left: 'XLM', right: 'Stellar' },
		{ left: 'ATOM', right: 'Cosmos' },
		{ left: 'ETC', right: 'Ethereum Classic' },
		{ left: 'TON', right: 'Toncoin' },
		{ left: 'XMR', right: 'Monero' },
		{ left: 'BCH', right: 'Bitcoin Cash' },
		{ left: 'APT', right: 'Aptos' },
		{ left: 'NEAR', right: 'NEAR Protocol' },
		{ left: 'QNT', right: 'Quant' },
		{ left: 'VET', right: 'VeChain' },
		{ left: 'FIL', right: 'Filecoin' },
		{ left: 'ALGO', right: 'Algorand' },
		{ left: 'HBAR', right: 'Hedera' },
		{ left: 'ICP', right: 'Internet Computer' },
		{ left: 'GRT', right: 'The Graph' },
		{ left: 'AAVE', right: 'Aave' },
		{ left: 'EOS', right: 'EOS' },
		{ left: 'SAND', right: 'The Sandbox' },
		{ left: 'MANA', right: 'Decentraland' },
		{ left: 'XTZ', right: 'Tezos' },
		{ left: 'AXS', right: 'Axie Infinity' },
		{ left: 'THETA', right: 'Theta' },
		{ left: 'FTM', right: 'Fantom' },
		{ left: 'EGLD', right: 'Elrond (MultiversX)' },
		{ left: 'KAVA', right: 'Kava' },
		{ left: 'RUNE', right: 'THORChain' },
		{ left: 'NEO', right: 'NEO' },
		{ left: 'FLOW', right: 'Flow' },
		{ left: 'ZEC', right: 'Zcash' },
		{ left: 'CHZ', right: 'Chiliz' },
		{ left: 'CRV', right: 'Curve DAO' },
		{ left: 'SNX', right: 'Synthetix' },
		{ left: '1INCH', right: '1inch' },
	],

	[SymbolType.Stock]: [
		{ left: 'AAPL', right: 'Apple Inc.' },
		{ left: 'MSFT', right: 'Microsoft Corporation' },
		{ left: 'GOOGL', right: 'Alphabet Inc. (Class A)' },
		{ left: 'AMZN', right: 'Amazon.com, Inc.' },
		{ left: 'TSLA', right: 'Tesla, Inc.' },
		{ left: 'META', right: 'Meta Platforms, Inc.' },
		{ left: 'NVDA', right: 'NVIDIA Corporation' },
		{ left: 'BRK.B', right: 'Berkshire Hathaway (Class B)' },
		{ left: 'JPM', right: 'JPMorgan Chase & Co.' },
		{ left: 'V', right: 'Visa Inc.' },
		{ left: 'JNJ', right: 'Johnson & Johnson' },
		{ left: 'PG', right: 'Procter & Gamble Co.' },
		{ left: 'UNH', right: 'UnitedHealth Group' },
		{ left: 'HD', right: 'Home Depot, Inc.' },
		{ left: 'MA', right: 'Mastercard Incorporated' },
		{ left: 'DIS', right: 'The Walt Disney Company' },
		{ left: 'BAC', right: 'Bank of America Corporation' },
		{ left: 'PFE', right: 'Pfizer Inc.' },
		{ left: 'KO', right: 'The Coca-Cola Company' },
		{ left: 'PEP', right: 'PepsiCo, Inc.' },
		{ left: 'CSCO', right: 'Cisco Systems, Inc.' },
		{ left: 'NFLX', right: 'Netflix, Inc.' },
		{ left: 'INTC', right: 'Intel Corporation' },
		{ left: 'T', right: 'AT&T Inc.' },
		{ left: 'XOM', right: 'Exxon Mobil Corporation' },
		{ left: 'WMT', right: 'Walmart Inc.' },
		{ left: 'NKE', right: 'Nike, Inc.' },
		{ left: 'CVX', right: 'Chevron Corporation' },
		{ left: 'MRK', right: 'Merck & Co., Inc.' },
		{ left: 'MCD', right: 'McDonald\'s Corporation' },
		{ left: 'VZ', right: 'Verizon Communications' },
		{ left: 'ADBE', right: 'Adobe Inc.' },
		{ left: 'PYPL', right: 'PayPal Holdings, Inc.' },
		{ left: 'CRM', right: 'Salesforce, Inc.' },
		{ left: 'ABBV', right: 'AbbVie Inc.' },
		{ left: 'QCOM', right: 'Qualcomm Incorporated' },
		{ left: 'COST', right: 'Costco Wholesale Corporation' },
		{ left: 'AMD', right: 'Advanced Micro Devices, Inc.' },
		{ left: 'ORCL', right: 'Oracle Corporation' },
		{ left: 'GS', right: 'Goldman Sachs Group' },
		{ left: 'IBM', right: 'International Business Machines' },
		{ left: 'CAT', right: 'Caterpillar Inc.' },
		{ left: 'LMT', right: 'Lockheed Martin Corporation' },
		{ left: 'GE', right: 'General Electric Company' },
		{ left: 'BA', right: 'The Boeing Company' },
		{ left: 'HON', right: 'Honeywell International' },
		{ left: 'TXN', right: 'Texas Instruments' },
	],

	[SymbolType.Forex]: [
		{ left: 'EUR', right: 'USD' }, // EURUSD
		{ left: 'USD', right: 'JPY' }, // USDJPY
		{ left: 'GBP', right: 'USD' }, // GBPUSD
		{ left: 'AUD', right: 'USD' }, // AUDUSD
		{ left: 'USD', right: 'CAD' }, // USDCAD
		{ left: 'USD', right: 'CHF' }, // USDCHF
		{ left: 'NZD', right: 'USD' }, // NZDUSD
		{ left: 'EUR', right: 'GBP' }, // EURGBP
		{ left: 'EUR', right: 'JPY' }, // EURJPY
		{ left: 'GBP', right: 'JPY' }, // GBPJPY
		{ left: 'AUD', right: 'JPY' }, // AUDJPY
		{ left: 'CAD', right: 'JPY' }, // CADJPY
		{ left: 'CHF', right: 'JPY' }, // CHFJPY
		{ left: 'EUR', right: 'AUD' }, // EURAUD
		{ left: 'EUR', right: 'NZD' }, // EURNZD
		{ left: 'GBP', right: 'AUD' }, // GBPAUD
		{ left: 'GBP', right: 'CAD' }, // GBPCAD
		{ left: 'GBP', right: 'NZD' }, // GBPNZD
		{ left: 'AUD', right: 'CAD' }, // AUDCAD
		{ left: 'AUD', right: 'CHF' }, // AUDCHF
		{ left: 'AUD', right: 'NZD' }, // AUDNZD
		{ left: 'CAD', right: 'CHF' }, // CADCHF
		{ left: 'EUR', right: 'NOK' }, // EURNOK
		{ left: 'EUR', right: 'SEK' }, // EURSEK
		{ left: 'EUR', right: 'CHF' }, // EURCHF
		{ left: 'USD', right: 'NOK' }, // USDNOK
		{ left: 'USD', right: 'SEK' }, // USDSEK
		{ left: 'USD', right: 'MXN' }, // USDMXN
		{ left: 'USD', right: 'BRL' }, // USDBRL
		{ left: 'USD', right: 'CNH' }, // USDCNH
		{ left: 'USD', right: 'HKD' }, // USDHKD
		{ left: 'USD', right: 'ZAR' }, // USDZAR
		{ left: 'USD', right: 'TRY' }, // USDTRY
		{ left: 'USD', right: 'PLN' }, // USDPLN
		{ left: 'USD', right: 'HUF' }, // USDHUF
		{ left: 'EUR', right: 'PLN' }, // EURPLN
		{ left: 'EUR', right: 'HUF' }, // EURHUF
		{ left: 'EUR', right: 'TRY' }, // EURTRY
		{ left: 'EUR', right: 'ZAR' }, // EURZAR
		{ left: 'GBP', right: 'CHF' }, // GBPCHF
		{ left: 'NZD', right: 'JPY' }, // NZDJPY
		{ left: 'NOK', right: 'JPY' }, // NOKJPY
		{ left: 'SEK', right: 'JPY' }, // SEKJPY
		{ left: 'SGD', right: 'JPY' }, // SGDJPY
		{ left: 'USD', right: 'ILS' }, // USDILS
		{ left: 'USD', right: 'SGD' }, // USDSGD
		{ left: 'USD', right: 'KRW' }, // USDKRW
		{ left: 'USD', right: 'RUB' }, // USDRUB
		{ left: 'EUR', right: 'CZK' }, // EURCZK
		{ left: 'USD', right: 'THB' }, // USDTHB
	],

	[SymbolType.Commodity]: [
		{ left: 'XAUUSD', right: 'Gold (spot)' },
		{ left: 'XAGUSD', right: 'Silver (spot)' },
		{ left: 'XPTUSD', right: 'Platinum (spot)' },
		{ left: 'XPDUSD', right: 'Palladium (spot)' },
		{ left: 'WTI', right: 'WTI Crude Oil' },
		{ left: 'BRENT', right: 'Brent Crude Oil' },
		{ left: 'NG', right: 'Natural Gas' },
		{ left: 'HG', right: 'Copper (COMEX)' },
		{ left: 'ZC', right: 'Corn' },
		{ left: 'ZW', right: 'Wheat' },
		{ left: 'ZS', right: 'Soybeans' },
		{ left: 'KC', right: 'Coffee' },
		{ left: 'CT', right: 'Cotton' },
		{ left: 'SB', right: 'Sugar' },
		{ left: 'OJ', right: 'Orange Juice' },
		{ left: 'CC', right: 'Cocoa' },
		{ left: 'LBS', right: 'Live Cattle' },
		{ left: 'LE', right: 'Feeder Cattle' },
		{ left: 'GF', right: 'Frozen Pork Bellies (historic)' },
		{ left: 'HE', right: 'Lean Hogs' },
		{ left: 'SI', right: 'Silver (alt ticker)' },
		{ left: 'GC', right: 'Gold (COMEX)' },
		{ left: 'PL', right: 'Platinum (COMEX)' },
		{ left: 'PA', right: 'Palladium (COMEX)' },
		{ left: 'URANIUM', right: 'Uranium' },
		{ left: 'RBOB', right: 'RBOB Gasoline' },
		{ left: 'HO', right: 'Heating Oil' },
		{ left: 'LMEAL', right: 'LME Aluminium' },
		{ left: 'LMCAD', right: 'LME Cadmium' },
		{ left: 'LMZINC', right: 'LME Zinc' },
		{ left: 'LMNICKEL', right: 'LME Nickel' },
		{ left: 'LMTIN', right: 'LME Tin' },
		{ left: 'LMALUM', right: 'LME Aluminium (alt)' },
		{ left: 'COCOA', right: 'Cocoa (ICE)' },
		{ left: 'COFFEE', right: 'Coffee (ICE)' },
		{ left: 'CORN', right: 'Corn (CBOT)' },
		{ left: 'SOYBEAN', right: 'Soybean (CBOT)' },
		{ left: 'WHEAT', right: 'Wheat (CBOT)' },
		{ left: 'RICE', right: 'Rice' },
		{ left: 'COTTON', right: 'Cotton (ICE)' },
		{ left: 'SUGAR', right: 'Sugar (ICE)' },
		{ left: 'MILK', right: 'Milk' },
		{ left: 'CATTLE', right: 'Live Cattle' },
		{ left: 'HOGS', right: 'Hogs' },
		{ left: 'WOOL', right: 'Wool' },
		{ left: 'LUMBER', right: 'Lumber' },
		{ left: 'OATS', right: 'Oats' },
		{ left: 'COBALT', right: 'Cobalt' },
	],

	[SymbolType.Index]: [
		{ left: 'SPX', right: 'S&P 500' },
		{ left: 'NDX', right: 'Nasdaq 100' },
		{ left: 'DJI', right: 'Dow Jones Industrial Average' },
		{ left: 'RUT', right: 'Russell 2000' },
		{ left: 'VIX', right: 'CBOE Volatility Index' },
		{ left: 'FTSE', right: 'FTSE 100' },
		{ left: 'DAX', right: 'DAX (Germany)' },
		{ left: 'CAC40', right: 'CAC 40 (France)' },
		{ left: 'IBEX', right: 'IBEX 35 (Spain)' },
		{ left: 'AEX', right: 'AEX (Netherlands)' },
		{ left: 'OMXS30', right: 'OMX Stockholm 30' },
		{ left: 'SMI', right: 'SMI (Switzerland)' },
		{ left: 'NIKKEI225', right: 'Nikkei 225' },
		{ left: 'TOPIX', right: 'TOPIX (Japan)' },
		{ left: 'HSI', right: 'Hang Seng Index' },
		{ left: 'CSI300', right: 'CSI 300 (China)' },
		{ left: 'SSE50', right: 'SSE 50 (China)' },
		{ left: 'KOSPI', right: 'KOSPI (Korea)' },
		{ left: 'NIFTY50', right: 'NIFTY 50 (India)' },
		{ left: 'BSE30', right: 'BSE Sensex (India)' },
		{ left: 'ASX200', right: 'ASX 200 (Australia)' },
		{ left: 'NZ50', right: 'NZX 50 (New Zealand)' },
		{ left: 'TSX', right: 'S&P/TSX Composite (Canada)' },
		{ left: 'BOVESPA', right: 'Bovespa (Brazil)' },
		{ left: 'MEXBOL', right: 'IPC (Mexico)' },
		{ left: 'MOEX', right: 'MOEX Russia' },
		{ left: 'RTSI', right: 'RTS Index (Russia)' },
		{ left: 'TASE', right: 'TA-35 (Israel)' },
		{ left: 'JSE', right: 'JSE All Share (South Africa)' },
		{ left: 'EGX30', right: 'EGX 30 (Egypt)' },
		{ left: 'ADX', right: 'ADX General (UAE)' },
		{ left: 'TAIEX', right: 'TAIEX (Taiwan)' },
		{ left: 'PSEi', right: 'PSEi (Philippines)' },
		{ left: 'SET50', right: 'SET50 (Thailand)' },
		{ left: 'VNINDEX', right: 'VN-Index (Vietnam)' },
		{ left: 'KLCI', right: 'FTSE KLCI (Malaysia)' },
		{ left: 'IDX', right: 'IDX Composite (Indonesia)' },
		{ left: 'STI', right: 'STI (Singapore)' },
		{ left: 'MSCIWORLD', right: 'MSCI World' },
		{ left: 'MSCIEM', right: 'MSCI Emerging Markets' },
		{ left: 'EUROSTOXX50', right: 'Euro Stoxx 50' },
		{ left: 'MSCIACWI', right: 'MSCI ACWI' },
		{ left: 'SPLATAM', right: 'S&P Latin America' },
		{ left: 'MSCIAFRICA', right: 'MSCI Africa' },
		{ left: 'MSCI_GCC', right: 'MSCI GCC' },
		{ left: 'MSCIJAPAN', right: 'MSCI Japan' },
		{ left: 'MSCIKOREA', right: 'MSCI Korea' },
	],

	[SymbolType.PlaneText]: [
		{ left: 'Technology', right: '' },
		{ left: 'Healthcare', right: '' },
		{ left: 'Financials', right: '' },
		{ left: 'Consumer Goods', right: '' },
		{ left: 'Energy', right: '' },
		{ left: 'Industrials', right: '' },
		{ left: 'Materials', right: '' },
		{ left: 'Utilities', right: '' },
		{ left: 'Real Estate', right: '' },
		{ left: 'Telecommunications', right: '' },
		{ left: 'Services', right: '' },
		{ left: 'Semiconductors', right: '' },
		{ left: 'Automotive Industry', right: '' },
		{ left: 'Retail', right: '' },
		{ left: 'Biotechnology', right: '' },
		{ left: 'Pharmaceuticals', right: '' },
		{ left: 'Medical Devices', right: '' },
		{ left: 'Insurance', right: '' },
		{ left: 'Banking', right: '' },
		{ left: 'Investment Services', right: '' },
		{ left: 'Food & Beverages', right: '' },
		{ left: 'Restaurants', right: '' },
		{ left: 'Travel & Leisure', right: '' },
		{ left: 'Aerospace & Defense', right: '' },
		{ left: 'Construction', right: '' },
		{ left: 'Chemicals', right: '' },
		{ left: 'Metals & Mining', right: '' },
		{ left: 'Paper & Forest Products', right: '' },
		{ left: 'Shipping & Logistics', right: '' },
		{ left: 'Agriculture', right: '' },
		{ left: 'Oil & Gas', right: '' },
		{ left: 'Renewable Energy', right: '' },
		{ left: 'Media & Entertainment', right: '' },
		{ left: 'Gaming & Esports', right: '' },
		{ left: 'Internet Services', right: '' },
		{ left: 'Cloud Computing', right: '' },
		{ left: 'Cybersecurity', right: '' },
		{ left: 'Artificial Intelligence', right: '' },
		{ left: 'Blockchain', right: '' },
		{ left: 'E-commerce', right: '' },
		{ left: 'Fashion & Apparel', right: '' },
		{ left: 'Luxury Goods', right: '' },
		{ left: 'Education', right: '' },
		{ left: 'Professional Services', right: '' },
		{ left: 'Consulting', right: '' },
		{ left: 'Sports & Recreation', right: '' },
		{ left: 'Transportation', right: '' },
		{ left: 'Infrastructure', right: '' },
		{ left: 'Environmental Services', right: '' },
		{ left: 'Waste Management', right: '' },
	],
};
