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

            $isVerified = !is_null($user->email_verified_at);

            if ($isVerified) {
                // Ensure we keep a login log entry once the user has been verified
                if (!$loginLog) {
                    LoginLogs::create([
                        'user_id' => $user->id,
                        'email' => $user->email,
                    ]);
                }

                return response()->json([
                    "exist" => true
                ]);
            }

            // Use OTP login if the user still isn't verified
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
