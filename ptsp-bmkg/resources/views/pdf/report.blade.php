<!DOCTYPE html>
<html>
<head>
    <title>Laporan PTSP BMKG</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; }
        .header { text-align: center; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; text-transform: uppercase; }
        .total { margin-top: 20px; font-size: 13px; font-weight: bold; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="margin:0">LAPORAN PELAYANAN DATA METEOROLOGI</h2>
        <h3 style="margin:5px 0">STASIUN METEOROLOGI RADIN INTEN II LAMPUNG</h3>
        <p>Periode: {{ $start_date }} s/d {{ $end_date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Tiket</th>
                <th>Nama Pemohon</th>
                <th>Jenis Data</th>
                <th>Status</th>
                <th>Tarif PNBP</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reports as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item->created_at->format('d-m-Y') }}</td>
                <td>{{ $item->ticket_code }}</td>
                <td>{{ $item->name }}</td>
                <td>{{ $item->catalog->info_type }}</td>
                <td>{{ strtoupper($item->status) }}</td>
                <td>Rp {{ number_format($item->catalog->price, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        Total Penerimaan PNBP: Rp {{ number_format($total_pnbp, 0, ',', '.') }}
    </div>

    <div style="margin-top: 50px; float: right; text-align: center;">
        <p>Dicetak pada: {{ date('d-m-Y H:i') }}</p>
        <p>Admin Operasional,</p>
        <br><br><br>
        <p><strong>( {{ $admin_name }} )</strong></p>
    </div>
</body>
</html>