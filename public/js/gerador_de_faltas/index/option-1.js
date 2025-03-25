/* Variável que armazena uma lista de ids de pedidos selecionados. (1/3 e 2/3 (uma vez)) */
let selectedOrders = [];

/** Variável que armazena uma tabela hash de produtos dos pedidos selecionados. (2/3 e 3/3) */
let products = {};

/** Variável que armazena os pedidos buscados no Bling. (1/3) */
let pedidos = [];

/** Variável que armazena a página em que se deseja buscar os pedidos. (1/3) */
let pagina = 1;

/** Variável que armazena o id da loja do pedido. (1/3) */
let idLoja = "not_found";

/** Variável que armazena o id da situação do pedido. (1/3) */
let idSituacao = "not_found";

/** Variável que contém o objeto HTML da barra de progresso. Usada entre 1/3 e 2/3 e entre 2/3 e 3/3 do fluxo do sistema. */
const progressBar = document.getElementById("progressBar");

/** Variável que contém o objeto HTML do texto acima da barra de progresso. Usada entre 1/3 e 2/3 e entre 2/3 e 3/3 do fluxo do sistema. */
const loadingText = document.getElementById("loadingText");

/**
 * Busca a lista de pedidos do Bling.
 * - É usada na parte 1/3 do fluxo do sistema.
 * @param {int} pagina É a página em que se deseja buscar os pedidos.
 * @param {int|string} idLoja É o id de loja em que o produto foi criado (0 -> Bling).
 * @param {int|string} idSituacao É o id da situação do pedido (6 -> Em aberto, 9 -> Atendido, 12 -> Cancelado, ...).
 * @returns Reorna uma lista de pedidos.
 */
