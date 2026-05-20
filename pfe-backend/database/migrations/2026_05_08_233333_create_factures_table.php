<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->string('numero_facture')->unique();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->date('date_emission');
            $table->date('date_echeance');
            $table->enum('statut', ['payée', 'en_attente', 'en_retard'])->default('en_attente');
            $table->decimal('taxe', 5, 2)->default(0);
            $table->decimal('remise', 5, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->string('piece_jointe')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};
