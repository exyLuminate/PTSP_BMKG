<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\DataRequest;
use App\Models\DataCatalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf; 

class DataRequestController extends Controller
{
    public function create()
    {
        return Inertia::render('User/FormPermohonan', [
            'catalogs' => DataCatalog::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'nik' => 'required|digits:16',
            'data_catalog_id' => 'required|exists:data_catalogs,id',
            'quantity' => 'required|integer|min:1',
            'description' => 'required|string',
            'password' => 'required|min:6',
            'ktp' => 'required|mimes:pdf|max:4096', 
            'letter' => 'required|mimes:pdf|max:4096', 
        ]);

        $ticketCode = 'PTSP-' . strtoupper(Str::random(6));

        $ktpPath = $request->file('ktp')->store('documents/ktp');
        $letterPath = $request->file('letter')->store('documents/letters');

        DataRequest::create([
            'ticket_code' => $ticketCode,
            'nik' => Crypt::encryptString($request->nik), 
            'access_password' => $request->password,
            'name' => $request->name,
            'email' => $request->email,
            'data_catalog_id' => $request->data_catalog_id,
            'quantity' => $request->quantity,
            'description' => $request->description,
            'ktp_path' => $ktpPath,
            'letter_path' => $letterPath,
            'status' => 'on_process', 
        ]);

        return redirect()->route('permohonan.success', ['ticket' => $ticketCode]);
    }

    public function success($ticket)
    {
        return Inertia::render('User/SuccessPermohonan', [
            'ticket_code' => $ticket
        ]);
    }

    public function downloadProof($ticket)
    {
        $requestData = DataRequest::with('catalog')->where('ticket_code', $ticket)->firstOrFail();

        $pdf = Pdf::loadView('pdf.bukti_pendaftaran', [
            'request_data' => $requestData
        ]);

        return $pdf->download('Bukti_PTSP_' . $ticket . '.pdf');
    }
}