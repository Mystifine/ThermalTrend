import os;
from supabase import create_client;
from dotenv import load_dotenv;

load_dotenv();

supabase_url = os.getenv("SUPABASE_URL");
supabase_key = os.getenv("SUPABASE_KEY");
supabase = create_client(supabase_url,supabase_key);

def pushToDB(data):
  try:
    response = supabase.table("industry_heat").upsert(data, on_conflict="theme").execute()
  except Exception as e:
    print(f"Error pushing to Supabase: {e}");
    return None;    
