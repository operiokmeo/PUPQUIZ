<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiProxyController extends Controller
{
    private $aiServiceUrl;

    public function __construct()
    {
        // Default to localhost:8800 if not specified in .env
        // This is where the Python service is running on the VPS
        $this->aiServiceUrl = env('AI_SERVICE_INTERNAL_URL', 'http://127.0.0.1:8800');
    }

    public function generateQuiz(Request $request)
    {
        try {
            $response = Http::timeout(120)->post("{$this->aiServiceUrl}/generate-quiz", $request->all());
            
            if ($response->successful()) {
                return response()->json($response->json());
            }
            
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            Log::error('AI Proxy Error (generateQuiz): ' . $e->getMessage());
            return response()->json(['error' => 'Failed to connect to AI service'], 500);
        }
    }

    public function generateQuizFromText(Request $request)
    {
        try {
            $response = Http::timeout(120)->post("{$this->aiServiceUrl}/generate-quiz-from-text", $request->all());
            
            if ($response->successful()) {
                return response()->json($response->json());
            }
            
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            Log::error('AI Proxy Error (generateQuizFromText): ' . $e->getMessage());
            return response()->json(['error' => 'Failed to connect to AI service'], 500);
        }
    }

    public function generateCustomPromptQuiz(Request $request)
    {
        try {
            $response = Http::timeout(120)->post("{$this->aiServiceUrl}/generate-custom-prompt-quiz", $request->all());
            
            if ($response->successful()) {
                return response()->json($response->json());
            }
            
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            Log::error('AI Proxy Error (generateCustomPromptQuiz): ' . $e->getMessage());
            return response()->json(['error' => 'Failed to connect to AI service'], 500);
        }
    }
}
