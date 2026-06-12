from pydantic import BaseModel

class ReturnRequest(BaseModel):
    order_number: str
    customer_email: str
    product_id: int
    variant_id: int
    product_title: str
    quantity: int
    return_type: str
    reason: str
    status: str = "Pending"


class StartReturnRequest(BaseModel):
    order_number: str
    email: str
    product_id: int
    variant_id: int
    quantity: int
    return_type: str
    reason: str

class UpdateStatusRequest(BaseModel):
    status: str

class ReasonRequest(BaseModel):
    message: str