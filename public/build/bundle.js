var app=function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(n)}function l(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(t,e,n,o){if(t){const r=a(t,e,n,o);return t[0](r)}}function a(t,e,n,o){return t[1]&&o?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](o(e))):n.ctx}function i(t,e,n,o){if(t[2]&&o){const r=t[2](o(n));if("object"==typeof e.dirty){const t=[],n=Math.max(e.dirty.length,r.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|r[o];return t}return e.dirty|r}return e.dirty}const u="undefined"!=typeof window;let f=u?()=>window.performance.now():()=>Date.now(),d=u?t=>requestAnimationFrame(t):t;const p=new Set;function g(t){p.forEach(e=>{e.c(t)||(p.delete(e),e.f())}),0!==p.size&&d(g)}function m(t,e){t.appendChild(e)}function $(t,e,n){t.insertBefore(e,n||null)}function h(t){t.parentNode.removeChild(t)}function v(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function b(t){return document.createElement(t)}function y(t){return document.createTextNode(t)}function w(){return y(" ")}function x(){return y("")}function C(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function k(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function _(t,e){e=""+e,t.data!==e&&(t.data=e)}function A(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}function L(t,e,n){t.classList[n?"add":"remove"](e)}function S(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}let E,j,T=0,O={};function N(t,e){t.style.animation=(t.style.animation||"").split(", ").filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")).join(", "),e&&!--T&&d(()=>{if(T)return;let t=E.cssRules.length;for(;t--;)E.deleteRule(t);O={}})}function B(t){j=t}function q(){const t=function(){if(!j)throw new Error("Function called outside component initialization");return j}();return(e,n)=>{const o=t.$$.callbacks[e];if(o){const r=S(e,n);o.slice().forEach(e=>{e.call(t,r)})}}}const F=[],M=[],R=[],U=[],z=Promise.resolve();let H,D=!1;function I(t){R.push(t)}function V(){const t=new Set;do{for(;F.length;){const t=F.shift();B(t),W(t.$$)}for(;M.length;)M.pop()();for(let e=0;e<R.length;e+=1){const n=R[e];t.has(n)||(n(),t.add(n))}R.length=0}while(F.length);for(;U.length;)U.pop()();D=!1}function W(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(I)}}function P(t,e,n){t.dispatchEvent(S(`${e?"intro":"outro"}${n}`))}const J=new Set;let Z;function Y(){Z={r:0,c:[],p:Z}}function G(){Z.r||r(Z.c),Z=Z.p}function K(t,e){t&&t.i&&(J.delete(t),t.i(e))}function Q(t,e,n,o){if(t&&t.o){if(J.has(t))return;J.add(t),Z.c.push(()=>{J.delete(t),o&&(n&&t.d(1),o())}),t.o(e)}}const X={duration:0};function tt(n,o,r){let s,c,a=o(n,r),i=!1,u=0;function m(){s&&N(n,s)}function $(){const{delay:o=0,duration:r=300,easing:l=e,tick:$=t,css:h}=a||X;h&&(s=function(t,e,n,o,r,l,s,c=0){const a=16.666/o;let i="{\n";for(let t=0;t<=1;t+=a){const o=e+(n-e)*l(t);i+=100*t+`%{${s(o,1-o)}}\n`}const u=i+`100% {${s(n,1-n)}}\n}`,f=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${c}`;if(!O[f]){if(!E){const t=b("style");document.head.appendChild(t),E=t.sheet}O[f]=!0,E.insertRule(`@keyframes ${f} ${u}`,E.cssRules.length)}const d=t.style.animation||"";return t.style.animation=`${d?`${d}, `:""}${f} ${o}ms linear ${r}ms 1 both`,T+=1,f}(n,0,1,r,o,l,h,u++)),$(0,1);const v=f()+o,y=v+r;c&&c.abort(),i=!0,I(()=>P(n,!0,"start")),c=function(t){let e;return 0===p.size&&d(g),{promise:new Promise(n=>{p.add(e={c:t,f:n})}),abort(){p.delete(e)}}}(t=>{if(i){if(t>=y)return $(1,0),P(n,!0,"end"),m(),i=!1;if(t>=v){const e=l((t-v)/r);$(e,1-e)}}return i})}let h=!1;return{start(){h||(N(n),l(a)?(a=a(),(H||(H=Promise.resolve(),H.then(()=>{H=null})),H).then($)):$())},invalidate(){h=!1},end(){i&&(m(),i=!1)}}}function et(t){t&&t.c()}function nt(t,e,o){const{fragment:s,on_mount:c,on_destroy:a,after_update:i}=t.$$;s&&s.m(e,o),I(()=>{const e=c.map(n).filter(l);a?a.push(...e):r(e),t.$$.on_mount=[]}),i.forEach(I)}function ot(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function rt(t,e){-1===t.$$.dirty[0]&&(F.push(t),D||(D=!0,z.then(V)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function lt(e,n,l,s,c,a,i=[-1]){const u=j;B(e);const f=n.props||{},d=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:c,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:o(),dirty:i};let p=!1;d.ctx=l?l(e,f,(t,n,...o)=>{const r=o.length?o[0]:n;return d.ctx&&c(d.ctx[t],d.ctx[t]=r)&&(d.bound[t]&&d.bound[t](r),p&&rt(e,t)),n}):[],d.update(),p=!0,r(d.before_update),d.fragment=!!s&&s(d.ctx),n.target&&(n.hydrate?d.fragment&&d.fragment.l(function(t){return Array.from(t.childNodes)}(n.target)):d.fragment&&d.fragment.c(),n.intro&&K(e.$$.fragment),nt(e,n.target,n.anchor),V()),B(u)}class st{$destroy(){ot(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}var ct={},at={};function it(t){return new Function("d","return {"+t.map((function(t,e){return JSON.stringify(t)+": d["+e+'] || ""'})).join(",")+"}")}function ut(t){var e=Object.create(null),n=[];return t.forEach((function(t){for(var o in t)o in e||n.push(e[o]=o)})),n}function ft(t,e){var n=t+"",o=n.length;return o<e?new Array(e-o+1).join(0)+n:n}function dt(t){var e,n=t.getUTCHours(),o=t.getUTCMinutes(),r=t.getUTCSeconds(),l=t.getUTCMilliseconds();return isNaN(t)?"Invalid Date":((e=t.getUTCFullYear())<0?"-"+ft(-e,6):e>9999?"+"+ft(e,6):ft(e,4))+"-"+ft(t.getUTCMonth()+1,2)+"-"+ft(t.getUTCDate(),2)+(l?"T"+ft(n,2)+":"+ft(o,2)+":"+ft(r,2)+"."+ft(l,3)+"Z":r?"T"+ft(n,2)+":"+ft(o,2)+":"+ft(r,2)+"Z":o||n?"T"+ft(n,2)+":"+ft(o,2)+"Z":"")}var pt=function(t){var e=new RegExp('["'+t+"\n\r]"),n=t.charCodeAt(0);function o(t,e){var o,r=[],l=t.length,s=0,c=0,a=l<=0,i=!1;function u(){if(a)return at;if(i)return i=!1,ct;var e,o,r=s;if(34===t.charCodeAt(r)){for(;s++<l&&34!==t.charCodeAt(s)||34===t.charCodeAt(++s););return(e=s)>=l?a=!0:10===(o=t.charCodeAt(s++))?i=!0:13===o&&(i=!0,10===t.charCodeAt(s)&&++s),t.slice(r+1,e-1).replace(/""/g,'"')}for(;s<l;){if(10===(o=t.charCodeAt(e=s++)))i=!0;else if(13===o)i=!0,10===t.charCodeAt(s)&&++s;else if(o!==n)continue;return t.slice(r,e)}return a=!0,t.slice(r,l)}for(10===t.charCodeAt(l-1)&&--l,13===t.charCodeAt(l-1)&&--l;(o=u())!==at;){for(var f=[];o!==ct&&o!==at;)f.push(o),o=u();e&&null==(f=e(f,c++))||r.push(f)}return r}function r(e,n){return e.map((function(e){return n.map((function(t){return s(e[t])})).join(t)}))}function l(e){return e.map(s).join(t)}function s(t){return null==t?"":t instanceof Date?dt(t):e.test(t+="")?'"'+t.replace(/"/g,'""')+'"':t}return{parse:function(t,e){var n,r,l=o(t,(function(t,o){if(n)return n(t,o-1);r=t,n=e?function(t,e){var n=it(t);return function(o,r){return e(n(o),r,t)}}(t,e):it(t)}));return l.columns=r||[],l},parseRows:o,format:function(e,n){return null==n&&(n=ut(e)),[n.map(s).join(t)].concat(r(e,n)).join("\n")},formatBody:function(t,e){return null==e&&(e=ut(t)),r(t,e).join("\n")},formatRows:function(t){return t.map(l).join("\n")},formatRow:l,formatValue:s}}(",").parse;function gt(t){if(!t.ok)throw new Error(t.status+" "+t.statusText);return t.text()}function mt(t,e){return fetch(t,e).then(gt)}var $t,ht=($t=pt,function(t,e,n){return 2===arguments.length&&"function"==typeof e&&(n=e,e=void 0),mt(t,e).then((function(t){return $t(t,n)}))});function vt(t,e,n){const o=t.slice();return o[4]=e[n],o}function bt(t,e,n){const o=t.slice();return o[4]=e[n],o}function yt(t,e,n){const o=t.slice();return o[4]=e[n],o}function wt(t,e,n){const o=t.slice();return o[4]=e[n],o}function xt(t,e,n){const o=t.slice();return o[4]=e[n],o}function Ct(t,e,n){const o=t.slice();return o[4]=e[n],o}function kt(t,e,n){const o=t.slice();return o[1]=e[n],o}function _t(t){let e,n,o;return{c(){e=b("img"),e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),A(e,"width","calc(200vw / "+Nt+")"),k(e,"alt",o=t[4].name),k(e,"class","svelte-1t1bpg5")},m(t,n){$(t,e,n)},p(t,r){1&r&&e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),1&r&&o!==(o=t[4].name)&&k(e,"alt",o)},d(t){t&&h(e)}}}function At(t){let e,n,o;return{c(){e=b("img"),e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),A(e,"width","calc(200vw / "+Nt+")"),k(e,"alt",o=t[4].name),k(e,"class","svelte-1t1bpg5")},m(t,n){$(t,e,n)},p(t,r){1&r&&e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),1&r&&o!==(o=t[4].name)&&k(e,"alt",o)},d(t){t&&h(e)}}}function Lt(t){let e,n,o;return{c(){e=b("img"),e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),A(e,"width","calc(200vw / "+Nt+")"),k(e,"alt",o=t[4].name),k(e,"class","svelte-1t1bpg5")},m(t,n){$(t,e,n)},p(t,r){1&r&&e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),1&r&&o!==(o=t[4].name)&&k(e,"alt",o)},d(t){t&&h(e)}}}function St(t){let e,n,o;return{c(){e=b("img"),e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),A(e,"width","calc(200vw / "+Nt+")"),k(e,"alt",o=t[4].name),k(e,"class","svelte-1t1bpg5")},m(t,n){$(t,e,n)},p(t,r){1&r&&e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),1&r&&o!==(o=t[4].name)&&k(e,"alt",o)},d(t){t&&h(e)}}}function Et(t){let e,n,o;return{c(){e=b("img"),e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),A(e,"width","calc(200vw / "+Nt+")"),k(e,"alt",o=t[4].name),k(e,"class","svelte-1t1bpg5")},m(t,n){$(t,e,n)},p(t,r){1&r&&e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),1&r&&o!==(o=t[4].name)&&k(e,"alt",o)},d(t){t&&h(e)}}}function jt(t){let e,n,o;return{c(){e=b("img"),e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),A(e,"width","calc(200vw / "+Nt+")"),k(e,"alt",o=t[4].name),k(e,"class","svelte-1t1bpg5")},m(t,n){$(t,e,n)},p(t,r){1&r&&e.src!==(n="assets/flags/"+t[4].code.toLowerCase()+"_small.png")&&k(e,"src",n),1&r&&o!==(o=t[4].name)&&k(e,"alt",o)},d(t){t&&h(e)}}}function Tt(t){let e,n,o,r,l,s,c,a,i,u,f=t[0].slice(0,Nt),d=[];for(let e=0;e<f.length;e+=1)d[e]=_t(Ct(t,f,e));let p=t[0].slice(0,.5*Nt),g=[];for(let e=0;e<p.length;e+=1)g[e]=At(xt(t,p,e));let y=t[0].slice(Nt,2*Nt),x=[];for(let e=0;e<y.length;e+=1)x[e]=Lt(wt(t,y,e));let C=t[0].slice(Nt,1.5*Nt),_=[];for(let e=0;e<C.length;e+=1)_[e]=St(yt(t,C,e));let A=t[0].slice(2*Nt,3*Nt),L=[];for(let e=0;e<A.length;e+=1)L[e]=Et(bt(t,A,e));let S=t[0].slice(2*Nt,2.5*Nt),E=[];for(let e=0;e<S.length;e+=1)E[e]=jt(vt(t,S,e));return{c(){e=b("div"),n=b("div");for(let t=0;t<d.length;t+=1)d[t].c();o=w();for(let t=0;t<g.length;t+=1)g[t].c();r=w(),l=b("div");for(let t=0;t<x.length;t+=1)x[t].c();s=w();for(let t=0;t<_.length;t+=1)_[t].c();c=w(),a=b("div");for(let t=0;t<L.length;t+=1)L[t].c();i=w();for(let t=0;t<E.length;t+=1)E[t].c();u=w(),k(n,"class","row svelte-1t1bpg5"),k(l,"class","row svelte-1t1bpg5"),k(a,"class","row svelte-1t1bpg5")},m(t,f){$(t,e,f),m(e,n);for(let t=0;t<d.length;t+=1)d[t].m(n,null);m(n,o);for(let t=0;t<g.length;t+=1)g[t].m(n,null);m(e,r),m(e,l);for(let t=0;t<x.length;t+=1)x[t].m(l,null);m(l,s);for(let t=0;t<_.length;t+=1)_[t].m(l,null);m(e,c),m(e,a);for(let t=0;t<L.length;t+=1)L[t].m(a,null);m(a,i);for(let t=0;t<E.length;t+=1)E[t].m(a,null);m(e,u)},p(t,e){if(1&e){let r;for(f=t[0].slice(0,Nt),r=0;r<f.length;r+=1){const l=Ct(t,f,r);d[r]?d[r].p(l,e):(d[r]=_t(l),d[r].c(),d[r].m(n,o))}for(;r<d.length;r+=1)d[r].d(1);d.length=f.length}if(1&e){let o;for(p=t[0].slice(0,.5*Nt),o=0;o<p.length;o+=1){const r=xt(t,p,o);g[o]?g[o].p(r,e):(g[o]=At(r),g[o].c(),g[o].m(n,null))}for(;o<g.length;o+=1)g[o].d(1);g.length=p.length}if(1&e){let n;for(y=t[0].slice(Nt,2*Nt),n=0;n<y.length;n+=1){const o=wt(t,y,n);x[n]?x[n].p(o,e):(x[n]=Lt(o),x[n].c(),x[n].m(l,s))}for(;n<x.length;n+=1)x[n].d(1);x.length=y.length}if(1&e){let n;for(C=t[0].slice(Nt,1.5*Nt),n=0;n<C.length;n+=1){const o=yt(t,C,n);_[n]?_[n].p(o,e):(_[n]=St(o),_[n].c(),_[n].m(l,null))}for(;n<_.length;n+=1)_[n].d(1);_.length=C.length}if(1&e){let n;for(A=t[0].slice(2*Nt,3*Nt),n=0;n<A.length;n+=1){const o=bt(t,A,n);L[n]?L[n].p(o,e):(L[n]=Et(o),L[n].c(),L[n].m(a,i))}for(;n<L.length;n+=1)L[n].d(1);L.length=A.length}if(1&e){let n;for(S=t[0].slice(2*Nt,2.5*Nt),n=0;n<S.length;n+=1){const o=vt(t,S,n);E[n]?E[n].p(o,e):(E[n]=jt(o),E[n].c(),E[n].m(a,null))}for(;n<E.length;n+=1)E[n].d(1);E.length=S.length}},d(t){t&&h(e),v(d,t),v(g,t),v(x,t),v(_,t),v(L,t),v(E,t)}}}function Ot(e){let n,o=new Array(2),r=[];for(let t=0;t<o.length;t+=1)r[t]=Tt(kt(e,o,t));return{c(){n=b("div");for(let t=0;t<r.length;t+=1)r[t].c();k(n,"class","wrapper svelte-1t1bpg5")},m(t,e){$(t,n,e);for(let t=0;t<r.length;t+=1)r[t].m(n,null)},p(t,[e]){if(1&e){let l;for(o=new Array(2),l=0;l<o.length;l+=1){const s=kt(t,o,l);r[l]?r[l].p(s,e):(r[l]=Tt(s),r[l].c(),r[l].m(n,null))}for(;l<r.length;l+=1)r[l].d(1);r.length=o.length}},i:t,o:t,d(t){t&&h(n),v(r,t)}}}const Nt=30;function Bt(t,e,n){let{flags:o}=e;return t.$set=t=>{"flags"in t&&n(0,o=t.flags)},t.$$.update=()=>{1&t.$$.dirty&&o.sort(()=>Math.random()>=.5)},[o]}class qt extends st{constructor(t){super(),lt(this,t,Bt,Ot,s,{flags:0})}}function Ft(t){const e=t-1;return e*e*e+1}function Mt(t,{delay:e=0,duration:n=400,easing:o=Ft,x:r=0,y:l=0,opacity:s=0}){const c=getComputedStyle(t),a=+c.opacity,i="none"===c.transform?"":c.transform,u=a*(1-s);return{delay:e,duration:n,easing:o,css:(t,e)=>`\n\t\t\ttransform: ${i} translate(${(1-t)*r}px, ${(1-t)*l}px);\n\t\t\topacity: ${a-u*e}`}}function Rt(t){let e,n,o;const r=t[1].default,l=c(r,t,t[0],null);return{c(){e=b("div"),l&&l.c(),k(e,"class","card svelte-10mq8y8")},m(t,n){$(t,e,n),l&&l.m(e,null),o=!0},p(t,[e]){l&&l.p&&1&e&&l.p(a(r,t,t[0],null),i(r,t[0],e,null))},i(t){o||(K(l,t),n||I(()=>{n=tt(e,Mt,{x:500,duration:1e3}),n.start()}),o=!0)},o(t){Q(l,t),o=!1},d(t){t&&h(e),l&&l.d(t)}}}function Ut(t,e,n){let{$$slots:o={},$$scope:r}=e;return t.$set=t=>{"$$scope"in t&&n(0,r=t.$$scope)},[r,o]}class zt extends st{constructor(t){super(),lt(this,t,Ut,Rt,s,{})}}function Ht(t){let e,n,o;const r=t[3].default,l=c(r,t,t[2],null);return{c(){e=b("button"),l&&l.c(),e.disabled=t[1],k(e,"class","svelte-1paopx"),L(e,"secondary",t[0])},m(r,s){$(r,e,s),l&&l.m(e,null),n=!0,o=C(e,"click",t[4])},p(t,[o]){l&&l.p&&4&o&&l.p(a(r,t,t[2],null),i(r,t[2],o,null)),(!n||2&o)&&(e.disabled=t[1]),1&o&&L(e,"secondary",t[0])},i(t){n||(K(l,t),n=!0)},o(t){Q(l,t),n=!1},d(t){t&&h(e),l&&l.d(t),o()}}}function Dt(t,e,n){let{secondary:o=!1}=e,{disabled:r=!1}=e;console.log(o);let{$$slots:l={},$$scope:s}=e;return t.$set=t=>{"secondary"in t&&n(0,o=t.secondary),"disabled"in t&&n(1,r=t.disabled),"$$scope"in t&&n(2,s=t.$$scope)},[o,r,s,l,function(e){!function(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(t=>t(e))}(t,e)}]}class It extends st{constructor(t){super(),lt(this,t,Dt,Ht,s,{secondary:0,disabled:1})}}function Vt(t){let e;const n=new qt({props:{flags:t[0]}});return{c(){et(n.$$.fragment)},m(t,o){nt(n,t,o),e=!0},p(t,e){const o={};1&e&&(o.flags=t[0]),n.$set(o)},i(t){e||(K(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){ot(n,t)}}}function Wt(t){let e;return{c(){e=y("Start")},m(t,n){$(t,e,n)},d(t){t&&h(e)}}}function Pt(t){let e,n,o,r,l;const s=new It({props:{$$slots:{default:[Wt]},$$scope:{ctx:t}}});return s.$on("click",t[2]),{c(){e=b("h3"),e.textContent="flaginator",n=w(),o=b("p"),o.textContent="Identify any flag",r=w(),et(s.$$.fragment),k(e,"class","svelte-1apm5yb")},m(t,c){$(t,e,c),$(t,n,c),$(t,o,c),$(t,r,c),nt(s,t,c),l=!0},p(t,e){const n={};16&e&&(n.$$scope={dirty:e,ctx:t}),s.$set(n)},i(t){l||(K(s.$$.fragment,t),l=!0)},o(t){Q(s.$$.fragment,t),l=!1},d(t){t&&h(e),t&&h(n),t&&h(o),t&&h(r),ot(s,t)}}}function Jt(t){let e,n,o=!t[1]&&Vt(t);const r=new zt({props:{$$slots:{default:[Pt]},$$scope:{ctx:t}}});return{c(){o&&o.c(),e=w(),et(r.$$.fragment)},m(t,l){o&&o.m(t,l),$(t,e,l),nt(r,t,l),n=!0},p(t,[n]){t[1]?o&&(Y(),Q(o,1,1,()=>{o=null}),G()):o?(o.p(t,n),K(o,1)):(o=Vt(t),o.c(),K(o,1),o.m(e.parentNode,e));const l={};16&n&&(l.$$scope={dirty:n,ctx:t}),r.$set(l)},i(t){n||(K(o),K(r.$$.fragment,t),n=!0)},o(t){Q(o),Q(r.$$.fragment,t),n=!1},d(t){o&&o.d(t),t&&h(e),ot(r,t)}}}function Zt(t,e,n){let{flags:o}=e,r=window.matchMedia("(orientation: portrait)").matches;window.addEventListener("resize",()=>{n(1,r=window.matchMedia("(orientation: portrait)").matches)});const l=q();return t.$set=t=>{"flags"in t&&n(0,o=t.flags)},[o,r,()=>{l("start")}]}class Yt extends st{constructor(t){super(),lt(this,t,Zt,Jt,s,{flags:0})}}function Gt(t,e,n){const o=t.slice();return o[11]=e[n],o}function Kt(t){let e,n,o,r,l,s=t[11].label+"";function c(...e){return t[10](t[11],...e)}return{c(){e=b("div"),n=w(),o=b("p"),r=y(s),k(e,"class","option-image svelte-11flixk"),A(e,"background-image","url(/assets/"+t[2]+"/"+t[11].value+".png)"),A(e,"padding-top","calc(100% * 2/3)"),L(e,"selected",t[1].includes(t[11].value)),k(o,"class","svelte-11flixk")},m(t,s){$(t,e,s),$(t,n,s),$(t,o,s),m(o,r),l=C(e,"click",c)},p(n,o){t=n,5&o&&A(e,"background-image","url(/assets/"+t[2]+"/"+t[11].value+".png)"),3&o&&L(e,"selected",t[1].includes(t[11].value)),1&o&&s!==(s=t[11].label+"")&&_(r,s)},d(t){t&&h(e),t&&h(n),t&&h(o),l()}}}function Qt(t){let e,n;function o(...e){return t[9](t[11],...e)}return{c(){e=b("div"),k(e,"class","option-image svelte-11flixk"),A(e,"background-color",t[11].value),A(e,"padding-top","calc(100% * 2/3)"),L(e,"selected",t[1].includes(t[11].value))},m(t,r){$(t,e,r),n=C(e,"click",o)},p(n,o){t=n,1&o&&A(e,"background-color",t[11].value),3&o&&L(e,"selected",t[1].includes(t[11].value))},d(t){t&&h(e),n()}}}function Xt(t){let e,n;function o(t,e){return"colors"===t[2]?Qt:Kt}let r=o(t),l=r(t);return{c(){e=b("div"),l.c(),n=w(),k(e,"class","option svelte-11flixk")},m(t,o){$(t,e,o),l.m(e,null),m(e,n)},p(t,s){r===(r=o(t))&&l?l.p(t,s):(l.d(1),l=r(t),l&&(l.c(),l.m(e,n)))},d(t){t&&h(e),l.d()}}}function te(t){let e;return{c(){e=y("Skip")},m(t,n){$(t,e,n)},d(t){t&&h(e)}}}function ee(t){let e;return{c(){e=y("Retry")},m(t,n){$(t,e,n)},d(t){t&&h(e)}}}function ne(t){let e;return{c(){e=y("Next")},m(t,n){$(t,e,n)},d(t){t&&h(e)}}}function oe(t){let e,n,o,r,l,s,c,a,i,u=t[0].question+"",f=t[0].options,d=[];for(let e=0;e<f.length;e+=1)d[e]=Xt(Gt(t,f,e));const p=new It({props:{secondary:!0,$$slots:{default:[te]},$$scope:{ctx:t}}});p.$on("click",t[5]);const g=new It({props:{secondary:!0,$$slots:{default:[ee]},$$scope:{ctx:t}}});g.$on("click",t[6]);const x=new It({props:{disabled:0==t[1].length,$$slots:{default:[ne]},$$scope:{ctx:t}}});return x.$on("click",t[4]),{c(){e=b("h3"),n=y(u),o=w(),r=b("div");for(let t=0;t<d.length;t+=1)d[t].c();l=w(),s=b("div"),et(p.$$.fragment),c=w(),et(g.$$.fragment),a=w(),et(x.$$.fragment),k(e,"class","svelte-11flixk"),k(r,"class","grid svelte-11flixk")},m(t,u){$(t,e,u),m(e,n),$(t,o,u),$(t,r,u);for(let t=0;t<d.length;t+=1)d[t].m(r,null);$(t,l,u),$(t,s,u),nt(p,s,null),m(s,c),nt(g,s,null),m(s,a),nt(x,s,null),i=!0},p(t,e){if((!i||1&e)&&u!==(u=t[0].question+"")&&_(n,u),15&e){let n;for(f=t[0].options,n=0;n<f.length;n+=1){const o=Gt(t,f,n);d[n]?d[n].p(o,e):(d[n]=Xt(o),d[n].c(),d[n].m(r,null))}for(;n<d.length;n+=1)d[n].d(1);d.length=f.length}const o={};16384&e&&(o.$$scope={dirty:e,ctx:t}),p.$set(o);const l={};16384&e&&(l.$$scope={dirty:e,ctx:t}),g.$set(l);const s={};2&e&&(s.disabled=0==t[1].length),16384&e&&(s.$$scope={dirty:e,ctx:t}),x.$set(s)},i(t){i||(K(p.$$.fragment,t),K(g.$$.fragment,t),K(x.$$.fragment,t),i=!0)},o(t){Q(p.$$.fragment,t),Q(g.$$.fragment,t),Q(x.$$.fragment,t),i=!1},d(t){t&&h(e),t&&h(o),t&&h(r),v(d,t),t&&h(l),t&&h(s),ot(p),ot(g),ot(x)}}}function re(t){let e;const n=new zt({props:{$$slots:{default:[oe]},$$scope:{ctx:t}}});return{c(){et(n.$$.fragment)},m(t,o){nt(n,t,o),e=!0},p(t,[e]){const o={};16391&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o)},i(t){e||(K(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){ot(n,t)}}}function le(t,e,n){let{property:o}=e,{propertyOptions:r}=e,{filtered:l}=e,{selected:s}=e;const c=q();"nbBands"===o&&(r.options=r.options.filter(t=>l.some(e=>t.value.startsWith(e.layout))));const a=t=>{r.multiple?n(1,s=s.includes(t)?s.filter(e=>e!==t):[...s,t]):n(1,s=[t])};return t.$set=t=>{"property"in t&&n(2,o=t.property),"propertyOptions"in t&&n(0,r=t.propertyOptions),"filtered"in t&&n(7,l=t.filtered),"selected"in t&&n(1,s=t.selected)},[r,s,o,a,()=>{c("submit")},()=>{c("skip")},()=>{c("retry")},l,c,t=>a(t.value),t=>a(t.value)]}class se extends st{constructor(t){super(),lt(this,t,le,re,s,{property:2,propertyOptions:0,filtered:7,selected:1})}}function ce(t,e,n){const o=t.slice();return o[3]=e[n],o}function ae(t){let e,n,o,r,l=t[0].slice(1),s=[];for(let e=0;e<l.length;e+=1)s[e]=ie(ce(t,l,e));return{c(){e=b("div"),n=b("p"),n.textContent="Alternative flags",o=w(),r=b("div");for(let t=0;t<s.length;t+=1)s[t].c();k(n,"class","svelte-vha7ls"),k(r,"class","alternative-results svelte-vha7ls"),k(e,"class","alternative-results-wrapper svelte-vha7ls")},m(t,l){$(t,e,l),m(e,n),m(e,o),m(e,r);for(let t=0;t<s.length;t+=1)s[t].m(r,null)},p(t,e){if(1&e){let n;for(l=t[0].slice(1),n=0;n<l.length;n+=1){const o=ce(t,l,n);s[n]?s[n].p(o,e):(s[n]=ie(o),s[n].c(),s[n].m(r,null))}for(;n<s.length;n+=1)s[n].d(1);s.length=l.length}},d(t){t&&h(e),v(s,t)}}}function ie(t){let e,n,o,r,l,s,c,a,i=t[3].name+"";return{c(){e=b("div"),n=b("img"),l=w(),s=b("p"),c=y(i),a=w(),n.src!==(o="/assets/flags/"+t[3].code.toLowerCase()+".png")&&k(n,"src",o),k(n,"alt",r=t[3].name),k(n,"class","svelte-vha7ls"),k(s,"class","svelte-vha7ls"),k(e,"class","svelte-vha7ls")},m(t,o){$(t,e,o),m(e,n),m(e,l),m(e,s),m(s,c),m(e,a)},p(t,e){1&e&&n.src!==(o="/assets/flags/"+t[3].code.toLowerCase()+".png")&&k(n,"src",o),1&e&&r!==(r=t[3].name)&&k(n,"alt",r),1&e&&i!==(i=t[3].name+"")&&_(c,i)},d(t){t&&h(e)}}}function ue(t){let e,n,o,r,l,s,c,a,i,u,f,d,p=t[0][0].name.toUpperCase()+"",g=t[0].length>1&&ae(t);return{c(){e=b("h3"),n=y("Is this "),o=y(p),r=y("?"),l=w(),s=b("img"),i=w(),g&&g.c(),u=w(),f=b("button"),f.textContent="Identify another flag",s.src!==(c="/assets/flags/"+t[0][0].code.toLowerCase()+".png")&&k(s,"src",c),k(s,"alt",a=t[0][0].name),k(s,"class","svelte-vha7ls"),k(f,"class","svelte-vha7ls")},m(c,a){$(c,e,a),m(e,n),m(e,o),m(e,r),$(c,l,a),$(c,s,a),$(c,i,a),g&&g.m(c,a),$(c,u,a),$(c,f,a),d=C(f,"click",t[1])},p(t,e){1&e&&p!==(p=t[0][0].name.toUpperCase()+"")&&_(o,p),1&e&&s.src!==(c="/assets/flags/"+t[0][0].code.toLowerCase()+".png")&&k(s,"src",c),1&e&&a!==(a=t[0][0].name)&&k(s,"alt",a),t[0].length>1?g?g.p(t,e):(g=ae(t),g.c(),g.m(u.parentNode,u)):g&&(g.d(1),g=null)},d(t){t&&h(e),t&&h(l),t&&h(s),t&&h(i),g&&g.d(t),t&&h(u),t&&h(f),d()}}}function fe(t){let e;const n=new zt({props:{$$slots:{default:[ue]},$$scope:{ctx:t}}});return{c(){et(n.$$.fragment)},m(t,o){nt(n,t,o),e=!0},p(t,[e]){const o={};65&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o)},i(t){e||(K(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){ot(n,t)}}}function de(t,e,n){let{found:o}=e;const r=q();return t.$set=t=>{"found"in t&&n(0,o=t.found)},[o,()=>{r("retry")}]}class pe extends st{constructor(t){super(),lt(this,t,de,fe,s,{found:0})}}function ge(t){let e;return{c(){e=b("h3"),e.textContent="I need more information to identify this flag..."},m(t,n){$(t,e,n)},d(t){t&&h(e)}}}function me(t){let e;return{c(){e=b("h3"),e.textContent="I don't know this flag... Are you sure it exists?"},m(t,n){$(t,e,n)},d(t){t&&h(e)}}}function $e(t){let e;return{c(){e=y("Retry")},m(t,n){$(t,e,n)},d(t){t&&h(e)}}}function he(t){let e,n;function o(t,e){return t[0]?me:ge}let r=o(t),l=r(t);const s=new It({props:{$$slots:{default:[$e]},$$scope:{ctx:t}}});return s.$on("click",t[1]),{c(){l.c(),e=w(),et(s.$$.fragment)},m(t,o){l.m(t,o),$(t,e,o),nt(s,t,o),n=!0},p(t,n){r!==(r=o(t))&&(l.d(1),l=r(t),l&&(l.c(),l.m(e.parentNode,e)));const c={};8&n&&(c.$$scope={dirty:n,ctx:t}),s.$set(c)},i(t){n||(K(s.$$.fragment,t),n=!0)},o(t){Q(s.$$.fragment,t),n=!1},d(t){l.d(t),t&&h(e),ot(s,t)}}}function ve(t){let e;const n=new zt({props:{$$slots:{default:[he]},$$scope:{ctx:t}}});return{c(){et(n.$$.fragment)},m(t,o){nt(n,t,o),e=!0},p(t,[e]){const o={};9&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o)},i(t){e||(K(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){ot(n,t)}}}function be(t,e,n){let{notFound:o}=e;const r=q();return t.$set=t=>{"notFound"in t&&n(0,o=t.notFound)},[o,()=>{r("retry")}]}class ye extends st{constructor(t){super(),lt(this,t,be,ve,s,{notFound:0})}}var we={layout:{question:"What is the layout (or layouts) of the flag?",multiple:!0,options:[{value:"plain",label:"Plain color"},{value:"bandsVertical",label:"Vertical bands"},{value:"bandsHorizontal",label:"Horizontal bands"},{value:"triangle",label:"Triangle on the hoist-side"},{value:"diagonal",label:"Diagonal"},{value:"unionJack",label:"Union Jack in the canton"},{value:"stripes",label:"Stripes"},{value:"cross",label:"Cross"},{value:"misc",label:"Miscellaneous"}]},colors:{question:"What are the main colors of the flag?",multiple:!0,options:[{value:"black"},{value:"white"},{value:"red"},{value:"green"},{value:"blue"},{value:"yellow"},{value:"orange"}]},figures:{question:"Does the flag contain any figure?",multiple:!0,options:[{value:"none",label:"None"},{value:"star",label:"Star(s)"},{value:"emblem",label:"Emblem"},{value:"sun",label:"Sun (or disk)"},{value:"crescent",label:"Crescent"},{value:"bird",label:"Bird (i.e. eagle)"},{value:"weapon",label:"Weapon"},{value:"cross",label:"Cross"},{value:"nature",label:"Leaf/tree"},{value:"misc",label:"Miscellaneous"}]},nbStars:{question:"How many stars does the flag contain?",multiple:!1,options:[{value:1,label:"A single star"},{value:2,label:"2 to 5 stars"},{value:6,label:"6 stars or more"}]},nbBands:{question:"How many bands has the flag?",multiple:!1,options:[{value:"bandsVertical2",label:"2 bands"},{value:"bandsVertical3",label:"3 bands"},{value:"bandsVertical4",label:"4 bands or more"},{value:"bandsHorizontal2",label:"2 bands"},{value:"bandsHorizontal3",label:"3 bands"}]}};function xe(t){let e,n,o,r;const l=[Ae,_e,ke],s=[];function c(t,e){return t[2]&&t[1].length>1?0:t[1].length>0&&t[1].length<=3?1:2}return e=c(t),n=s[e]=l[e](t),{c(){n.c(),o=x()},m(t,n){s[e].m(t,n),$(t,o,n),r=!0},p(t,r){let a=e;e=c(t),e===a?s[e].p(t,r):(Y(),Q(s[a],1,1,()=>{s[a]=null}),G(),n=s[e],n||(n=s[e]=l[e](t),n.c()),K(n,1),n.m(o.parentNode,o))},i(t){r||(K(n),r=!0)},o(t){Q(n),r=!1},d(t){s[e].d(t),t&&h(o)}}}function Ce(t){let e;const n=new Yt({props:{flags:t[0]}});return n.$on("start",t[13]),{c(){et(n.$$.fragment)},m(t,o){nt(n,t,o),e=!0},p(t,e){const o={};1&e&&(o.flags=t[0]),n.$set(o)},i(t){e||(K(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){ot(n,t)}}}function ke(t){let e;const n=new ye({props:{notFound:0===t[1].length}});return n.$on("retry",t[11]),{c(){et(n.$$.fragment)},m(t,o){nt(n,t,o),e=!0},p(t,e){const o={};2&e&&(o.notFound=0===t[1].length),n.$set(o)},i(t){e||(K(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){ot(n,t)}}}function _e(t){let e;const n=new pe({props:{found:t[1]}});return n.$on("retry",t[15]),{c(){et(n.$$.fragment)},m(t,o){nt(n,t,o),e=!0},p(t,e){const o={};2&e&&(o.found=t[1]),n.$set(o)},i(t){e||(K(n.$$.fragment,t),e=!0)},o(t){Q(n.$$.fragment,t),e=!1},d(t){ot(n,t)}}}function Ae(t){let e,n;function o(e){t[14].call(null,e)}let r={property:t[2],propertyOptions:t[7][t[2]],filtered:t[1]};void 0!==t[3]&&(r.selected=t[3]);const l=new se({props:r});return M.push(()=>function(t,e,n){const o=t.$$.props[e];void 0!==o&&(t.$$.bound[o]=n,n(t.$$.ctx[o]))}(l,"selected",o)),l.$on("submit",t[9]),l.$on("skip",t[10]),l.$on("retry",t[11]),{c(){et(l.$$.fragment)},m(t,e){nt(l,t,e),n=!0},p(t,n){const o={};var r;4&n&&(o.property=t[2]),4&n&&(o.propertyOptions=t[7][t[2]]),2&n&&(o.filtered=t[1]),!e&&8&n&&(e=!0,o.selected=t[3],r=()=>e=!1,U.push(r)),l.$set(o)},i(t){n||(K(l.$$.fragment,t),n=!0)},o(t){Q(l.$$.fragment,t),n=!1},d(t){ot(l,t)}}}function Le(t){let e,n,o,r;const l=[Ce,xe],s=[];function c(t,e){return t[5]?t[5]&&!t[6]?1:-1:0}return~(e=c(t))&&(n=s[e]=l[e](t)),{c(){n&&n.c(),o=x()},m(t,n){~e&&s[e].m(t,n),$(t,o,n),r=!0},p(t,[r]){let a=e;e=c(t),e===a?~e&&s[e].p(t,r):(n&&(Y(),Q(s[a],1,1,()=>{s[a]=null}),G()),~e?(n=s[e],n||(n=s[e]=l[e](t),n.c()),K(n,1),n.m(o.parentNode,o)):n=null)},i(t){r||(K(n),r=!0)},o(t){Q(n),r=!1},d(t){~e&&s[e].d(t),t&&h(o)}}}function Se(t,e,n){const o=(navigator.languages[0],we),r=["layout","colors","figures","nbStars","nbBands"];let l=[],s=[],c=r[0],a=[],i={},u=!1,f=!0;ht("./flags.csv").then(t=>{t.forEach(t=>{t.nbStars=+t.nbStars,t.nbStars>1&&t.nbStars<=5?t.nbStars=2:t.nbStars>5&&(t.nbStars=6),t.layout=t.layout.split(","),t.colors=t.colors.split(","),t.figures=t.figures.split(",").map(t=>""===t?"none":t)}),n(0,l=t),n(1,s=l),n(6,f=!1)});const d=()=>{const t=r.filter(t=>!Object.keys(i).includes(t)).filter(t=>i.figures&&i.figures.includes("star")?t:"nbStars"!==t).filter(t=>i.layout&&i.layout.some(t=>t.startsWith("bands"))?t:"nbBands"!==t);if(console.log(i,t),0===t.length)return;const e=t.reduce((t,e)=>{if(s.every(t=>{const n="nbBands"===e?"layout":e;return!(!Array.isArray(t[n])||t[n].length!==s[0][n].length||!t[n].every(t=>s[0][n].some(e=>t===e)))||!Array.isArray(t[n])&&t[n]==s[0][n]}))return t;const n=o[e].options.filter(t=>"nbBands"===e?t.value.startsWith(i.layout):t),r=n.reduce((t,n)=>t+s.filter(t=>{const o=t["nbBands"===e?"layout":e];return Array.isArray(o)?o.some(t=>t.includes(n.value)):o===n.value}).length,0);return{...t,[e]:r/n.length}},{});return 0!==Object.keys(e).length?Object.entries(e).sort((t,e)=>t[1]-e[1])[0][0]:void 0};return t.$$.update=()=>{2&t.$$.dirty&&console.log(s)},[l,s,c,a,i,u,f,o,r,()=>{n(6,f=!0),o[c].multiple?(n(1,s=s.filter(t=>a.reduce((e,n)=>e&&t[c].some(t=>t.includes(n)),!0))),n(4,i={...i,[c]:a})):(n(1,s=s.filter(t=>"nbBands"===c?t.layout.includes(a[0]):t[c]===a[0])),n(4,i={...i,[c]:a[0]})),n(2,c=d()),n(3,a=[]),setTimeout(()=>n(6,f=!1),0)},()=>{n(6,f=!0),n(3,a=[]),n(4,i={...i,[c]:void 0}),n(2,c=d()),setTimeout(()=>n(6,f=!1),0)},()=>{n(6,f=!0),n(3,a=[]),n(4,i={}),n(2,c=r[0]),n(1,s=l),setTimeout(()=>n(6,f=!1),0)},d,()=>n(5,u=!0),function(t){a=t,n(3,a)},()=>{n(1,s=l),n(4,i={}),n(2,c=r[0])}]}return new class extends st{constructor(t){super(),lt(this,t,Se,Le,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
