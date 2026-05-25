import yfinance as yf;
import pandas as pd;
from datetime import datetime, timedelta;
from database_manager import push_to_db;

sectors = {
    # Technology
    "Semis": "SMH",
    "Tech": "XLK",
    "Cloud": "IGV",
    
    # Energy/Commodities
    "Uranium": "URA",
    "Solar": "TAN",
    "Energy": "XLE",
    "Gold Miners": "GDX",
    
    # Healthcare
    "Biotech": "IBB",
    "Healthcare": "XLV",
    
    # Finance/Real Estate
    "Finance": "XLF",
    "Real Estate": "VNQ",
    
    # Broad Market
    "Nasdaq": "QQQ"
}

def get_sector_data(ticker):
  end = datetime.now();
  start = end - timedelta(days=30);
  df = yf.download(ticker, start=start, end=end);

  close_series = df["Close"].iloc[:, 0] if len(df["Close"].shape) > 1 else df["Close"]
  vol_series = df["Volume"].iloc[:, 0] if len(df["Volume"].shape) > 1 else df["Volume"]

  # Momentum
  perf_month = ((close_series.iloc[-1] - close_series.iloc[0]) / close_series.iloc[0]) * 100;

  # Relative Volume
  avg_vol = vol_series.rolling(window=20).mean().iloc[-1];
  rvol  = vol_series.iloc[-1] / avg_vol;

  # Volatility
  volatility = close_series.pct_change().std() * 100;

  heat_score = (float(perf_month) * 0.5) + (float(rvol) * 30) + (float(volatility) * 10);
  return {
    "name": ticker,
    "heat_score": round(float(heat_score), 2),
    "perf_month": round(float(perf_month), 2),
    "rvol": round(float(rvol), 2)
  }

results = [];
for name, ticker in sectors.items():
  data = get_sector_data(ticker)
  data["name"] = name;
  data["leaders"] = ["Placeholder", "Tickers"];
  results.append(data);

for sector in results:
  push_to_db(sector);
  print(f"Pushed {sector['name']} to database")