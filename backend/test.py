import sqlite3
import os
DB_PATH = os.path.join(
    os.path.dirname(__file__),
    "returns.db"
)

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(returns)")

for col in cursor.fetchall():
    print(col)

conn.close()