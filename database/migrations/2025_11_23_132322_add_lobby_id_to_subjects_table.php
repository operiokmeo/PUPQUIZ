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
        Schema::table('subjects', function (Blueprint $table) {
            // Add lobby_id column if it doesn't exist
            if (!Schema::hasColumn('subjects', 'lobby_id')) {
                $table->unsignedBigInteger('lobby_id')->nullable()->after('subject_name');
                $table->foreign('lobby_id')->references('id')->on('lobby')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            // Drop foreign key first, then the column
            if (Schema::hasColumn('subjects', 'lobby_id')) {
                $table->dropForeign(['lobby_id']);
                $table->dropColumn('lobby_id');
            }
        });
    }
};
