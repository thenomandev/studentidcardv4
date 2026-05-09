import { loadDatabase } from "./college-service.js";

const appData = {
colleges:{},
selectedCollege:null,
theme:"purple",

logoX:0,
logoY:0,
logoSize:100,

headerX:0,
headerY:0,
headerSize:100
};

const collegeSearch = document.getElementById("collegeSearch");
const collegeDropdown = document.getElementById("collegeDropdown");

const collegeLogo = document.getElementById("collegeLogo");
const collegeLogoImg = document.getElementById("collegeLogoImg");

const headerText = document.getElementById("headerText");

const collegeNameBn = document.getElementById("collegeNameBn");
const collegeNameEn = document.getElementById("collegeNameEn");
const collegeEstablished = document.getElementById("collegeEstablished");

const principalSignature = document.getElementById("principalSignature");
const cardWatermark = document.getElementById("cardWatermark");

await loadDatabase(appData);

window.toggleCollegeDropdown = function(){
if(collegeDropdown.style.display==="block"){
collegeDropdown.style.display="none";
}else{
filterCollegeList();
collegeDropdown.style.display="block";
}
};

window.filterCollegeList = function(){
const input = collegeSearch.value.toLowerCase();

collegeDropdown.innerHTML = "";

Object.keys(appData.colleges).forEach((id)=>{
const college = appData.colleges[id];
const aliases = college.aliases || [];

const aliasMatch = aliases.some(alias =>
alias.toLowerCase().includes(input)
);

const match =
id.toLowerCase().includes(input) ||
college.bangla.toLowerCase().includes(input) ||
college.english.toLowerCase().includes(input) ||
aliasMatch;

if(match){
const item = document.createElement("div");
item.className = "college-item";
item.innerText = college.english || id;

item.onclick = function(){
selectCollege(id);
};

collegeDropdown.appendChild(item);
}
});
};

function selectCollege(id){
const college = appData.colleges[id];
if(!college) return;

appData.selectedCollege = college;

collegeSearch.value = college.english;
collegeDropdown.style.display = "none";

collegeNameBn.innerText = college.bangla;
collegeNameEn.innerText = college.english;
collegeEstablished.innerText = "স্থাপিত: " + college.established + " খ্রি.";

principalSignature.src = college.signature || "";

if(college.watermark){
cardWatermark.src = college.watermark;
cardWatermark.style.display = "block";
}else{
cardWatermark.style.display = "none";
}

const logoMode = college.defaultLogoMode || "transparent";
document.getElementById("logoMode").value = logoMode;
applyLogoMode(logoMode,college);

const design = college.design || {};

appData.logoX = design.logoPosX || 0;
appData.logoY = design.logoPosY || 0;
appData.logoSize = design.logoSize || 100;

appData.headerX = design.headerPosX || 0;
appData.headerY = design.headerPosY || 0;
appData.headerSize = design.headerSize || 100;

applyAdjustments();

setTheme("purple");
}

function applyLogoMode(mode,college){
if(mode==="transparent"){
collegeLogo.classList.add("transparent");
collegeLogoImg.src = college.transparentLogo || "";
}else{
collegeLogo.classList.remove("transparent");
collegeLogoImg.src = college.logo || "";
}
}

window.updateLogoMode = function(){
if(!appData.selectedCollege) return;

applyLogoMode(
document.getElementById("logoMode").value,
appData.selectedCollege
);
};

document.addEventListener("click",function(e){
if(
!collegeSearch.contains(e.target) &&
!collegeDropdown.contains(e.target)
){
collegeDropdown.style.display="none";
}
});

window.moveLogo = function(direction){
const target = document.getElementById("adjustTarget").value;

if(target==="logo"){
if(direction==="up") appData.logoY -= 5;
if(direction==="down") appData.logoY += 5;
if(direction==="left") appData.logoX -= 5;
if(direction==="right") appData.logoX += 5;
}else{
if(direction==="up") appData.headerY -= 5;
if(direction==="down") appData.headerY += 5;
if(direction==="left") appData.headerX -= 5;
if(direction==="right") appData.headerX += 5;
}

applyAdjustments();
};

