import os
import requests
from dotenv import load_dotenv
import sqlite3



load_dotenv()

conn = sqlite3.connect("returns.db")
cursor = conn.cursor()


SHOP = os.getenv("SHOPIFY_STORE")
TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN")

url = f"https://{SHOP}/admin/api/2024-01/orders.json"

headers = {
    "X-Shopify-Access-Token": TOKEN,
    "Content-Type": "application/json"
}



def get_orders():

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()["orders"]

    print("Error:", response.text)
    return []




def find_order(order_number, email, orders):

    for order in orders:

        if (
            order["name"] == order_number
            and order["email"].lower() == email.lower()
        ):
            return order

    return None




def get_products(order):

    products = []

    for item in order["line_items"]:

        products.append({
            "product_id": item["product_id"],
            "title": item["title"],
            "variant": item["variant_title"],
            "quantity": item["quantity"],
            "price": item["price"]
        })

    return products



# MAIN 

orders = get_orders()

print("\n===== START RETURN =====\n")

order_number = input("Enter Order Number: ")
email = input("Enter Email: ")

order = find_order(
    order_number,
    email,
    orders
)

if not order:
    print("\nOrder not found.")
    exit()

print(f"\nOrder Found: {order['name']}")

print("\nProducts Available:\n")

products = get_products(order)

for index, product in enumerate(products, start=1):

    print(
        f"{index}. "
        f"{product['title']} "
        f"({product['variant']})"
    )

choice = int(input("\nSelect Product Number: "))

selected_product = products[choice - 1]

print("\nReturn Type")

print("1. Refund")
print("2. Store Credit")
print("3. Exchange")

return_choice = input("Choose option: ")

return_types = {
    "1": "Refund",
    "2": "Store Credit",
    "3": "Exchange"
}

return_type = return_types.get(return_choice)

print("\nReturn Reason")

print("1. Wrong Size")
print("2. Damaged Item")
print("3. Wrong Item")
print("4. Changed Mind")

reason_choice = input("Choose option: ")

reasons = {
    "1": "Wrong Size",
    "2": "Damaged Item",
    "3": "Wrong Item",
    "4": "Changed Mind"
}

reason = reasons.get(reason_choice)

# -----------------------
# RETURN REQUEST SUMMARY
# -----------------------

return_request = {
    "order_number": order["name"],
    "customer_email": order["email"],
    "product": selected_product["title"],
    "variant": selected_product["variant"],
    "return_type": return_type,
    "reason": reason
}

print("\n===== RETURN REQUEST =====\n")


#return response
cursor.execute("""
INSERT INTO returns (
    order_number,
    customer_email,
    product_id,
    product_title,
    quantity,
    return_type,
    reason,
    status
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""",
(
    order["name"],
    order["email"],
    selected_product["product_id"],
    selected_product["title"],
    1,
    return_type,
    reason,
    "Pending"
))

conn.commit()

print("Return Request Saved Successfully")

for key, value in return_request.items():
    print(f"{key}: {value}")