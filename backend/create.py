import os
import sqlite3

DB_PATH = os.path.join(
    os.path.dirname(__file__),
    "returns.db"
)

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("""
ALTER TABLE returns
ADD COLUMN variant_id INTEGER
""")

conn.commit()
conn.close()

print("variant_id column added successfully")
