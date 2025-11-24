import{c as y}from"./createLucideIcon-Dpa32nA7.js";import{r as l,j as a}from"./app-DWT7hB3X.js";import{s as h}from"./soundEffects-DP_uyALH.js";import{C as f}from"./clock-DY8zjvnn.js";/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],S=y("circle-alert",N);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],$=y("triangle-alert",w),W=({timeLeft:e,totalTime:b,onTimeUp:t})=>{const[j,n]=l.useState(!1),[k,o]=l.useState(!1),[m,i]=l.useState(!1);if(l.useEffect(()=>{if(e!==null){if(e<=5&&e>0){const u=setInterval(()=>{n(g=>!g)},300);return o(!0),m||(h.playTimerCritical(),i(!0)),()=>{clearInterval(u),o(!1)}}else if(e<=10&&e>5){const u=setInterval(()=>{n(g=>!g)},600);return i(!1),e%2===0&&h.playTimerWarning(),()=>clearInterval(u)}else n(!1),o(!1),i(!1);e===0&&t&&(h.playError(),t())}},[e,t,m]),e===null)return a.jsxs("div",{className:"flex items-center gap-2 text-gray-600",children:[a.jsx(f,{className:"w-5 h-5"}),a.jsx("span",{className:"text-lg font-semibold",children:"No time limit"})]});const v=e/b*100,r=e<=5,p=e<=10&&e>5;let s="text-blue-600",c="bg-blue-100",d="border-blue-500",x="shadow-blue-500/50";return r?(s="text-red-600",c="bg-red-100",d="border-red-500",x="shadow-red-500/50"):p&&(s="text-orange-600",c="bg-orange-100",d="border-orange-500",x="shadow-orange-500/50"),a.jsxs("div",{className:`flex items-center gap-3 ${k?"animate-shake":""}`,children:[r&&a.jsx($,{className:`w-6 h-6 ${s} animate-pulse`}),a.jsxs("div",{className:`
                    relative px-6 py-3 rounded-lg border-2 ${d} ${c}
                    ${j?"animate-pulse":""}
                    transition-all duration-300
                    ${r?"shadow-lg "+x:""}
                `,children:[a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx(f,{className:`w-5 h-5 ${s}`}),a.jsx("span",{className:`text-2xl font-bold ${s}`,children:e}),a.jsx("span",{className:"text-sm text-gray-600",children:"seconds"})]}),a.jsx("div",{className:"absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden",children:a.jsx("div",{className:`h-full transition-all duration-1000 ${r?"bg-red-500":p?"bg-orange-500":"bg-blue-500"}`,style:{width:`${v}%`}})})]}),a.jsx("style",{children:`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out infinite;
                }
            `})]})};export{W as A,S as C};
