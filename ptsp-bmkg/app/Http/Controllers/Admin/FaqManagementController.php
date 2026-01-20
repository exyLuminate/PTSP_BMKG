<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FaqMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqManagementController extends Controller
{
    /**
     * Menampilkan daftar semua FAQ untuk Admin
     */
    public function index()
    {
        return Inertia::render('Admin/FaqList', [
            'faqs' => FaqMessage::orderBy('created_at', 'desc')->get()
        ]);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'user_name' => 'required|string|max:255',
        'email'     => 'nullable|email|max:255',
        'question'  => 'required|string|min:10',
    ]);

    // Simpan dengan status is_published = false (Draft) secara default
    FaqMessage::create($validated);

    return redirect()->back()->with('success', 'Pertanyaan Anda telah dikirim dan akan segera dijawab oleh tim kami.');
}

    /**
     * Memperbarui jawaban dan status publikasi
     */
    public function update(Request $request, $id)
    {
        $faq = FaqMessage::findOrFail($id);

        $validated = $request->validate([
            'answer' => 'required|string',
            'is_published' => 'required|boolean',
        ]);

        $faq->update($validated);

        return redirect()->back()->with('success', 'FAQ berhasil diperbarui dan status publikasi diubah.');
    }

    /**
     * Menghapus pertanyaan FAQ
     */
    public function destroy($id)
    {
        $faq = FaqMessage::findOrFail($id);
        $faq->delete();

        return redirect()->back()->with('success', 'Pertanyaan FAQ berhasil dihapus.');
    }
}
