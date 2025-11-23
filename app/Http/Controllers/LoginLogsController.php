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

            // Check if user has logged in before
            $loginLog = LoginLogs::where('email', $request->input('email'))->first();
            
            // Also check if the user's email is verified
            $user = User::where('email', $request->input('email'))->first();
            
            // If user doesn't exist, return false (will use OTP login)
            if (!$user) {
                return response()->json([
                    "exist" => false
                ]);
            }
            
            // User can use regular login only if:
            // 1. They have logged in before (exist in login_logs)
            // 2. AND their email is verified
            if ($loginLog && $user->hasVerifiedEmail()) {
                return response()->json([
                    "exist" => true
                ]);
            } else {
                // Use OTP login if:
                // - User hasn't logged in before, OR
                // - User's email is not verified
                return response()->json([
                    "exist" => false
                ]);
            }
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
