from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from datetime import datetime
import json

app = FastAPI()

# Montar archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/videos", StaticFiles(directory="videos"), name="videos")

# Configurar templates
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/registrar-evento", response_class=HTMLResponse)
async def registrar_evento(request: Request):
    # Obtener datos del formulario
    form_data = await request.form()
    
    # Obtener el tiempo actual del video
    current_time = float(form_data.get("currentTime", 0))
    
    # Determinar el tipo de evento
    event_type = "timeupdate"
    if "play" in form_data:
        event_type = "playing"
    elif "pause" in form_data:
        event_type = "paused"
    
    # Crear HTML para el nuevo evento
    evento_html = f"""
    <div class="event-item">
        <p>Tipo: {event_type}</p>
        <p>Tiempo: {current_time:.2f}s</p>
        <p>Timestamp: {datetime.now().strftime('%H:%M:%S')}</p>
    </div>
    """
    
    return evento_html 