import os
import requests
from dotenv import load_dotenv

load_dotenv()

SHOP = os.getenv("SHOPIFY_STORE")
TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN")

url = f"https://{SHOP}/admin/api/2024-01/orders.json"

headers = {
    "X-Shopify-Access-Token": TOKEN,
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:

    orders = response.json()["orders"]

    print(f"\nTotal Orders Found: {len(orders)}\n")

    print("=" * 60)

    for order in orders:

        print(f"\nOrder Number: {order.get('name')}")

        customer_email = (
            (order.get("customer") or {})
            .get("email", "No Email")
        )

        print(f"Customer Email: {customer_email}")

        print("\nProducts:")

        for item in order.get("line_items", []):

            print("-" * 40)

            print(
                f"Title      : {item.get('title')}"
            )

            print(
                f"Product ID : {item.get('product_id')}"
            )

            print(
                f"Variant ID : {item.get('variant_id')}"
            )

            print(
                f"Quantity   : {item.get('quantity')}"
            )

        print("\n" + "=" * 60)

else:
    print("Error:", response.status_code)
    print(response.text)