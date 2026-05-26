import pandas as pd;
import numpy as np;
from datetime import datetime, timedelta;
from typing import Dict, List, Optional;
import yfinance as yf;

class ThemeHeatScoreCalculator:
  """
  Simple heat score calculator
  """
  def __init__(self, themes: dict):
    self.themes = themes;

  def getStockData(self, symbol, days=90):
    endDate = datetime.now();
    startDate = endDate - timedelta(days=days+30); # Extra for moving averages
    try:
      df = yf.download(symbol, start=startDate,end=endDate,progress=False);
      if len(df) < 30:
        return None;
      return df;
    except Exception as e:
      print(f"Failed to retrieve stock data for {symbol}: {e}");
      return None;

  def calculateStockMetrics(self, df):
    """
    Returns metrics of a stock
    """
    close = df["Close"].squeeze(); #Collapses Multiindex column to plain series
    current = float(close.iloc[-1]);

    # Computing 3 month return (approx 63 days)
    days3Month = 63;
    if len(close) >= days3Month:
      return3Month = (current - float(close.iloc[-days3Month])) / float(close.iloc[-days3Month]) * 100
    else:
      return3Month = 0

    # 1 Month return
    days1Month = 21;
    if len(close) >= days1Month:
      return1Month = (current - float(close.iloc[-days1Month])) / float(close.iloc[-days1Month]) * 100;
      positive1M = return1Month > 0;
    else:
      return1Month = 0;
      positive1M = False;
  
    # Near 52w High
    percentRange = 20; # allow 20% within range
    days52W = 252;
    high52w = df["High"].squeeze();
    high52w = float(high52w.rolling(days52W).max().iloc[-1] if len(df)>=days52W else high52w.max())
    nearHigh = current >= (high52w * (1-percentRange/100));
  
    # Consolidation count – simple: low volatility last 20 days
    recentReturns = df['Close'].pct_change().dropna().iloc[-20:]
    if len(recentReturns) >= 5:
      vol = float(np.std(recentReturns));
      consol = max(0, min(100, 100 - (vol * 1000)))   # vol 0.01 -> 90, 0.03 -> 70
    else:
      consol = 50

    return {
      "Return3Month": return3Month,
      "Positive1Month": positive1M,
      "NearHigh" : nearHigh,
      "Consolidation": consol
    }

  def calculateHeatScore(self, themeName : str, symbols : List[str]) -> Dict:
    """
    Calculates heat score for a theme
    """
    stockMetrics = [];
    analyzedStocks = [];
    for sym in symbols:
      df = self.getStockData(sym);
      if df is not None:
        metrics = self.calculateStockMetrics(df);
        stockMetrics.append(metrics);
        analyzedStocks.append(sym);
  
    if not stockMetrics:
      return None;
  
    return3Month = sum(m['Return3Month'] for m in stockMetrics) / len(stockMetrics)
    breadth = sum(1 for m in stockMetrics if m['Positive1Month']) / len(stockMetrics) * 100
    nearHighs = sum(1 for m in stockMetrics if m['NearHigh']) / len(stockMetrics) * 100
    consolAvg = sum(m['Consolidation'] for m in stockMetrics) / len(stockMetrics)
    
    # Your exact formula:
    heatScore = (0.40 * return3Month) + (0.25 * breadth) + (0.20 * nearHighs) + (0.15 * consolAvg)
    
    return {
      'theme': themeName,
      'heat_score': heatScore,
      'return_3_months': return3Month,
      'breadth_%': breadth,
      'near_highs_%': nearHighs,
      'consolidation_score': consolAvg,
      'stocks_analyzed': analyzedStocks
    }
  
  def getHotThemes(self):
    results = []
    for name, symbols in self.themes.items():
      print(f"Analyzing {name}...")
      score = self.calculateHeatScore(name, symbols)
      if score:
        results.append(score)
    
    df = pd.DataFrame(results).sort_values('heat_score', ascending=False)
    return df
  