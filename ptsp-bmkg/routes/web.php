<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqManagementController;
use App\Models\FaqMessage;
use App\Http\Controllers\Admin\RequestManagementController;
use App\Http\Controllers\Admin\DataCatalogController;
use App\Models\DataCatalog;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\FileStreamController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\User\DataRequestController;
use App\Http\Controllers\User\StatusController;

Route::prefix('permohonan')->name('permohonan.')->group(function () {
    Route::get('/', [DataRequestController::class, 'create'])->name('create');
    Route::post('/store', [DataRequestController::class, 'store'])->name('store');
    Route::get('/berhasil/{ticket}', [DataRequestController::class, 'success'])->name('success');
});

Route::get('/permohonan/download-bukti/{ticket}', [DataRequestController::class, 'downloadProof'])
    ->name('permohonan.download_proof');
Route::get('/permohonan/file/{id}/{type}', [FileStreamController::class, 'streamForUser'])
    ->name('permohonan.file.stream');

Route::prefix('cek-status')->name('status.')->group(function () {
    Route::get('/', [StatusController::class, 'index'])->name('index');
    Route::get('/cari', [StatusController::class, 'search'])->name('search'); // Berubah ke GET
    Route::get('/detail/{ticket}', [StatusController::class, 'show'])->name('show'); // Berubah ke GET + Param
    Route::post('/verify', [StatusController::class, 'verifyPassword'])->name('verify_password');
    Route::post('/upload-proof/{ticket}', [StatusController::class, 'uploadProof'])->name('upload_proof');
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'catalogs' => DataCatalog::all(),
        'canRegister' => false,
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/faq', function () {
    return Inertia::render('Guest/FaqPage', [
        'faqs' => FaqMessage::where('is_published', true)->orderBy('created_at', 'desc')->get()
    ]);
})->name('faq.index');

Route::post('/faq', [App\Http\Controllers\Admin\FaqManagementController::class, 'store'])->name('faq.store');

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
    Route::resource('faqs', FaqManagementController::class)->only(['index', 'update', 'destroy']);
    Route::get('/logs', [ActivityLogController::class, 'index'])->name('logs.index');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/download', [ReportController::class, 'download'])->name('reports.download');
});

require __DIR__.'/auth.php';
