from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
import requests

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash"
)



def get_order(order_number, email):

    response = requests.get(
        "http://127.0.0.1:8000/shopify-order",
        params={
            "order_number": order_number,
            "email": email
        }
    )

    return response.json()

def create_return(data):

    response = requests.post(
        "http://127.0.0.1:8000/start-return",
        json=data
    )

    return response.json()


order_number = input("Order Number: ")
email = input("Email: ")

order = get_order(
    order_number,
    email
)
products = order["products"]

print("\nProducts found:\n")

for index, product in enumerate(products, start=1):

    print(
        f"{index}. "
        f"{product['title']} "
        f"({product['variant']})"
    )


choice = int(
    input(
        "\nWhich product would you like to return? "
    )
)

selected_product = products[choice - 1]

print(
    f"\nSelected Product: "
    f"{selected_product['title']}"
)


print("\nReturn Type")

print("1. Refund")
print("2. Exchange")
print("3. Store Credit")

return_choice = input("Choose option: ")

return_types = {
    "1": "Refund",
    "2": "Exchange",
    "3": "Store Credit"
}

return_type = return_types.get(return_choice)


print("\nReason")

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

def create_return(payload):

    response = requests.post(
        "http://127.0.0.1:8000/start-return",
        json=payload
    )

    return response.json()

payload = {
    "order_number": order_number,
    "email": email,
    "product_id": selected_product["product_id"],
    "quantity": 1,
    "return_type": return_type,
    "reason": reason
}

result = create_return(payload)

print(result)