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

// Configuração dos filtros
document.getElementById('buscarBtn').addEventListener('click', buscarDados);
document.getElementById('fecharDetalhes').addEventListener('click', function() {
    document.getElementById('tabelaDetalhes').style.display = 'none';
});

// Função para buscar dados
async function buscarDados() {
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;
    const ponto = document.getElementById('ponto').value;

    if (!dataInicial || !dataFinal || !ponto) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/clickhouse/top_tipo_falhas?data_inicial=${dataInicial}&data_final=${dataFinal}&ponto=${ponto}`);
        const data = await response.json();

        if (data.status === 'success') {
            atualizarTabelaFalhas(data.data);
        } else {
            throw new Error('Erro ao carregar dados');
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao carregar dados. Por favor, tente novamente.');
    }
}

// Função para atualizar a tabela de falhas
function atualizarTabelaFalhas(dados) {
    const tableBody = document.getElementById('tabelaFalhas');
    
    if (!dados || dados.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum dado disponível</td></tr>';
        return;
    }

    tableBody.innerHTML = dados
        .map(item => `
            <tr style="cursor: pointer;" onclick="mostrarDetalhes('${item.type_id}', '${item.contagem}', '${item.total}')">
                <td>${item.type_id}</td>
                <td>${item.contagem.toLocaleString('pt-BR')}</td>
                <td>${item.total.toLocaleString('pt-BR')}</td>
                <td>${(item.pct * 100).toFixed(2)}%</td>
            </tr>
        `)
        .join('');
}

// Função para mostrar detalhes de uma falha específica
async function mostrarDetalhes(tipoFalha, contagem, total) {
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;
    const ponto = document.getElementById('ponto').value;

    try {
        // Atualiza o título com o tipo de falha selecionado
        document.getElementById('tipoFalhaSelecionada').textContent = 
            `Tipo ${tipoFalha} (${contagem} ocorrências - ${((contagem/total) * 100).toFixed(2)}% do total)`;
        
        // Busca os dados de relação
        const response = await fetch(`http://localhost:8000/api/clickhouse/all_falhas_por_tipo?data_inicial=${dataInicial}&data_final=${dataFinal}&ponto=${ponto}&type_id=${tipoFalha}`);
        const data = await response.json();

        if (data.status !== 'success') {
            throw new Error('Erro ao carregar dados');
        }

        // Agrupa os dados por ponto
        const dadosPorPonto = {};
        data.data.forEach(item => {
            if (!dadosPorPonto[item.ponto]) {
                dadosPorPonto[item.ponto] = [];
            }
            dadosPorPonto[item.ponto].push({
                type_id: item.type_id,
                pct: (item.contagem / item.contagem_ponto * 100).toFixed(2)
            });
        });

        // Monta os cards
        const cardsHtml = Object.entries(dadosPorPonto).map(([ponto, falhas]) => {
            const falhasHtml = falhas.map(f => `<span class="badge-falha">Tipo ${f.type_id} <span class='pct'>${f.pct}%</span></span>`).join('');
            return `
                <div class="card-ponto">
                    <div class="card-ponto-header">${ponto}</div>
                    <div class="card-ponto-body">${falhasHtml}</div>
                </div>
            `;
        }).join('');

        // Atualiza o container
        const detalhesContainer = document.getElementById('tabelaDetalhesFalha');
        detalhesContainer.innerHTML = `<div class="cards-pontos-container">${cardsHtml}</div>`;
        document.getElementById('tabelaDetalhes').style.display = 'block';
    } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        alert('Erro ao carregar detalhes. Por favor, tente novamente.');
    }
}

// Define as datas padrão (últimos 30 dias)
window.addEventListener('load', function() {
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    document.getElementById('dataFinal').value = hoje.toISOString().split('T')[0];
    document.getElementById('dataInicial').value = trintaDiasAtras.toISOString().split('T')[0];
}); 