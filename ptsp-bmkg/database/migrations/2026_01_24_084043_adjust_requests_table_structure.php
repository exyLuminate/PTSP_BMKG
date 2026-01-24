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
        // Hapus kolom yang tidak diperlukan


        $table->timestamp('downloaded_at')->nullable();
        
        // Update Enum (khusus MySQL)
        DB::statement("ALTER TABLE requests MODIFY COLUMN status ENUM('on_process','rejected','waiting_payment','invalid','verifikasi_payment','paid','expired','done') DEFAULT 'on_process'");
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

