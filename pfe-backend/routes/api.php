<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RapportController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/me', [AuthController::class, 'me']);

  Route::apiResource('clients', ClientController::class);
  Route::apiResource('factures', FactureController::class);

  Route::get('/paiements',  [PaiementController::class, 'index']);
  Route::post('/paiements', [PaiementController::class, 'store']);

  Route::get('/rapports',   [RapportController::class, 'index']);
  Route::post('/rapports',  [RapportController::class, 'store']);

  Route::get('/dashboard/stats',           [DashboardController::class, 'stats']);
  Route::get('/dashboard/revenue',         [DashboardController::class, 'revenue']);
  Route::get('/dashboard/top-clients',     [DashboardController::class, 'topClients']);
  Route::get('/dashboard/recent-invoices', [DashboardController::class, 'recentInvoices']);
});
