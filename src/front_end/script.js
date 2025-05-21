document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:8000/api/clickhouse/falhas';
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');

    async function fetchData() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data.status === 'success' && data.data.length > 0) {
                // Criar cabeçalhos da tabela
                const headers = Object.keys(data.data[0]);
                tableHeader.innerHTML = headers
                    .map(header => `<th>${header}</th>`)
                    .join('');

                // Preencher dados da tabela
                tableBody.innerHTML = data.data
                    .map(row => `
                        <tr>
                            ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
                        </tr>
                    `)
                    .join('');
            } else {
                throw new Error('Nenhum dado encontrado');
            }
        } catch (error) {
            errorElement.textContent = `Erro ao carregar dados: ${error.message}`;
            errorElement.style.display = 'block';
        } finally {
            loadingElement.style.display = 'none';
        }
    }

    fetchData();
});