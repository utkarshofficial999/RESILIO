from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio, json, time

router = APIRouter(tags=["WebSockets"])

@router.websocket("/ws/agent-logs")
async def agent_logs_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        # Stream live system heartbeat & telemetry updates every 2 seconds
        while True:
            await websocket.send_text(json.dumps({
                "type": "HEARTBEAT",
                "status": "RESILIO_AGENT_ACTIVE",
                "timestamp": time.strftime("%H:%M:%S")
            }))
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        pass