async function getOrders(pagina = 1, idLoja = "not_found", idSituacao = "not_found") {
    // Completa o endpoint da API com os parâmetros de busca.
    let appApi = APP_URL + `api-bling/getOrders?pagina=${pagina}&idLoja=${idLoja}&idSituacao=${idSituacao}`;

    try {
        // Faz a requisição GET para a API.
        const response = await fetch(appApi, {
            method: 'GET'
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            // Caso não seja, lança um erro.
            throw new Error('Erro na resposta da requisição');
        }

        // Converte a resposta em JSON.
        const data = await response.json();

        // Retorna os pedidos.
        return data;
    } catch (error) {
        alert("Erro ao buscar os pedidos.");
        console.log(error);
    }
}

/**
 * Insere cada pedido em uma linha na tabela de pedidos.
 * - É usada na parte 1/3 do fluxo do sistema.
 * @param {array|object} pedidos São os pedidos que foram buscados na @function getOrders.
 */
function insertOrders(pedidos) {
    // Limpa a tabela de pedidos.
    document.getElementById("t-body-orders").innerHTML = "";

    // Percorre a lista de pedidos e insere cada pedido em uma linha da tabela.
    pedidos.forEach(pedido => {
        // Cria uma nova linha na tabela.
        let tableRow = document.createElement("tr");

        // Cria uma célula para o checkbox.
        let checkboxTd = document.createElement("td");

        // Cria um checkbox.
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("form-check-input");

        // O valor do checkbox é o id do pedido.
        checkbox.value = pedido.id;

        // Adiciona o checkbox à célula.
        checkboxTd.appendChild(checkbox);

        // Adiciona a célula do checkbox à linha.
        tableRow.appendChild(checkboxTd);

        // Caso o pedido tenha sido selecionado, marca o checkbox (serve para ele ser marcado quando um filtro ou paginação for ativada).
        if (selectedOrders.includes(checkbox.value)) {
            checkbox.checked = true;
        }

        // Cria uma célula para o número do pedido e adiciona o valor.
        let numero = document.createElement("td");
        numero.innerHTML = pedido.numero;

        // Divide a data em um array de três partes (ano, mês e dia).
        dataArray = pedido.data.split("-");

        // Cria uma célula para a data e adiciona o valor.
        let data = document.createElement("td");
        data.innerHTML = dataArray[2] + "/" + dataArray[1] + "/" + dataArray[0];

        // Cria uma célula para o cliente e adiciona o valor.
        let cliente = document.createElement("td");
        cliente.innerHTML = pedido.cliente;

        // Cria uma célula para o valor e adiciona o valor.
        let valor = document.createElement("td");
        valor.innerHTML = pedido.valor;

        // Tabela hash de situações catalogadas.
        let situacoes = {
            "6": "Em aberto",
            "9": "Atendido",
            "12": "Cancelado",
        }

        // Cria uma célula para a situação.
        let situacao = document.createElement("td");

        // Caso a situação não seja catalogada, adiciona o valor normal da situação.
        situacao.innerHTML = situacoes[pedido.situacao] ?? pedido.situacao;

        // Adiciona as células à linha.
        tableRow.appendChild(numero);
        tableRow.appendChild(data);
        tableRow.appendChild(cliente);
        tableRow.appendChild(valor);
        tableRow.appendChild(situacao);

        // Adiciona a linha à tabela.
        document.getElementById("t-body-orders").appendChild(tableRow);
    });
}

/**
 * Função responsável por salvar  os pedidos selecionados no array "selectedOrders".
 * - É usada na parte 1/3 do fluxo do sistema, e no começo da parte 2/3 (1 vez).
 * - Acionada quando algum filtro ou paginação é clicada.
 */
function saveOrdersSelected() {
    // Recebe todos os checkboxes da tabela de pedidos.
    const selectedCheckboxes = document.querySelectorAll("#t-body-orders input[type='checkbox']");

    // Percorre todos os checkboxes.
    selectedCheckboxes.forEach(checkbox => {
        // Caso o checkbox esteja marcado, adiciona o id do pedido ao array "selectedOrders".
        if (checkbox.checked) {
            // Caso o pedido já esteja no array, não adiciona novamente.
            if (!selectedOrders.includes(checkbox.value)) {
                selectedOrders.push(checkbox.value);
            }
        } else {
            // Caso o pedido não esteja no array, remove o id do pedido do array "selectedOrders".
            selectedOrders = selectedOrders.filter(order => order !== checkbox.value);
        }
    });
};

/**
 * Função responsável por buscar e retornar um pedido específico.
 * @param {int|string} idOrder É o id do pedido que será buscado.
 * @returns Retorna o pedido de acordo com o idOrder (id).
 */
async function getOrder(idOrder = "not_found") {
    // Completa o endpoint da API.
    let appApi = APP_URL + `api-bling/getProducts?idOrder=${idOrder}`;

    try {
        // Faz a requisição GET à API.
        const response = await fetch(appApi, {
            method: 'GET'
        });

        // Verifica se a resposta foi bem-sucedida.
        if (!response.ok) {
            // Caso não, lança um erro.
            throw new Error('Erro na resposta da requisição');
        }

        // Converte a resposta para JSON.
        const data = await response.json();

        // Retorna o pedido.
        return data;
    } catch (error) {
        alert("Erro ao buscar os pedidos.");
        console.log(error);
    }
}

/** Não documentada!!!!!!!!!!!!!!!
 * Função responsável por atualizar a barra de progresso entre as partes  1/3 e 2/3 do fluxo do sistema.
 * É usada na parte 2/3 do fluxo do sistema.
 * 
 * @param {int} selectedOrders É a lista de pedidos selecionados.
 * @returns Retorna a lista completa de produtos dos pedidos selecionados.
 */
async function searchOrdersWithProgress(selectedOrders) {
    // Variável que guarda quantas requiisções foram concluídas.
    let completed = 0;

    // Variável que guarda o total de requisições necessárias.
    const total = selectedOrders.length;


    // Função que atualiza a barra de progresso.
    const updateProgress = () => {
        completed++;
        progressBar.value = (completed / total) * 100;
    };

    const promises = selectedOrders.map(async (order) => {
        const result = await getOrder(order);
        updateProgress();
        return result;
    });

    const results = await Promise.allSettled(promises);

    return results;
}

/**
 * Função para remover qualquer conteúdo (content) da tela do usuário.
 */
function removeAllContents() {
    // Remove o content de loading simples (spinner).
    document.getElementById("loading-content-orders").style.display = "none";

    // Remove o content de loading com barra de progresso.
    document.getElementById("loading-progress-bar").style.display = "none";

    // Remove o content da parte  1/3 do fluxo do sistema.
    document.getElementById("orders-content").style.display = "none";

    // Remove o content da parte 2/3 do fluxo do sistema.
    document.getElementById("orders-2-content").style.display = "none";

    // Remove o botão de criar lista da parte 2/3 do fluxo do sistema.
    document.getElementById("btn-create-list").style.display = "none";

    // Remove o content da parte 3/3 do fluxo do sistema.
    document.getElementById("orders-3-content").style.display = "none";
}

/**
 * Função responsável por buscar e retornar o fornecedor de um produto específico.
 * - É usada na parte 3/3 do fluxo do sistema.
 * @param {int|string} idProduct É o id do produto que será buscado.
 * @returns Retorna o id e nome do fornecedor do produto.
 */
async function completeFornecedor(idProduct = "not_found") {
    // Completa o endpoint da API.
    let appApi = APP_URL + `api-bling/completeFornecedor?idProduct=${idProduct}`;

    try {
        // Faz a requisição GET à API.
        const response = await fetch(appApi, {
            method: 'GET'
        });

        // Verifica se a resposta foi bem-sucedida.
        if (!response.ok) {
            // Caso não, lança um erro.
            throw new Error('Erro na resposta da requisição');
        }

        // Converte a resposta para JSON.
        const data = await response.json();

        // Retorna o id e nome do fornecedor do produto.
        return data;
    } catch (error) {
        alert("Erro ao buscar os pedidos.");
        console.log(error);
    }
}

/**
 * Função para atualizar a contagem de pedidos selecionados.
 * - É usada na parte 1/3 do fluxo do sistema.
 */
function atualizarSelecaoPedidos() {
    // Cria uma lista de pedidos selecionados (temporariiamente), até que a função "saveSelectedOrders" seja executada.
    let selectedOrdersTemporario = [];

    // Percorre todos os checkboxes do tbody e verifica se o checkbox está marcado.
    document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
        if (checkbox.checked) {
            // Se estiver marcado, verifica se o pedido já está na lista de pedidos selecionados.
            if (!selectedOrders.includes(checkbox.value)) {
                // Caso não esteja, adiciona um (1) a lista de pedidos selecionados.
                selectedOrdersTemporario.push(1);
            }
        } else {
            // Caso não esteja marcado, verifica se o pedido está na lista de pedidos selecionados.
            if (selectedOrders.includes(checkbox.value)) {
                // Caso esteja, adiciona menos um (-1) da lista de pedidos selecionados.
                selectedOrdersTemporario.push(-1);
            }
        }
    });

    // Variável que guarda a soma dos pedidos selecionados (temporariamente).
    let somaTemporaria = 0;

    // Percorre todos os pedidos selecionados (temporariamente).
    selectedOrdersTemporario.forEach(item => {
        // Soma a lista.
        somaTemporaria += item;
    });

    // Atualiza a contagem de pedidos selecionados, que serão os salvos + os salvos temporariamente.
    document.getElementById("pedidos-selecionados").innerHTML = selectedOrders.length + somaTemporaria;

    // O Botão para retornar a parte 2/3 é desabilitada, pois o usuário terá que seguir o fluxo comum.
    document.getElementById("btn-return-content-2").disabled = true;
}

