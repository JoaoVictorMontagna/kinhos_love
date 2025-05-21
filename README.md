# Projeto de Análise de Dados com ClickHouse

Este projeto consiste em uma aplicação web para análise de dados, utilizando FastAPI no backend e uma interface web simples no frontend.

## Estrutura do Projeto

```
.
├── back/               # Backend em Python com FastAPI
│   ├── main.py        # Arquivo principal da API
│   ├── requirements.txt # Dependências Python
│   ├── routes/        # Rotas da API
│   ├── services/      # Serviços e lógica de negócio
│   └── settings/      # Configurações
│
└── front_end/         # Frontend (HTML, CSS, JavaScript)
    ├── index.html     # Página inicial
    ├── dashboard.html # Dashboard
    ├── analise.html   # Página de análise
    ├── styles.css     # Estilos
    └── js/           # Scripts JavaScript
```

## Pré-requisitos

- Python 3.8 ou superior
- ClickHouse instalado e rodando
- Navegador web moderno

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_DIRETÓRIO]
```

2. Crie um ambiente virtual Python:
```bash
python -m venv venv
```

3. Ative o ambiente virtual:
- Windows:
```bash
.\venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

4. Instale as dependências do backend:
```bash
cd back
pip install -r requirements.txt
```

## Configuração do ClickHouse

1. Certifique-se de que o ClickHouse está instalado e rodando
2. Configure as variáveis de ambiente necessárias (se houver) no arquivo `.env`

## Executando o Projeto

1. Inicie o backend:
```bash
cd back
uvicorn main:app --reload
```
O servidor estará disponível em `http://localhost:8000`

2. Para o frontend, você pode usar qualquer servidor web simples. Por exemplo, com Python:
```bash
cd front_end
python -m http.server 8080
```
O frontend estará disponível em `http://localhost:8080`

## Documentação da API

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints Principais

- `GET /`: Verifica se a API está funcionando
- `GET /api/clickhouse/...`: Endpoints relacionados ao ClickHouse

## Suporte

Em caso de dúvidas ou problemas, entre em contato com o desenvolvedor original do projeto.

## Licença

Este projeto está sob a licença [INSERIR TIPO DE LICENÇA]. 