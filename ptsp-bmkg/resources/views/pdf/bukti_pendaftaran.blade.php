<!DOCTYPE html>
<html>
<head>
    <title>Bukti Pendaftaran PTSP BMKG</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h2 { margin: 0; text-transform: uppercase; font-size: 16px; }
        .header p { margin: 2px 0; font-size: 10px; }
        .ticket-box { background: #f0f7ff; border: 1px dashed #3b82f6; padding: 15px; text-align: center; margin-bottom: 20px; }
        .ticket-code { font-size: 26px; font-weight: bold; color: #1e3a8a; letter-spacing: 2px; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table th, table td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; }
        table th { background-color: #f9fafb; width: 35%; font-size: 10px; text-transform: uppercase; color: #666; }
        .total-row { background-color: #eff6ff; font-weight: bold; }
        .footer { margin-top: 30px; font-size: 9px; color: #777; font-style: italic; }
        .note { background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; font-size: 10px; border-radius: 5px; }
        .pass-text { font-family: monospace; font-size: 14px; font-weight: bold; color: #dc2626; }
    </style>
</head>
<body>
    <div class="header">
        <h2>BADAN METEOROLOGI KLIMATOLOGI DAN GEOFISIKA</h2>
        <p>Stasiun Meteorologi Radin Inten II Lampung</p>
        <p>Jl. Alamsyah Ratu Prawira Negara Km. 28 Branti, Natar, Lampung Selatan | Telp: +62 823-6335-3482</p>
    </div>

    <h3 style="text-align: center; text-transform: uppercase; letter-spacing: 1px;">BUKTI PENDAFTARAN PERMOHONAN DATA</h3>

    <div class="ticket-box">
        <p style="margin: 0; font-size: 10px; font-weight: bold; color: #3b82f6; text-transform: uppercase;">KODE TIKET ANDA</p>
        <div class="ticket-code">{{ $request_data->ticket_code }}</div>
    </div>

    <table>
        <tr>
            <th>Password Akses Dokumen</th>
            <td class="pass-text">{{ $request_data->access_password }}</td>
        </tr>
        <tr>
            <th>Nama Pemohon</th>
            <td>{{ $request_data->name }}</td>
        </tr>
        <tr>
            <th>Email</th>
            <td>{{ $request_data->email }}</td>
        </tr>
        <tr>
            <th>Jenis Informasi</th>
            <td>{{ $request_data->catalog->info_type }}</td>
        </tr>
        <tr>
            <th>Tarif Satuan (Asli)</th>
            <td>Rp {{ number_format($request_data->catalog->price, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <th>Jumlah Pesanan</th>
            <td>{{ $request_data->quantity }} {{ $request_data->catalog->unit }}</td>
        </tr>
        <tr class="total-row">
            <th>Total Yang Harus Dibayar</th>
            <td style="color: #1e3a8a; font-size: 14px;">Rp {{ number_format($request_data->catalog->price * $request_data->quantity, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <th>Tanggal Daftar</th>
            <td>{{ $request_data->created_at->format('d F Y H:i') }} WIB</td>
        </tr>
    </table>

    <div class="note">
        <strong>PENTING:</strong>
        <ul>
            <li><strong>Password Akses</strong> di atas digunakan untuk mengunduh hasil data jika sudah disetujui. Jangan sampai hilang!</li>
            <li>Data akan tersedia <strong>paling lambat 3 Hari Kerja</strong> (Sabtu, Minggu, dan hari libur nasional tidak dihitung dalam masa proses).</li>
            <li>Harap lakukan pengecekan status tiket secara berkala melalui menu <strong>Cek Status</strong> di website PTSP.</li>
            <li>Segera lakukan pembayaran setelah Kode Billing diterbitkan oleh admin.</li>
            <li>Jika melewati batas 7 hari, Kode Billing akan kedaluwarsa dan Anda wajib <strong>meminta ulang kode billing</strong> pada halaman cek status.</li>
            <li>Setelah status menjadi "PAID", file data dapat diunduh dalam masa aktif <strong>14 hari</strong>.</li>
        </ul>
    </div>

    <div class="footer">
        Bukti pendaftaran ini dihasilkan otomatis oleh sistem PTSP BMKG Lampung pada {{ date('d/m/Y H:i') }}.
    </div>
</body>
</html>