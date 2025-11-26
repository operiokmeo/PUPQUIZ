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
        Schema::table('subject_questions', function (Blueprint $table) {
            // Change question column from string(255) to LONGTEXT to support long AI-generated questions
            $table->longText('question')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subject_questions', function (Blueprint $table) {
            // Revert back to string(255) if needed
            $table->string('question', 255)->change();
        });
    }
};

