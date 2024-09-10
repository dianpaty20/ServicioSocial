<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados de Depreciación</title>
    <link rel="stylesheet" href="<?= base_url('css/style.css') ?>">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .chart-container {
            width: 80%;
            margin: auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-top: 20px; /* Separación adicional arriba */
            margin-bottom: 20px; /* Separación adicional abajo */
        }
        
        h2 {
        text-align: center;
    }
    </style>
</head>
<body>
    <div id="sidebar">
        <ul>
            <li><a href="<?= site_url('form') ?>">Método Depreciación en linea recta</a></li>
            <li><a href="<?= site_url('formrate') ?>">Método Porcentaje Fijo</a></li>
        </ul>
    </div>
    <div id="content">
        
        <h1>Resumen de Depreciación</h1>
        <?php
        // Datos iniciales
        $assetLife = $data['asset_life'];
        $residualValue = $data['residual_value'];
        $usefulLife = $data['useful_life'];

        // Calculando la base de depreciación
        $depreciationBase = $assetLife - $residualValue;
        // Calculando la depreciación anual
        $annualDepreciation = $depreciationBase / $usefulLife;
        // Calculando la depreciación mensual
        $monthlyDepreciation = $annualDepreciation / 12;
        ?>
        <table border="1">
            <tr>
                <th>Base de Depreciación</th>
                <th>Depreciación Anual</th>
                <th>Depreciación Mensual</th>
            </tr>
            <tr>
                <td>$<?= number_format($depreciationBase, 2, '.', ',') ?></td>
                <td>$<?= number_format($annualDepreciation, 2, '.', ',') ?></td>
                <td>$<?= number_format($monthlyDepreciation, 2, '.', ',') ?></td>
            </tr>
        </table>

        <div class="button-container">
            <button onclick="toggleTable('annualTable', 'annualChart')">Anual</button>
            <button onclick="toggleTable('monthlyTable', 'monthlyChart')">Mensual</button>
            <button class="new-calculation-button" onclick="location.href='<?= site_url('form') ?>'">Nuevo Cálculo</button>
        </div>

        <div id="annualTable" style="display: none;">
            <h2>Tabla de Depreciación Anual</h2>
            <table border="1">
                <tr>
                    <th>Periodo</th>
                    <th>Depreciación Anual</th>
                    <th>Depreciación Acumulada</th>
                    <th>Valor en Libros</th>
                </tr>
                <?php
                $cumulativeDepreciation = 0;
                $bookValue = $assetLife;
                $annualPeriods = [];
                $annualBookValues = [];
                for ($period = 0; $period <= $usefulLife; $period++) {
                    echo "<tr>";
                    echo "<td>$period</td>";
                    if ($period == 0) {
                        echo "<td></td>";
                        echo "<td></td>";
                        echo "<td>$" . number_format($bookValue, 2, '.', ',') . "</td>";
                    } else {
                        $cumulativeDepreciation += $annualDepreciation;
                        $bookValue -= $annualDepreciation;
                        echo "<td>$" . number_format($annualDepreciation, 2, '.', ',') . "</td>";
                        echo "<td>$" . number_format($cumulativeDepreciation, 2, '.', ',') . "</td>";
                        echo "<td>$" . number_format($bookValue, 2, '.', ',') . "</td>";
                    }
                    echo "</tr>";
                    $annualPeriods[] = $period;
                    $annualBookValues[] = $bookValue;
                }
                ?>
            </table>
            <div class="chart-container">
                <canvas id="annualChart"></canvas>
            </div>
        </div>

        <div id="monthlyTable" style="display: none;">
            <h2>Tabla de Depreciación Mensual</h2>
            <table border="1">
                <tr>
                    <th>Periodo</th>
                    <th>Depreciación Mensual</th>
                    <th>Depreciación Acumulada</th>
                    <th>Valor en Libros</th>
                </tr>
                <?php
                $cumulativeDepreciation = 0;
                $bookValue = $assetLife;
                $monthlyPeriods = [];
                $monthlyBookValues = [];
                for ($period = 0; $period <= $usefulLife * 12; $period++) {
                    echo "<tr>";
                    echo "<td>$period</td>";
                    if ($period == 0) {
                        echo "<td></td>";
                        echo "<td></td>";
                        echo "<td>$" . number_format($bookValue, 2, '.', ',') . "</td>";
                    } else {
                        $cumulativeDepreciation += $monthlyDepreciation;
                        $bookValue -= $monthlyDepreciation;
                        echo "<td>$" . number_format($monthlyDepreciation, 2, '.', ',') . "</td>";
                        echo "<td>$" . number_format($cumulativeDepreciation, 2, '.', ',') . "</td>";
                        echo "<td>$" . number_format($bookValue, 2, '.', ',') . "</td>";
                    }
                    echo "</tr>";
                    if ($period % 12 == 0) {  // Mostrar datos por cada año para mantener la gráfica manejable
                        $monthlyPeriods[] = $period;
                        $monthlyBookValues[] = $bookValue;
                    }
                }
                ?>
            </table>
            <div class="chart-container">
                <canvas id="monthlyChart"></canvas>
            </div>
        </div>
    </div>
    <script>
        function toggleTable(tableId, chartId) {
            var table = document.getElementById(tableId);
            if (table.style.display === 'none') {
                table.style.display = 'block';
                drawChart(chartId);
            } else {
                table.style.display = 'none';
            }
        }

        function drawChart(chartId) {
            var ctx = document.getElementById(chartId).getContext('2d');
            var labels, data, title;
            if (chartId === 'annualChart') {
                labels = <?= json_encode($annualPeriods) ?>;
                data = <?= json_encode($annualBookValues) ?>;
                title = 'Gráfica de Resultados (Anual)';
            } else if (chartId === 'monthlyChart') {
                labels = <?= json_encode($monthlyPeriods) ?>;
                data = <?= json_encode($monthlyBookValues) ?>;
                title = 'Gráfica de Resultados (Mensual)';
            }
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Valor en Libros',
                        data: data,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        fill: true
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: title,
                            font: {
                                size: 18,
                                weight: 'bold'
                            }
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Periodo',
                                font: {
                                    size: 16
                                }
                            },
                            ticks: {
                                font: {
                                    size: 12
                                }
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Valor en Libros',
                                font: {
                                    size: 16
                                }
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                                },
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
            });
        }
        // Inicializar la gráfica al cargar la página
        drawChart('annualChart');
        drawChart('monthlyChart');
    </script>
</body>
</html>