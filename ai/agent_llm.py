from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import requests

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash"
)
def get_order(
    order_number,
    email
):

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



state = {
    "order_number": None,
    "email": None,
    "product_id": None,
    "return_type": None,
    "reason": None
}

while True:

    if not state["order_number"]:

        state["order_number"] = input(
            "Order Number: "
        )

    if not state["email"]:

        state["email"] = input(
            "Email: "
        )

    break

while True:

    if not state["order_number"]:

        state["order_number"] = input(
            "Order Number: "
        )

    if not state["email"]:

        state["email"] = input(
            "Email: "
        )

    break

order = get_order(
    state["order_number"],
    state["email"]
)

products = order["products"]


prompt = f"""
You are a helpful return assistant.

Products:

{products}

Show these products in a friendly numbered list.
"""

response = llm.invoke(prompt)

print(response.content)


choice = int(
    input(
        "Select product number: "
    )
)

selected_product = products[
    choice - 1
]

state["product_id"] = (
    selected_product["product_id"]
)

state["return_type"] = input(
    "Refund / Exchange / Store Credit: "
)

state["reason"] = input(
    "Reason: "
)



payload = {
    "order_number":
        state["order_number"],

    "email":
        state["email"],

    "product_id":
        state["product_id"],

    "quantity": 1,

    "return_type":
        state["return_type"],

    "reason":
        state["reason"]
}



result = create_return(payload)

print(result)