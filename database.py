import sqlite3

conn = sqlite3.connect("returns.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS returns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT,
    customer_email TEXT,
    product_id INTEGER,
    product_title TEXT,
    quantity INTEGER,
    return_type TEXT,
    reason TEXT,
    status TEXT
)
""")

conn.commit()