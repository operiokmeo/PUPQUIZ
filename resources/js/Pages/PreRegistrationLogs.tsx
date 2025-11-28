import React, { useState, useEffect } from 'react';
import {
  Search, User, Clock, Filter, BanIcon, UserRoundCheckIcon, Hash,
  LayoutDashboardIcon, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
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
  type?: string;
  name?: string;
}

const PreRegistrationLogs = (props: Props) => {
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

  const sessionData = logs || [];

  const formatDateTime = (timestamp: any) => {
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

  const filteredData = sessionData.filter(session => {
    if (selectedLobby) {
      if (session.lobby_id !== selectedLobby) {
        return false;
      }
    }

    const matchesSearch =
      (session.participant?.team || '').toString().trim().toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      (session.participant?.team_leader || '').toString().trim().toLowerCase().includes(searchTerm.trim().toLowerCase());

    if (filterActive === 'all') return matchesSearch;
    if (filterActive === 'active') return matchesSearch && session.status === 2;
    if (filterActive === 'ended') return matchesSearch && session.status === 1;

    return matchesSearch;
  });

  const makeUrl = (value?: string | null) => {
    if (!value) return '';
    if (typeof value !== 'string') return '';
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) return value;
    return '/storage/' + value;
  };

  function formatLabel(key) {
    return key
        .replace(/([A-Z])/g, " $1")  // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // Uppercase first letter
}

  // fileCards rendering logic, slightly refactored to reuse
  const renderFileCardsFromArray = (files: FileItem[] = []) => {
    if (!Array.isArray(files) || files.length === 0) {
      return `
        <div class="mb-2 p-2 text-sm text-gray-600 italic">No files uploaded.</div>
      `;
    }

    const REQUIREMENT_LABELS = {
        studentId: "Valid Student ID",
        registrationForm: "Certificate of Registration Form",
        consentForm: "Signed Consent Form"
    };    

    return files.map((file) => {
      const url = file.url || "";
      const rawName = (file.name || "Untitled").replace(/\s*\(.*?\)\s*/, "");
      const name = REQUIREMENT_LABELS[rawName] || rawName;
      const ext = (url.split(".").pop() || "").toLowerCase();

      if (!url || url === "null" || url === "undefined" || url.trim() === "" || url.includes("null") || url.includes("undefined")) {
        return `
          <div class="file-card">
            <h4>${name}</h4>
            <div>No file uploaded ❌</div>
          </div>
        `;
      }

      const isPDF = ext === "pdf";
      const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);

      if (isPDF) {
        return `
          <div class="file-card w-1/3 p-2">
            <div class="file-inner">
              <h4 class="file-title text-black">${name}</h4>
      
              <iframe 
                src="${url}" 
                class="rounded-lg shadow-sm mb-2" 
                style="width:100%; height:200px;">
              </iframe>
      
              <button 
                onclick="window.open('${url}', '_blank')" 
                class="w-full bg-orange-500 text-white py-1.5 rounded-lg text-sm hover:bg-orange-600 transition">
                View Full PDF
              </button>
      
            </div>
          </div>
        `;
      }       

      if (isImage) {
        return `
          <div class="file-card w-1/3 p-2">
            <div class="file-inner">
              <h4 class="file-title text-black mb-2">${name}</h4>
      
              <!-- image + centered tooltip wrapper -->
              <div class="relative group rounded-lg overflow-hidden" style="width:100%; height:200px;">
                <img
                  src="${url}"
                  class="file-image w-full h-full object-cover cursor-pointer"
                  onclick="window.open('${url}', '_blank')"
                  alt="${name}"
                />
      
                <!-- Centered tooltip (non-interactive so clicks go to the image) -->
                <span class="absolute inset-0 flex items-center justify-center
                             text-white text-sm bg-orange-500 bg-opacity-80
                             opacity-0 group-hover:opacity-100 transition
                             pointer-events-none">
                  Click to see full size
                </span>
              </div>
            </div>
          </div>
        `;
      }                

      return `
        <div class="w-1/3 p-2 text-center">
          <h4 class="font-semibold text-gray-700 mb-2">${name}</h4>
          <p class="text-gray-600 mb-2">File type not supported for preview</p>
          <a href="${url}" target="_blank" class="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Download File</a>
        </div>
      `;
    }).join("");
  };

  // The main function that builds and shows the SweetAlert modal
  const handleViewFiles = (session: any) => {
    const leader = session.participant || {};

    // Parse members JSON (Option A)
    let membersArray: any[] = [];
    try {
      const raw = leader.members || '[]';
      membersArray = Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
      if (!Array.isArray(membersArray)) membersArray = [];
    } catch (e) {
      console.error("Error parsing members JSON:", e);
      membersArray = [];
    }

    // Build a flat files array where each file.name includes the person in parentheses,
    // so it groups the same way your original logic did.
    const files: FileItem[] = [];

    // Gather leader files: prefer leader.requirements object, otherwise fall back to known fields
    if (leader.requirements && typeof leader.requirements === 'object') {
      Object.entries(leader.requirements).forEach(([k, v]) => {
        const url = makeUrl(String(v || ''));
        const type = (url.split('.').pop() || '').toLowerCase() === 'pdf' ? 'pdf' : 'image';
        files.push({ name: `${k} (${leader.team_leader || 'Team Leader'})`, url, type });
      });
    } else {
      // fallback candidates (some codebases used student_id, registration_form, consent_form)
      const leaderCandidates: Array<{ label: string, value?: string }> = [
        { label: 'Valid Student ID', value: leader.student_id || leader.student_number || undefined },
        { label: 'Certificate of Registration Form', value: leader.registration_form || undefined },
        { label: 'Signed Consent Form', value: leader.consent_form || undefined },
      ];
      leaderCandidates.forEach(c => {
        if (c.value) {
          const url = makeUrl(String(c.value));
          const type = (url.split('.').pop() || '').toLowerCase() === 'pdf' ? 'pdf' : 'image';
          files.push({ name: `${c.label} (${leader.team_leader || 'Team Leader'})`, url, type });
        }
      });
    }

    // Add member files (membersArray expected per Option A)
    membersArray.forEach(member => {
      const req = member.requirements || {};
      Object.entries(req).forEach(([k, v]) => {
        const url = makeUrl(String(v || ''));
        const type = (url.split('.').pop() || '').toLowerCase() === 'pdf' ? 'pdf' : 'image';
        const memberName = member.name || 'Member';
        files.push({ name: `${k} (${memberName})`, url, type });
      });
    });

    // Group by person's name inside parentheses (same grouping logic you used before)
    const grouped: Record<string, FileItem[]> = files.reduce((acc: Record<string, FileItem[]>, file) => {
      const match = file.name?.match(/\((.*?)\)/);
      const personName = match ? match[1] : "Unknown";

      if (!acc[personName]) acc[personName] = [];
      acc[personName].push(file);

      return acc;
    }, {});

    // Build leader info HTML
    const leaderHTML = `
      <div class="p-4 border-2 rounded-lg bg-orange-50 mb-4">
        <h2 class="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
          Team Leader Information
        </h2>

        <p class="flex items-center gap-2 text-black"><strong>Full Name:</strong> ${leader.team_leader || 'N/A'}</p>
        <p class="flex items-center gap-2 mt-2 text-black"><strong>Student ID:</strong> ${leader.student_number || leader.student_id || 'N/A'}</p>
        <p class="flex items-center gap-2 mt-2 text-black"><strong>Section:</strong> ${leader.course_year || leader.section || 'N/A'}</p>
        <p class="flex items-center gap-2 mt-2 text-black"><strong>Email:</strong> ${leader.team_leader_email || leader.email || 'N/A'}</p>
        <p class="flex items-center gap-2 mt-2 text-black"><strong>Contact Number:</strong> ${leader.contact_number || 'N/A'}</p>
      </div>
    `;

    // Leader files HTML (use grouped with leader name)
    const leaderNameKey = leader.team_leader || 'Team Leader';
    const leaderFiles = grouped[leaderNameKey] || [];
    const leaderFilesHTML = `
      <div class="mb-6 p-4 border rounded-lg bg-orange-50">
        <h3 class="text-xl font-bold text-orange-600 mb-4">Submitted Requirements (Team Leader)</h3>
        <div class="flex flex-wrap -m-2">
          ${renderFileCardsFromArray(leaderFiles)}
        </div>
      </div>
    `;

    // Build members HTML using membersArray (each member gets own info box + their files)
    const membersHTML = membersArray.map((member: any, index) => {
      const name = member.name || 'N/A';
      const studentNo = member.studentNumber || member.student_number || 'N/A';
      const courseYear = member.courseYear || member.course_year || 'N/A';
      // get grouped files for this member (matching by member name)
      const memberFiles = grouped[name] || [];

      const memberNumber = index + 1;

      return `
        <div class="p-4 border-2 rounded-lg bg-orange-50 mb-4">
          <h2 class="text-2xl font-bold text-orange-600 mb-3">Member No. ${memberNumber} Information</h2>
          <p class="text-black"><strong>Full Name:</strong> ${name}</p>
          <p class="mt-1 text-black"><strong>Student ID:</strong> ${studentNo}</p>
          <p class="mt-1 text-black"><strong>Section:</strong> ${courseYear}</p>
        </div>

        <div class="p-4 border rounded-lg bg-orange-50 mb-6">
          <h3 class="text-xl font-bold text-orange-600 mb-4">Submitted Requirements (Member)</h3>
          <div class="flex flex-wrap -m-2 ">
            ${renderFileCardsFromArray(memberFiles)}
          </div>
        </div>
      `;
    }).join("")

    // Build final HTML in requested order
    const filesHTML = `
      ${leaderFilesHTML}
      ${membersHTML}
    `;

    // Show Swal
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
      didOpen: () => {
        const popup = Swal.getPopup();
        popup?.querySelectorAll("iframe").forEach((iframe) => {
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
                Pre-Registration Logs
              </h1>
              <p className="text-gray-600">Monitor and track Pre-Registration activity</p>
            </div>
            <div onClick={() => router.get("/organizerLobby")} className='bg-red-500 text-white p-4 flex gap-x-3 rounded-md hover:bg-red-700 hover:cursor-pointer'>
              <LayoutDashboardIcon />
              <p>Go to Dashboard</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
          <div className={`${isSidebarCollapsed ? 'w-12' : 'w-80'} flex-shrink-0 transition-all duration-300 overflow-hidden`}>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl h-full relative">

            {/* Collapse / Expand Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors absolute top-4 right-4"
              type="button"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Sidebar content only visible when NOT collapsed */}
            {!isSidebarCollapsed && (
              <>
                <h2 className="text-xl font-bold text-red-600 mb-2">Quiz Event</h2>
                <p className="text-sm text-gray-600 mb-4">Select a quiz event to filter logs</p>

                {/* Search box */}
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

                {/* List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => setSelectedLobby(null)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedLobby === null ? 'bg-orange-500 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}`}
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
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedLobby === lobby.id ? 'bg-orange-500 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'}`}
                        type="button"
                      >
                        {lobby.name}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>


            {/* Right Content - Logs Table */}
            <div className="flex-1">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
                <div className="bg-white rounded-xl shadow-lg border border-red-300 border-l-4 border-l-red-500 p-6">
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

                <div className="bg-white rounded-xl shadow-lg border border-green-300 border-l-4 border-l-green-500 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Approved</p>
                      <p className="text-2xl font-bold text-gray-900">{filteredData?.filter(s => s.status == 2).length}</p>
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
              <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-6 overflow-hidden">
                <div className="p-4 border-b border-gray-500 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Pre-Registration Logs</h3>
                  {selectedLobby && (
                    <span className="text-sm text-gray-600">- {availableLobbies.find(l => l.id === selectedLobby)?.name || ''}</span>
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
                        <tr key={session.id} className={`hover:bg-red-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center w-fit truncate">
                              <div className="max-w-[150px] px-3 truncate h-8 bg-gradient-to-r from-red-400 to-amber-400 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
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
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${session.status === 1 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
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
                              onClick={() => handleViewFiles(session)}
                            >
                              <Eye className="w-4 h-4 text-white" />
                              <span>View</span>
                            </Button>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-gray-900 text-sm w-fit truncate">{session.comment}</span>
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
  );
};

export default PreRegistrationLogs;
