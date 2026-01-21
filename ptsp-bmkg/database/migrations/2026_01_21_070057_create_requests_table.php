<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('requests', function (Blueprint $table) {
        // Menambahkan kolom yang belum ada
        if (!Schema::hasColumn('requests', 'payment_proof_path')) {
            $table->string('payment_proof_path')->after('letter_path')->nullable();
        }
        if (!Schema::hasColumn('requests', 'va_file_path')) {
            $table->string('va_file_path')->after('va_number')->nullable();
        }

       
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};