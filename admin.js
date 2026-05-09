import { db, auth, storage } from "./firebase-config.js";

import {
collection,
getDocs,
doc,
getDoc,
setDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
ref,
uploadBytesResumable,
getDownloadURL,
deleteObject,
listAll
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";

const collegeSelect = document.getElementById("collegeSelect");
const adminDropdown = document.getElementById("adminCollegeDropdown");

const totalCollegesEl = document.getElementById("totalColleges");
const activeCollegesEl = document.getElementById("activeColleges");
const featuredCollegesEl = document.getElementById("featuredColleges");
const storageUsedEl = document.getElementById("storageUsed");

const modal = document.getElementById("collegeListModal");
const modalTitle = document.getElementById("modalTitle");
const modalList = document.getElementById("modalCollegeList");

const previewWrap = document.getElementById("adminPreviewWrap");

let allColleges = {};
let currentModalType = "all";

let logoX = 0;
let logoY = 0;
let logoSize = 100;

let headerX = 0;
let headerY = 0;
let headerSize = 100;

let logoutTimer = null;

function resetLogoutTimer(){
clearTimeout(logoutTimer);

logoutTimer = setTimeout(async ()=>{
await signOut(auth);
window.location.href="login.html";
},30 * 60 * 1000);
}

document.addEventListener("click", resetLogoutTimer);
document.addEventListener("keydown", resetLogoutTimer);
document.addEventListener("touchstart", resetLogoutTimer);

onAuthStateChanged(auth,(user)=>{
if(!user){
window.location.href="login.html";
return;
}

resetLogoutTimer();
loadColleges();
});

async function calculateStorageUsage(){
try{
const rootRef = ref(storage,"colleges");
const result = await listAll(rootRef);

let totalFiles = result.items.length;

storageUsedEl.innerText = totalFiles + " Files";
}catch{
storageUsedEl.innerText = "Unavailable";
}
}

async function updateAnalytics(){
let total = 0;
let active = 0;
let featured = 0;

Object.keys(allColleges).forEach((id)=>{
const data = allColleges[id];

total++;

if(data.isActive) active++;
if(data.isFeatured) featured++;
});

totalCollegesEl.innerText = total;
activeCollegesEl.innerText = active;
featuredCollegesEl.innerText = featured;

calculateStorageUsage();
}

async function loadColleges(){
allColleges = {};

const querySnapshot = await getDocs(collection(db,"colleges"));

querySnapshot.forEach((docSnap)=>{
allColleges[docSnap.id] = docSnap.data();
});

updateAnalytics();
renderPreview();
}

window.toggleAdminDropdown = function(){
if(adminDropdown.style.display==="block"){
adminDropdown.style.display="none";
}else{
filterAdminCollegeList();
adminDropdown.style.display="block";
}
};

window.filterAdminCollegeList = function(){
const input = collegeSelect.value.toLowerCase();

adminDropdown.innerHTML = "";

Object.keys(allColleges).forEach((key)=>{
const college = allColleges[key];
const aliases = college.aliases || [];

const aliasMatch = aliases.some(alias =>
alias.toLowerCase().includes(input)
);

const match =
key.toLowerCase().includes(input) ||
(college.collegeNameEn || "").toLowerCase().includes(input) ||
(college.collegeNameBn || "").toLowerCase().includes(input) ||
aliasMatch;

if(match){
const item = document.createElement("div");
item.className = "college-item";
item.innerText = college.collegeNameEn || key;

item.onclick = function(){
collegeSelect.value = college.collegeNameEn || key;
collegeSelect.dataset.selectedId = key;
adminDropdown.style.display = "none";
};

adminDropdown.appendChild(item);
}
});
};

document.addEventListener("click",function(e){
if(
!collegeSelect.contains(e.target) &&
!adminDropdown.contains(e.target)
){
adminDropdown.style.display="none";
}
});

window.showCollegeList = function(type){
currentModalType = type;

if(type==="all") modalTitle.innerText = "All Colleges";
if(type==="active") modalTitle.innerText = "Active Colleges";
if(type==="featured") modalTitle.innerText = "Featured Colleges";

renderModalList();
modal.style.display = "flex";
};

window.closeCollegeListModal = function(){
modal.style.display = "none";
};

window.filterModalList = function(){
renderModalList();
};

function renderModalList(){
const search = document.getElementById("modalSearch").value.toLowerCase();

modalList.innerHTML = "";

Object.keys(allColleges).forEach((id)=>{
const data = allColleges[id];

if(currentModalType==="active" && !data.isActive) return;
if(currentModalType==="featured" && !data.isFeatured) return;

const name = data.collegeNameEn || id;

if(!name.toLowerCase().includes(search)) return;

const item = document.createElement("div");
item.className = "college-item";
item.innerText = name;

item.onclick = function(){
collegeSelect.value = name;
collegeSelect.dataset.selectedId = id;
closeCollegeListModal();
loadCollege();
};

modalList.appendChild(item);
});
}

window.loadCollege = async function(){
const id = collegeSelect.dataset.selectedId || collegeSelect.value;

if(!id){
alert("Select college");
return;
}

const snap = await getDoc(doc(db,"colleges",id));

if(!snap.exists()){
alert("College not found");
return;
}

const data = snap.data();

document.getElementById("collegeNameBn").value = data.collegeNameBn || "";
document.getElementById("collegeNameEn").value = data.collegeNameEn || "";
document.getElementById("established").value = data.established || "";
document.getElementById("phone").value = data.phone || "";
document.getElementById("email").value = data.email || "";
document.getElementById("website").value = data.website || "";
document.getElementById("address").value = data.address || "";
document.getElementById("displayOrder").value = data.displayOrder || "";
document.getElementById("defaultLogoMode").value =
data.defaultLogoMode || "transparent";

document.getElementById("aliases").value =
(data.aliases || []).join("\n");

document.getElementById("isActive").checked =
data.isActive !== false;

document.getElementById("isFeatured").checked =
data.isFeatured === true;

const design = data.design || {};

logoX = design.logoPosX || 0;
logoY = design.logoPosY || 0;
logoSize = design.logoSize || 100;

headerX = design.headerPosX || 0;
headerY = design.headerPosY || 0;
headerSize = design.headerSize || 100;

renderPreview(data);
};

window.moveDesign = function(direction){
const target = document.getElementById("adjustTarget").value;

if(target==="logo"){
if(direction==="up") logoY -= 5;
if(direction==="down") logoY += 5;
if(direction==="left") logoX -= 5;
if(direction==="right") logoX += 5;
}else{
if(direction==="up") headerY -= 5;
if(direction==="down") headerY += 5;
if(direction==="left") headerX -= 5;
if(direction==="right") headerX += 5;
}

renderPreview();
};

window.resizeDesign = function(action){
const target = document.getElementById("adjustTarget").value;

if(target==="logo"){
if(action==="plus") logoSize += 10;
if(action==="minus" && logoSize > 30) logoSize -= 10;
}else{
if(action==="plus") headerSize += 10;
if(action==="minus" && headerSize > 30) headerSize -= 10;
}

renderPreview();
};

window.resetDesign = function(){
logoX = 0;
logoY = 0;
logoSize = 100;

headerX = 0;
headerY = 0;
headerSize = 100;

renderPreview();
};

function renderPreview(data=null){
const current = data || {};

const logoMode =
document.getElementById("defaultLogoMode")?.value ||
current.defaultLogoMode ||
"transparent";

const logo =
logoMode === "transparent"
? (current.transparentLogo || "")
: (current.whiteLogo || "");

const signature = current.principalSignature || "";
const watermark = current.watermark || "";

previewWrap.innerHTML = `
<div class="id-card" style="margin:auto;transform:scale(0.92);transform-origin:top center;">

${watermark ? `
<img
src="${watermark}"
style="
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);
max-width:75%;
max-height:75%;
opacity:0.08;
pointer-events:none;
z-index:1;
"
>
` : ""}

<div class="front-header">

<div class="logo ${logoMode==="transparent" ? "transparent" : ""}"
style="
transform:translate(${logoX}px,${logoY}px) scale(${logoSize/100});
">
<img src="${logo}">
</div>

<div
class="header-text"
style="
transform:translate(${headerX}px,${headerY}px) scale(${headerSize/100});
"
>
<h1>${current.collegeNameBn || "College Name"}</h1>
<p>${current.collegeNameEn || "College English"}</p>
<p class="estd">স্থাপিত: ${current.established || "2025"} খ্রি.</p>
</div>

<div class="dept">ব্যবস্থাপনা বিভাগ</div>

</div>

<div class="photo-box">
<div style="
width:115px;
height:140px;
border:3px solid red;
border-radius:8px;
background:white;
margin:auto;
"></div>
</div>

<div class="student-name">Student Name</div>

<div class="info">
<div class="info-row"><div class="label">শ্রেণি</div><div>:</div><div>Demo</div></div>
<div class="info-row"><div class="label">রোল</div><div>:</div><div>Demo</div></div>
<div class="info-row"><div class="label">সেশন</div><div>:</div><div>Demo</div></div>
<div class="info-row"><div class="label">মেয়াদ</div><div>:</div><div>Demo</div></div>
<div class="info-row"><div class="label">মোবাইল</div><div>:</div><div>Demo</div></div>
</div>

<div class="signature">
<img src="${signature}">
<p>অধ্যক্ষ</p>
</div>

<div class="front-bottom-design"></div>

</div>
`;
}

