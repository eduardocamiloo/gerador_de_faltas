<!DOCTYPE html>
<html lang="pt-br" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php $view->callHeader("basic") ?>
    <link rel="stylesheet" href="<?php echo $view->linkAsset("css/gerador_de_faltas/index.css") ?>">
    <title>Gerador de Faltas | Selecionar Pedidos</title>
</head>

<body class="bg-body-tertiary">
    <?php $view->component("navbar") ?>
    <main>
        <div class="m-auto d-flex justify-content-center">
            <div class="border border-1 rounded p-4 mb-5" style="width: 1100px;">
                <div id="loading-content-orders" style="display: block;">
                    <div class="d-flex justify-content-center align-items-center" style="height: 80vh;">
                        <div class="spinner-border text-primary fs-5" style="width: 60px; height: 60px" role="status"></div>
                    </div>
                </div>

                <div id="loading-progress-bar" style="display: none;">
                    <div class="d-flex justify-content-center align-items-center flex-column" style="height: 80vh;">
                        <p id="loadingText" class="text-center text-white">Carregando...</p>
                        <progress id="progressBar" value="0" max="100"></progress>
                    </div>
                </div>

                <div id="orders-content" style="display: none;">
                    <div class="w-100 mb-2" style="height: 40px;">
                        <button class="btn btn-outline-info float-start" id="btn-return-options"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
                        <button class="btn btn-outline-info float-end" id="btn-return-content-2">Voltar <i class="fa-solid fa-arrow-right"></i></button>
                    </div>

                    <p class="h2 mb-4">Selecione as vendas desejadas</p>
                    <div class="d-flex justify-content-start align-items-center mb-3">
                        <p class="fw-bold d-inline my-0" style="margin-left: 10px;">Pedidos selecionados: <span id="pedidos-selecionados" class="text-info">0</span></p>

                        <div class="d-inline mx-4" style="width: 2px; height: 40px; background-color: #f7f6f6; border-radius: 10px"></div>

                        <p class="fw-bold d-inline my-0" style="margin-left: 10px;">Página atual: <span id="current-page" class="text-info"></span></p>

                        <div class="d-inline mx-4" style="width: 2px; height: 40px; background-color: #f7f6f6; border-radius: 10px"></div>

                        <button class="btn btn-primary d-inline" id="button-orders-bling" style="margin-right: 15px; width: 150px;">Somente Bling</button>

                        <select name="situacao_order" id="situacao-order" class="form-select d-inline" style="width: 200px;">
                            <option selected value="not_found">Todos</option>
                            <option value="6">Em Aberto</option>
                            <option value="9">Atendido</option>
                            <option value="12">Cancelado</option>
                        </select>
                    </div>
                    <hr>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th><input type="checkbox" class="form-check-input" id="form-check-all"></th>
                                <th>Número</th>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Valor</th>
                                <th>Situação</th>
                            </tr>
                        </thead>
                        <tbody id="t-body-orders" class="table-group-divider">

                        </tbody>
                    </table>

                    <nav class="d-flex justify-content-center mt-3">
                        <ul class="pagination">
                            <li class="page-item" id="page-previous-orders"><a href="#content-1" class="page-link">Anterior</a></li>
                            <li class="page-item" id="page-next-orders"><a href="#content-1" class="page-link">Próximo</a></li>
                        </ul>
                    </nav>
                    <div class="w-100 mt-0">
                        <button class="btn btn-primary float-end" style="width: 200px;" id="btn-submit-orders">Buscar produtos <i class="fa-solid fa-bolt" style="margin-left: 5px;"></i></button>
                    </div>
                </div>

                <div id="orders-2-content" style="display: none;">
                    <div class="w-100 mb-2" style="height: 40px;">
                        <button class="btn btn-outline-info float-start" id="btn-return-selected-orders"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
                        <button class="btn btn-outline-info float-end" id="btn-return-content-3">Voltar <i class="fa-solid fa-arrow-right"></i></button>
                    </div>

                    <div class="div-order-model w-100" style="display: none;">
                        <h3 class="h2 mb-4 title-order"></h3>

                        <div class="d-flex flex-row p-0 mx-2 mb-2 div-pai-products-model" style="display: none !important;">
                            <div class="bg-secondary d-flex justify-content-center align-items-center" style="width: 35px; height: 35px; border-radius: 8px; margin-right: 10px !important;">
                                <span class="fw-bold index-product"></span>
                            </div>
                            <div class="p-0 bg-dark d-flex flex-row div-products" style="height: 35px; width: calc(100% - 45px); border-radius: 8px">
                                <div class="border border-white div-product" style="width: 40%; height: 100%; border-radius: 8px 0 0 8px;">
                                    <input type="text" class="input-product input-nome" placeholder="Nome do produto">
                                </div>
                                <div class="border border-white bg-secondary div-product" style="width: 12%; height: 100%">
                                    <input type="text" class="input-product-2 input-codigo" placeholder="Código">
                                </div>
                                <div class="border border-white div-product" style="width: 8%; height: 100%">
                                    <input type="text" class="input-product input-unidade" placeholder="Unidade">
                                </div>
                                <div class="border border-white bg-secondary div-product" style="width: 15%; height: 100%">
                                    <input type="number" class="input-product-2 input-quantidade" placeholder="Quantidade">
                                </div>
                                <div class="border border-white div-product" style="width: 20%; height: 100%">
                                    <input type="text" class="input-product input-id" placeholder="ID do Produto" readonly>
                                </div>
                                <div class="border border-white bg-secondary" style="width: 5%; height: 100%; border-radius: 0 8px 8px 0;">
                                    <div class="d-flex w-100 h-100 justify-content-center align-items-center">
                                        <i class="fa-solid fa-trash fs-4 text-danger icon-trash" style="cursor: pointer;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button id="btn-create-list" class="btn btn-primary w-100 my-2" style="display: none;">Criar Romaneio <i class="fa-solid fa-file"></i></button>

                <div id="orders-3-content" style="display: none;">
                    <button class="btn btn-outline-info mb-4" id="btn-return-modify-orders"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
                </div>
            </div>
        </div>
    </main>

    <?php $view->component("bootstrapjs") ?>
    <script src="<?php echo $view->linkAsset("js/gerador_de_faltas/index/option-1.js") ?>"></script>
</body>

</html>