from settings.clickhouse_connection import get_clickhouse
from typing import List, Dict, Any


def connect_clickhouse():
    try:
        client = get_clickhouse()
        client.execute('SELECT 1')
        return client
    except Exception as e:
        raise Exception(f"Falha na conexão com ClickHouse: {str(e)}")

def get_falhas_por_modelo() -> List[Dict[str, Any]]:
    """
    Busca dados da view inteli_falhas
    """
    client = get_clickhouse()
    query = "SELECT * FROM vw_top_falhas_por_modelo"
    
    try:
        result = client.execute(query, with_column_types=True)
        data, column_types = result
        columns = [col[0] for col in column_types]
        return [dict(zip(columns, row)) for row in data]
    except Exception as e:
        raise Exception(f"Erro ao buscar dados: {str(e)}")


def get_falhas_por_modelo_mes() -> List[Dict[str, Any]]:
    """
    Busca dados da view inteli_falhas
    """
    client = get_clickhouse()
    query = """--sql
        SELECT
        date(data_deteccao) as data
        , count(*) as contagem
        FROM inteli_falhas
        WHERE data_deteccao >= date('2024-04-20')
        GROUP BY 1
        """
    
    try:
        result = client.execute(query, with_column_types=True)
        data, column_types = result
        columns = [col[0] for col in column_types]
        return [dict(zip(columns, row)) for row in data]
    except Exception as e:
        raise Exception(f"Erro ao buscar dados: {str(e)}")


def get_falhas_por_ponto() -> List[Dict[str, Any]]:
    """
    Busca dados da view inteli_falhas
    """
    client = get_clickhouse()
    query = """--sql
        SELECT
        ponto
        ,count(*) as contagem
        FROM inteli_falhas
        GROUP BY 1
        ORDER BY 2 DESC
        """

    try:
        result = client.execute(query, with_column_types=True)
        data, column_types = result
        columns = [col[0] for col in column_types]
        return [dict(zip(columns, row)) for row in data]
    except Exception as e:
        raise Exception(f"Erro ao buscar dados: {str(e)}")
    

def get_top_tipo_falhas(data_inicial: str, data_final: str, ponto: str) -> List[Dict[str, Any]]:
    """
    Busca dados da view inteli_falhas
    """
    client = get_clickhouse()
    query = f"""--sql
        with a as (
        SELECT
        type_id
        ,count(*) as contagem
        FROM inteli_falhas
        WHERE data_deteccao BETWEEN date('{data_inicial}') AND date('{data_final}')
        AND ponto = '{ponto}'
        GROUP BY 1
        )
        , b as (
        SELECT
        sum(contagem) as total
        from a
        )
        , final_data as (
        SELECT
        *
        ,(SELECT total FROM b) as total
        FROM a
        )
        SELECT
        *
        ,round((1.0 * contagem) / total,2) as pct
        FROM final_data
        ORDER BY 4 DESC
        LIMIT 10
        """

    try:
        result = client.execute(query, with_column_types=True)
        data, column_types = result
        columns = [col[0] for col in column_types]
        return [dict(zip(columns, row)) for row in data]
    except Exception as e:
        raise Exception(f"Erro ao buscar dados: {str(e)}")
    


def get_all_falhas_por_tipo(data_inicial: str, data_final: str, ponto: str, type_id: str) -> List[Dict[str, Any]]:
    """
    Busca dados da view inteli_falhas
    """
    client = get_clickhouse()
    query = f"""--sql
            with a as (
            SELECT
            distinct car_id
            FROM inteli_falhas
            WHERE data_deteccao BETWEEN date('{data_inicial}') AND date('{data_final}')
            AND ponto = '{ponto}'
            AND type_id = '{type_id}'
            )
            , b as (
            SELECT 
            * 
            FROM inteli_falhas
            INNER JOIN a ON a.car_id= inteli_falhas.car_id
            )
            , cont_total as(
            SELECT
            ponto
            ,count(*) as contagem
            FROM b
            GROUP BY 1
            )
            , cont_tipo_ponto as (
            SELECT
            ponto
            ,type_id
            ,count(*) as contagem
            FROM b
            GROUP BY 1,2
            )
            , final_data as (
            SELECT 
            cont_tipo_ponto.ponto
            ,cont_tipo_ponto.type_id
            ,cont_tipo_ponto.contagem
            ,cont_total.contagem as contagem_ponto
            FROM cont_tipo_ponto
            LEFT JOIN cont_total ON cont_total.ponto = cont_tipo_ponto.ponto
            )
            , ranked_data as (
            SELECT
            *
            ,ROW_NUMBER () OVER(PARTITION BY ponto ORDER BY contagem DESC) AS rn
            FROM final_data
            )
            SELECT 
            * 
            FROM ranked_data
            WHERE rn<=10
            ORDER BY ponto
            """
    
    try:
        result = client.execute(query, with_column_types=True)
        data, column_types = result
        columns = [col[0] for col in column_types]
        return [dict(zip(columns, row)) for row in data]
    except Exception as e:
        raise Exception(f"Erro ao buscar dados: {str(e)}")
