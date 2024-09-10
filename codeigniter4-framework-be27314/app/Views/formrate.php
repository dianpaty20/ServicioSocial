<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Método Porcentaje Fijo</title>
    <link rel="stylesheet" href="<?= base_url('css/style.css') ?>">
    <style>
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-buttons button {
            margin-right: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 10px;
            text-align: right;
        }
        .form-buttons {
            margin-top: 20px;
        }
        .hidden {
            display: none;
        }
        h1, h2 {
            text-align: center;
        }
        .form-buttons {
            text-align: center;
            margin-bottom: 20px;
        }

        .form-buttons button {
            margin: 0 15px;
            padding: 10px 20px;
            font-size: 16px;
        }
    </style>
</head>
<body>

    <div id="sidebar">
        <ul>
            <li><a href="<?= site_url('form') ?>">Método Depreciación en línea recta</a></li>
            <li><a href="<?= site_url('formrate') ?>">Método Depreciación de Porcentaje Fijo</a></li>
        </ul>
    </div>

    <div id="content">
        <h1>Método Depreciación de Porcentaje Fijo</h1>
        
        <div class="form-buttons">
            <button id="toggleTasaForm" type="button">Tasa de Depreciación</button>
            <button id="toggleTablaForm" type="button">Tabla de Depreciación</button>
        </div>

        <!-- Sección para calcular la tasa de depreciación -->
        <div id="tasa-form" class="hidden">
            <h2>Tasa de Depreciación</h2>
            <form id="depreciationForm">
                <div class="form-group">
                    <label for="initial_value">Valor inicial del activo:</label>
                    <input type="number" id="initial_value" name="initial_value" required step="0.000001">
                </div>
                <div class="form-group">
                    <label for="salvage_value">Valor de salvamento:</label>
                    <input type="number" id="salvage_value" name="salvage_value" required step="0.000001">
                </div>
                <div class="form-group">
                    <label for="useful_life">Vida útil (en años):</label>
                    <input type="number" id="useful_life" name="useful_life" required step="0.000001">
                </div>
                <div class="button-container">
                    <button type="submit">Calcular</button>
                </div>
            </form>
            <div class="result" id="result"></div>
        </div>

        <!-- Sección para calcular y mostrar la tabla de depreciación -->
        <div id="tabla-form">
            <h2>Método de Depreciación Porcentaje Fijo</h2>
            <form id="tableForm" action="/calcular_depreciacion" method="post">
                <div class="form-group">
                    <label for="valor-inicial">Valor inicial del activo:</label>
                    <input type="number" id="valor-inicial" name="valor_inicial" required step="0.01">
                </div>
                <div class="form-group">
                    <label for="tasa-depreciacion">Tasa de depreciación (%):</label>
                    <input type="number" id="tasa-depreciacion" name="tasa_depreciacion" required step="0.000001" min="0">
                </div>
                <div class="form-group">
                    <label for="vida-util">Vida útil (años):</label>
                    <input type="number" id="vida-util" name="vida_util" required step="1">
                </div>
                <div class="form-buttons">
                    <button type="submit">Calcular</button>
                </div>
            </form>

            <!-- Mostrar la tabla solo si hay datos -->
            <?php if (isset($vida_util)): ?>
            <h2>Tabla de Depreciación por el Método de Porcentaje Fijo</h2>
            <table>
                <thead>
                    <tr>
                        <th>Años</th>
                        <th>Depreciación Anual</th>
                        <th>Depreciación Acumulada</th>
                        <th>Valor en Libros</th>
                        <th>Tasa de Depreciación (%)</th>
                    </tr>
                </thead>
                <tbody>
                    <?php for ($i = 0; $i <= $vida_util; $i++): ?>
                    <tr>
                        <td><?= $i ?></td>
                        <td><?= $i === 0 ? '' : number_format($depreciacion_anual[$i], 4, '.', '') ?></td>
                        <td><?= $i === 0 ? '' : number_format($depreciacion_acumulada[$i], 4, '.', '') ?></td>
                        <td><?= number_format($valor_libros[$i], 4, '.', '') ?></td>
                        <td><?= number_format($tasa_depreciacion[$i], 4, '.', '') ?>%</td>
                    </tr>
                    <?php endfor; ?>
                </tbody>
            </table>
            <?php endif; ?>
        </div>

    </div>

    <script>
        let isTasaFormVisible = false;
        let isTablaFormVisible = false;

        function showForm(formId) {
            const tasaForm = document.getElementById('tasa-form');
            const tablaForm = document.getElementById('tabla-form');
            
            if (formId === 'tasa') {
                if (isTasaFormVisible) {
                    tasaForm.classList.add('hidden');
                    isTasaFormVisible = false;
                } else {
                    tasaForm.classList.remove('hidden');
                    tablaForm.classList.add('hidden');
                    isTasaFormVisible = true;
                    isTablaFormVisible = false;
                }
            } else if (formId === 'tabla') {
                if (isTablaFormVisible) {
                    // No ocultar el formulario de tabla
                    isTablaFormVisible = false;
                } else {
                    tablaForm.classList.remove('hidden');
                    tasaForm.classList.add('hidden');
                    isTablaFormVisible = true;
                    isTasaFormVisible = false;
                }
            }
        }

        document.getElementById('toggleTasaForm').addEventListener('click', function(event) {
            event.preventDefault();
            showForm('tasa');
        });

        document.getElementById('toggleTablaForm').addEventListener('click', function(event) {
            event.preventDefault();
            showForm('tabla');
        });

        document.getElementById('depreciationForm').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const initialValue = parseFloat(document.getElementById('initial_value').value);
            const salvageValue = parseFloat(document.getElementById('salvage_value').value);
            const usefulLife = parseFloat(document.getElementById('useful_life').value);

            if (initialValue > salvageValue && usefulLife > 0) {
                // Fórmula de depreciación
                const depreciationRate = (1 - Math.pow((salvageValue / initialValue), (1 / usefulLife))) * 100;

                // Convertir el número a cadena y asegurarse de que tenga exactamente 6 dígitos después del punto decimal sin redondeo
                let result = depreciationRate.toString();
                const [integerPart, decimalPart = ''] = result.split('.');
                
                if (decimalPart.length < 4) {
                    // Agregar ceros a la derecha si es necesario
                    result = `${integerPart}.${decimalPart.padEnd(4, '0')}`;
                } else if (decimalPart.length > 4) {
                    // Mantener solo los primeros 6 dígitos decimales sin redondear
                    result = `${integerPart}.${decimalPart.slice(0, 4)}`;
                }

                document.getElementById('result').innerHTML = `Tasa de depreciación: ${result}%`;
            } else {
                document.getElementById('result').innerHTML = "Por favor, asegúrese de que los valores ingresados sean correctos.";
            }
        });

        document.getElementById('tableForm').addEventListener('submit', function(event) {
            // No ocultar el formulario ni hacer nada especial al enviar el formulario de tabla
        });
    </script>
</body>
</html>
