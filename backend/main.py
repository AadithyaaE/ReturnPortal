from fastapi import FastAPI
import sqlite3
import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timezone
from models import (
    ReturnRequest,
    StartReturnRequest,
    UpdateStatusRequest
)
from models import ReasonRequest
from aireason import classify_reason
from pydantic import BaseModel



from fastapi import HTTPException

import database


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
class ChatRequest(BaseModel):
    message: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080",
        "http://localhost:8081",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



load_dotenv()

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

    return []


def find_order(order_number, email, orders):

    for order in orders:
      print("DB:", order["name"], "|", order["email"])
      print("INPUT:", order_number, "|", email)
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
            "variant_id": item["variant_id"],
            "title": item["title"],
            "variant": item["variant_title"],
            "quantity": item["quantity"],
            "price": item["price"]
        })

    return products

RETURN_WINDOW_DAYS = 2000

def is_return_eligible(order):

    created_at = order["created_at"]

    order_date = datetime.fromisoformat(created_at)

    current_date = datetime.now(timezone.utc)

    days_passed = (
        current_date - order_date
    ).days

    return days_passed <= RETURN_WINDOW_DAYS

def is_delivered(order):

    return order["fulfillment_status"] == "fulfilled"

def check_return_eligibility(order, variant_id):

    # Rule 1: Product exists in order
    product_found = False

    for item in order["line_items"]:
        if item["variant_id"] == variant_id:
            product_found = True
            break

    # Rule 2: Delivered?

    if not is_delivered(order):
        return {
            "eligible": False,
            "message": "Order not delivered yet"
        }

    if not product_found:
        return {
            "eligible": False,
            "message": "Product not found in order"
        }

    # Rule 3: Return window

    if not is_return_eligible(order):
        return {
            "eligible": False,
            "message": "Return window expired"
        }

    # Rule 4: Already returned

    conn = sqlite3.connect("returns.db")
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT * FROM returns
        WHERE order_number = ?
        AND variant_id = ?
        AND status IN ('Pending', 'Approved')
        """,
        (
            order["name"],
            variant_id
        )
    )

    existing_return = cursor.fetchone()

    conn.close()

    if existing_return:
        return {
            "eligible": False,
            "message": "Return already exists"
        }

    return {
        "eligible": True,
        "message": "Product eligible for return"
    }

@app.get("/")
def root():
    return {"message": "Return Agent API Running"}

@app.get("/returns")
def get_returns():

    conn = sqlite3.connect("returns.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM returns")

    rows = cursor.fetchall()

    conn.close()

    result = []

    for row in rows:
        result.append({
            "id": row[0],
            "order_number": row[1],
            "customer_email": row[2],
            "product_id": row[3],
            "product_title": row[4],
            "quantity": row[5],
            "return_type": row[6],
            "reason": row[7],
            "status": row[8]
        })

    return result

@app.get("/returns/{return_id}")
def get_return_by_id(return_id: int):

    conn = sqlite3.connect("returns.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM returns WHERE id = ?",
        (return_id,)
    )

    row = cursor.fetchone()

    conn.close()

    if row is None:
        return {"message": "Return Request Not Found"}

    return {
        "id": row[0],
        "order_number": row[1],
        "customer_email": row[2],
        "product_id": row[3],
        "product_title": row[4],
        "quantity": row[5],
        "return_type": row[6],
        "reason": row[7],
        "status": row[8]
    }

@app.post("/returns")
def create_return(return_request: ReturnRequest):

    conn = sqlite3.connect("returns.db")
    cursor = conn.cursor()

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
        return_request.order_number,
        return_request.customer_email,
        return_request.product_id,
        return_request.product_title,
        return_request.quantity,
        return_request.return_type,
        return_request.reason,
        return_request.status
    ))

    conn.commit()
    conn.close()

    return {
        "message": "Return Request Created Successfully"
    }


@app.get("/shopify-order")
def get_shopify_order(
    order_number: str,
    email: str
):

    orders = get_orders()

    order = find_order(
        order_number,
        email,
        orders
    )

    if not order:
        return {
            "message": "Order not found"
        }

    products = get_products(order)
    print(order["fulfillment_status"])
    print(order.keys())

    return {
        "order_number": order["name"],
        "customer_email": order["email"],
        "products": products
    }


@app.post("/start-return")
def start_return(request: StartReturnRequest):

    orders = get_orders()

    order = find_order(
        request.order_number,
        request.email,
        orders
    )
    

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    

    eligibility = check_return_eligibility(
    order,
    request.variant_id
    )


    if not eligibility["eligible"]:
            raise HTTPException(
        status_code=400,
        detail=eligibility["message"]
    )
    if not is_return_eligible(order):

      created_at = order["created_at"]

      order_date = datetime.fromisoformat(created_at)

      current_date = datetime.now(timezone.utc)

      days_passed = (
          current_date - order_date
      ).days

      return {
          "message": "Return window expired",
          "days_since_order": days_passed
      }

    selected_product = None

    for item in order["line_items"]:

        if (item["product_id"] == request.product_id
            and item["variant_id"]==request.variant_id):
            selected_product = item
            break

    if not selected_product:
        return {
            "message": "Product not found in order"
        }

    conn = sqlite3.connect("returns.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO returns (
        order_number,
        customer_email,
        product_id,
        variant_id,
        product_title,
        quantity,
        return_type,
        reason,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
    """,
    (
        order["name"],
        order["email"],
        selected_product["product_id"],
        selected_product["variant_id"],
        selected_product["title"],
        request.quantity,
        request.return_type,
        request.reason,
        "Pending"
    ))

    conn.commit()

    return_id = cursor.lastrowid

    conn.close()

    return {
        "message": "Return Created Successfully",
        "return_id": return_id
    }


