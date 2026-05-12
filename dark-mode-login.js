(function(){

const STORAGE_KEY="student_id_dark_mode";

function injectStyles(){
const style=document.createElement("style");

style.innerHTML=`
body,
.box,
input,
button{
transition:all 0.35s ease;
}

#loginDarkToggle{
position:fixed;
top:14px;
right:14px;
z-index:999999;
background:rgba(255,255,255,0.95);
backdrop-filter:blur(14px);
padding:10px 14px;
border-radius:18px;
box-shadow:0 8px 24px rgba(0,0,0,0.18);
cursor:pointer;
user-select:none;
}

#loginDarkInner{
display:flex;
align-items:center;
gap:10px;
}

#loginDarkIcon{
font-size:20px;
}

#loginDarkText{
font-size:14px;
font-weight:700;
color:#111;
white-space:nowrap;
}

#loginDarkSwitch{
width:46px;
height:24px;
background:#d0d7de;
border-radius:999px;
position:relative;
}

#loginDarkKnob{
width:20px;
height:20px;
background:white;
border-radius:50%;
position:absolute;
top:2px;
left:2px;
box-shadow:0 2px 8px rgba(0,0,0,0.2);
transition:all 0.35s ease;
}

body.dark-mode{
background:linear-gradient(135deg,#0d1117,#161b22,#21262d) !important;
}

body.dark-mode .box{
background:#161b22 !important;
box-shadow:0 10px 30px rgba(0,0,0,0.6) !important;
}

body.dark-mode h2{
color:#ffffff !important;
}

body.dark-mode input{
background:#0d1117 !important;
color:#ffffff !important;
border:1px solid #30363d !important;
}

body.dark-mode input::placeholder{
color:#9aa4b2 !important;
}

body.dark-mode button{
background:#238636 !important;
}

body.dark-mode #loginDarkToggle{
background:rgba(22,27,34,0.95);
border:1px solid rgba(255,255,255,0.08);
}

body.dark-mode #loginDarkText{
color:#ffffff;
}

body.dark-mode #loginDarkSwitch{
background:#238636;
}

body.dark-mode #loginDarkKnob{
left:24px;
}

@media(max-width:480px){
#loginDarkToggle{
top:10px;
right:10px;
padding:9px 12px;
}

#loginDarkText{
font-size:13px;
}
}
`;

document.head.appendChild(style);
}

function createToggle(){
const toggle=document.createElement("div");
toggle.id="loginDarkToggle";

toggle.innerHTML=`
<div id="loginDarkInner">
<span id="loginDarkIcon">🌙</span>
<span id="loginDarkText">Dark Mode</span>
<div id="loginDarkSwitch">
<div id="loginDarkKnob"></div>
</div>
</div>
`;

document.body.appendChild(toggle);

toggle.addEventListener("click",function(){
const isDark=document.body.classList.contains("dark-mode");
setDarkMode(!isDark);
});
}

function updateUI(isDark){
const icon=document.getElementById("loginDarkIcon");
const text=document.getElementById("loginDarkText");

if(!icon || !text) return;

if(isDark){
icon.textContent="☀️";
text.textContent="Light Mode";
}else{
icon.textContent="🌙";
text.textContent="Dark Mode";
}
}

function setDarkMode(enable){
if(enable){
document.body.classList.add("dark-mode");
localStorage.setItem(STORAGE_KEY,"dark");
updateUI(true);
}else{
document.body.classList.remove("dark-mode");
localStorage.setItem(STORAGE_KEY,"light");
updateUI(false);
}
}

function initMode(){
const saved=localStorage.getItem(STORAGE_KEY);

if(saved==="dark"){
setDarkMode(true);
return;
}

if(saved==="light"){
setDarkMode(false);
return;
}

const prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches;
setDarkMode(prefersDark);
}

document.addEventListener("DOMContentLoaded",function(){
injectStyles();
createToggle();
initMode();
});

})();