window.saveCollege = async function(){
const id = collegeSelect.dataset.selectedId || collegeSelect.value;

if(!id){
alert("Select college");
return;
}

const aliases = document.getElementById("aliases").value
.split("\n")
.map(x=>x.trim())
.filter(Boolean);

const existingSnap = await getDoc(doc(db,"colleges",id));
const existingData = existingSnap.exists()
? existingSnap.data()
: {};

await setDoc(doc(db,"colleges",id),{
collegeNameBn: document.getElementById("collegeNameBn").value,
collegeNameEn: document.getElementById("collegeNameEn").value,
established: document.getElementById("established").value,
phone: document.getElementById("phone").value,
email: document.getElementById("email").value,
website: document.getElementById("website").value,
address: document.getElementById("address").value,
displayOrder: Number(document.getElementById("displayOrder").value || 9999),
defaultLogoMode: document.getElementById("defaultLogoMode").value,
aliases: aliases,
isActive: document.getElementById("isActive").checked,
isFeatured: document.getElementById("isFeatured").checked,

design:{
logoPosX:logoX,
logoPosY:logoY,
logoSize:logoSize,
headerPosX:headerX,
headerPosY:headerY,
headerSize:headerSize
},

transparentLogo: existingData.transparentLogo || "",
whiteLogo: existingData.whiteLogo || "",
principalSignature: existingData.principalSignature || "",
watermark: existingData.watermark || ""
});

alert("Saved successfully");
loadColleges();
};

