import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import {
  Search,
  User,
  Eye,
  Ban,
  FileCheck2,
  Hash,
  LayoutDashboardIcon,
  ChevronDown,
  ChevronUp,
  Users,
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import axios from 'axios';
import Swal from 'sweetalert2';

type Props = {};

// ---- Types for incoming data ----
interface Requirements {
  studentId?: string;
  registrationForm?: string;
  consentForm?: string;
  [key: string]: any;
}

interface Member {
  name?: string;
  studentNumber?: string;
  student_number?: string;
  courseYear?: string;
  course_year?: string;
  requirements?: Requirements;
  [key: string]: any;
}

interface PreRegItem {
  id: number;
  team?: string;
  team_leader?: string;
  team_leader_email?: string;
  student_id?: string;
  student_number?: string;
  registration_form?: string;
  consent_form?: string;
  contact_number?: string;
  members?: string; // NOTE: stored as JSON string (Option A)
  logout_timestamp?: string | null;
  created_at?: string;
  participant?: any; // some sessions might wrap participant
  requirements?: Requirements;
  [key: string]: any;
}

interface Lobby {
  id: number;
  name?: string;
  [key: string]: any;
}

interface PageServerProps {
  lobby: Lobby;
  pre_registration: PreRegItem[];
  auth?: {
    user: any;
  };
}

// small helper type for file preview
interface FileItem {
  url: string;
  type?: string;
  name?: string;
}

// helper to convert storage keys/filenames into usable URLs
const makeUrl = (val?: string | null) => {
  if (!val) return '';
  const trimmed = String(val).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return trimmed;
  return `/storage/${trimmed}`;
};

export default function ManagePreRegistration({}: Props) {
  // read raw page props (avoid generic mismatch with PageProps)
  const page = usePage();
  // cast to our server shape (safe because backend provides these)
  const { lobby, pre_registration } = (page.props as unknown) as PageServerProps;
  const sessionData: PreRegItem[] = pre_registration || [];

  // if you still need auth from global PageProps, you can do:
  // const { auth } = page.props as PageProps;
  // but only use it if you need it below.

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // ---------- Helpers ----------
  const formatDateTime = (timestamp?: string | null) => {
    if (!timestamp) return 'Active Session';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const filteredData = sessionData.filter((session) => {
    const team = session.team ?? '';
    const leader = session.team_leader ?? '';
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return String(team).toLowerCase().includes(q) || String(leader).toLowerCase().includes(q);
  });

  // ---------- Manage (Approve / Reject) ----------
  const handleManage = async (action: 'Reject' | 'Approved', participant_id: string | number) => {
    const { value: comment } = await Swal.fire({
      title: `${action} Participant`,
      input: 'textarea',
      inputLabel: 'Enter your comment (optional)',
      inputPlaceholder: 'Write your comment here...',
      inputAttributes: { 'aria-label': 'Write your comment here' },
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
      icon: action === 'Reject' ? 'warning' : 'question',
      confirmButtonColor: action === 'Reject' ? '#d33' : '#3085d6',
    });

    if (comment === undefined) return;

    const formData = new FormData();
    formData.append('lobby_id', String(lobby.id));
    formData.append('status', action === 'Reject' ? '1' : '2');
    formData.append('participant_id', String(participant_id));
    formData.append('comment', comment || '');

    try {
      Swal.fire({
        title: 'Please wait...',
        text: `${action === 'Approved' ? 'Approving' : action} participant...`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await axios.post('/manage-pre-registration', formData);

      Swal.close();

      if (response.data?.success) {
        document.getElementById(`pre-reg-${participant_id}`)?.remove();

        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
          confirmButtonColor: '#3085d6',
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data?.message || 'Something went wrong.',
        });
      }
    } catch (error: any) {
      Swal.close();
      console.error(error?.response?.data || error?.message);
      await Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: error?.response?.data?.message || 'Unable to process the request.',
      });
    }
  };

    const REQUIREMENT_LABELS = {
        studentId: "Valid Student ID",
        registrationForm: "Certificate of Registration Form",
        consentForm: "Signed Consent Form"
    }; 

  // ---------- File preview HTML builder ----------
  const renderFileCardsFromArray = (files: FileItem[] = []) => {
    if (!Array.isArray(files) || files.length === 0) {
      return `<div class="mb-2 p-2 text-sm text-gray-600 italic">No files uploaded.</div>`;
    }

    return files
      .map((file) => {
        const url = file.url || "";
        const rawName = (file.name || "Untitled").replace(/\s*\(.*?\)\s*/, "");
        const name = REQUIREMENT_LABELS[rawName] || rawName;
        const ext = (url.split(".").pop() || "").toLowerCase();

        if (!url || url === 'null' || url === 'undefined' || url.trim() === '' || url.includes('null') || url.includes('undefined')) {
          return `<div class="file-card w-1/3 p-2"><h4 class="file-title text-black">${name}</h4><div>No file uploaded ❌</div></div>`;
        }

        const isPDF = ext === 'pdf';
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);

        if (isPDF) {
          return `
            <div class="file-card w-1/3 p-2">
              <div class="file-inner">
                <h4 class="file-title text-black">${name}</h4>
                <iframe src="${url}" class="rounded-lg shadow-sm mb-2" style="width:100%; height:200px;"></iframe>
                <button onclick="window.open('${url}', '_blank')" class="w-full bg-orange-500 text-white py-1.5 rounded-lg text-sm hover:bg-orange-600 transition">View Full PDF</button>
              </div>
            </div>
          `;
        }

        if (isImage) {
          return `
            <div class="file-card w-1/3 p-2">
              <div class="file-inner">
                <h4 class="file-title text-black mb-2">${name}</h4>
                <div class="relative group rounded-lg overflow-hidden" style="width:100%; height:200px;">
                  <img src="${url}" class="file-image w-full h-full object-cover cursor-pointer" onclick="window.open('${url}', '_blank')" alt="${name}" />
                  <span class="absolute inset-0 flex items-center justify-center text-white text-sm bg-orange-500 bg-opacity-80 opacity-0 group-hover:opacity-100 transition pointer-events-none">Click to see full size</span>
                </div>
              </div>
            </div>
          `;
        }

        return `
          <div class="w-1/3 p-2 text-center">
            <h4 class="font-semibold text-gray-700 mb-2">${name}</h4>
            <p class="text-red-400 mb-2">❗File type not supported for preview.</p>
          </div>
        `;
      })
      .join('');
  };

  // ---------- View files modal ----------
  const handleViewFiles = (session: PreRegItem) => {
    // The leader object might be inside session.participant or session itself.
    const leader = session.participant ?? session;

    // members stored as JSON string (Option A)
    let membersArray: Member[] = [];
    try {
      const raw = leader.members ?? session.members ?? '[]';
      membersArray = Array.isArray(raw) ? raw : JSON.parse(String(raw || '[]'));
      if (!Array.isArray(membersArray)) membersArray = [];
    } catch (e) {
      console.error('Error parsing members JSON:', e);
      membersArray = [];
    }

    // Build flat files list
    const files: FileItem[] = [];

    // leader.requirements preferred
    if (leader.requirements && typeof leader.requirements === 'object') {
      Object.entries(leader.requirements).forEach(([k, v]) => {
        const url = makeUrl(String(v ?? ''));
        const type = (url.split('.').pop() || '').toLowerCase() === 'pdf' ? 'pdf' : 'image';
        files.push({ name: `${k} (${leader.team_leader ?? leader.name ?? 'Team Leader'})`, url, type });
      });
    } else {
      // fallback fields
      const leaderCandidates: Array<{ label: string; value?: string | null }> = [
        { label: 'Valid Student ID', value: leader.student_number ?? leader.student_id ?? null },
        { label: 'Certificate of Registration Form', value: leader.registration_form ?? null },
        { label: 'Signed Consent Form', value: leader.consent_form ?? null },
      ];
      leaderCandidates.forEach((c) => {
        if (c.value) {
          const url = makeUrl(String(c.value));
          files.push({ name: `${c.label} (${leader.team_leader ?? leader.name ?? 'Team Leader'})`, url });
        }
      });
    }

    // member files
    membersArray.forEach((member) => {
      const req = member.requirements ?? {};
      Object.entries(req).forEach(([k, v]) => {
        const url = makeUrl(String(v ?? ''));
        files.push({ name: `${k} (${member.name ?? 'Member'})`, url });
      });
    });

    // group files by person (name in parentheses)
    const grouped: Record<string, FileItem[]> = files.reduce((acc: Record<string, FileItem[]>, file) => {
      const match = file.name?.match(/\((.*?)\)/);
      const personName = match ? match[1] : 'Unknown';
      if (!acc[personName]) acc[personName] = [];
      acc[personName].push(file);
      return acc;
    }, {});

    const leaderNameKey = leader.team_leader ?? leader.name ?? 'Team Leader';
    const leaderFiles = grouped[leaderNameKey] ?? [];

    const leaderHTML = `
      <div class="p-4 border-2 rounded-lg bg-orange-50 mb-4">
        <h2 class="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">Team Leader Information</h2>
        <p class="flex items-center gap-2 text-black"><strong>Full Name:</strong> ${leader.team_leader ?? leader.name ?? 'N/A'}</p>
        <p class="flex items-center gap-2 mt-2 text-black"><strong>Student ID:</strong> ${leader.student_number ?? leader.student_id ?? 'N/A'}</p>
        <p class="flex items-center gap-2 mt-2 text-black"><strong>Section:</strong> ${leader.course_year ?? leader.section ?? 'N/A'}</p>
        <p class="flex items-center gap-2 mt-2 text-black"><strong>Email:</strong> ${leader.team_leader_email ?? leader.email ?? 'N/A'}</p>
        <p class="flex items-center gap-2 mt-2 text-black"><strong>Contact Number:</strong> ${leader.contact_number ?? 'N/A'}</p>
      </div>
    `;

    const leaderFilesHTML = `
      <div class="mb-6 p-4 border rounded-lg bg-orange-50">
        <h3 class="text-xl font-bold text-orange-600 mb-4">Submitted Requirements (Team Leader)</h3>
        <div class="flex flex-wrap -m-2">
          ${renderFileCardsFromArray(leaderFiles)}
        </div>
      </div>
    `;

    const membersHTML = membersArray
      .map((member: Member, idx) => {
        const name = member.name ?? 'N/A';
        const studentNo = (member as any).studentNumber ?? (member as any).student_number ?? 'N/A';
        const courseYear = (member as any).courseYear ?? (member as any).course_year ?? 'N/A';
        const memberFiles = grouped[name] ?? [];
        const memberNumber = idx + 1;

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
      })
      .join('');

    const filesHTML = `
      ${leaderFilesHTML}
      ${membersHTML}
    `;

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
      width: '80%',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'swal-wide',
        htmlContainer: 'swal-html-container',
      },
      didOpen: () => {
        const popup = Swal.getPopup();
        popup?.querySelectorAll('iframe').forEach((iframe) => {
          iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups');
        });
      },
    });
  };

  // ---------- Render ----------
  return (
    <div>
      <AuthenticatedLayout>
        <div className="min-h-screen bg-white p-6">
          <div className="w-full max-w-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                  {lobby?.name ?? 'Lobby'}
                </h1>
                <p className="text-gray-600">Manage Pre Registration</p>
              </div>

              <div onClick={() => router.get('/organizerLobby')} className="bg-red-500 text-white p-4 flex gap-x-3 rounded-md hover:bg-red-700 hover:cursor-pointer">
                <LayoutDashboardIcon />
                <p>Go to Dashboard</p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by team name or team leader name..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Session Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-red-500 to-amber-500">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Team Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Team Leader</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white w-fit truncate">Contact Number</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white w-fit truncate">Members</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white w-fit truncate">View Preview</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((session, index) => {
                      const isExpanded = expandedRows.has(session.id);
                      // parse members as JSON string (Option A)
                      let membersData: Member[] = [];
                      try {
                        const raw = session.members ?? '[]';
                        membersData = Array.isArray(raw) ? raw : JSON.parse(String(raw || '[]'));
                        if (!Array.isArray(membersData)) membersData = [];
                      } catch (e) {
                        console.error('Error parsing members:', e);
                        membersData = [];
                      }

                      return (
                        <React.Fragment key={session.id}>
                          <tr
                            id={`pre-reg-${session.id}`}
                            className={`hover:bg-red-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-fit px-8 truncate h-8 bg-gradient-to-r from-red-400 to-amber-400 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                  {session.team ?? '—'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center w-fit truncate">
                                <User className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-900 font-medium uppercase">{session.team_leader ?? 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-900">{session.team_leader_email ?? 'N/A'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <Hash className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-900 font-mono">{session.contact_number ?? 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900 font-medium">
                                  {membersData.length} {membersData.length === 1 ? 'Member' : 'Members'}
                                </span>
                                {membersData.length > 0 && (
                                  <button
                                    onClick={() => {
                                      const newExpanded = new Set(expandedRows);
                                      if (isExpanded) newExpanded.delete(session.id);
                                      else newExpanded.add(session.id);
                                      setExpandedRows(newExpanded);
                                    }}
                                    className="ml-2 text-red-600 hover:text-red-800"
                                  >
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-800 flex items-center gap-2"
                                onClick={() => {
                                  try {
                                    handleViewFiles(session);
                                  } catch (error) {
                                    console.error('Error viewing files:', error);
                                    Swal.fire({
                                      icon: 'error',
                                      title: 'Error',
                                      text: 'Failed to load files. Please try again.',
                                      confirmButtonColor: '#dc2626',
                                    });
                                  }
                                }}
                              >
                                <Eye className="w-4 h-4 text-white" />
                                <span>View</span>
                              </Button>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className= "flex flex-col md:flex-row justify-center items-center gap-2">
                                <Button
                                    size="sm" className="bg-blue-600 hover:bg-blue-800 w-32 flex items-center justify-center gap-2"
                                    onClick={() => handleManage('Approved', session.id)}
                                >
                                    <FileCheck2 className="w-4 h-4 text-white"/>
                                    <span>Approved</span>
                                </Button>

                                <Button
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-800 w-32 flex items-center justify-center gap-2"
                                    onClick={() => handleManage('Reject', session.id)}
                                >
                                    <Ban className="w-4 h-4 text-white"/>
                                    <span>Reject</span>
                                </Button>
                              </div>
                            </td>
                          </tr>

                          {isExpanded && membersData.length > 0 && (
                            <tr className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                              <td colSpan={7} className="px-6 py-4">
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-red-600" />
                                    Team Members Information
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {membersData.map((member: Member, memberIndex: number) => (
                                      <div key={memberIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <h5 className="font-semibold text-gray-800 mb-2">{member.name ?? `Member ${memberIndex + 1}`}</h5>
                                        <div className="space-y-1 text-sm">
                                          <p className="text-gray-600">
                                            <span className="font-medium">Student Number:</span> {member.studentNumber ?? member.student_number ?? 'N/A'}
                                          </p>
                                          <p className="text-gray-600">
                                            <span className="font-medium">Course/Year:</span> {member.courseYear ?? member.course_year ?? 'N/A'}
                                          </p>
                                          {member.requirements && (
                                            <div className="mt-2 pt-2 border-t border-gray-300">
                                              <p className="font-medium text-gray-700 mb-1">Requirements:</p>
                                              <ul className="space-y-1 text-xs">
                                                <li className={member.requirements.studentId ? 'text-green-600' : 'text-gray-400'}>
                                                  {member.requirements.studentId ? '✓' : '✗'} Student ID
                                                </li>
                                                <li className={member.requirements.registrationForm ? 'text-green-600' : 'text-gray-400'}>
                                                  {member.requirements.registrationForm ? '✓' : '✗'} Registration Form
                                                </li>
                                                <li className={member.requirements.consentForm ? 'text-green-600' : 'text-gray-400'}>
                                                  {member.requirements.consentForm ? '✓' : '✗'} Consent Form
                                                </li>
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
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
              <p className="text-gray-500 text-sm">Showing {filteredData.length} of {sessionData.length} Registration</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}
