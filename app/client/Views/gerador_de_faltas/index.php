<!DOCTYPE html>
<html lang="pt-br" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php $view->callHeader("basic") ?>
    <link rel="stylesheet" href="<?php echo $view->linkAsset("css/gerador_de_faltas/index.css") ?>">
    <title>Gerador de Faltas</title>
</head>

<body class="bg-body-tertiary">
    <?php $view->component("navbar") ?>

    <main class="container d-block">
        <div id="content-0" style="display: block;">
            <div class="m-auto d-flex justify-content-center align-items-center" style="height: 80vh;">
                <div style="width: 800px;">
                    <h1 class="text-center">Bem vindo! Selecione como deseja continuar:</h1>
                    <div class="row d-flex justify-content-center">
                        <div class="col-auto border border-1 rounded mx-2 d-flex justify-content-center align-items-center flex-column" style="width: 200px; height: 200px; cursor: pointer;" id="option-1">
                            <i class="fa-solid fa-boxes-stacked mb-1" style="font-size: 50px;" id="option-1-icon"></i>
                            <p class="text-center fw-bold" style="font-size: 18px;" id="option-1-text">Gerar a lista de faltas a partir de uma venda</p>
                        </div>
                        <div class="col-auto border border-1 rounded mx-2 d-flex justify-content-center align-items-center flex-column" style="width: 200px; height: 200px; cursor: pointer;" id="option-2">
                            <i class="fa-solid fa-box mb-1" style="font-size: 50px;" id="option-2-icon"></i>
                            <p class="text-center fw-bold" style="font-size: 18px;" id="option-2-text">Gerar a lista de faltas manualmente</p>
                        </div>
                        <div class="col-auto border border-1 rounded mx-2 d-flex justify-content-center align-items-center flex-column" style="width: 200px; height: 200px; cursor: pointer;" id="option-3">
                            <i class="fa-solid fa-floppy-disk mb-1" style="font-size: 50px;" id="option-3-icon"></i>
                            <p class="text-center fw-bold" style="font-size: 18px;" id="option-3-text">Ver listas salvas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>


    <?php $view->component("bootstrapjs") ?>
    <script src="<?php echo $view->linkAsset("js/gerador_de_faltas/index/index.js") ?>"></script>
</body>
</html>