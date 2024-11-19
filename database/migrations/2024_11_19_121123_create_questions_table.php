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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();

            // Alterando as colunas para suportar texto maior
            $table->text('question'); // Para perguntas longas
            $table->text('choices');  // Para listas de escolhas grandes
            $table->text('correct');  // Para respostas corretas maiores (se necessário)

            $table->integer('points');

            // Adicionar a coluna de chave estrangeira
            $table->unsignedBigInteger('quiz_id');

            // Definir a chave estrangeira
            $table->foreign('quiz_id')->references('id')->on('quizzes')->onDelete('cascade');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