window.addCollege = async function(){
const id = document.getElementById("newCollegeId").value.trim();
const name = document.getElementById("newCollegeName").value.trim();

if(!id || !name){
alert("Fill all fields");
return;
}

await setDoc(doc(db,"colleges",id),{
collegeNameBn:name,
collegeNameEn:name,
established:"",
phone:"",
email:"",
website:"",
address:"",
displayOrder:9999,
defaultLogoMode:"transparent",
aliases:[],
isActive:true,
isFeatured:false,

design:{
logoPosX:0,
logoPosY:0,
logoSize:100,
headerPosX:0,
headerPosY:0,
headerSize:100
},

transparentLogo:"",
whiteLogo:"",
principalSignature:"",
watermark:""
});

alert("College added");
loadColleges();
};

window.deleteCollege = async function(){
const id = collegeSelect.dataset.selectedId || collegeSelect.value;

if(!id) return;

if(!confirm("Delete this college?")) return;

await deleteDoc(doc(db,"colleges",id));

alert("Deleted");
loadColleges();
};

window.logout = async function(){
await signOut(auth);
window.location.href="login.html";
};

function validateImage(file){
if(!file) return false;

const allowed = ["image/png","image/jpeg","image/webp"];

if(!allowed.includes(file.type)){
alert("Only PNG/JPG/WEBP allowed");
return false;
}

if(file.size > 5 * 1024 * 1024){
alert("Max 5MB");
return false;
}

return true;
}

