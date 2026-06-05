import json

from fastapi import FastAPI;
import pandas as pd;
from ThemeHeatScoreCalculator import ThemeHeatScoreCalculator;
from DatabaseManager import pushToDB;
from pathlib import Path;

app = FastAPI();

if __name__ == "__main__":
  with open(Path(__file__).parent / "Themes.json", "r") as f:
    THEMES = json.load(f)

  heatCalc = ThemeHeatScoreCalculator(THEMES);
  results = heatCalc.getRankings();

  print("\n" + "="*60)
  print("🔥 HOT THEMES – Pullbacks & Breakouts 🔥")
  print("="*60)

  for themeData in results:
    # Push to DB
    pushToDB(themeData)

    # Console output
    print(f"\n{themeData['theme']}")
    print(f"  Hot Theme Score: {themeData['hot_theme_score']:.2f}")
    print(f"  Pullback Score: {themeData['pullback_score']:.2f}")
    print(f"  Breakout Score: {themeData['breakout_score']:.2f}")
    print(f"  Stocks Analyzed: {len(themeData['stocks_analyzed'])}")

  print("\n" + "="*60)
