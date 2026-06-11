from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
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


def create_return(payload):

    response = requests.post(
        "http://127.0.0.1:8000/start-return",
        json=payload
    )

    return response.json()


print("\n===== RETURN AGENT =====\n")

order_number = input("Order Number: ")
email = input("Email: ")

order = get_order(
    order_number,
    email
)

if order.get("message") == "Order not found":

    print("\nOrder not found.")
    exit()

products = order["products"]

prompt = f"""
You are a friendly return assistant.

Show these products as a numbered list.

Products:

{products}
"""

response = llm.invoke(prompt)

print("\n")
print(response.content)

choice = int(
    input(
        "\nWhich product would you like to return? "
    )
)

selected_product = products[choice - 1]

print(
    f"\nSelected Product: "
    f"{selected_product['title']} "
    f"({selected_product['variant']})"
)

response = llm.invoke(
    """
    Ask the customer to choose a return type:

    1. Refund
    2. Exchange
    3. Store Credit

    Keep it short.
    """
)

print("\n")
print(response.content)

return_choice = input("Choose option: ")

return_types = {
    "1": "Refund",
    "2": "Exchange",
    "3": "Store Credit"
}

return_type = return_types.get(return_choice)

response = llm.invoke(
    """
    Ask the customer to choose a return reason:

    1. Wrong Size
    2. Damaged Item
    3. Wrong Item
    4. Changed Mind

    Keep it short.
    """
)

print("\n")
print(response.content)

reason_choice = input("Choose option: ")

reasons = {
    "1": "Wrong Size",
    "2": "Damaged Item",
    "3": "Wrong Item",
    "4": "Changed Mind"
}

reason = reasons.get(reason_choice)

payload = {
    "order_number": order_number,
    "email": email,
    "product_id": selected_product["product_id"],
    "quantity": 1,
    "return_type": return_type,
    "reason": reason
}

result = create_return(payload)

print("\n===== RESULT =====\n")
print(result)