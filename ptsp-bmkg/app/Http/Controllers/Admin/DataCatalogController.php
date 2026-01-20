<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataCatalog;
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

        DataCatalog::create($validated);
        return redirect()->back()->with('success', 'Item katalog berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $catalog = DataCatalog::findOrFail($id);
        
        $validated = $request->validate([
        'info_type' => 'required|string|max:255',
        'category'  => 'required|in:INFORMASI METEOROLOGI,INFORMASI KHUSUS METEOROLOGI,JASA KONSULTASI METEOROLOGI',
        'unit'      => 'required|string',
        'price'     => 'required|numeric|min:0',
        ]);

        $catalog->update($validated);
        return redirect()->back()->with('success', 'Item katalog berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $catalog = DataCatalog::findOrFail($id);
        $catalog->delete();
        return redirect()->back()->with('success', 'Item katalog berhasil dihapus.');
    }
}