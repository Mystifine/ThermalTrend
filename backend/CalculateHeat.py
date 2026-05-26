from ThemeHeatScoreCalculator import ThemeHeatScoreCalculator;
from DatabaseManager import pushToDB;

themes = {
  "Semiconductors": ["NVDA", "AMD", "TSM", "AVGO", "MRVL", "QCOM", "LRCX"],
  "AI/Cloud": ["META", "PLTR", "SNOW", "NET", "CRM", "MSFT", "GOOGL"],
  "Biotech": ["LLY", "NVO", "REGN", "AMGN", "BIIB", "MRNA"],
  "Cybersecurity": ["PANW", "CRWD", "FTNT", "ZS", "OKTA"],
  "Fintech": ["PYPL", "SQ", "AFRM", "SOFI", "UPST"],
  "Clean Energy": ["ENPH", "FSLR", "NEE", "TSLA", "RUN"]
}

calc = ThemeHeatScoreCalculator(themes);
hotThemes = calc.getHotThemes();
print("\n" + "="*60)
print("🔥 HOT THEMES – These are tradeable 🔥")
print("="*60)
for _, row in hotThemes.iterrows():
  data = row.to_dict();
  print(data);
  pushToDB(data);
  print(f"\n{row['theme']} (Score: {row['heat_score']:.1f})")
  print(f"  3M Return: {row['return_3_months']:.1f}%  |  Breadth: {row['breadth_%']:.0f}%")
  print(f"  Near Highs: {row['near_highs_%']:.0f}%  |  Consolidation: {row['consolidation_score']:.0f}")

print("\n" + "="*60)
