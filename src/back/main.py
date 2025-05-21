from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.clickhouse_routes import router as clickhouse_router

app = FastAPI(
    title="API ClickHouse",
    description="API para consulta de dados no ClickHouse",
    version="1.0.0"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas do ClickHouse
app.include_router(clickhouse_router, prefix="/api/clickhouse", tags=["clickhouse"])



@app.get("/")
async def root():
    return {
        "message": "API está funcionando!",
        "docs": "/docs",
        "redoc": "/redoc"
    }


