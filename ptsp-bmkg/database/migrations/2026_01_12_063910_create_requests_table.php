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
    Schema::create('requests', function (Blueprint $table) {
        $table->id();
        $table->string('ticket_code')->unique();
        $table->text('nik'); 
        $table->string('access_password');
        $table->string('name');
        $table->string('email');
        $table->text('description')->nullable();
        $table->integer('quantity');
        $table->string('ktp_path');
        $table->string('letter_path');
        $table->foreignId('data_catalog_id')->constrained();
            $table->enum('status', ['on_process', 'ready', 'rejected', 'waiting_payment', 'paid', 'expired', 'done'])->default('on_process');
        $table->string('va_number')->nullable();
        $table->string('result_file_path')->nullable();
        $table->text('admin_note')->nullable();
        $table->timestamp('ready_at')->nullable();
        $table->timestamp('va_expired_at')->nullable();
        $table->timestamp('download_expired_at')->nullable();
        $table->timestamps();
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
