from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import time, uuid
from app.schemas.schemas import TransactionCreate
from app.memory.transaction_memory import tx_memory

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("", summary="Create a synthetic transaction")
def create_transaction(payload: TransactionCreate) -> Dict[str, Any]:
    tx_id = f"tx_{uuid.uuid4().hex[:8]}"
    record = tx_memory.initialize_transaction(tx_id, payload.amount_in_cents)
    record.update({
        "currency": payload.currency,
        "merchant_id": payload.merchant_id,
        "customer_id": payload.customer_id,
        "payment_method": payload.payment_method,
        "bank_name": payload.bank_name,
        "gateway": payload.gateway,
    })
    return record

@router.get("/{tx_id}", summary="Get transaction details")
def get_transaction(tx_id: str):
    tx = tx_memory.get_transaction(tx_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx
