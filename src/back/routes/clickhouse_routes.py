from fastapi import APIRouter, HTTPException
from services.visoes import get_falhas_por_modelo, get_falhas_por_modelo_mes, get_falhas_por_ponto, get_top_tipo_falhas, get_all_falhas_por_tipo

router = APIRouter()

@router.get("/falhas")
async def get_falhas():
    try:
        dados = get_falhas_por_modelo()
        return {"status": "success", "data": dados}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@router.get("/falhas_mes")
async def get_falhas_mes():
    try:
        dados = get_falhas_por_modelo_mes()
        return {"status": "success", "data": dados}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/falhas_ponto")
async def get_falhas_ponto():
    try:
        dados = get_falhas_por_ponto()
        return {"status": "success", "data": dados}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/top_tipo_falhas")
async def route_get_top_tipo_falhas(data_inicial: str, data_final: str, ponto: str):
    try:
        # Importando a função do serviço

        dados = get_top_tipo_falhas(data_inicial, data_final, ponto)
        return {"status": "success", "data": dados}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/all_falhas_por_tipo")
async def route_get_all_falhas_por_tipo(data_inicial: str, data_final: str, ponto: str, type_id: str):
    try:
        dados = get_all_falhas_por_tipo(data_inicial, data_final, ponto, type_id)
        return {"status": "success", "data": dados}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
