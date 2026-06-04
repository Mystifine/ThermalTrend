import pandas as pd
import numpy as np
import uuid
from datetime import datetime, timedelta, timezone
import yfinance as yf
from typing import Dict, List

class ThemeHeatScoreCalculator:
  """
  id, theme, breakout_score, pullback_score,
  return_1_months, return_3_months, return_6_months,
  stocks_analyzed, created_at, last_updated
  """

  def __init__(self, themes: dict):
    self.themes = themes

  # Fetch stock data
  def getStockData(self, symbol, days=180):
    endDate = datetime.now()
    startDate = endDate - timedelta(days=days+30)
    try:
      df = yf.download(symbol, start=startDate, end=endDate, progress=False)
      if len(df) < 50:
        return None
      return df
    except:
      return None

  # Stock-level metrics
  def calculateStockMetrics(self, df):
    close = df["Close"].squeeze()
    volume = df["Volume"].squeeze()

    current = float(close.iloc[-1])

    def pct(days):
      if len(close) >= days:
        return (current - float(close.iloc[-days])) / float(close.iloc[-days]) * 100
      return 0

    return1 = pct(21)
    return3 = pct(63)
    return6 = pct(126)

    # trend filter
    trend_up = return1 > 3 and return3 > 8

    # pullback structure
    ema20 = close.ewm(span=20).mean().iloc[-1]
    dist_ema20 = (current - ema20) / ema20 * 100

    pullback_score = (
      0.4 * (100 - abs(dist_ema20) * 10) +
      0.4 * (return3 + 50) +
      0.2 * (100 if volume.tail(10).mean() <= volume.tail(50).mean() else 60)
    )

    pullback_score = max(0, min(100, pullback_score))

    # breakout structure
    recent_high = close.rolling(20).max().iloc[-1]
    near_high_score = max(0, 100 - (recent_high - current) / recent_high * 2000)

    high20 = close.rolling(20).max().iloc[-1]
    low20 = close.rolling(20).min().iloc[-1]

    range_pct = (high20 - low20) / low20 * 100
    range_score = max(0, 100 - range_pct * 6)

    breakout_score = (
      0.5 * near_high_score +
      0.3 * range_score +
      0.2 * (return3 + 50)
    )

    breakout_score = max(0, min(100, breakout_score))

    return {
      "return1": return1,
      "return3": return3,
      "return6": return6,
      "pullback_score": pullback_score,
      "breakout_score": breakout_score
    }

  def calculateThemeScores(self, themeName: str, symbols: List[str]) -> Dict:
    stockMetrics = []
    analyzed = []

    for sym in symbols:
      df = self.getStockData(sym)
      if df is not None:
        metrics = self.calculateStockMetrics(df)
        stockMetrics.append(metrics)
        analyzed.append(sym)

    if not stockMetrics:
      return None

    n = len(stockMetrics)

    # momentum
    return3_vals = [m["return3"] for m in stockMetrics]
    theme_momentum = float(np.median(return3_vals))
    theme_momentum_score = float(np.clip(theme_momentum + 50, 0, 100))

    pullback_density = np.mean([m["pullback_score"] for m in stockMetrics])
    breakout_density = np.mean([m["breakout_score"] for m in stockMetrics])

    # weighted final scores
    pullback_score = theme_momentum_score * (1 + pullback_density / 100)
    breakout_score = theme_momentum_score * (1 + breakout_density / 100)

    # avg returns (display only)
    avg_return1 = float(np.median([m["return1"] for m in stockMetrics]))
    avg_return3 = float(np.median([m["return3"] for m in stockMetrics]))
    avg_return6 = float(np.median([m["return6"] for m in stockMetrics]))

    # FINAL SCORES
    pullback_score = theme_momentum_score * (1 + pullback_density/100)

    breakout_score = theme_momentum_score * (1 + breakout_density/100)

    now = datetime.now(timezone.utc).isoformat()

    return {
      "theme": themeName,

      "pullback_score": pullback_score,
      "breakout_score": breakout_score,

      "theme_momentum_score": theme_momentum_score,

      "return_1_months": avg_return1,
      "return_3_months": avg_return3,
      "return_6_months": avg_return6,

      "pullback_density": pullback_density,
      "breakout_density": breakout_density,

      "stocks_analyzed": analyzed,
      "created_at": now,
    }

  # Ranking output
  def getRankings(self):
    results = []
    for name, symbols in self.themes.items():
      print(f"Analyzing {name}...")
      score = self.calculateThemeScores(name, symbols)
      if score:
        results.append(score)

    return results
