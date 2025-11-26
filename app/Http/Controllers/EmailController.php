<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\LoginLogs;
use App\Models\LoginOtp;
use App\Models\User;
use Exception;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use PDO;

class EmailController extends Controller
{
    //

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $otpLogin = LoginOtp::where("email", $request->email)->first();
        
        if (!$otpLogin) {
            return response()->json(['error' => 'OTP not found. Please request a new OTP.'], 404);
        }

        // Check expiration
        if (now()->greaterThan($otpLogin->otp_expires_at)) {
            return response()->json(['error' => 'OTP expired'], 400);
        }

        // Check code
        if ($request->otp !== $otpLogin->otp) {
            return response()->json(['error' => 'Invalid OTP'], 400);
        }

        $otpLogin->delete();

        // Log the user in
        Auth::login($user);
        
        // Create login log entry after successful OTP verification
        // This ensures that next time the user logs in, they won't need OTP (first-time login only)
        if (DB::getSchemaBuilder()->hasTable('login_logs')) {
            $loginLog = LoginLogs::where('email', $request->email)->first();
            if (!$loginLog) {
                LoginLogs::create([
                    'user_id' => $user->id,
                    'email' => $request->email,
                ]);
            }
        }
        
        return response()->json(['success' => 'Logged In Successfully'], 200);
    }

    public function resendOTP(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where("email", $request->email)->first();

        if (!$user) {
            return response()->json([
                "error" => "Email not found"
            ], 404);
        }

        // Delete existing OTP if any (don't fail if it doesn't exist)
        $lOtp = LoginOtp::where('email', $request->email)->first();
        if ($lOtp) {
            $lOtp->delete();
        }

        try {
            $otp = rand(100000, 999999);



            LoginOtp::create([
                "otp" =>  $otp,
                "code" => "",
                "email" => $request->email,
                "otp_expires_at" =>  now()->addMinutes(5)
            ]);

            $name = $user->name;
            $email = $request->email;
            $subject = "Your OTP Code";
            $body = "Your OTP code is "  . $otp . ". It expires in 5 minutes.";

            Mail::to($email)->send(new OtpMail($name, $email, $subject, $body));

            return response()->json(['success' => 'New OTP sent successfully'], 200);
        } catch (Exception $e) {
            return response()->json([
                "msg" => "Failed to send OTP email",
                "error" => $e->getMessage()  // will show the actual error message
            ], 500);
        }
    }

    public function sendOtp(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'msg' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        $user = User::where("email", $request->email)->first();

        if (!$user) {
            return response()->json([
                'msg' => 'Email not found',
                'error' => 'Email not found'
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'msg' => 'Invalid password',
                'error' => 'Invalid password'
            ], 401);
        }

        // Check if login_otp table exists
        if (!DB::getSchemaBuilder()->hasTable('login_otp')) {
            Log::error('login_otp table does not exist. Please run migrations.');
            return response()->json([
                'msg' => 'Database configuration error',
                'error' => 'OTP table not found. Please contact administrator.'
            ], 500);
        }

        try {
            // Delete existing OTP if any
            $lOtp = LoginOtp::where('email', $request->email)->first();
            if ($lOtp) {
                $lOtp->delete();
            }

            $otp = rand(100000, 999999);
            
            // Check if login_logs table exists before trying to use it
            if (DB::getSchemaBuilder()->hasTable('login_logs')) {
                $login_log = LoginLogs::where("email", $request->email)->first();

                if (!$login_log) {
                    LoginLogs::create([
                        "user_id" => $user->id,
                        "email" => $request->email,
                    ]);
                }
            }

            LoginOtp::create([
                "otp" => $otp,
                "code" => "",
                "email" => $request->email,
                "otp_expires_at" => now()->addMinutes(5)
            ]);

            $name = $user->name ?? $user->email ?? 'User';
            $email = $request->email;
            $subject = "Your OTP Code";
            $body = "Your OTP code is "  . $otp . ". It expires in 5 minutes.";

            try {
                Mail::to($email)->send(new OtpMail($name, $email, $subject, $body));
            } catch (\Exception $mailException) {
                Log::error('Mail sending failed in sendOtp', [
                    'email' => $email,
                    'error' => $mailException->getMessage(),
                    'trace' => $mailException->getTraceAsString()
                ]);
                // Don't fail the request if mail fails - OTP is still created
                // But log it for debugging
            }
            
            // Return success response
            return response()->json([
                "msg" => "OTP sent successfully",
                "success" => true
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Re-throw validation exceptions so they return proper 422 status
            throw $e;
        } catch (Exception $e) {
            // Log the full error for debugging
            Log::error('Error in sendOtp: ' . $e->getMessage(), [
                'email' => $request->input('email'),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                "msg" => "Failed to send OTP email",
                "error" => config('app.debug') ? $e->getMessage() : "An error occurred. Please try again later."
            ], 500);
        }
    }
}
