(function(){

const STORAGE_KEY = "student_id_dark_mode";
let savedThemeState = null;

function createToggle(){
const toggle = document.createElement("div");
toggle.id = "darkModeToggle";

toggle.innerHTML = `
<div id="darkModeInner">
<span id="darkModeIcon">🌙</span>
<span id="darkModeText">Dark Mode</span>
<div id="darkModeSwitch">
<div id="darkModeKnob"></div>
</div>
</div>
`;

document.body.appendChild(toggle);

toggle.addEventListener("click",function(){
const isDark = document.body.classList.contains("dark-mode");
setDarkMode(!isDark);
});
}

function applyTransitions(){
const style = document.createElement("style");

style.innerHTML = `
body,
.form-box,
.input-box input,
.input-box select,
.form-box label,
.developer-section,
.developer-text,
.dev-subtitle,
.dev-version,
.dev-copy,
.dev-contact,
.college-dropdown,
.college-item,
#darkModeToggle,
.id-card,
.notice,
.back-row,
.student-name,
.college h2,
.college p,
.footer,
.logo-controls button,
.reset-btn,
.btn,
.front-header,
.top-wave,
.front-bottom-design,
.theme-buttons button,
.input-box i{
transition:all 0.35s ease;
}
`;

document.head.appendChild(style);
}

function injectDarkStyles(){
const style = document.createElement("style");

style.innerHTML = `
body.dark-mode{
background:linear-gradient(135deg,#0d1117,#161b22,#21262d) !important;
color:#ffffff !important;
}

body.dark-mode .form-box{
background:#161b22 !important;
box-shadow:0 8px 30px rgba(0,0,0,0.6) !important;
}

body.dark-mode .developer-section{
background:rgba(22,27,34,0.95) !important;
border:1px solid rgba(255,255,255,0.08) !important;
box-shadow:0 8px 30px rgba(0,0,0,0.6) !important;
}

body.dark-mode .dev-subtitle,
body.dark-mode .dev-version,
body.dark-mode .dev-copy,
body.dark-mode .dev-contact{
color:#ffffff !important;
}

body.dark-mode .input-box input,
body.dark-mode .input-box select{
background:#0d1117 !important;
color:#ffffff !important;
border:1px solid #30363d !important;
}

body.dark-mode .input-box input::placeholder{
color:#9aa4b2 !important;
}

body.dark-mode .input-box i{
color:#58a6ff !important;
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

body.dark-mode .student-name{
color:#ffffff !important;
}

body.dark-mode .developer-text{
color:#58a6ff !important;
}

body.dark-mode .notice,
body.dark-mode .back-row,
body.dark-mode .college h2,
body.dark-mode .college p{
color:#111111 !important;
}

body.dark-mode .btn,
body.dark-mode .logo-controls button,
body.dark-mode .reset-btn{
background:#238636 !important;
}

body.dark-mode .form-box h2,
body.dark-mode .form-box label{
background:linear-gradient(135deg,#1f6feb,#238636) !important;
box-shadow:none !important;
color:#ffffff !important;
}

body.dark-mode .theme-buttons button{
opacity:0.95;
}

#darkModeToggle{
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

#darkModeInner{
display:flex;
align-items:center;
gap:10px;
}

#darkModeIcon{
font-size:20px;
}

#darkModeText{
font-size:14px;
font-weight:700;
color:#111;
white-space:nowrap;
}

#darkModeSwitch{
width:46px;
height:24px;
background:#d0d7de;
border-radius:999px;
position:relative;
}

#darkModeKnob{
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

body.dark-mode #darkModeToggle{
background:rgba(22,27,34,0.95);
border:1px solid rgba(255,255,255,0.08);
}

body.dark-mode #darkModeText{
color:#ffffff;
}

body.dark-mode #darkModeSwitch{
background:#238636;
}

body.dark-mode #darkModeKnob{
left:24px;
}

@media(max-width:480px){
#darkModeToggle{
top:10px;
right:10px;
padding:9px 12px;
}

#darkModeText{
font-size:13px;
}
}
`;

document.head.appendChild(style);
}

function saveThemeState(){
savedThemeState = {
bodyBg: document.body.style.background || "",
formShadow: document.querySelector(".form-box")?.style.boxShadow || "",
devShadow: document.querySelector(".developer-section")?.style.boxShadow || "",
headingBg: document.querySelector(".form-box h2")?.style.background || "",
headingShadow: document.querySelector(".form-box h2")?.style.boxShadow || "",
headingColor: document.querySelector(".form-box h2")?.style.color || "",
devTextColor: document.querySelector(".developer-text")?.style.color || ""
};
}

function restoreThemeState(){
if(!savedThemeState) return;

document.body.style.background = savedThemeState.bodyBg;

const formBox = document.querySelector(".form-box");
const devBox = document.querySelector(".developer-section");
const heading = document.querySelector(".form-box h2");
const devText = document.querySelector(".developer-text");

if(formBox) formBox.style.boxShadow = savedThemeState.formShadow;
if(devBox) devBox.style.boxShadow = savedThemeState.devShadow;
if(heading){
heading.style.background = savedThemeState.headingBg;
heading.style.boxShadow = savedThemeState.headingShadow;
heading.style.color = savedThemeState.headingColor;
}
if(devText) devText.style.color = savedThemeState.devTextColor;
}

function updateToggleUI(isDark){
const icon = document.getElementById("darkModeIcon");
const text = document.getElementById("darkModeText");

if(!icon || !text) return;

if(isDark){
icon.textContent = "☀️";
text.textContent = "Light Mode";
}else{
icon.textContent = "🌙";
text.textContent = "Dark Mode";
}
}

function setDarkMode(enable){
if(enable){
saveThemeState();
document.body.classList.add("dark-mode");
localStorage.setItem(STORAGE_KEY,"dark");
updateToggleUI(true);
}else{
document.body.classList.remove("dark-mode");
restoreThemeState();
localStorage.setItem(STORAGE_KEY,"light");
updateToggleUI(false);
}
}

function initMode(){
const saved = localStorage.getItem(STORAGE_KEY);

if(saved === "dark"){
setTimeout(()=>setDarkMode(true),200);
return;
}

if(saved === "light"){
setDarkMode(false);
return;
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if(prefersDark){
setTimeout(()=>setDarkMode(true),200);
}
}

document.addEventListener("DOMContentLoaded",function(){
applyTransitions();
injectDarkStyles();
createToggle();
initMode();
});

})();