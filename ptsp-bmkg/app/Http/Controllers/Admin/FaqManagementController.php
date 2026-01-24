<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FaqMessage;
use App\Models\ActivityLog; 
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqManagementController extends Controller
{
    /**
     * Menampilkan daftar FAQ untuk Admin
     * Sinkron dengan: faqs.data.map & faqs.links di React
     */
    public function index()
    {
        return Inertia::render('Admin/FaqList', [
            // Penting: Gunakan paginate agar struktur data memiliki 'data' dan 'links'
            'faqs' => FaqMessage::orderBy('created_at', 'desc')->paginate(10)
        ]);
    }

    /**
     * Update Jawaban & Status Publikasi
     * Sinkron dengan: patch(route('admin.faqs.update', selectedFaq.id))
     */
    public function update(Request $request, $id)
    {
        $faq = FaqMessage::findOrFail($id);

        // Validasi data dari form modal
        $validated = $request->validate([
            'answer' => 'required|string',
            'is_published' => 'required|boolean',
        ]);

        // Simpan status lama untuk kebutuhan log audit
        $oldStatus = $faq->is_published;

        $faq->update($validated);

        // CATAT LOG: Menggunakan helper record() yang sudah kita buat
        ActivityLog::record('update_faq_status', [
            'question' => substr($faq->question, 0, 50) . '...',
            'published_status' => $faq->is_published ? 'Published' : 'Draft',
            'action' => ($oldStatus != $faq->is_published) ? 'Toggle Visibility' : 'Update Answer'
        ]);

        // Redirect back agar Inertia merefresh data di tabel tanpa reload halaman
        return redirect()->back()->with('success', 'FAQ berhasil diperbarui.');
    }
}