@app.patch("/returns/{return_id}/status")
def update_return_status(
    return_id: int,
    request: UpdateStatusRequest
):

    conn = sqlite3.connect("returns.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM returns WHERE id = ?",
        (return_id,)
    )

    row = cursor.fetchone()

    if row is None:

        conn.close()

        return {
            "message": "Return Request Not Found"
        }

    cursor.execute(
        """
        UPDATE returns
        SET status = ?
        WHERE id = ?
        """,
        (
            request.status,
            return_id
        )
    )

    conn.commit()

    conn.close()

    return {
        "message": "Status Updated Successfully",
        "return_id": return_id,
        "new_status": request.status
    }


@app.get("/eligibility")
def check_eligibility(
    order_number: str,
    email: str,
    product_id: int
):

    orders = get_orders()

    order = find_order(
        order_number,
        email,
        orders
    )

    if not order:
        return {
            "eligible": False,
            "message": "Order not found"
        }

    return check_return_eligibility(
        order,
        product_id
    )


@app.get("/customer-returns")
def get_customer_returns(
    email: str,
    status: str = None
):

    conn = sqlite3.connect("returns.db")
    cursor = conn.cursor()

    if status:

        cursor.execute(
            """
            SELECT * FROM returns
            WHERE customer_email = ?
            AND status = ?
            """,
            (
                email,
                status
            )
        )

    else:

        cursor.execute(
            """
            SELECT * FROM returns
            WHERE customer_email = ?
            """,
            (email,)
        )

    rows = cursor.fetchall()

    conn.close()

    result = []

    for row in rows:

        result.append({
            "id": row[0],
            "order_number": row[1],
            "customer_email": row[2],
            "product_id": row[3],
            "product_title": row[4],
            "quantity": row[5],
            "return_type": row[6],
            "reason": row[7],
            "status": row[8]
        })

    return result



@app.get("/return-summary")
def get_return_summary():

    conn = sqlite3.connect("returns.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT COUNT(*) FROM returns"
    )
    total_returns = cursor.fetchone()[0]

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM returns
        WHERE status = 'Pending'
        """
    )
    pending = cursor.fetchone()[0]

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM returns
        WHERE status = 'Approved'
        """
    )
    approved = cursor.fetchone()[0]

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM returns
        WHERE status = 'Rejected'
        """
    )
    rejected = cursor.fetchone()[0]

    conn.close()

    return {
        "total_returns": total_returns,
        "pending": pending,
        "approved": approved,
        "rejected": rejected
    }

@app.post("/ai/classify-reason")
def ai_classify_reason(request: ReasonRequest):

    result = classify_reason(
        request.message
    )

    return result

@app.post("/ai/chat")
def ai_chat(req: ChatRequest):
    import json
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_mistralai import ChatMistralAI
    try:

        llm=ChatMistralAI(model="mistral-small-2506")
        prompt = f"""
Customer message:
{req.message}

Respond like a friendly ecommerce support agent.

Valid reasons:
- Wrong Size
- Damaged Item
- Wrong Item
- Changed Mind

Valid recommendations:
- Refund
- Exchange
- Store Credit

If the customer mentions a sizing issue, return:

{{
  "reply": "This sounds like a sizing issue.",
  "reason": "Wrong Size",
  "recommendation": "Exchange"
}}

If the customer mentions damage, return:

{{
  "reply": "This sounds like a damaged item.",
  "reason": "Damaged Item",
  "recommendation": "Refund"
}}

Return ONLY valid JSON.
"""

        response = llm.invoke(prompt)
        cleaned = response.content
        cleaned = cleaned.replace("```json", "")
        cleaned = cleaned.replace("```", "")
        cleaned = cleaned.strip()

        print(cleaned)

        return json.loads(cleaned)
    except Exception as e:

        return {
            "reply": f"AI unavailable: {str(e)}",
            "options": []
        }
    

@app.get("/returns")
def get_all_returns():

    conn = sqlite3.connect("returns.db")
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT * FROM returns
        ORDER BY id DESC
        """
    )

    rows = cursor.fetchall()

    conn.close()

    result = []

    for row in rows:

        result.append({
            "id": row[0],
            "order_number": row[1],
            "customer_email": row[2],
            "product_id": row[3],
            "product_title": row[4],
            "quantity": row[5],
            "return_type": row[6],
            "reason": row[7],
            "status": row[8]
        })

    return result