/**
 * Evento do botão para retornar à parte 0/3 (opções) do fluxo do sistema (1 >> 0).
 */
document.getElementById("btn-return-options").addEventListener("click", function () {
    // Chama função para remover todos os conteúdos da tela.
    removeAllContents();

    // Mostra a tela de loading.
    document.getElementById("loading-content-orders").style.display = "block";

    // Redireciona para a página inicial do Gerador de Faltas.
    window.location.href = APP_URL + "gerador-de-faltas";
});

/**
 * Função que é chamada quando a página é carregada.
 * - Função responsável pela primeira parte do fluxo do sistema.
 * - 1/3 - Busca os pedidos do Bling.
 */
async function initializePage() {
    // Zerar o array de pedidos do Bling.
    pedidos.length = 0;

    // Busca os pedidos do Bling.
    pedidos = await getOrders(pagina, idLoja, idSituacao);

    // Insere os pedidos na tabela.
    insertOrders(pedidos);

    // Atualiza qual a página atual (aqui sempre será a 1).
    document.getElementById("current-page").innerHTML = pagina;

    // Remove a tela de loading e adiciona a tela/tabela de pedidos (1/3).
    document.getElementById("loading-content-orders").style.display = "none";
    document.getElementById("orders-content").style.display = "block";

    // O botão de "página anterior" começa desabilitado (porque começamos na página 1).
    document.getElementById("page-previous-orders").classList.add("disabled");

    // O botão de "retornar a parte 2/3" começa invisível.
    document.getElementById("btn-return-content-2").style.display = "none";

    // Adicionar o evento de clique em qualquer checkbox de pedido.
    document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
        // Chama a função de atualização da contagem de pedidos selecionados.
        checkbox.addEventListener("change", atualizarSelecaoPedidos);
    });


    // Eventos da tabela/página:

    // Adicionar o evento de clique no checkbox de "Todos".
    document.getElementById("form-check-all").addEventListener("click", function () {
        // Recebe todos os checkboxes.
        const checkboxes = document.querySelectorAll("#t-body-orders input[type='checkbox']");

        // Ativa ou desativa todos os checkboxes com base no estado do checkbox "Todos".
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });

        // Chama a função de atualização da contagem de pedidos selecionados.
        atualizarSelecaoPedidos();
    });


    // Adicionar o evento de clique no botão de "Somente Bling".
    document.getElementById("button-orders-bling").addEventListener("click", async function () {
        // Caso o botão não esteja ativo e for clicado, deverá buscar os pedidos somente do Bling.
        if (!this.classList.contains("active")) {
            // Para buscar os pedidos do Bling, o idLoja deve ser 0.
            idLoja = 0;

            // Zera o array de pedidos do Bling.
            pedidos = [];

            // Adiciona a tela de loading e remove a tela/tabela de pedidos (1/3).
            document.getElementById("loading-content-orders").style.display = "block";
            document.getElementById("orders-content").style.display = "none";

            // Salva os pedidos selecionados.
            saveOrdersSelected();

            // Busca os pedidos do Bling.
            pedidos = await getOrders(pagina, idLoja, idSituacao);

            // Insere os pedidos na tabela.
            insertOrders(pedidos);

            // Adiciona a classe de ativo (pois agora está buscando somente pedidos do Bling).
            this.classList.add("active");

            // Coloca novamente o evento de clique em qualquer checkbox de pedido.
            document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
                // Chama a função de atualização da contagem de pedidos selecionados.
                checkbox.addEventListener("change", atualizarSelecaoPedidos);
            });

            // Remove a tela de loading e adiciona a tela/tabela de pedidos (1/3).
            document.getElementById("loading-content-orders").style.display = "none";
            document.getElementById("orders-content").style.display = "block";
        } else {
            // Caso o botão esteja ativo e for clicado, deverá buscar todos os pedidos (qualquer loja).

            // Para buscar TODOS os pedidos de qualquer loja, o idLoja deve ser "not_found".
            idLoja = "not_found";

            // Zera o array de pedidos do Bling.
            pedidos = [];

            // Adiciona a tela de loading e remove a tela/tabela de pedidos.
            document.getElementById("loading-content-orders").style.display = "block";
            document.getElementById("orders-content").style.display = "none";

            // Salva os pedidos selecionados.
            saveOrdersSelected();

            // Busca os pedidos do Bling.
            pedidos = await getOrders(pagina, idLoja, idSituacao);

            // Insere os pedidos na tabela.
            insertOrders(pedidos);

            // Remove a classe de ativo (pois agora está buscando todos os pedidos).
            this.classList.remove("active");

            // Coloca novamente o evento de clique em qualquer checkbox de pedido.
            document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
                // Chama a função de atualização da contagem de pedidos selecionados.
                checkbox.addEventListener("change", atualizarSelecaoPedidos);
            });

            // Remove a tela de loading e adiciona a tela/tabela de pedidos (1/3).
            document.getElementById("loading-content-orders").style.display = "none";
            document.getElementById("orders-content").style.display = "block";
        }
    });

    // Adiciona o evento de mudança de seleção de opção no select "situação do pedido".
    document.getElementById("situacao-order").addEventListener("change", async function () {
        // O id da situação do pedido é o valor do select que foi selecionado.
        idSituacao = this.value;

        // Zera o array de pedidos do Bling.
        pedidos = [];

        // Adiciona a tela de loading e remove a tela/tabela de pedidos (1/3).
        document.getElementById("loading-content-orders").style.display = "block";
        document.getElementById("orders-content").style.display = "none";

        // Salva os pedidos selecionados.
        saveOrdersSelected();

        // Busca os pedidos do Bling.
        pedidos = await getOrders(pagina, idLoja, idSituacao);

        // Insere os pedidos na tabela.
        insertOrders(pedidos);

        // Coloca novamente o evento de clique em qualquer checkbox de pedido.
        document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
            // Chama a função de atualização da contagem de pedidos selecionados.
            checkbox.addEventListener("change", atualizarSelecaoPedidos);
        });

        // Remove a tela de loading e adiciona a tela/tabela de pedidos (1/3).
        document.getElementById("loading-content-orders").style.display = "none";
        document.getElementById("orders-content").style.display = "block";
    });

    // Adiciona o evento de clique no botão "Página anterior".
    document.querySelector("#page-previous-orders a").addEventListener("click", async function () {
        // Caso o botão seja  clicado e essa seja a página 2, ele irá para a página 1, portanto desative o botão.
        if (pagina == 2) {
            // Desativar o botão de "Página anterior".
            document.getElementById("page-previous-orders").classList.add("disabled");
        }

        // Se a página for maior que 1, vá para a página anterior.
        if (pagina > 1) {
            // Diminui a página em 1.
            pagina--;

            // Zera o array de pedidos do Bling.
            pedidos = [];

            // Adiciona a tela de loading e remove a tela/tabela de pedidos (1/3).
            document.getElementById("loading-content-orders").style.display = "block";
            document.getElementById("orders-content").style.display = "none";

            // Salva os pedidos selecionados.
            saveOrdersSelected();

            // Busca os pedidos do Bling.
            pedidos = await getOrders(pagina, idLoja, idSituacao);

            // Insere os pedidos na tabela.
            insertOrders(pedidos);

            // Atualiza o número da página atual.
            document.getElementById("current-page").innerHTML = pagina;

            // Coloca novamente o evento de clique em qualquer checkbox de pedido.
            document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
                // Chama a função de atualização da contagem de pedidos selecionados.
                checkbox.addEventListener("change", atualizarSelecaoPedidos);
            });

            // Remove a tela de loading e adiciona a tela/tabela de pedidos (1/3).
            document.getElementById("loading-content-orders").style.display = "none";
            document.getElementById("orders-content").style.display = "block";
        }
    });

    // Adiciona o evento de clique no botão "Próxima página".
    document.querySelector("#page-next-orders a").addEventListener("click", async function () {
        // Aumenta a página em 1.
        pagina++;

        // Zera o array de pedidos do Bling.
        pedidos = [];

        // Adiciona a tela de loading e remove a tela/tabela de pedidos (1/3).
        document.getElementById("loading-content-orders").style.display = "block";
        document.getElementById("orders-content").style.display = "none";

        // Salva os pedidos selecionados.
        saveOrdersSelected();

        // Busca os pedidos do Bling.
        pedidos = await getOrders(pagina, idLoja, idSituacao);

        // Insere os pedidos na tabela.
        insertOrders(pedidos);

        // Atualiza o número da página atual.
        document.getElementById("current-page").innerHTML = pagina;

        // Ativa o botão de "Página anterior" (caso já não esteja ativado). Logicamente, se a página aumentar, ela será maior que 1, portanto, o botão de "Página anterior" pode ser usado.
        document.getElementById("page-previous-orders").classList.remove("disabled");

        // Coloca novamente o evento de clique em qualquer checkbox de pedido.
        document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
            // Chama a função de atualização da contagem de pedidos selecionados.
            checkbox.addEventListener("change", atualizarSelecaoPedidos);
        });

        // Remove a tela de loading e adiciona a tela/tabela de pedidos (1/3).
        document.getElementById("loading-content-orders").style.display = "none";
        document.getElementById("orders-content").style.display = "block";
    });
}

