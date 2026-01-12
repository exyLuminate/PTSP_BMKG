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
    Schema::create('faq_messages', function (Blueprint $table) {
        $table->id(); // [cite: 75]
        $table->string('user_name'); // [cite: 76]
        $table->string('email')->nullable(); // [cite: 77]
        $table->text('question'); // [cite: 78]
        $table->text('answer')->nullable(); // Diisi oleh admin [cite: 79]
        $table->boolean('is_published')->default(false); // Kontrol tampilan publik [cite: 80, 252]
        $table->timestamps(); // [cite: 81]
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faq_messages');
    }
};
