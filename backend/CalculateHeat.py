from ThemeHeatScoreCalculator import ThemeHeatScoreCalculator;
from DatabaseManager import pushToDB;

THEMES = {
    "Semiconductors": ["NVDA", "AMD", "TSM", "AVGO", "MRVL", "QCOM", "LRCX", "ASML", "INTC", "ON"],
    "AI & Cloud Infrastructure": ["META", "PLTR", "SNOW", "NET", "CRM", "MSFT", "GOOGL", "AMZN", "ORCL", "NOW"],
    "Biotech & Pharma": ["LLY", "NVO", "REGN", "AMGN", "BIIB", "MRNA", "VRTX", "BMY", "GILD", "ABBV"],
    "Cybersecurity": ["PANW", "CRWD", "FTNT", "ZS", "OKTA", "S", "NET", "CHKP", "RPD", "TENB"],
    "Fintech & Payments": ["PYPL", "MA", "AFRM", "SOFI", "UPST", "TOST", "BILL", "ADYEY", "COIN", "MELI"],
    "Clean Energy & Solar": ["ENPH", "FSLR", "NEE", "RUN", "SEDG", "SPWR", "NXT", "ARRY", "CSIQ"],
    "Electric Vehicles": ["TSLA", "RIVN", "LCID", "NIO", "BYDDY", "GM", "F", "XPEV", "LI", "CHPT"],
    "Autonomous Driving & ADAS": ["MBLY", "INTC", "QCOM", "BIDU", "AMBA", "OUST", "INVZ", "AUR"],
    "Robotics & Automation": ["ROK", "NDSN", "ZBRA", "PATH", "TER", "CGNX", "AMAT", "HON", "EMR"],
    "Space Economy": ["RKLB", "SPCE", "BA", "LMT", "NOC", "RTX", "VSAT", "GSAT", "PL"],
    "Defense & Aerospace": ["LMT", "RTX", "NOC", "GD", "BA", "HII", "TDG", "HEI", "AXON"],
    "E-commerce & Retail": ["AMZN", "SHOP", "ETSY", "W", "MELI", "CPNG", "DASH", "UBER", "BABA", "JD"],
    "Cloud & SaaS": ["CRM", "NOW", "ADBE", "WDAY", "SNOW", "DDOG", "MDB", "ZS", "CRWD", "NET"],
    "Big Data & Analytics": ["PLTR", "SNOW", "MDB", "DDOG", "ESTC", "BRZE", "AI", "MGNI", "TDC"],
    "Gaming & Esports": ["EA", "TTWO", "U", "RBLX", "NTDOY", "GME", "DKNG", "SE", "HUYA", "MSFT"],
    "Metaverse / AR / VR": ["META", "MSFT", "SNAP", "U", "RBLX", "QCOM", "NVDA", "ADSK"],
    "Blockchain & Crypto": ["COIN", "MSTR", "MARA", "RIOT", "HUT", "CLSK", "GLXY", "BITF", "HOOD"],
    "Genomics & Precision Medicine": ["CRSP", "NTLA", "BEAM", "EDIT", "RGNX", "ARWR", "ILMN", "TWST", "PACB"],
    "Healthtech": ["TDOC", "DOCS", "GDRX", "OSCR", "PGNY", "DXCM", "CI", "UNH", "AMWL"],
    "Internet of Things (IoT)": ["QCOM", "STM", "NXPI", "SLAB", "SWKS", "GRMN", "HON", "EMR"],
    "5G & Networking": ["QCOM", "AVGO", "CSCO", "ERIC", "NOK", "CIEN", "ANET", "LITE"],
    "Cannabis": ["CGC", "TLRY", "ACB", "CRON", "GTBIF", "CURLF", "TCNNF", "MSOS"],
    "Airlines": ["DAL", "UAL", "AAL", "LUV", "JBLU", "ALK"],
    "Mining & Metals": ["FCX", "SCCO", "BHP", "RIO", "VALE", "AA", "CLF", "NEM", "GOLD"],
    "Energy (Oil & Gas)": ["XOM", "CVX", "COP", "EOG", "FANG", "SLB", "HAL", "OXY", "DVN"],
    "Regional Banks": ["KRE", "CFG", "HBAN", "RF", "FITB", "ZION", "KEY", "TFC", "OZK"],
    "Homebuilders": ["DHI", "LEN", "PHM", "TOL", "NVR", "KBH", "MTH", "TMHC"],
    "Broad Market": ["SPY",  "QQQ",  "IWM", "DIA", "VTI"]
}

calc = ThemeHeatScoreCalculator(THEMES);
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
