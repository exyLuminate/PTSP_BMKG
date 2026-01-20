<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataCatalog; // Pastikan model ini sudah ada
use App\Models\ActivityLog; // Import model log untuk audit trail
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    /**
     * Menampilkan daftar katalog untuk Admin
     */
    public function index()
    {
        return Inertia::render('Admin/CatalogList', [
            'catalogs' => DataCatalog::orderBy('category')->get()
        ]);
    }

    /**
     * Menyimpan item katalog baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'info_type' => 'required|string|max:255',
            'category'  => 'required|in:Meteorologi,Khusus,Konsultasi', // Sesuaikan dengan enum di DB
            'unit'      => 'required|string',
            'price'     => 'required|numeric|min:0',
        ]);

        $catalog = DataCatalog::create($validated);

        // CATAT LOG: Penambahan katalog baru
        ActivityLog::record('add_catalog', [
            'info_type' => $catalog->info_type,
            'category'  => $catalog->category,
            'price'     => $catalog->price
        ]);

        return redirect()->back()->with('success', 'Item katalog berhasil ditambahkan.');
    }

    /**
     * Memperbarui item katalog yang ada
     */
    public function update(Request $request, string $id)
    {
        $catalog = DataCatalog::findOrFail($id);
        
        // Simpan data lama untuk perbandingan di audit trail
        $oldData = [
            'info_type' => $catalog->info_type,
            'price'     => $catalog->price
        ];

        $validated = $request->validate([
            'info_type' => 'required|string|max:255',
            'category'  => 'required|string',
            'unit'      => 'required|string',
            'price'     => 'required|numeric|min:0',
        ]);

        $catalog->update($validated);

        // CATAT LOG: Perubahan data katalog
        ActivityLog::record('update_catalog', [
            'item'      => $catalog->info_type,
            'old_price' => $oldData['price'],
            'new_price' => $catalog->price,
            'changes'   => array_diff($validated, $oldData) // Opsional: catat hanya yang berubah
        ]);

        return redirect()->back()->with('success', 'Item katalog berhasil diperbarui.');
    }

    /**
     * Menghapus item katalog
     */
    public function destroy(string $id)
    {
        $catalog = DataCatalog::findOrFail($id);

        // CATAT LOG: Sebelum data dihapus agar info_type tetap terekam
        ActivityLog::record('delete_catalog', [
            'item'     => $catalog->info_type,
            'category' => $catalog->category,
            'price'    => $catalog->price
        ]);

        $catalog->delete();

        return redirect()->back()->with('success', 'Item katalog berhasil dihapus.');
    }
}