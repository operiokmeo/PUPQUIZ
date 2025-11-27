import{q as V,r as p,j as e,b as P}from"./app-DfPUS0g-.js";import{A as H}from"./AuthenticatedLayout-DP1sGqdd.js";import{S as b}from"./sweetalert2.esm.all-ePrzfkxH.js";import{B as O}from"./button-DbBkCaNi.js";import{L as U}from"./layout-dashboard-CJdz84ez.js";import{C as G,a as J}from"./chevron-right-p5ycHldi.js";import{S as j}from"./search-B22_l6qK.js";import{B as Q,H as K}from"./hash-CIAl1wSh.js";import{c as W}from"./createLucideIcon-BW7jgRi7.js";import{F as X}from"./funnel-RwBh1FFU.js";import{U as Y}from"./user-D7jZvcVM.js";import{C as Z}from"./clock-CAzn1UTl.js";import{E as ee}from"./eye-CDZT0WGR.js";import"./transition-CdeAVsF6.js";import"./render-TPd2KTBo.js";import"./index-33bLDdrw.js";import"./clsx-B-dksMZM.js";import"./utils-CP3_-lCt.js";/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=[["path",{d:"M2 21a8 8 0 0 1 13.292-6",key:"bjp14o"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"m16 19 2 2 4-4",key:"1b14m6"}]],re=W("user-round-check",te),Ce=se=>{var L;const M=V(),{logs:E,lobbies:h,auth:ae,personFiles:le}=M.props,[w,F]=p.useState(""),[u,I]=p.useState("all"),[c,v]=p.useState(null),[y,R]=p.useState(""),[N,C]=p.useState(!1),[k,z]=p.useState([]);p.useEffect(()=>{h&&h.length>0&&(z(h),!c&&h[0]&&v(h[0].id))},[h]);const S=k.filter(t=>t.name.toLowerCase().includes(y.toLowerCase())),$=E,B=t=>t?new Date(t).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}):"Active Session",n=$.filter(t=>{var d,l,m,x;if(c&&t.lobby_id!==c)return!1;const a=((l=(d=t.participant)==null?void 0:d.team)==null?void 0:l.trim().toLowerCase().includes(w.trim().toLowerCase()))||((x=(m=t.participant)==null?void 0:m.team_leader)==null?void 0:x.trim().toLowerCase().includes(w.trim().toLowerCase()));return u==="all"?a:u==="active"?a&&t.status===2:u==="ended"?a&&t.status===1:a}),T=(t,a)=>{if(!a||a.length===0){b.fire({icon:"info",title:"No Files",text:"No files available to view",confirmButtonColor:"#16a34a"});return}const d=a.reduce((i,o)=>{var s;const r=(s=o.name)==null?void 0:s.match(/\((.*?)\)/),g=r?r[1]:"Unknown";return i[g]||(i[g]=[]),i[g].push(o),i},{}),l=t.participant,m=`
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
                    <strong>Full Name:</strong> ${l.team_leader}
                </p>

                <p class="flex items-center gap-2 mt-2">
                    <!-- ID Card Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 7h16M4 11h8M4 15h5M15 11h5M15 15h5M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
                    </svg>
                    <strong>Student ID:</strong> ${l.student_number||"N/A"}
                </p>

                <p class="flex items-center gap-2 mt-2">
                    <!-- Section Icon (layers) -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4M3 19l9 4 9-4" />
                    </svg>
                    <strong>Section:</strong> ${l.course_year||"N/A"}
                </p>

                <p class="flex items-center gap-2 mt-2">
                    <!-- Email / Gmail Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <strong>Email:</strong> ${l.team_leader_email}
                </p>

                <p class="flex items-center gap-2 mt-2">
                    <!-- Phone Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 5a2 2 0 012-2h2l3 6-2 2a11 11 0 005 5l2-2 6 3v2a2 2 0 01-2 2h-1C9.82 21 3 14.18 3 6V5z" />
                    </svg>
                    <strong>Contact Number:</strong> ${l.contact_number}
                </p>
            </div>
        `,x=Object.entries(d).map(([i,o])=>o.length===0?`
                        <div class="mb-6 p-4 border rounded-lg bg-orange-50">
                            <h3 class="text-xl font-bold text-orange-600 mb-4">Submitted Requirements</h3>
                            <p class="text-gray-600 italic">No files uploaded.</p>
                        </div>
                    `:`
                    <div class="section-card">
                        <h3 class="section-title">Submitted Requirements</h3>
                        <div class="flex flex-wrap -m-2">
                            ${o.map(g=>{var A;const s=g.url||"",f=(g.name||"Untitled").replace(/\s*\(.*?\)\s*/,""),_=(A=s.split(".").pop())==null?void 0:A.toLowerCase();if(!s||s.includes("undefined")||s.includes("null"))return`
                                <div class="file-card">
                                    <div class="file-inner">
                                        <h4 class="file-title">${f}</h4>
                                        <div class="file-empty">
                                            <span class="file-empty-text">No file uploaded</span>
                                        </div>
                                    </div>
                                </div>
                            `;const q=_==="pdf",D=["jpg","jpeg","png","gif","webp","svg"].includes(_);return q?`
                                <div class="file-card">
                                    <div class="file-inner">
                                        <h4 class="file-title">${f}</h4>
                                        <iframe 
                                            src="${s}" 
                                            class="rounded-lg shadow-sm mb-2"
                                            style="width:100%; height:200px;"></iframe>
                                        <a href="${s}" target="_blank" class="small-btn">Open</a>
                                    </div>
                                </div>
                            `:D?`
                                <div class="file-card">
                                    <div class="file-inner">
                                        <h4 class="file-title">${f}</h4>
                                        <img src="${s}" class="file-image" onclick="window.open('${s}', '_blank')" />
                                    </div>
                                </div>
                            `:`
                            <div class="w-1/3 p-2 text-center">
                                <h4 class="font-semibold text-gray-700 mb-2">${f}</h4>
                                <p class="text-gray-600 mb-2">File type not supported for preview</p>
                                <a href="${s}" target="_blank" class="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                                    Download File
                                </a>
                            </div>
                        `}).join("")}
                        </div>
                    </div>
                `).join("");b.fire({title:`
                <span class="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                    Participant Information
                </span>
            `,html:`
                <div style="max-height:600px; overflow-y:auto; text-align:left;">
                    ${m}
                    ${x}
                </div>
            `,width:"80%",showCloseButton:!0,showConfirmButton:!1,customClass:{popup:"swal-wide",htmlContainer:"swal-html-container"},didOpen:()=>{b.getPopup().querySelectorAll("iframe").forEach(o=>{o.setAttribute("sandbox","allow-same-origin allow-scripts allow-popups")})}})};return e.jsx(H,{children:e.jsx("div",{className:"min-h-screen bg-white p-6",children:e.jsxs("div",{className:"w-full max-w-full flex flex-col",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{className:"mb-8",children:[e.jsx("h1",{className:"text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent",children:"Pre Registration Logs"}),e.jsx("p",{className:"text-gray-600",children:"Monitor and track Pre Registration activity"})]}),e.jsxs("div",{onClick:()=>P.get("/organizerLobby"),className:"bg-red-500 text-white p-4 flex gap-x-3 rounded-md hover:bg-red-700 hover:cursor-pointer",children:[e.jsx(U,{}),e.jsx("p",{children:"Go to Dashboard"})]})]}),e.jsxs("div",{className:"flex flex-col lg:flex-row gap-6",children:[e.jsx("div",{className:`${N?"w-0":"w-80"} flex-shrink-0 transition-all duration-300 overflow-hidden`,children:e.jsxs("div",{className:"bg-white rounded-xl shadow-lg p-6 transition-all duration -300 p-6 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-bold text-red-600 mb-2",children:"Quiz Event"}),e.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"Select a quiz event to filter logs"})]}),e.jsx("button",{onClick:()=>C(!0),className:"p-2 hover:bg-gray-100 rounded-lg transition-colors",type:"button",title:"Collapse sidebar",children:e.jsx(G,{className:"w-5 h-5 text-gray-600"})})]}),e.jsxs("div",{className:"relative mb-4",children:[e.jsx("input",{type:"text",placeholder:"Search quiz event...",className:"w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-0 focus:ring-orange-400 focus:border-orange-400",value:y,onChange:t=>R(t.target.value)}),e.jsx(j,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"})]}),e.jsxs("div",{className:"space-y-2 max-h-96 overflow-y-auto",children:[e.jsx("button",{onClick:()=>v(null),className:`w-full text-left px-4 py-3 rounded-lg transition-colors ${c===null?"bg-orange-500 text-white":"bg-gray-50 hover:bg-gray-100 text-gray-900"}`,type:"button",children:"All Event Quiz Sessions"}),S.length===0?e.jsx("p",{className:"text-gray-500 text-sm text-center py-4",children:"No quiz events found"}):S.map(t=>e.jsx("button",{onClick:()=>v(t.id),className:`w-full text-left px-4 py-3 rounded-lg transition-colors ${c===t.id?"bg-orange-500 text-white":"bg-gray-50 hover:bg-gray-100 text-gray-900"}`,type:"button",children:t.name},t.id))]})]})}),N&&e.jsx("button",{onClick:()=>C(!1),className:"self-start p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors",type:"button",title:"Expand sidebar",children:e.jsx(J,{className:"w-5 h-5 text-gray-600"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ",children:[e.jsx("div",{className:"bg-white rounded-xl shadow-lg border border-red-300 border-l-4 border-l-red-500 p-6 transition-all duration-300 hover:shadow-2xl",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium text-gray-600",children:"Rejected"}),e.jsx("p",{className:"text-2xl font-bold text-gray-900",children:n==null?void 0:n.filter(t=>t.status==1).length})]}),e.jsx("div",{className:"p-3 bg-red-100 rounded-full",children:e.jsx(Q,{className:"w-6 h-6 text-red-600"})})]})}),e.jsx("div",{className:"bg-white rounded-xl shadow-lg border border-green-300 border-l-4 border-l-green-500 p-6 transition-all duration-300 hover:shadow-2xl",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium text-gray-600",children:"Approved"}),e.jsx("p",{className:"text-2xl font-bold text-gray-900",children:n==null?void 0:n.filter(t=>t.status==2).length})]}),e.jsx("div",{className:"p-3 bg-green-100 rounded-full",children:e.jsx(re,{className:"w-6 h-6 text-green-600"})})]})})]}),e.jsx("div",{className:"bg-white rounded-xl border border-gray-300 shadow-lg p-6 mb-6",children:e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 items-center justify-between",children:[e.jsxs("div",{className:"relative flex-1 max-w-md ",children:[e.jsx(j,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"}),e.jsx("input",{type:"text",placeholder:"Search by team name or team leader name...",className:"w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-0 focus:ring-orange-400 focus:border-orange-400 transition-colors",value:w,onChange:t=>F(t.target.value)})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(X,{className:"w-5 h-5 text-gray-500"}),e.jsxs("select",{className:"border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white",value:u,onChange:t=>I(t.target.value),children:[e.jsx("option",{value:"all",children:"All Logs"}),e.jsx("option",{value:"active",children:"Approved Only"}),e.jsx("option",{value:"ended",children:"Rejected Only"})]})]})]})}),e.jsxs("div",{className:"bg-white rounded-xl shadow-lg border border-gray-300 p-6 transition-all duration-300 hover:shadow-2xl overflow-hidden",children:[e.jsxs("div",{className:"p-4 border-b border-gray-500 flex items-center gap-2",children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:"Pre Registration Logs"}),c&&e.jsxs("span",{className:"text-sm text-gray-600",children:["- ",((L=k.find(t=>t.id===c))==null?void 0:L.name)||""]})]}),e.jsx("div",{className:"overflow-x-auto pb-4",children:e.jsxs("table",{className:"w-full table-auto",children:[e.jsx("thead",{className:"bg-gradient-to-r from-red-500 to-amber-500",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-4 text-left text-sm font-semibold text-white",children:"Team Name"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-semibold text-white",children:"Team Leader"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-semibold text-white",children:"Email"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-semibold text-white",children:"Contact Number"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-semibold text-white",children:"Status"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-semibold text-white",children:"Reject / Approved Date"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-semibold text-white",children:"View"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-semibold text-white",children:"Comment"})]})}),e.jsx("tbody",{className:"divide-y divide-gray-200",children:n.map((t,a)=>{var d,l,m,x;return e.jsxs("tr",{className:`hover:bg-red-50 transition-colors duration-200 ${a%2===0?"bg-white":"bg-gray-50"}`,children:[e.jsx("td",{className:"px-6 py-4",children:e.jsx("div",{className:"flex items-center w-fit truncate",children:e.jsx("div",{className:"max-w-[150px] px-3 truncate h-8 bg-gradient-to-r from-red-400 to-amber-400 rounded full flex items-center justify-center text-white font-semibold text-sm mr-3",children:((d=t.participant)==null?void 0:d.team)||"N/A"})})}),e.jsx("td",{className:"px-6 py-4",children:e.jsxs("div",{className:"flex items-center w-fit truncate",children:[e.jsx(Y,{className:"w-4 h-4 text-gray-400 mr-2"}),e.jsx("span",{className:"text-gray-900 font-medium",children:((l=t.participant)==null?void 0:l.team_leader)||"N/A"})]})}),e.jsx("td",{className:"px-6 py-4",children:e.jsx("span",{className:"text-gray-900 font-medium break-words",children:((m=t.participant)==null?void 0:m.team_leader_email)||"N/A"})}),e.jsx("td",{className:"px-6 py-4",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx(K,{className:"w-4 h-4 text-gray-400 mr-2 flex-shrink-0"}),e.jsx("span",{className:"text-gray-900 font-mono break-words",children:((x=t.participant)==null?void 0:x.contact_number)||"N/A"})]})}),e.jsx("td",{className:"px-6 py-4",children:e.jsx("span",{className:`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${t.status===1?"bg-red-100 text-red-800":"bg-blue-100 text-blue-800"}`,children:t.status===1?"Rejected":"Approved"})}),e.jsx("td",{className:"px-6 py-4",children:e.jsxs("div",{className:"flex items-center w-fit truncate",children:[e.jsx(Z,{className:"w-4 h-4 text-gray-400 mr-2"}),e.jsx("span",{className:"text-gray-900 text-sm",children:B(t.created_at)})]})}),e.jsx("td",{className:"px-6 py-4",children:e.jsxs(O,{size:"sm",className:"bg-green-600 hover:bg-green-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",type:"button",disabled:!t.participant,onClick:()=>{if(!t.participant){b.fire({icon:"error",title:"Error",text:"Participant data not available",confirmButtonColor:"#16a34a"});return}let i=[];try{t.participant.members&&(i=JSON.parse(t.participant.members))}catch(r){console.error("Error parsing members data:",r),i=[]}console.log(JSON.stringify(i));const o=[{url:"/storage/"+t.participant.student_id,type:"image",name:`Valid Student ID (${t.participant.team_leader})`},{url:"/storage/"+t.participant.registration_form,type:"image",name:`Certificate of Registration Form (${t.participant.team_leader})`},{url:"/storage/"+t.participant.consent_form,type:"image",name:`Signed Consent Form (${t.participant.team_leader})`}];i.forEach(r=>{o.push({url:"/storage/"+r.requirements.studentId,type:"image",name:`Valid Student ID (${r.name})`},{url:"/storage/"+r.requirements.registrationForm,type:"image",name:`Certificate of Registration Form (${r.name})`},{url:"/storage/"+r.requirements.consentForm,type:"image",name:`Signed Consent Form (${r.name})`})}),T(t,o)},children:[e.jsx(ee,{className:"w-4 h-4 text-white"}),e.jsx("span",{children:"View"})]})}),e.jsx("td",{className:"px-6 py-4",children:e.jsx("span",{className:"text-gray-900 text-sm  w-fit  truncate",children:t.comment})})]},t.id)})})]})}),n.length===0&&e.jsxs("div",{className:"text-center py-12",children:[e.jsx("div",{className:"w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx(j,{className:"w-8 h-8 text-red-500"})}),e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"No sessions found"}),e.jsx("p",{className:"text-gray-500",children:"Try adjusting your search criteria or filters."})]})]}),e.jsx("div",{className:"mt-8 text-center",children:e.jsxs("p",{className:"text-gray-500 text-sm",children:["Showing ",n.length," of ",c?n.length:$.length," sessions"]})})]})]})]})})})};export{Ce as default};
