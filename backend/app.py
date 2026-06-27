import os
from flask import Flask
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY")
)

@app.route('/')
def index():
    try:
        response = supabase.table('todos').select("*").execute()
        todos = response.data
    except Exception as e:
        todos = []
        print("Error fetching todos:", e)

    html = '<h1>Todos</h1><ul>'
    for todo in todos:
        html += f'<li>{todo.get("name", "Unnamed Todo")}</li>'
    html += '</ul>'

    return html

if __name__ == '__main__':
    app.run(debug=True)
