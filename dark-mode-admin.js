(function(){

const MODE_KEY="admin_dark_mode_pref";
const SYSTEM="system";
const ON="on";
const OFF="off";

function injectStyles(){
const style=document.createElement("style");

style.innerHTML=`
body,
.container,
input,
textarea,
select,
button,
.college-dropdown,
.college-item,
#adminThemeModeLauncher,
#adminThemeModePopup,
.adminThemeModeOption{
transition:all 0.35s ease;
}

#adminThemeModeLauncher{
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

#adminThemeModeOverlay{
position:fixed;
inset:0;
background:rgba(0,0,0,0.45);
z-index:999998;
display:none;
}

#adminThemeModePopup{
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

#adminThemeModeTitle{
font-size:20px;
font-weight:800;
margin-bottom:16px;
text-align:center;
color:#111111;
}

.adminThemeModeOption{
display:flex;
align-items:center;
justify-content:space-between;
padding:14px 16px;
border-radius:16px;
cursor:pointer;
margin-bottom:10px;
border:1px solid #e5e5e5;
background:white;
}

.adminThemeModeOption:last-child{
margin-bottom:0;
}

.adminThemeModeLeft{
display:flex;
align-items:center;
gap:12px;
}

.adminThemeModeIcon{
font-size:22px;
}

.adminThemeModeText{
display:flex;
flex-direction:column;
}

.adminThemeModeMain{
font-size:15px;
font-weight:700;
color:#111111;
}

.adminThemeModeSub{
font-size:12px;
opacity:0.7;
margin-top:2px;
color:#111111;
}

.adminThemeModeCheck{
font-size:18px;
font-weight:900;
opacity:0;
color:#111111;
}

.adminThemeModeOption.active .adminThemeModeCheck{
opacity:1;
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
body.dark-mode h2,
body.dark-mode h3,
body.dark-mode h4,
body.dark-mode label{
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

body.dark-mode #adminThemeModeLauncher{
background:rgba(18,22,28,0.95);
border:1px solid rgba(255,255,255,0.08);
}

body.dark-mode #adminThemeModePopup{
background:#161b22;
color:#ffffff;
}

body.dark-mode #adminThemeModeTitle{
color:#ffffff;
}

body.dark-mode .adminThemeModeOption{
background:#0d1117;
border:1px solid rgba(255,255,255,0.08);
}

body.dark-mode .adminThemeModeMain,
body.dark-mode .adminThemeModeSub,
body.dark-mode .adminThemeModeCheck{
color:#ffffff;
}

@media(max-width:480px){
#adminThemeModeLauncher{
top:10px;
right:10px;
width:52px;
height:52px;
}
}
`;

document.head.appendChild(style);
}

function systemDark(){
return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getMode(){
return localStorage.getItem(MODE_KEY) || SYSTEM;
}

function clearDarkMode(){
document.body.classList.remove("dark-mode");
}

function enableDarkMode(){
document.body.classList.add("dark-mode");
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

function setMode(mode){
localStorage.setItem(MODE_KEY,mode);
applyMode();
updateSelection();
closePopup();
}

function updateSelection(){
document.querySelectorAll(".adminThemeModeOption").forEach(el=>{
el.classList.remove("active");
});

const mode=getMode();
const target=document.querySelector(`[data-mode="${mode}"]`);

if(target){
target.classList.add("active");
}

const launcher=document.getElementById("adminThemeModeLauncher");

if(!launcher) return;

if(mode===ON){
launcher.innerHTML="🌙";
}else if(mode===OFF){
launcher.innerHTML="☀️";
}else{
launcher.innerHTML="🌓";
}
}

function createUI(){
const launcher=document.createElement("div");
launcher.id="adminThemeModeLauncher";
launcher.innerHTML="🌓";

const overlay=document.createElement("div");
overlay.id="adminThemeModeOverlay";

const popup=document.createElement("div");
popup.id="adminThemeModePopup";

popup.innerHTML=`
<div id="adminThemeModeTitle">Dark Mode</div>

<div class="adminThemeModeOption" data-mode="off">
<div class="adminThemeModeLeft">
<div class="adminThemeModeIcon">☀️</div>
<div class="adminThemeModeText">
<div class="adminThemeModeMain">Off</div>
<div class="adminThemeModeSub">Always light mode</div>
</div>
</div>
<div class="adminThemeModeCheck">✓</div>
</div>

<div class="adminThemeModeOption" data-mode="on">
<div class="adminThemeModeLeft">
<div class="adminThemeModeIcon">🌙</div>
<div class="adminThemeModeText">
<div class="adminThemeModeMain">On</div>
<div class="adminThemeModeSub">Always dark mode</div>
</div>
</div>
<div class="adminThemeModeCheck">✓</div>
</div>

<div class="adminThemeModeOption" data-mode="system">
<div class="adminThemeModeLeft">
<div class="adminThemeModeIcon">🌓</div>
<div class="adminThemeModeText">
<div class="adminThemeModeMain">System</div>
<div class="adminThemeModeSub">Follow device appearance</div>
</div>
</div>
<div class="adminThemeModeCheck">✓</div>
</div>
`;

document.body.appendChild(overlay);
document.body.appendChild(popup);
document.body.appendChild(launcher);

launcher.addEventListener("click",openPopup);
overlay.addEventListener("click",closePopup);

document.querySelectorAll(".adminThemeModeOption").forEach(option=>{
option.addEventListener("click",function(){
setMode(this.dataset.mode);
});
});
}

function openPopup(){
document.getElementById("adminThemeModeOverlay").style.display="block";
document.getElementById("adminThemeModePopup").style.display="block";
}

function closePopup(){
document.getElementById("adminThemeModeOverlay").style.display="none";
document.getElementById("adminThemeModePopup").style.display="none";
}

function watchSystemTheme(){
const media=window.matchMedia("(prefers-color-scheme: dark)");

media.addEventListener("change",function(){
if(getMode()===SYSTEM){
applyMode();
}
});
}

document.addEventListener("DOMContentLoaded",function(){
injectStyles();
createUI();
applyMode();
updateSelection();
watchSystemTheme();
});

})();