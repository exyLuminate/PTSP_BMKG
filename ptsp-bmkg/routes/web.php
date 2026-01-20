<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RequestManagementController;
use App\Http\Controllers\Admin\DataCatalogController;
use App\Http\Controllers\FileStreamController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/requests', [RequestManagementController::class, 'index'])->name('requests.index');
    Route::get('/requests/{id}', [RequestManagementController::class, 'show'])->name('requests.show');
    Route::patch('/requests/{id}', [RequestManagementController::class, 'update'])->name('requests.update');
    Route::get('/requests/{id}/file/{type}', [FileStreamController::class, 'streamForAdmin'])->name('file.stream');
    Route::resource('catalogs', DataCatalogController::class)->except(['create', 'edit']);
});

require __DIR__.'/auth.php';
