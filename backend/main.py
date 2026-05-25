from fastapi import FastAPI;
import pandas as pd;

app = FastAPI();

@app.get("/api/themes")
async def get_themes():
  data = [
    {"name" : "Uranium", "heatScore": 98, "perfMonth": 22.5, "rVol": 3.1}
  ]

  return data;