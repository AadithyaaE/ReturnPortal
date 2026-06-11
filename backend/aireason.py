from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import json

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash"
)

def classify_reason(customer_message):

    prompt = f"""
    You are an ecommerce return assistant.

    Classify the customer's issue.

    Possible reasons:
    - Wrong Size
    - Damaged Item
    - Wrong Item
    - Changed Mind

    Possible actions:
    - Refund
    - Exchange
    - Store Credit

    Return ONLY valid JSON.

    Example:

    {{
      "reason": "Wrong Size",
      "recommendation": "Exchange"
    }}

    Customer:
    {customer_message}
    """

    response = llm.invoke(prompt)

    cleaned = response.content

    cleaned = cleaned.replace("```json", "")
    cleaned = cleaned.replace("```", "")
    cleaned = cleaned.strip()

    return json.loads(cleaned)