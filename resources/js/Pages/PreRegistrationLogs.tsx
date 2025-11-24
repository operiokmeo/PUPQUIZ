import React, { useState, useEffect } from 'react';
import { Search, User, Clock, MapPin, Calendar, Filter, BanIcon, UserRoundCheckIcon, Hash, LayoutDashboardIcon, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, usePage } from '@inertiajs/react';

import { PageProps } from '@/types';
import Swal from 'sweetalert2';
import { Button } from '@/Components/ui/button';
type Props = {}

interface PageData {
    logs: any[];
    lobbies: any[];
    auth: any;
    personFiles: any[];
    [key: string]: any;
}

interface FileItem {
    url: string;
    type: string;
    name: string;
}
  
const PreRegistrationLogs = (props: Props) => {
    // const { logs, lobbies } = usePage().props
    // const { auth } = usePage<PageProps>().props
    const page = usePage<PageProps<PageData>>();
    const { logs, lobbies, auth, personFiles } = page.props;
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActive, setFilterActive] = useState('all');
    const [selectedLobby, setSelectedLobby] = useState<number | null>(null);
    const [lobbySearchTerm, setLobbySearchTerm] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [availableLobbies, setAvailableLobbies] = useState<any[]>([]);

    useEffect(() => {
        if (lobbies && lobbies.length > 0) {
            setAvailableLobbies(lobbies);
            if (!selectedLobby && lobbies[0]) {
                setSelectedLobby(lobbies[0].id);
            }
        }
    }, [lobbies]);

    const filteredLobbies = availableLobbies.filter(lobby =>
        lobby.name.toLowerCase().includes(lobbySearchTerm.toLowerCase())
    );

    const sessionData = logs
    const formatDateTime = (timestamp) => {
        if (!timestamp) return 'Active Session';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const calculateDuration = (created, logout) => {
        if (!logout) return 'Active';
        const start = new Date(created);
        const end = new Date(logout);
        const diff = Math.abs(Number(end) - Number(start));
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const getStatusBadge = (logoutTime) => {
        if (!logoutTime) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Active
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                Ended
            </span>
        );
    };

    const filteredData = sessionData.filter(session => {
        // Filter by selected lobby if one is selected
        if (selectedLobby) {
            if (session.lobby_id !== selectedLobby) {
                return false;
            }
        }

        const matchesSearch = session.participant?.team?.trim().toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            session.participant?.team_leader?.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())

        if (filterActive === 'all') return matchesSearch;
        if (filterActive === 'active') return matchesSearch && session.status === 2;
        if (filterActive === 'ended') return matchesSearch && session.status === 1;

        return matchesSearch;
    });
    function convertToPhilippineTime(utcDateString: string): string {
        const date = new Date(utcDateString);
        return date.toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // set to true if you want AM/PM
        });
    }
    // Function to handle viewing files
    const handleViewFiles = (session, files) => {

        if (!files || files.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No Files",
                text: "No files available to view",
                confirmButtonColor: "#16a34a"
            });
            return;
        }

        // --- GROUPING BY NAME INSIDE PARENTHESES ---
        const grouped: Record<string, FileItem[]> = files.reduce((acc, file) => {
            const match = file.name?.match(/\((.*?)\)/);
            const personName = match ? match[1] : "Unknown";
        
            if (!acc[personName]) acc[personName] = [];
            acc[personName].push(file);
        
            return acc;
        }, {} as Record<string, FileItem[]>);
        

        // --- RENDER EACH GROUP ---

        // --- TEAM LEADER INFO ---
        const leader = session.participant;
        const leaderHTML = `
            <div class="mb-6 p-4 border rounded-lg bg-orange-50">
                <h2 class="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Team Leader Information
                </h2>

                <p class="flex items-center gap-2">
                    <!-- Name Tag Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 7h18M3 11h18M7 15h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                    <strong>Full Name:</strong> ${leader.team_leader}
                </p>

                <p class="flex items-center gap-2 mt-2">
                    <!-- ID Card Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 7h16M4 11h8M4 15h5M15 11h5M15 15h5M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
                    </svg>
                    <strong>Student ID:</strong> ${leader.student_number || "N/A"}
                </p>

                <p class="flex items-center gap-2 mt-2">
                    <!-- Section Icon (layers) -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4M3 19l9 4 9-4" />
                    </svg>
                    <strong>Section:</strong> ${leader.course_year || "N/A"}
                </p>

                <p class="flex items-center gap-2 mt-2">
                    <!-- Email / Gmail Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <strong>Email:</strong> ${leader.team_leader_email}
                </p>

                <p class="flex items-center gap-2 mt-2">
                    <!-- Phone Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 5a2 2 0 012-2h2l3 6-2 2a11 11 0 005 5l2-2 6 3v2a2 2 0 01-2 2h-1C9.82 21 3 14.18 3 6V5z" />
                    </svg>
                    <strong>Contact Number:</strong> ${leader.contact_number}
                </p>
            </div>
        `;
        
        const filesHTML = Object.entries(grouped)
            .map(([personName, personFiles]) => {

                // If person has NO FILES
                if (personFiles.length === 0) {
                    return `
                        <div class="mb-6 p-4 border rounded-lg bg-orange-50">
                            <h3 class="text-xl font-bold text-orange-600 mb-4">Submitted Requirements</h3>
                            <p class="text-gray-600 italic">No files uploaded.</p>
                        </div>
                    `;
                }
                
                const fileCards = personFiles
                    .map((file) => {
                        const url = file.url || "";
                        const name = (file.name || "Untitled").replace(/\s*\(.*?\)\s*/, "");
                        const ext = url.split(".").pop()?.toLowerCase();

                        // check if participant uploaded file
                        if (!url || url.includes("undefined") || url.includes("null")) {
                            return `
                                <div class="file-card">
                                    <div class="file-inner">
                                        <h4 class="file-title">${name}</h4>
                                        <div class="file-empty">
                                            <span class="file-empty-text">No file uploaded</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }

                        const isPDF = ext === "pdf";
                        const isImage = ["jpg","jpeg","png","gif","webp","svg"].includes(ext);

                        if (isPDF) {
                            return `
                                <div class="file-card">
                                    <div class="file-inner">
                                        <h4 class="file-title">${name}</h4>
                                        <iframe 
                                            src="${url}" 
                                            class="rounded-lg shadow-sm mb-2"
                                            style="width:100%; height:200px;"></iframe>
                                        <a href="${url}" target="_blank" class="small-btn">Open</a>
                                    </div>
                                </div>
                            `;
                        }

                        if (isImage) {
                            return `
                                <div class="file-card">
                                    <div class="file-inner">
                                        <h4 class="file-title">${name}</h4>
                                        <img src="${url}" class="file-image" onclick="window.open('${url}', '_blank')" />
                                    </div>
                                </div>
                            `;
                        }

                        return `
                            <div class="w-1/3 p-2 text-center">
                                <h4 class="font-semibold text-gray-700 mb-2">${name}</h4>
                                <p class="text-gray-600 mb-2">File type not supported for preview</p>
                                <a href="${url}" target="_blank" class="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                                    Download File
                                </a>
                            </div>
                        `;
                    })
                    .join("");

                return `
                    <div class="section-card">
                        <h3 class="section-title">Submitted Requirements</h3>
                        <div class="flex flex-wrap -m-2">
                            ${fileCards}
                        </div>
                    </div>
                `;
                
                })
            .join("");

        // --- SWEETALERT2 POPUP ---
        Swal.fire({
    
            title: `
                <span class="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                    Participant Information
                </span>
            `,
            html: `
                <div style="max-height:600px; overflow-y:auto; text-align:left;">
                    ${leaderHTML}
                    ${filesHTML}
                </div>
            `,
            width: "80%",
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                popup: "swal-wide",
                htmlContainer: "swal-html-container",
            },

            // Enable PDF iframe previews safely
            didOpen: () => {
                const popup = Swal.getPopup();
                popup.querySelectorAll("iframe").forEach((iframe) => {
                    iframe.setAttribute(
                        "sandbox",
                        "allow-same-origin allow-scripts allow-popups"
                    );
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-white p-6">
                <div className="w-full max-w-full flex flex-col">
                    {/* Header */}
                    <div className='flex justify-between items-center'>
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                                Pre Registration Logs
                            </h1>
                            <p className="text-gray-600">Monitor and track Pre Registration activity</p>
                        </div>
                        <div onClick={() => router.get("/organizerLobby")} className='bg-red-500 text-white p-4 flex gap-x-3 rounded-md hover:bg-red-700 hover:cursor-pointer'>
                            <LayoutDashboardIcon />
                            <p>Go to Dashboard</p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Sidebar - Quiz Event Filter (Collapsible*/}
                        <div className={`${isSidebarCollapsed ? 'w-0' : 'w-80'} flex-shrink-0 transition-all duration-300 overflow-hidden`}>
                            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration -300 p-6 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-red-600 mb-2">Quiz Event</h2>
                                        <p className="text-sm text-gray-600 mb-4">Select a quiz event to filter logs</p>
                                    </div>
                                    <button
                                        onClick={() => setIsSidebarCollapsed(true)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        type="button"
                                        title="Collapse sidebar"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                {/* Search Input */}
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search quiz event..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-0 focus:ring-orange-400 focus:border-orange-400"
                                        value={lobbySearchTerm}
                                        onChange={(e) => setLobbySearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                </div>

                                {/* Quiz Event List */}
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                <button
                                    onClick={() => setSelectedLobby(null)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedLobby === null
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                                    }`}
                                    type="button"
                                >
                                    All Event Quiz Sessions
                                </button>
                                {filteredLobbies.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center py-4">No quiz events found</p>
                                ) : (
                                    filteredLobbies.map((lobby) => (
                                        <button
                                            key={lobby.id}
                                            onClick={() => setSelectedLobby(lobby.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                                selectedLobby === lobby.id
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                                            }`}
                                            type="button"
                                        >
                                            {lobby.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Collapse/Expand Button when sidebar is collapsed */}
                    {isSidebarCollapsed && (
                        <button
                            onClick={() => setIsSidebarCollapsed(false)}
                            className="self-start p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                            type="button"
                            title="Expand sidebar"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    )}

                        {/* Right Content - Logs Table */}
                        <div className="flex-1">


                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
                                <div className="bg-white rounded-xl shadow-lg border border-red-300 border-l-4 border-l-red-500 p-6 transition-all duration-300 hover:shadow-2xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Rejected</p>
                                            <p className="text-2xl font-bold text-gray-900">{filteredData?.filter(s => s.status == 1).length}</p>
                                        </div>
                                        <div className="p-3 bg-red-100 rounded-full">
                                            <BanIcon className="w-6 h-6 text-red-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg border border-green-300 border-l-4 border-l-green-500 p-6 transition-all duration-300 hover:shadow-2xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Approved</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {filteredData?.filter(s => s.status == 2).length}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-green-100 rounded-full">
                                            <UserRoundCheckIcon className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="bg-white rounded-xl border border-gray-300 shadow-lg p-6 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative flex-1 max-w-md ">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by team name or team leader name..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:ring-orange-400 focus:border-orange-400 transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-500" />
                                <select
                                    className="border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                                    value={filterActive}
                                    onChange={(e) => setFilterActive(e.target.value)}
                                >
                                    <option value="all">All Logs</option>
                                    <option value="active">Approved Only</option>
                                    <option value="ended">Rejected Only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                            {/* Session Table */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-6 transition-all duration-300 hover:shadow-2xl overflow-hidden">
                                <div className="p-4 border-b border-gray-500 flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Pre Registration Logs
                                    </h3>
                                    {selectedLobby && (
                                        <span className="text-sm text-gray-600">
                                            - {availableLobbies.find(l => l.id === selectedLobby)?.name || ''}
                                        </span>
                                    )}
                                </div>
                        <div className="overflow-x-auto pb-4">
                            <table className="w-full table-auto">
                                <thead className="bg-gradient-to-r from-red-500 to-amber-500">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Team Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Team Leader</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Contact Number</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Reject / Approved Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">View</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Comment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredData.map((session, index) => (
                                        <tr
                                            key={session.id}
                                            className={`hover:bg-red-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center w-fit truncate">
                                                    <div className="max-w-[150px] px-3 truncate h-8 bg-gradient-to-r from-red-400 to-amber-400 rounded full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                                        {session.participant?.team || 'N/A'}
                                                    </div>

                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center w-fit truncate">
                                                    <User className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="text-gray-900 font-medium">{session.participant?.team_leader || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900 font-medium break-words">{session.participant?.team_leader_email || 'N/A'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <Hash className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                    <span className="text-gray-900 font-mono break-words">{session.participant?.contact_number || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${session.status === 1
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {session.status === 1 ? 'Rejected' : 'Approved'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center w-fit truncate">
                                                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="text-gray-900 text-sm">{formatDateTime(session.created_at)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button
                                                    size='sm'
                                                    className='bg-green-600 hover:bg-green-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                                                    type="button"
                                                    disabled={!session.participant}
                                                    onClick={() => {
                                                        if (!session.participant) {
                                                            Swal.fire({
                                                                icon: 'error',
                                                                title: 'Error',
                                                                text: 'Participant data not available',
                                                                confirmButtonColor: '#16a34a'
                                                            });
                                                            return;
                                                        }
                                                        
                                                        const baseURL = window.location.origin + "/";
                             
                                                        let membersData = [];
                                                        try {
                                                            if (session.participant.members) {
                                                                membersData = JSON.parse(session.participant.members);
                                                            }
                                                        } catch (e) {
                                                            console.error('Error parsing members data:', e);
                                                            membersData = [];
                                                        }

             
                                                        // alert(JSON.stringify(membersData))
                                                        console.log(JSON.stringify(membersData))
                                                        // Example files array - replace with your actual data
                                                        const files = [
                                                            // {
                                                            //     url: 'https://example.com/document.pdf',
                                                            //     type: 'pdf',
                                                            //     name: 'Registration Form.pdf'
                                                            // },
                                                            {
                                                                url: '/storage/' + session.participant.student_id,
                                                                type: 'image',
                                                                name: `Valid Student ID (${session.participant.team_leader})`
                                                            },
                                                            {
                                                                url: '/storage/' + session.participant.registration_form,
                                                                type: 'image',
                                                                name: `Certificate of Registration Form (${session.participant.team_leader})`
                                                            },
                                                            {
                                                                url: '/storage/' + session.participant.consent_form,
                                                                type: 'image',
                                                                name: `Signed Consent Form (${session.participant.team_leader})`
                                                            }
                                                        ];

                                                        membersData.forEach(member => {
                                                            files.push(
                                                                {
                                                                    url: '/storage/' + member.requirements.studentId,
                                                                    type: 'image',
                                                                    name: `Valid Student ID (${member.name})`
                                                                },
                                                                {
                                                                    url: '/storage/' + member.requirements.registrationForm,
                                                                    type: 'image',
                                                                    name: `Certificate of Registration Form (${member.name})`
                                                                },
                                                                {
                                                                    url: '/storage/' + member.requirements.consentForm,
                                                                    type: 'image',
                                                                    name: `Signed Consent Form (${member.name})`
                                                                }
                                                            );
                                                        });
                                                        handleViewFiles(session, files);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 text-white" />
                                                    <span>View</span>
                                                </Button>

                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900 text-sm  w-fit  truncate">{session.comment}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
                                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
                            </div>
                        )}
                    </div>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-500 text-sm">
                                    Showing {filteredData.length} of {selectedLobby ? filteredData.length : sessionData.length} sessions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    )
}

export default PreRegistrationLogs