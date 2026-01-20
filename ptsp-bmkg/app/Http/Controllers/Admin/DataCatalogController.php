<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataCatalog;
use App\Models\ActivityLog; // Pastikan ini di-import
use Illuminate\Http\Request;
use Inertia\Inertia;

class DataCatalogController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/CatalogList', [
            'catalogs' => DataCatalog::orderBy('category')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'info_type' => 'required|string|max:255',
            'category'  => 'required|in:Meteorologi,Khusus,Konsultasi',
            'unit'      => 'required|string',
            'price'     => 'required|numeric|min:0',
        ]);

        // 1. Simpan data ke variabel $catalog terlebih dahulu
        $catalog = DataCatalog::create($validated);

        // 2. Catat Log menggunakan data yang baru disimpan
        ActivityLog::record('add_catalog', [
            'info_type' => $catalog->info_type,
            'price' => $catalog->price
        ]);

        return redirect()->back()->with('success', 'Item katalog berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $catalog = DataCatalog::findOrFail($id);
        
        // Simpan harga lama untuk perbandingan di log
        $oldPrice = $catalog->price;

        $validated = $request->validate([
            'info_type' => 'required|string|max:255',
            'category'  => 'required|in:Meteorologi,Khusus,Konsultasi',
            'unit'      => 'required|string',
            'price'     => 'required|numeric|min:0',
        ]);

        $catalog->update($validated);

        // Catat Log perubahan
        ActivityLog::record('update_catalog', [
            'item' => $catalog->info_type,
            'old_price' => $oldPrice,
            'new_price' => $catalog->price
        ]);

        return redirect()->back()->with('success', 'Item katalog berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $catalog = DataCatalog::findOrFail($id);

        // Catat Log SEBELUM data dihapus agar datanya masih bisa diakses
        ActivityLog::record('delete_catalog', [
            'item' => $catalog->info_type,
            'category' => $catalog->category
        ]);

        $catalog->delete();
        return redirect()->back()->with('success', 'Item katalog berhasil dihapus.');
    }
}