// Inicializa a página.
initializePage();

/**
 * Evento do botão para retornar à parte 2/3 do fluxo do sistema (1 >> 2).
 */
document.getElementById("btn-return-content-2").addEventListener("click", async function () {
    document.getElementById("orders-2-content").style.display = "block";
    document.getElementById("btn-create-list").style.display = "block";
    document.getElementById("orders-content").style.display = "none";
});

/**
 * Evento do botão para retornar à parte 1/3 do fluxo do sistema (2 >> 1).
 */
document.getElementById("btn-return-selected-orders").addEventListener("click", async function () {
    document.getElementById("btn-return-content-2").style.display = "block";
    document.getElementById("btn-return-content-2").disabled = false;
    document.getElementById("orders-content").style.display = "block";
    document.getElementById("orders-2-content").style.display = "none";
    document.getElementById("btn-create-list").style.display = "none";
});

/**
 * Evento acionado depois dos pedidos serem selecionados.
 * - Função responsável pela segunda parte do fluxo do sistema.
 * - 2/3 - Ver e modificar os produtos do pedido selecionado.
 */
document.getElementById("btn-submit-orders").addEventListener("click", async function () {

    document.getElementById("loading-progress-bar").style.display = "block";
    document.getElementById("orders-content").style.display = "none";

    products = {};

    let dots = 3;

    const interval = setInterval(() => {
        if (dots > 6) {
            dots = 2;
        } else {
            dots++;
        }

        loadingText.innerHTML = "Carregando" + ".".repeat(dots);
    }, 500);

    saveOrdersSelected();

    document.querySelectorAll(".div-order").forEach((divOrder) => {
        divOrder.remove();
    });

    document.querySelectorAll("#orders-2-content hr").forEach((hr) => {
        hr.remove();
    });

    const ordersToSearch = (await searchOrdersWithProgress(selectedOrders))
        .filter(order => order.status === "fulfilled")
        .map(order => order.value);

    let divOrderModel = document.querySelector(".div-order-model");
    let divPaiProductsModel = document.querySelector(".div-pai-products-model");

    let dataRow = 0;

    ordersToSearch.forEach((order) => {
        let divOrder = divOrderModel.cloneNode(true);
        divOrder.classList.remove("div-order-model");
        divOrder.classList.add("div-order");

        divOrder.querySelector(".title-order").innerHTML = order.cliente;

        order.produtos.forEach((product, index) => {
            if (product.idProduct == 0) {
                return;
            }

            let divProduct = divPaiProductsModel.cloneNode(true);
            divProduct.classList.remove("div-pai-products-model");
            divProduct.classList.add("div-pai-products");

            divProduct.querySelector(".index-product").innerHTML = index + 1;

            divProduct.querySelector(".input-nome").value = product.nome;

            divProduct.querySelector(".input-codigo").value = product.codigo;

            divProduct.querySelector(".input-unidade").value = product.unidade;

            divProduct.querySelector(".input-quantidade").value = product.quantidade;

            divProduct.querySelector(".input-id").value = "#" + product.idProduct;

            dataRow++;
            divProduct.querySelector(".icon-trash").dataset.row = dataRow;
            divProduct.dataset.row = dataRow;

            products[dataRow] = {
                idProduct: product.idProduct,
                nome: product.nome,
                codigo: product.codigo,
                unidade: product.unidade,
                quantidade: product.quantidade,
                idOrder: order.id,
                idFornecedor: null,
                fornecedor: null,
            };

            divProduct.style.display = "block";
            divOrder.appendChild(divProduct);
        });

        divOrder.style.display = "block";
        let hr = document.createElement("hr");
        hr.classList.add("my-5");

        document.getElementById("orders-2-content").appendChild(divOrder);
        document.getElementById("orders-2-content").appendChild(hr);
    });

    document.querySelectorAll(".input-nome").forEach(input => {
        input.addEventListener("input", function (event) {
            let row = event.target.closest(".div-pai-products").dataset.row;
            products[row].nome = event.target.value;
            document.getElementById("btn-return-content-3").disabled = true;
        });
    });

    document.querySelectorAll(".input-codigo").forEach(input => {
        input.addEventListener("input", function (event) {
            let row = event.target.closest(".div-pai-products").dataset.row;
            products[row].codigo = event.target.value;
            document.getElementById("btn-return-content-3").disabled = true;
        });
    });

    document.querySelectorAll(".input-unidade").forEach(input => {
        input.addEventListener("input", function (event) {
            let row = event.target.closest(".div-pai-products").dataset.row;
            products[row].unidade = event.target.value;
            document.getElementById("btn-return-content-3").disabled = true;
        });
    });

    document.querySelectorAll(".input-quantidade").forEach(input => {
        input.addEventListener("input", function (event) {
            let row = event.target.closest(".div-pai-products").dataset.row;
            products[row].quantidade = event.target.value;
            document.getElementById("btn-return-content-3").disabled = true;
        });
    });

    document.querySelectorAll(".icon-trash").forEach(icon => {
        icon.addEventListener("click", function (event) {
            let row = event.target.dataset.row;
            delete products[row];
            document.querySelector(".div-order [data-row='" + row + "']").remove();
            document.getElementById("btn-return-content-3").disabled = true;
        });
    });

    document.getElementById("btn-return-content-3").style.display = "none";
    document.getElementById("loading-progress-bar").style.display = "none";
    document.getElementById("orders-2-content").style.display = "block";
    document.getElementById("btn-create-list").style.display = "block";

    clearInterval(interval);
    loadingText.innerHTML = "Carregando...";
    progressBar.value = 0;
});

