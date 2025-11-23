<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\PreRegistration;
use Illuminate\Http\Request;

class PreRegistrationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $logs = PreRegistration::all();   // example data
        $lobbies = [];                                         // placeholder
        $personFiles = [];                                     // placeholder

        return Inertia::render('PreRegistrationLogs', [
            'logs' => $logs,
            'lobbies' => $lobbies,
            'auth' => auth()->user(),
            'personFiles' => $personFiles,
        ]);
 
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PreRegistration $preRegistration)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PreRegistration $preRegistration)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PreRegistration $preRegistration)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PreRegistration $preRegistration)
    {
        //
    }
}
