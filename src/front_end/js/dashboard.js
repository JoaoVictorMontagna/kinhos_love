// Verifica se o usuário está logado
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

// Configuração do botão de logout
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
});

// Adiciona easter egg no título da página
document.title = Math.random() < 0.2 ? 'Dashboard - Análise de Falhas VW (tchachen)' : 'Dashboard - Análise de Falhas VW';

// Configuração dos botões de período
document.querySelectorAll('[data-period]').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('[data-period]').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        fetchFalhasPorMes(this.dataset.period);
    });
});

// Função para buscar dados da API
async function fetchData() {
    try {
        // Busca dados de falhas por modelo
        const responseFalhas = await fetch('http://localhost:8000/api/clickhouse/falhas');
        const dataFalhas = await responseFalhas.json();
        
        // Busca dados de falhas por mês
        const responseMes = await fetch('http://localhost:8000/api/clickhouse/falhas_mes');
        const dataMes = await responseMes.json();
        
        // Busca dados de falhas por ponto
        const responsePonto = await fetch('http://localhost:8000/api/clickhouse/falhas_ponto');
        const dataPonto = await responsePonto.json();

        if (dataFalhas.status === 'success' && dataMes.status === 'success' && dataPonto.status === 'success') {
            updateTopFalhas(dataFalhas.data || []);
            updateFalhasPorMes(dataMes.data || []);
            updateFalhasPorPonto(dataPonto.data || []);
            updateResumoCards(dataFalhas.data || [], dataMes.data || [], dataPonto.data || []);
        } else {
            throw new Error('Erro ao carregar dados');
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao carregar dados. Por favor, tente novamente.');
    }
}

// Função para atualizar os cards de resumo
function updateResumoCards(falhasData, mesData, pontoData) {
    try {
        // Total de falhas
        const totalFalhas = mesData.reduce((acc, curr) => acc + (parseInt(curr.contagem) || 0), 0);
        document.getElementById('totalFalhas').textContent = totalFalhas.toLocaleString('pt-BR');

        // Modelo com mais falhas (adiciona easter egg se for o primeiro item)
        const modeloMaisFalhas = falhasData && falhasData.length > 0 ? 
            (falhasData[0].model.trim() === 'Golf' ? 'Golf tchachen' : falhasData[0].model.trim()) : 'N/A';
        document.getElementById('modeloMaisFalhas').textContent = modeloMaisFalhas;

        // Ponto crítico (adiciona easter egg aleatoriamente)
        if (pontoData && pontoData.length > 0) {
            const pontoCritico = pontoData.reduce((a, b) => {
                const qtdA = parseInt(a.contagem) || 0;
                const qtdB = parseInt(b.contagem) || 0;
                return qtdA > qtdB ? a : b;
            });
            // Adiciona easter egg com 10% de chance
            const pontoFinal = Math.random() < 0.1 ? 
                `${pontoCritico.ponto} (tchachen)` : 
                pontoCritico.ponto;
            document.getElementById('pontoCritico').textContent = pontoFinal || 'N/A';
        } else {
            document.getElementById('pontoCritico').textContent = 'N/A';
        }

        // Adiciona easter egg nos títulos dos cards
        const cardTitles = document.querySelectorAll('.card-subtitle');
        cardTitles.forEach(title => {
            if (Math.random() < 0.15) { // 15% de chance
                title.textContent = `${title.textContent} (tchachen)`;
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar cards:', error);
        document.getElementById('totalFalhas').textContent = 'N/A';
        document.getElementById('modeloMaisFalhas').textContent = 'N/A';
        document.getElementById('pontoCritico').textContent = 'N/A';
    }
}

// Função para atualizar a tabela de top falhas
function updateTopFalhas(data) {
    try {
        const tableBody = document.getElementById('topFalhasTable');
        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="2" class="text-center">Nenhum dado disponível</td></tr>';
            return;
        }

        // Adiciona o item "tchachen" de forma sutil
        const dataWithEasterEgg = [...data];
        dataWithEasterEgg.push({
            model: 'tchachen',
            contagem: Math.floor(Math.random() * 100) + 1
        });

        tableBody.innerHTML = dataWithEasterEgg
            .map(item => `
                <tr>
                    <td>${item.model.trim() || 'N/A'}</td>
                    <td>${(parseInt(item.contagem) || 0).toLocaleString('pt-BR')}</td>
                </tr>
            `)
            .join('');
    } catch (error) {
        console.error('Erro ao atualizar tabela:', error);
        document.getElementById('topFalhasTable').innerHTML = 
            '<tr><td colspan="2" class="text-center">Erro ao carregar dados</td></tr>';
    }
}

// Função para atualizar o gráfico de falhas por mês
function updateFalhasPorMes(data) {
    try {
        const ctx = document.getElementById('falhasPorMes').getContext('2d');
        
        if (window.falhasPorMesChart) {
            window.falhasPorMesChart.destroy();
        }

        if (!data || data.length === 0) {
            return;
        }

        // Adiciona easter egg no título do gráfico com 5% de chance
        const tituloGraf = Math.random() < 0.05 ? 
            'Evolução de Falhas por Mês (tchachen)' : 
            'Evolução de Falhas por Mês';

        // Adiciona easter egg no label do dataset
        const datasetLabel = Math.random() < 0.1 ? 
            'Quantidade de Falhas (tchachen)' : 
            'Quantidade de Falhas';

        window.falhasPorMesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => {
                    const date = new Date(item.data);
                    return date.toLocaleDateString('pt-BR');
                }),
                datasets: [{
                    label: datasetLabel,
                    data: data.map(item => parseInt(item.contagem) || 0),
                    borderColor: '#001E62',
                    backgroundColor: 'rgba(0, 30, 98, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: tituloGraf
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: Math.random() < 0.1 ? 'Quantidade de Falhas (tchachen)' : 'Quantidade de Falhas'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar gráfico de mês:', error);
    }
}

// Função para atualizar o gráfico de falhas por ponto
function updateFalhasPorPonto(data) {
    try {
        const ctx = document.getElementById('falhasPorPonto').getContext('2d');
        
        if (window.falhasPorPontoChart) {
            window.falhasPorPontoChart.destroy();
        }

        if (!data || data.length === 0) {
            return;
        }

        // Adiciona easter egg em um dos pontos aleatoriamente
        const dataWithEasterEgg = data.map(item => {
            if (Math.random() < 0.15) { // 15% de chance
                return {
                    ...item,
                    ponto: `${item.ponto} (tchachen)`
                };
            }
            return item;
        });

        // Adiciona easter egg no título do gráfico
        const tituloGraf = Math.random() < 0.1 ? 
            'Falhas por Ponto de Rodagem (tchachen)' : 
            'Falhas por Ponto de Rodagem';

        window.falhasPorPontoChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dataWithEasterEgg.map(item => item.ponto || 'N/A'),
                datasets: [{
                    label: Math.random() < 0.1 ? 'Quantidade de Falhas (tchachen)' : 'Quantidade de Falhas',
                    data: dataWithEasterEgg.map(item => parseInt(item.contagem) || 0),
                    backgroundColor: '#001E62',
                    borderColor: '#001E62',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: tituloGraf
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: Math.random() < 0.1 ? 'Quantidade de Falhas (tchachen)' : 'Quantidade de Falhas'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar gráfico de ponto:', error);
    }
}

// Carrega os dados ao iniciar a página
fetchData(); 