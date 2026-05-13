(function(){

const MODE_KEY="student_dark_mode_pref";
const SYSTEM="system";
const ON="on";
const OFF="off";

function getThemeAccent(theme){
const themes={
purple:"#9800a8",
blue:"#0057d9",
green:"#0b7a3b",
red:"#b30000",
gold:"#d4af37",
ocean:"#006fa6",
sunset:"#dd2476",
black:"#222222",
classicblue:"#0b3d91",
brown:"#5d4037",
violet:"#6a1b9a",
teal:"#00695c"
};
return themes[theme]||"#9800a8";
}

function getCurrentTheme(){
return localStorage.getItem("student_id_last_theme")||"purple";
}

function injectStyles(){
const style=document.createElement("style");

style.innerHTML=`
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
.logo-controls button,
.reset-btn,
.btn,
.theme-buttons button,
.input-box i,
#themeModeLauncher,
#themeModePopup,
.themeModeOption{
transition:all 0.35s ease;
}

#themeModeLauncher{
position:fixed;
top:14px;
right:14px;
z-index:999999;
width:56px;
height:56px;
border-radius:18px;
display:flex;
align-items:center;
justify-content:center;
font-size:24px;
cursor:pointer;
background:rgba(255,255,255,0.95);
backdrop-filter:blur(14px);
box-shadow:0 8px 24px rgba(0,0,0,0.18);
}

#themeModeOverlay{
position:fixed;
inset:0;
background:rgba(0,0,0,0.45);
z-index:999998;
display:none;
}

#themeModePopup{
position:fixed;
left:50%;
top:50%;
transform:translate(-50%,-50%);
width:320px;
max-width:90vw;
background:white;
border-radius:22px;
padding:18px;
z-index:999999;
box-shadow:0 20px 50px rgba(0,0,0,0.25);
display:none;
}

#themeModeTitle{
font-size:20px;
font-weight:800;
margin-bottom:16px;
text-align:center;
}

.themeModeOption{
display:flex;
align-items:center;
justify-content:space-between;
padding:14px 16px;
border-radius:16px;
cursor:pointer;
margin-bottom:10px;
border:1px solid #e5e5e5;
}

.themeModeOption:last-child{
margin-bottom:0;
}

.themeModeLeft{
display:flex;
align-items:center;
gap:12px;
}

.themeModeIcon{
font-size:22px;
}

.themeModeText{
display:flex;
flex-direction:column;
}

.themeModeMain{
font-size:15px;
font-weight:700;
}

.themeModeSub{
font-size:12px;
opacity:0.7;
margin-top:2px;
}

.themeModeCheck{
font-size:18px;
font-weight:900;
opacity:0;
}

.themeModeOption.active .themeModeCheck{
opacity:1;
}

body.dark-mode .form-box{
background:#161b22 !important;
}

body.dark-mode .developer-section{
background:rgba(22,27,34,0.95) !important;
border:1px solid rgba(255,255,255,0.08) !important;
}

body.dark-mode .dev-subtitle,
body.dark-mode .dev-version,
body.dark-mode .dev-copy,
body.dark-mode .dev-contact{
color:#dfe7f2 !important;
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

body.dark-mode #themeModeLauncher{
background:rgba(22,27,34,0.95);
border:1px solid rgba(255,255,255,0.08);
}

body.dark-mode #themeModePopup{
background:#161b22;
color:#ffffff;
}

body.dark-mode .themeModeOption{
background:#0d1117;
border:1px solid #30363d;
color:#ffffff;
}

@media(max-width:480px){
#themeModeLauncher{
top:10px;
right:10px;
width:52px;
height:52px;
}
}
`;

document.head.appendChild(style);
}

function applyDarkThemeColors(){
const accent=getThemeAccent(getCurrentTheme());

document.body.style.background=`linear-gradient(135deg,#0d1117,${accent},#161b22)`;

const formBox=document.querySelector(".form-box");
const devBox=document.querySelector(".developer-section");
const heading=document.querySelector(".form-box h2");
const labels=document.querySelectorAll(".form-box label");
const icons=document.querySelectorAll(".input-box i");
const devTexts=document.querySelectorAll(".developer-text");
const buttons=document.querySelectorAll(".btn, .logo-controls button, .reset-btn");

if(formBox) formBox.style.boxShadow=`0 4px 18px ${accent}55`;
if(devBox) devBox.style.boxShadow=`0 4px 18px ${accent}55`;

if(heading){
heading.style.background=`linear-gradient(135deg,${accent},#111)`;
heading.style.boxShadow=`0 6px 15px ${accent}55`;
}

labels.forEach(label=>{
label.style.background=`linear-gradient(135deg,${accent},#111)`;
label.style.boxShadow=`0 6px 15px ${accent}55`;
});

icons.forEach(icon=>{
icon.style.color=accent;
});

devTexts.forEach(dev=>{
dev.style.color=accent;
});

buttons.forEach(btn=>{
btn.style.background=accent;
});
}

function clearDarkMode(){
document.body.classList.remove("dark-mode");
if(typeof window.setTheme==="function"){
window.setTheme(getCurrentTheme());
}
}

function enableDarkMode(){
document.body.classList.add("dark-mode");
applyDarkThemeColors();
}

function systemDark(){
return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getMode(){
return localStorage.getItem(MODE_KEY)||SYSTEM;
}

function setMode(mode){
localStorage.setItem(MODE_KEY,mode);
applyMode();
updateSelection();
closePopup();
}

function applyMode(){
const mode=getMode();

if(mode===ON){
enableDarkMode();
return;
}

if(mode===OFF){
clearDarkMode();
return;
}

if(systemDark()){
enableDarkMode();
}else{
clearDarkMode();
}
}

function updateSelection(){
document.querySelectorAll(".themeModeOption").forEach(el=>{
el.classList.remove("active");
});

const mode=getMode();
const target=document.querySelector(`[data-mode="${mode}"]`);
if(target) target.classList.add("active");

const launcher=document.getElementById("themeModeLauncher");
if(!launcher) return;

if(mode===ON) launcher.innerHTML="🌙";
else if(mode===OFF) launcher.innerHTML="☀️";
else launcher.innerHTML="🌓";
}

function createUI(){
const launcher=document.createElement("div");
launcher.id="themeModeLauncher";
launcher.innerHTML="🌓";

const overlay=document.createElement("div");
overlay.id="themeModeOverlay";

const popup=document.createElement("div");
popup.id="themeModePopup";

popup.innerHTML=`
<div id="themeModeTitle">Dark Mode</div>

<div class="themeModeOption" data-mode="off">
<div class="themeModeLeft">
<div class="themeModeIcon">☀️</div>
<div class="themeModeText">
<div class="themeModeMain">Off</div>
<div class="themeModeSub">Always light mode</div>
</div>
</div>
<div class="themeModeCheck">✓</div>
</div>

<div class="themeModeOption" data-mode="on">
<div class="themeModeLeft">
<div class="themeModeIcon">🌙</div>
<div class="themeModeText">
<div class="themeModeMain">On</div>
<div class="themeModeSub">Always dark mode</div>
</div>
</div>
<div class="themeModeCheck">✓</div>
</div>

<div class="themeModeOption" data-mode="system">
<div class="themeModeLeft">
<div class="themeModeIcon">🌓</div>
<div class="themeModeText">
<div class="themeModeMain">System</div>
<div class="themeModeSub">Follow device appearance</div>
</div>
</div>
<div class="themeModeCheck">✓</div>
</div>
`;

document.body.appendChild(overlay);
document.body.appendChild(popup);
document.body.appendChild(launcher);

launcher.addEventListener("click",openPopup);
overlay.addEventListener("click",closePopup);

document.querySelectorAll(".themeModeOption").forEach(option=>{
option.addEventListener("click",function(){
setMode(this.dataset.mode);
});
});
}

function openPopup(){
document.getElementById("themeModeOverlay").style.display="block";
document.getElementById("themeModePopup").style.display="block";
}

function closePopup(){
document.getElementById("themeModeOverlay").style.display="none";
document.getElementById("themeModePopup").style.display="none";
}

function watchSystemTheme(){
const media=window.matchMedia("(prefers-color-scheme: dark)");

media.addEventListener("change",function(){
if(getMode()===SYSTEM){
applyMode();
}
});
}

function hookThemeChanges(){
const originalSetTheme=window.setTheme;

if(typeof originalSetTheme==="function"){
window.setTheme=function(theme){
originalSetTheme(theme);

if(document.body.classList.contains("dark-mode")){
applyDarkThemeColors();
}
};
}
}

document.addEventListener("DOMContentLoaded",function(){
injectStyles();
createUI();
hookThemeChanges();
applyMode();
updateSelection();
watchSystemTheme();
});

})();