<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->get('/', 'Main::index');
$routes->get('form', 'Main::form');
$routes->post('results', 'Main::results');

$routes->get('formrate', 'Main::formrate');
$routes->post('resultTs', 'Main::resultTs');
$routes->post('calcular_depreciacion', 'Main::calcularDepreciacion');


