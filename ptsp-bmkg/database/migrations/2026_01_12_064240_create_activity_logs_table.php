<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up() {
    Schema::create('activity_logs', function (Blueprint $table) {
        $table->id(); // [cite: 70]
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign Key ke tabel users (Admin) [cite: 71, 84]
        $table->string('action'); // Contoh: "verify_payment", "upload_va" [cite: 72]
        $table->json('details')->nullable(); // Detail aksi dalam format JSON [cite: 73]
        $table->timestamps(); // [cite: 81]
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
