<!DOCTYPE html>
<html>
<head>
    <title>Laporan PTSP BMKG - {{ $start_date }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #333; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header h2 { margin: 0; font-size: 16px; text-transform: uppercase; }
        .header h3 { margin: 2px 0; font-size: 14px; text-transform: uppercase; }
        .header p { margin: 5px 0; font-size: 11px; color: #555; }
        
        .filter-info { margin-bottom: 15px; font-weight: bold; text-transform: uppercase; font-size: 9px; color: #666; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 0.5px solid #333; padding: 6px 8px; text-align: left; }
        th { background-color: #f8fafc; font-weight: bold; text-transform: uppercase; font-size: 9px; }
        
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .total-box { 
            margin-top: 20px; 
            padding: 10px; 
            background-color: #f1f5f9; 
            border: 1px solid #cbd5e1;
            font-size: 12px; 
            font-weight: bold; 
            text-align: right; 
        }
        
        .footer-sign { margin-top: 40px; width: 100%; }
        .footer-sign td { border: none; padding: 0; }
        .sign-area { text-align: center; width: 250px; float: right; }
    </style>
</head>
<body>
    <div class="header">
        <h2>BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA</h2>
        <h3>STASIUN METEOROLOGI RADIN INTEN II LAMPUNG</h3>
        <p>Jl. Alamsyah Ratu Prawira Negara Km. 28 Branti, Natar, Lampung Selatan | Telp: +62 823-6335-3482</p>
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
        <h4 style="margin: 0; text-decoration: underline; text-transform: uppercase;">LAPORAN PELAYANAN DATA METEOROLOGI (PNBP)</h4>
        <p style="margin: 5px 0;">Periode: <strong>{{ date('d/m/Y', strtotime($start_date)) }}</strong> s/d <strong>{{ date('d/m/Y', strtotime($end_date)) }}</strong></p>
    </div>

    <div class="filter-info">
        Filter Status: {{ $status ? strtoupper(str_replace('_', ' ', $status)) : 'SEMUA DATA' }}
    </div>

    <table>
        <thead>
            <tr>
                <th width="3%" class="text-center">No</th>
                <th width="12%">Tanggal</th>
                <th width="12%">Kode Tiket</th>
                <th>Nama Pemohon</th>
                <th>Jenis Informasi</th>
                <th width="10%" class="text-center">Status</th>
                <th width="15%" class="text-right">Tarif PNBP</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reports as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->created_at->format('d/m/Y H:i') }}</td>
                <td><strong>{{ $item->ticket_code }}</strong></td>
                <td>{{ strtoupper($item->name) }}</td>
                <td>{{ $item->catalog->info_type ?? 'Custom Request' }}</td>
                <td class="text-center">{{ strtoupper(str_replace('_', ' ', $item->status)) }}</td>
                <td class="text-right">Rp {{ number_format($item->catalog->price ?? 0, 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="text-center" style="padding: 20px;">TIDAK ADA DATA DITEMUKAN PADA PERIODE INI</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    @if($total_pnbp > 0)
    <div class="total-box">
        TOTAL PENERIMAAN PNBP: Rp {{ number_format($total_pnbp, 0, ',', '.') }}
    </div>
    <p style="font-size: 8px; font-style: italic; color: #666;">* Total hanya menghitung permohonan dengan status PAID atau DONE</p>
    @endif

    <div class="footer-sign">
        <div class="sign-area">
            <p>Lampung Selatan, {{ date('d F Y') }}</p>
            <p>Dicetak pada: {{ now()->format('H:i') }} WIB</p>
            <p style="margin-top: 10px;">Admin Operasional PTSP,</p>
            <br><br><br><br>
            <p><strong>( {{ strtoupper($admin_name) }} )</strong></p>
            <p style="font-size: 8px; color: #999;">Sistem Informasi Layanan Data BMKG Radin Inten II</p>
        </div>
    </div>
</body>
</html>