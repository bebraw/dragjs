function u({element:n,handle:e,xPosition:t},r){if(!n){console.warn("drag is missing elem!");return}p(n,"touchstart","touchmove","touchend",r,e,t),p(n,"mousedown","mousemove","mouseup",r,e,t)}function C(n){let e=c(n.class||"",n.parent),t=c("pointer",e);return c("shape shape1",t),c("shape shape2",t),c("bg bg1",e),c("bg bg2",e),u({element:e},M(n.cbs,t)),{background:e,pointer:t}}function T(n){let e=c(n.class,n.parent),t=c("pointer",e);return c("shape",t),c("bg",e),u({element:e},M(n.cbs,t)),{background:e,pointer:t}}function M(n,e){let t={};return Object.entries(n).forEach(([r,i])=>{t[r]=o=>{i({...o,pointer:e})}}),t}function c(n,e){return H("div",n,e)}function H(n,e,t){let r=document.createElement(n);return e&&(r.className=e),t.appendChild(r),r}function p(n,e,t,r,i,o,s){i=w(i,s);let l=i.begin,a=i.change,m=i.end;g(o||n,e,h=>{let y=L=>f(a,n,L);function E(){v(document,t,y),v(document,r,E),f(m,n,h)}g(document,t,y),g(document,r,E),f(l,n,h)})}function g(n,e,t){let r=!1;try{let i=Object.defineProperty({},"passive",{get:function(){r=!0}});globalThis.addEventListener("testPassive",null,i),globalThis.removeEventListener("testPassive",null,i)}catch(i){console.error(i)}n.addEventListener(e,t,r?{passive:!1}:!1)}function v(n,e,t){n.removeEventListener(e,t,!1)}function w(n,e="left"){let t,r,i={begin:o=>{let s=document.body.clientWidth;t={x:e==="left"?o.elem.offsetLeft:s-o.elem.offsetLeft-o.elem.clientWidth,y:o.elem.offsetTop},r=e==="left"?o.cursor:{x:s-o.cursor.x,y:o.cursor.y}},change:o=>{if(typeof t.x!="number"||typeof o.cursor.x!="number"||typeof r.x!="number")return;let s=document.body.clientWidth;x(o.elem,e,e==="left"?t.x+o.cursor.x-r.x+"px":t.x+(s-o.cursor.x)-r.x+"px"),!(typeof t.y!="number"||typeof o.cursor.y!="number"||typeof r.y!="number")&&x(o.elem,"top",t.y+o.cursor.y-r.y+"px")},end:k};return n?{begin:n.begin?o=>{if(n.begin&&n.begin(o))return i.begin(o)}:i.begin,change:n.change?o=>{let s=n.change&&n.change(o);if(console.log("at change",s),s)return i.change(o)}:i.change,end:n.end||i.end}:i}function x(n,e,t){n.style[e]=t}function k(){}function f(n,e,t){t.preventDefault();let r=P(e),i=e.clientWidth,o=e.clientHeight,s={x:B(e,t),y:W(e,t)};if(typeof s.x!="number"||typeof s.y!="number")return;let l=(s.x-r.x)/i,a=(s.y-r.y)/o;n({x:isNaN(l)?0:l,y:isNaN(a)?0:a,cursor:s,elem:e,e:t})}function P(n){let e=n.getBoundingClientRect();return{x:e.left,y:e.top}}function B(n,e){return window.TouchEvent&&e instanceof window.TouchEvent?e.touches.item(0)?.clientX:e.clientX}function W(n,e){return window.TouchEvent&&e instanceof window.TouchEvent?e.touches.item(0)?.clientY:e.clientY}window.onload=function(){let n=document.getElementById("draggable");n&&u({element:n},{change:({x:o,y:s})=>(d("draggable x:"+o.toFixed(2)+", y: "+s.toFixed(2)),!0)});let e=document.getElementById("draggabletwo"),t=e?.children[0];e&&t&&u({element:e,handle:t});let r=document.getElementById("onedContainer");r&&T({parent:r,class:"oned",cbs:{begin:()=>{d("2dslider: begin")},change:({x:o,pointer:s})=>{let l=b(o*100,0,100).toFixed(2)+"%";d("2dslider: "+l),s&&(s.style.left=l)},end:()=>{d("2dslider: end")}}});let i=document.getElementById("twodContainer");i&&C({parent:i,class:"twod",cbs:{change:({x:o,y:s,pointer:l})=>{let a=b(o*100,0,100).toFixed(2)+"%",m=b(s*100,0,100).toFixed(2)+"%";d("x: "+a+", y: "+m),l&&(l.style.left=a,l.style.top=m)}}})};function d(n){let e=document.getElementById("value");console.log(n),e&&(e.innerHTML=n)}function b(n,e,t){return Math.min(Math.max(n,e),t)}
