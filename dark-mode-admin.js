(function(){

const STORAGE_KEY = "student_id_dark_mode";

function injectStyles(){
const style = document.createElement("style");

style.innerHTML = `
body,
.container,
input,
textarea,
select,
button,
.college-dropdown,
.college-item{
transition:all 0.35s ease;
}

#adminDarkToggle{
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

#adminDarkInner{
display:flex;
align-items:center;
gap:10px;
}

#adminDarkIcon{
font-size:20px;
}

#adminDarkText{
font-size:14px;
font-weight:700;
color:#111;
white-space:nowrap;
}

#adminDarkSwitch{
width:46px;
height:24px;
background:#d0d7de;
border-radius:999px;
position:relative;
}

#adminDarkKnob{
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
color:#ffffff !important;
}

body.dark-mode .container{
background:#161b22 !important;
box-shadow:0 10px 30px rgba(0,0,0,0.6) !important;
}

body.dark-mode h1,
body.dark-mode h3{
color:#ffffff !important;
}

body.dark-mode input,
body.dark-mode textarea,
body.dark-mode select{
background:#0d1117 !important;
color:#ffffff !important;
border:1px solid #30363d !important;
}

body.dark-mode input::placeholder,
body.dark-mode textarea::placeholder{
color:#9aa4b2 !important;
}

body.dark-mode .college-dropdown{
background:#161b22 !important;
border:1px solid #30363d !important;
}

body.dark-mode .college-item{
color:#ffffff !important;
border-bottom:1px solid #30363d !important;
}

body.dark-mode .college-item:hover{
background:#21262d !important;
}

body.dark-mode #adminDarkToggle{
background:rgba(22,27,34,0.95);
border:1px solid rgba(255,255,255,0.08);
}

body.dark-mode #adminDarkText{
color:#ffffff;
}

body.dark-mode #adminDarkSwitch{
background:#238636;
}

body.dark-mode #adminDarkKnob{
left:24px;
}

@media(max-width:480px){
#adminDarkToggle{
top:10px;
right:10px;
padding:9px 12px;
}

#adminDarkText{
font-size:13px;
}
}
`;

document.head.appendChild(style);
}

function createToggle(){
const toggle=document.createElement("div");
toggle.id="adminDarkToggle";

toggle.innerHTML=`
<div id="adminDarkInner">
<span id="adminDarkIcon">🌙</span>
<span id="adminDarkText">Dark Mode</span>
<div id="adminDarkSwitch">
<div id="adminDarkKnob"></div>
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
const icon=document.getElementById("adminDarkIcon");
const text=document.getElementById("adminDarkText");

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