/**
 * Evento do botão para retornar à parte 3/3 do fluxo do sistema (2 >> 3).
 */
document.getElementById("btn-return-content-3").addEventListener("click", async function () {
    document.getElementById("orders-2-content").style.display = "none";
    document.getElementById("btn-create-list").style.display = "none";
    document.getElementById("orders-3-content").style.display = "block";
});

/**
 * Evento do botão para retornar à parte 2/3 do fluxo do sistema (3 >> 2).
 */
document.getElementById("btn-return-modify-orders").addEventListener("click", async function () {
    document.getElementById("btn-return-content-3").style.display = "block";
    document.getElementById("btn-return-content-3").disabled = false;

    document.getElementById("orders-2-content").style.display = "block";
    document.getElementById("btn-create-list").style.display = "block";

    document.getElementById("orders-3-content").style.display = "none";
});

/**
 * Evento acionado depois dos produtos serem revisados.
 * - Função responsável pela terceira parte do fluxo do sistema.
 * - 3/3 - Visualização das mensagens.
 */
document.getElementById("btn-create-list").addEventListener("click", async function () {
    removeAllContents();
    document.getElementById("loading-progress-bar").style.display = "block";

    document.querySelectorAll("#orders-3-content div").forEach(div => {
        div.remove();
    });

    document.querySelectorAll("#orders-3-content hr").forEach(hr => {
        hr.remove();
    });

    let uniqueFornecedores = new Set();

    let dots = 3;

    const interval = setInterval(() => {
        if (dots > 6) {
            dots = 3;
        } else {
            dots++;
        }

        loadingText.innerHTML = "Carregando" + ".".repeat(dots);
    }, 500);

    let uniqueProducts = {};

    for (let chave in products) {
        let { codigo, quantidade } = products[chave];

        // Se o código já existe no objeto final, apenas soma a quantidade
        if (uniqueProducts[codigo]) {
            uniqueProducts[codigo].quantidade += Number(quantidade);
        } else {
            // Se não existe, copia o objeto original
            uniqueProducts[codigo] = { ...products[chave], quantidade: Number(quantidade) };
        }
    }

    const total = Object.keys(uniqueProducts).length;
    let completed = 0;

    await Promise.all(Object.entries(uniqueProducts).map(async (chave) => {
        let idProduct = uniqueProducts[chave[0]].idProduct;
        let fornecedorResponse = await completeFornecedor(idProduct);

        uniqueProducts[chave[0]].fornecedor = fornecedorResponse.nomeFornecedor;
        uniqueProducts[chave[0]].idFornecedor = fornecedorResponse.idFornecedor;

        uniqueFornecedores.add(fornecedorResponse.idFornecedor);

        // Atualiza a barra de progresso
        completed++;
        progressBar.value = (completed / total) * 100;
    }));

    let ContentThree = document.getElementById("orders-3-content");

    uniqueFornecedores.forEach(async (idFornecedor) => {
        let filteredProducts = Object.entries(uniqueProducts)
            .filter(([key, product]) => product.idFornecedor === idFornecedor)
            .reduce((obj, [key, product]) => {
                obj[key] = product;
                return obj;
            }, {});

        let message = "";

        for (let product in filteredProducts) {
            message += filteredProducts[product].nome + " = " + filteredProducts[product].quantidade + " " + filteredProducts[product].unidade + "\n";
        }

        let divFornecedor = document.createElement("div");
        divFornecedor.classList.add("mb-3", "border", "border-primary", "rounded", "p-3", "w-100");

        let title = document.createElement("p");
        title.classList.add("h2", "mb-3");
        title.innerHTML = filteredProducts[Object.keys(filteredProducts)[0]].fornecedor;

        divFornecedor.appendChild(title);

        let textArea = document.createElement("textarea");
        textArea.classList.add("form-control");
        textArea.rows = Object.keys(filteredProducts).length + 1;
        textArea.value = message;

        divFornecedor.appendChild(textArea);

        ContentThree.appendChild(divFornecedor);
        ContentThree.appendChild(document.createElement("hr"));
    });

    let lastHr = ContentThree.lastChild;
    lastHr.remove();

    document.getElementById("loading-progress-bar").style.display = "none";
    document.getElementById("orders-3-content").style.display = "block";

    clearInterval(interval);
    loadingText.innerHTML = "Carregando...";
    progressBar.value = 0;
});