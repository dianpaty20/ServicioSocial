<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class Main extends BaseController
{
    public function index()
    { 
        return view('home');
    }

    public function form()
    {
        return view('form');
    }

    public function results()
    {
        $data = $this->request->getPost();
        return view('results', ['data' => $data]);
    }

    public function formrate()
    {
        // Mostrar la vista del formulario
        return view('formrate');
    }

    public function calcularDepreciacion()
    {
        // Recibe los datos del formulario
        $valorInicial = $this->request->getPost('valor_inicial');
        $tasaDepreciacion = $this->request->getPost('tasa_depreciacion') / 100; // Convertir porcentaje a decimal
        $vidaUtil = $this->request->getPost('vida_util');

        // Variables para almacenar los cálculos
        $depreciacionAnual = [];
        $depreciacionAcumulada = [];
        $valorLibros = [];
        $tasaDepreciacionArray = [];

        // Inicialización
        $valorLibros[0] = $valorInicial; // Valor en libros al año 0 es el valor inicial
        $depreciacionAnual[0] = 0; // En el año 0 no hay depreciación
        $depreciacionAcumulada[0] = 0; // Acumulada en el año 0 es 0
        $tasaDepreciacionArray[0] = $tasaDepreciacion * 100; // Mostrar tasa de depreciación en %

        // Cálculos a partir del año 1
        for ($i = 1; $i <= $vidaUtil; $i++) {
            $depreciacionAnual[$i] = $valorLibros[$i - 1] * $tasaDepreciacion;
            $depreciacionAcumulada[$i] = $depreciacionAcumulada[$i - 1] + $depreciacionAnual[$i];
            $valorLibros[$i] = $valorLibros[$i - 1] - $depreciacionAnual[$i];
            $tasaDepreciacionArray[$i] = $tasaDepreciacion * 100; // Guardar la tasa en porcentaje
        }

        // Datos a enviar a la vista
        $data = [
            'vida_util' => $vidaUtil,
            'depreciacion_anual' => $depreciacionAnual,
            'depreciacion_acumulada' => $depreciacionAcumulada,
            'valor_libros' => $valorLibros,
            'tasa_depreciacion' => $tasaDepreciacionArray
        ];

        // Enviar los resultados a la vista
        return view('formrate', $data);
    }

    
}