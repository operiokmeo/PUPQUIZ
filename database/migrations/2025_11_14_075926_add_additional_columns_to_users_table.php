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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->nullable()->unique()->after('email');
            }
            if (!Schema::hasColumn('users', 'student_number')) {
                $table->string('student_number')->nullable()->after('username');
            }
            if (!Schema::hasColumn('users', 'program')) {
                $table->string('program')->nullable()->after('student_number');
            }
            if (!Schema::hasColumn('users', 'section')) {
                $table->string('section')->nullable()->after('program');
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->integer('role')->nullable()->after('section'); // 1 = teacher, 2 = student, 3 = organizer, 4 = member
            }
            if (!Schema::hasColumn('users', 'department')) {
                $table->string('department')->nullable()->after('role');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'student_number', 'program', 'section', 'role', 'department']);
        });
    }
};
