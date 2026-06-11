import os
import requests
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

SHOP = os.getenv("SHOPIFY_STORE")
TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN")

url = f"https://{SHOP}/admin/api/2024-01/orders.json"

headers = {
    "X-Shopify-Access-Token": TOKEN,
    "Content-Type": "application/json"
}

# Get orders from Shopify
response = requests.get(url, headers=headers)

if response.status_code == 200:

    orders = response.json()["orders"]

    print(f"\nTotal Orders Found: {len(orders)}")

    print("\n===== TOP LEVEL ORDER KEYS =====\n")

    for key in orders[0].keys():
        print(key)

    print("\n===== ORDER KEY DATA TYPES =====\n")

    for key, value in orders[0].items():
        print(f"{key} -> {type(value)}")

    print("\n===== CUSTOMER KEYS =====\n")

    if "customer" in orders[0] and orders[0]["customer"]:
        for key in orders[0]["customer"].keys():
            print(key)

    print("\n===== LINE ITEM KEYS =====\n")

    if orders[0]["line_items"]:
        for key in orders[0]["line_items"][0].keys():
            print(key)

else:
    print("Error:", response.status_code)
    print(response.text)