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

const collegeSelect = document.getElementById("collegeSelect");
const adminDropdown = document.getElementById("adminCollegeDropdown");

const totalCollegesEl = document.getElementById("totalColleges");
const activeCollegesEl = document.getElementById("activeColleges");
const featuredCollegesEl = document.getElementById("featuredColleges");
const storageUsedEl = document.getElementById("storageUsed");

let allColleges = {};
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

async function updateAnalytics(){
const querySnapshot = await getDocs(collection(db,"colleges"));

let total = 0;
let active = 0;
let featured = 0;

querySnapshot.forEach((docSnap)=>{
total++;

const data = docSnap.data();

if(data.isActive) active++;
if(data.isFeatured) featured++;
});

totalCollegesEl.innerText = total;
activeCollegesEl.innerText = active;
featuredCollegesEl.innerText = featured;
storageUsedEl.innerText = "Connected";
}

async function loadColleges(){
adminDropdown.innerHTML = "";
allColleges = {};

const querySnapshot = await getDocs(collection(db,"colleges"));

querySnapshot.forEach((docSnap)=>{
allColleges[docSnap.id] = docSnap.data();
});

updateAnalytics();
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

window.loadCollege = async function(){
const id = collegeSelect.dataset.selectedId || collegeSelect.value;
if(!id) return alert("Select college");

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
document.getElementById("defaultLogoMode").value = data.defaultLogoMode || "transparent";

document.getElementById("aliases").value =
(data.aliases || []).join("\n");

document.getElementById("isActive").checked =
data.isActive !== false;

document.getElementById("isFeatured").checked =
data.isFeatured === true;

const design = data.design || {};

document.getElementById("logoPosX").value = design.logoPosX || 0;
document.getElementById("logoPosY").value = design.logoPosY || 0;
document.getElementById("logoSize").value = design.logoSize || 100;

document.getElementById("headerPosX").value = design.headerPosX || 0;
document.getElementById("headerPosY").value = design.headerPosY || 0;
document.getElementById("headerSize").value = design.headerSize || 100;
};

window.saveCollege = async function(){
const id = collegeSelect.dataset.selectedId || collegeSelect.value;

if(!id){
alert("Select college");
return;
}

const aliasesText = document.getElementById("aliases").value;

const aliases = aliasesText
.split("\n")
.map(x => x.trim())
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
logoPosX:Number(document.getElementById("logoPosX").value || 0),
logoPosY:Number(document.getElementById("logoPosY").value || 0),
logoSize:Number(document.getElementById("logoSize").value || 100),
headerPosX:Number(document.getElementById("headerPosX").value || 0),
headerPosY:Number(document.getElementById("headerPosY").value || 0),
headerSize:Number(document.getElementById("headerSize").value || 100)
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

const ok = confirm("Delete this college?");

if(!ok) return;

await deleteDoc(doc(db,"colleges",id));

alert("Deleted");
loadColleges();
};

window.logout = async function(){
await signOut(auth);
window.location.href="login.html";
};

import {
ref,
uploadBytesResumable,
getDownloadURL,
deleteObject
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";

function validateImage(file){
if(!file) return false;

const allowed = [
"image/png",
"image/jpeg",
"image/webp"
];

if(!allowed.includes(file.type)){
alert("Only PNG/JPG/WEBP allowed");
return false;
}

if(file.size > 5 * 1024 * 1024){
alert("Max file size 5MB");
return false;
}

return true;
}

function setProgress(progressId, fillId, percent){
const progress = document.getElementById(progressId);
const fill = document.getElementById(fillId);

progress.style.display = "block";
fill.style.width = percent + "%";
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
input.value="";
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

const folderPath = `colleges/${id}/${fileName}`;

const url = await uploadCollegeImage(
file,
folderPath,
data[dbField],
progressId,
fillId
);

if(!url) return;

await setDoc(doc(db,"colleges",id),{
...data,
[dbField]: url
});

alert("Upload successful");

input.value = "";

setTimeout(()=>{
document.getElementById(progressId).style.display="none";
document.getElementById(fillId).style.width="0%";
},1200);

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
exportedAt: new Date().toISOString(),
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

const ok = confirm("Import backup and overwrite matching colleges?");
if(!ok) return;

const text = await file.text();
let json;

try{
json = JSON.parse(text);
}catch{
alert("Invalid JSON backup file");
return;
}

if(!json.colleges){
alert("Invalid backup file");
return;
}

for(const id in json.colleges){
await setDoc(
doc(db,"colleges",id),
json.colleges[id]
);
}

alert("Backup imported successfully");
loadColleges();
});