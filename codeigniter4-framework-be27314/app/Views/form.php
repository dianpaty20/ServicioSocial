<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculadora de Depreciación</title>
    <link rel="stylesheet" href="<?= base_url('css/style.css') ?>">
</head>
<body>
    <div id="sidebar">
        <ul>
            <li><a href="<?= site_url('form') ?>">Método Depreciación en línea recta</a></li>
            <li><a href="<?= site_url('formrate') ?>">Método Porcentaje Fijo</a></li>
        </ul>
    </div>
    <div id="content">
        <h1>Calculadora de Depreciación de Activos</h1>
        <form action="<?= site_url('results') ?>" method="post">
            <div class="description">
                <img src="/images/imagen.jpg" alt="Gráfica de Depreciación" class="description-img">
                <p class="description-text">Esta es la primera vistas de la calculadora depreciación de activos. Esta calculadora te ayudará a determinar la depreciación de tus activos a lo largo del tiempo. Introduce los valores necesarios para obtener un cálculo preciso.</p>
            </div>
            <div class="form-group">
                <label for="asset_life">Valor inicial del Activo:</label>
                <input type="number" id="asset_life" name="asset_life" required>
            </div>
            <div class="form-group">
                <label for="residual_value">Valor de salvamento:</label>
                <input type="number" id="residual_value" name="residual_value" required>
            </div>
            <div class="form-group">
                <label for="useful_life">Vida Útil (en años):</label>
                <input type="number" id="useful_life" name="useful_life" required>
            </div>
            <button type="submit">Calcular</button>
        </form>
    </div>
</body>
</html>