window.resizeLogo = function(action){
const target = document.getElementById("adjustTarget").value;

if(target==="logo"){
if(action==="plus") appData.logoSize += 10;
if(action==="minus" && appData.logoSize > 30){
appData.logoSize -= 10;
}
}else{
if(action==="plus") appData.headerSize += 10;
if(action==="minus" && appData.headerSize > 30){
appData.headerSize -= 10;
}
}

applyAdjustments();
};

window.resetAdjust = function(){
if(!appData.selectedCollege) return;

const design = appData.selectedCollege.design || {};

appData.logoX = design.logoPosX || 0;
appData.logoY = design.logoPosY || 0;
appData.logoSize = design.logoSize || 100;

appData.headerX = design.headerPosX || 0;
appData.headerY = design.headerPosY || 0;
appData.headerSize = design.headerSize || 100;

applyAdjustments();
};

function applyAdjustments(){
collegeLogo.style.transform =
`translate(${appData.logoX}px,${appData.logoY}px) scale(${appData.logoSize/100})`;

headerText.style.transform =
`translate(${appData.headerX}px,${appData.headerY}px) scale(${appData.headerSize/100})`;
}

window.setTheme = function(theme){
appData.theme = theme;

let gradient = "linear-gradient(135deg,#7b008a,#d100d1)";
let deptColor = "#ffd500";
let nameColor = "#000080";

if(theme==="blue") gradient = "linear-gradient(135deg,#003c8f,#00a2ff)";
if(theme==="green") gradient = "linear-gradient(135deg,#0b7a3b,#19c15f)";
if(theme==="red") gradient = "linear-gradient(135deg,#8f0000,#ff3d3d)";
if(theme==="gold") gradient = "linear-gradient(135deg,#111,#d4af37)";
if(theme==="ocean") gradient = "linear-gradient(135deg,#004e92,#00c6ff)";
if(theme==="sunset") gradient = "linear-gradient(135deg,#ff512f,#dd2476)";
if(theme==="black"){
gradient = "linear-gradient(135deg,#111,#444)";
deptColor = "#ffffff";
nameColor = "#ffffff";
}
if(theme==="classicblue") gradient = "linear-gradient(135deg,#082c6c,#0b3d91)";
if(theme==="brown") gradient = "linear-gradient(135deg,#3e2723,#6d4c41)";
if(theme==="violet") gradient = "linear-gradient(135deg,#4a148c,#7b1fa2)";
if(theme==="teal") gradient = "linear-gradient(135deg,#004d40,#00897b)";

document.querySelector(".front-header").style.background = gradient;
document.querySelector(".front-bottom-design").style.background = gradient;
document.getElementById("deptText").style.color = deptColor;
document.getElementById("studentName").style.color = nameColor;
};

window.updateCard = function(){
document.getElementById("studentName").innerText =
document.getElementById("nameInput").value || "Student Name";

document.getElementById("studentRoll").innerText =
document.getElementById("rollInput").value || "-";

document.getElementById("studentClass").innerText =
document.getElementById("classInput").value || "-";

document.getElementById("studentSession").innerText =
document.getElementById("sessionInput").value || "-";

document.getElementById("studentExpiry").innerText =
document.getElementById("expiryInput").value || "-";

document.getElementById("studentMobile").innerText =
document.getElementById("mobileInput").value || "-";
};

document.getElementById("photoInput").addEventListener("change",function(e){
const file = e.target.files[0];
if(!file) return;

const reader = new FileReader();

reader.onload = function(ev){
document.getElementById("studentPhoto").src = ev.target.result;
};

reader.readAsDataURL(file);
});

setTheme("purple");
