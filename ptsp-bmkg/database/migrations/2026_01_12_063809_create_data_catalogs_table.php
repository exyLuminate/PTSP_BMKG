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
        Schema::create('data_catalogs', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // Tambahkan kolom kategori untuk grouping
            $table->string('info_type');
            $table->string('unit');      // Contoh: per lokasi - per hari
            $table->decimal('price', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_catalogs');
    }
};