import { db } from "../firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

export async function loadDatabase(appData){

appData.colleges = {};

const querySnapshot = await getDocs(collection(db,"colleges"));

let collegesArray = [];

querySnapshot.forEach((docSnap)=>{
const data = docSnap.data();

if(data.isActive === false){
return;
}

collegesArray.push({
id: docSnap.id,
featured: data.isFeatured === true,
displayOrder: Number(data.displayOrder || 9999),
data
});
});

collegesArray.sort((a,b)=>{

if(a.featured && !b.featured) return -1;
if(!a.featured && b.featured) return 1;

return a.displayOrder - b.displayOrder;
});

collegesArray.forEach((item)=>{

const data = item.data;

appData.colleges[item.id] = {
id:item.id,

featured:item.featured,
displayOrder:item.displayOrder,

bangla:data.collegeNameBn || "",
english:data.collegeNameEn || "",
established:data.established || "",
phone:data.phone || "",
email:data.email || "",
website:data.website || "",
address:data.address || "",

logo:data.whiteLogo || "",
transparentLogo:data.transparentLogo || "",
signature:data.principalSignature || "",
watermark:data.watermark || "",

defaultLogoMode:data.defaultLogoMode || "transparent",

aliases:Array.isArray(data.aliases)
? data.aliases
: [],

design:data.design || {
logoPosX:0,
logoPosY:0,
logoSize:100,
headerPosX:0,
headerPosY:0,
headerSize:100
}
};

});

}