function setProgress(progressId, fillId, percent){
document.getElementById(progressId).style.display = "block";
document.getElementById(fillId).style.width = percent + "%";
}

async function uploadCollegeImage(file, folderPath, oldUrl, progressId, fillId){
if(!validateImage(file)) return null;

const storageRef = ref(storage, folderPath);
const uploadTask = uploadBytesResumable(storageRef, file);

return new Promise((resolve,reject)=>{

uploadTask.on("state_changed",

(snapshot)=>{
const percent = Math.round(
(snapshot.bytesTransferred / snapshot.totalBytes) * 100
);

setProgress(progressId, fillId, percent);
},

(error)=>{
alert(error.message);
reject(error);
},

async ()=>{
try{

if(oldUrl){
try{
const oldRef = ref(storage, oldUrl);
await deleteObject(oldRef);
}catch(e){}
}

const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
resolve(downloadURL);

}catch(err){
reject(err);
}
}
);
});
}

async function handleFileUpload(inputId, dbField, fileName, progressId, fillId){
const input = document.getElementById(inputId);

input.addEventListener("change", async function(){

const id = collegeSelect.dataset.selectedId || collegeSelect.value;

if(!id){
alert("Select college first");
input.value = "";
return;
}

const file = input.files[0];
if(!file) return;

const snap = await getDoc(doc(db,"colleges",id));

if(!snap.exists()){
alert("College not found");
return;
}

const data = snap.data();

const url = await uploadCollegeImage(
file,
`colleges/${id}/${fileName}`,
data[dbField],
progressId,
fillId
);

if(!url) return;

await setDoc(doc(db,"colleges",id),{
...data,
[dbField]:url
});

alert("Upload successful");

input.value = "";

setTimeout(()=>{
document.getElementById(progressId).style.display="none";
document.getElementById(fillId).style.width="0%";
},1200);

loadCollege();
});
}

handleFileUpload(
"transparentLogoFile",
"transparentLogo",
"transparent-logo",
"transparentProgress",
"transparentProgressFill"
);

handleFileUpload(
"whiteLogoFile",
"whiteLogo",
"white-logo",
"whiteProgress",
"whiteProgressFill"
);

handleFileUpload(
"signatureFile",
"principalSignature",
"signature",
"signatureProgress",
"signatureProgressFill"
);

handleFileUpload(
"watermarkFile",
"watermark",
"watermark",
"watermarkProgress",
"watermarkProgressFill"
);

window.exportBackup = async function(){
const querySnapshot = await getDocs(collection(db,"colleges"));

const backup = {
exportedAt:new Date().toISOString(),
colleges:{}
};

querySnapshot.forEach((docSnap)=>{
backup.colleges[docSnap.id] = docSnap.data();
});

const blob = new Blob(
[JSON.stringify(backup,null,2)],
{type:"application/json"}
);

const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "student-id-cms-backup.json";
a.click();

URL.revokeObjectURL(url);
};

document.getElementById("importBackup")
.addEventListener("change", async function(e){

const file = e.target.files[0];
if(!file) return;

const ok = confirm("Import backup?");
if(!ok) return;

const text = await file.text();

let json;

try{
json = JSON.parse(text);
}catch{
alert("Invalid JSON");
return;
}

if(!json.colleges){
alert("Invalid backup");
return;
}

for(const id in json.colleges){
await setDoc(doc(db,"colleges",id),json.colleges[id]);
}

alert("Backup imported");
loadColleges();
});