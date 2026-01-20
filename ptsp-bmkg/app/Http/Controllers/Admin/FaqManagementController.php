<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FaqMessage;
use App\Models\ActivityLog; // Import model Log
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

    /**
     * Menyimpan pertanyaan baru (biasanya dari sisi publik)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
            'email'     => 'nullable|email|max:255',
            'question'  => 'required|string|min:10',
        ]);

        $faq = FaqMessage::create($validated);

        // Opsional: Catat log jika ingin tahu ada pertanyaan masuk
        ActivityLog::create([
            'user_id' => auth()->id() ?? 1, // Jika publik, bisa di-set ke admin default atau null
            'action' => 'receive_faq',
            'details' => [
                'from' => $faq->user_name,
                'question' => $faq->question
            ]
        ]);

        return redirect()->back()->with('success', 'Pertanyaan Anda telah dikirim.');
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

        // CATAT LOG: Admin menjawab atau mengubah status FAQ
        ActivityLog::record('update_faq', [
            'question' => $faq->question,
            'is_published' => $faq->is_published ? 'Published' : 'Draft',
            'has_answer' => !empty($faq->answer)
        ]);

        return redirect()->back()->with('success', 'FAQ berhasil diperbarui.');
    }

    /**
     * Menghapus pertanyaan FAQ
     */
    public function destroy($id)
    {
        $faq = FaqMessage::findOrFail($id);
        
        // Simpan konten sebelum dihapus untuk detail log
        $deletedContent = $faq->question;

        // CATAT LOG: Sebelum data benar-benar hilang
        ActivityLog::record('delete_faq', [
            'question' => $deletedContent,
            'asked_by' => $faq->user_name
        ]);

        $faq->delete();

        return redirect()->back()->with('success', 'Pertanyaan FAQ berhasil dihapus.');
    }
}