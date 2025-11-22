<?php

namespace App\Http\Controllers;

use App\Models\QuizManagement;
use App\Models\SubjectQuestion;
use App\Models\Subjects;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SubjectQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */

    public function getLobbyQuestion($lobby_id, $subject_id)
    {
        return Subjects::with(['subjectsQuestions' => function ($query) use ($subject_id) {
            $query->where('subject_id', $subject_id)
                ->whereJsonLength('options', '>', 0); // Ensures options field is not empty
        }])
            ->where('lobby_id', $lobby_id)
            ->whereHas('subjectsQuestions', function ($query) use ($subject_id) {
                $query->where('subject_id', $subject_id)
                    ->whereJsonLength('options', '>', 0);
            })
            ->get();
    }


    public function store(Request $request)
    {


        //
        // $validator = Validator::make($request->all(), [
        //     'data' => 'required|string|max:255',
        // ]);

        // if ($validator->fails()) {
        //     return response()->json([
        //         'errors' => $validator->errors(),
        //     ], 422);
        // }
        $updateData = [
            'quiz_title' => $request->quiz_title
        ];
        Subjects::where('id', $request->subject_id)->update($updateData);
        $question_data = json_decode($request->input("data"));
        foreach ($question_data as $question) {
            if (
                isset($question->type)
                && $question->type === 'short-answer'
                && (!isset($question->shortAnswer) || trim($question->shortAnswer) === '')
            ) {
                throw ValidationException::withMessages([
                    'shortAnswer' => 'Short answer questions require a correct answer.',
                ]);
            }
        }

        foreach ($question_data as $question) {
            $rawOptions = $question->options ?? '[]';
            $decodedOptions = json_decode($rawOptions, true);
            $normalizedOptions = [];

            if (is_array($decodedOptions) && $question->type === 'multiple-choice') {
                $normalizedOptions = $decodedOptions;
            }

            $shortAnswer = null;
            if ($question->type === 'short-answer') {
                $trimmed = trim($question->shortAnswer ?? '');
                $shortAnswer = $trimmed !== '' ? $trimmed : null;
            }

            $question =   SubjectQuestion::create([
                'question' => $question->question,
                "difficulty" => $question->difficulty,
                "answer" => '', // not used 
                "type" =>  $question->type, // not used 
                "timeLimit" => $question->timeLimit,
                "image" => $question->image || "",
                'options' => json_encode($normalizedOptions),
                "points" => $question->points,
                "subject_id" => $question->subject_id,
                'trueFalseAnswer' => $question->trueFalseAnswer,
                'shortAnswer' => $shortAnswer,
            ]);

            QuizManagement::create([
                "user_id" => Auth::id(),
                "quiz_id" => $question->id,
                "action" => 0
            ]);
        }

        // Return Inertia response if it's an Inertia request, otherwise return JSON
        if (request()->header('X-Inertia')) {
            return redirect()->back()->with('success', 'Quiz created successfully!');
        }
        
        // Return JSON for non-Inertia requests (API calls)
        return response()->json([
            'success' => true,
            'message' => 'Quiz created successfully',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
