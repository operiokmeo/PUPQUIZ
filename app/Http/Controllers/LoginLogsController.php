<?php

namespace App\Http\Controllers;

use App\Models\LoginLogs;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class LoginLogsController extends Controller
{
    public function isFirstLogin(Request $request)
    {
        // Validate input
        $request->validate([
            'email' => 'required|email'
        ]);

        try {
            // Check if the table exists before querying
            if (!DB::getSchemaBuilder()->hasTable('login_logs')) {
                Log::warning('login_logs table does not exist. Please run migrations.');
                // Return false if table doesn't exist (treat as first login)
                return response()->json([
                    "exist" => false,
                    "error" => "Database table not found. Please run migrations."
                ], 200);
            }

            // Check if user has logged in before by checking login_logs table
            // If a login log exists, it means the user has successfully completed OTP verification before
            $loginLog = LoginLogs::where('email', $request->input('email'))->first();
            
            // If login log exists, user has logged in before (no OTP needed)
            if ($loginLog) {
                return response()->json([
                    "exist" => true
                ]);
            }

            // No login log found - this is first-time login, OTP is required
            return response()->json([
                "exist" => false
            ]);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error in isFirstLogin: ' . $e->getMessage(), [
                'email' => $request->input('email'),
                'exception' => $e
            ]);

            // Return a safe default response instead of throwing 500
            return response()->json([
                "exist" => false,
                "error" => "An error occurred while checking login status."
            ], 500);
        }
    }
}
