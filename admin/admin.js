import { db, auth } from "../firebase-config.js";
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

onAuthStateChanged(auth,(user)=>{
if(!user){
window.location.href="./login.html";
}else{
loadColleges();
}
});

let allColleges = {};

async function loadColleges(){
adminDropdown.innerHTML="";
allColleges={};

const querySnapshot = await getDocs(collection(db,"colleges"));

querySnapshot.forEach((docSnap)=>{
allColleges[docSnap.id]=docSnap.data();
});
}

window.loadCollege = async function(){
const id=collegeSelect.dataset.selectedId || collegeSelect.value;
if(!id) return;

const docRef=doc(db,"colleges",id);
const snap=await getDoc(docRef);

if(!snap.exists()) return;

const data=snap.data();

document.getElementById("collegeNameBn").value=data.collegeNameBn || "";
document.getElementById("collegeNameEn").value=data.collegeNameEn || "";
document.getElementById("established").value=data.established || "";
document.getElementById("transparentLogo").value=data.transparentLogo || "";
document.getElementById("whiteLogo").value=data.whiteLogo || "";
document.getElementById("principalSignature").value=data.principalSignature || "";
document.getElementById("website").value=data.website || "";
document.getElementById("email").value=data.email || "";
document.getElementById("phone").value=data.phone || "";
document.getElementById("address").value=data.address || "";
};

window.saveCollege = async function(){
const id=collegeSelect.dataset.selectedId || collegeSelect.value;
if(!id) return alert("Select college");

await setDoc(doc(db,"colleges",id),{
collegeNameBn:document.getElementById("collegeNameBn").value,
collegeNameEn:document.getElementById("collegeNameEn").value,
established:document.getElementById("established").value,
transparentLogo:document.getElementById("transparentLogo").value,
whiteLogo:document.getElementById("whiteLogo").value,
principalSignature:document.getElementById("principalSignature").value,
website:document.getElementById("website").value,
email:document.getElementById("email").value,
phone:document.getElementById("phone").value,
address:document.getElementById("address").value
});

alert("Saved successfully");
};

window.addCollege = async function(){
const id=document.getElementById("newCollegeId").value.trim();
const name=document.getElementById("newCollegeName").value.trim();

if(!id || !name) return alert("Fill fields");

await setDoc(doc(db,"colleges",id),{
collegeNameEn:name,
collegeNameBn:name,
established:"",
transparentLogo:"",
whiteLogo:"",
principalSignature:"",
website:"",
email:"",
phone:"",
address:""
});

alert("College added");
loadColleges();
};

window.deleteCollege = async function(){
const id=collegeSelect.dataset.selectedId || collegeSelect.value;
if(!id) return;

await deleteDoc(doc(db,"colleges",id));

alert("Deleted");
loadColleges();
};

window.logout = async function(){
await signOut(auth);
window.location.href="./login.html";
};

window.toggleAdminDropdown = function(){
if(adminDropdown.style.display==="block"){
adminDropdown.style.display="none";
}else{
filterAdminCollegeList();
adminDropdown.style.display="block";
}
};

window.filterAdminCollegeList = function(){
const input=collegeSelect.value.toLowerCase();

adminDropdown.innerHTML="";

Object.keys(allColleges).forEach((key)=>{
const college=allColleges[key];

const match=
key.toLowerCase().includes(input) ||
(college.collegeNameEn || "").toLowerCase().includes(input) ||
(college.collegeNameBn || "").toLowerCase().includes(input);

if(match){
const item=document.createElement("div");
item.className="college-item";
item.innerText=college.collegeNameEn || key;

item.onclick=function(){
collegeSelect.value=college.collegeNameEn || key;
collegeSelect.dataset.selectedId=key;
adminDropdown.style.display="none";
};

adminDropdown.appendChild(item);
}
});
};