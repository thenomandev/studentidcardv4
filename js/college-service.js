import { db } from "../firebase-config.js";
import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

export async function loadDatabase(appData){

const querySnapshot = await getDocs(collection(db,"colleges"));

querySnapshot.forEach((docSnap)=>{
const data = docSnap.data();

appData.colleges[docSnap.id]={
bangla:data.collegeNameBn || "",
english:data.collegeNameEn || "",
established:data.established || "",
phone:data.phone || "",
email:data.email || "",
website:data.website || "",
logo:data.whiteLogo || "",
transparentLogo:data.transparentLogo || "",
signature:data.principalSignature || ""
};
});

}