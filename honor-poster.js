// مولّد صور لوحة الشرف بنفس شكل بوستات اللجنة على فيسبوك
// ملفات اختيارية بنفس المجلد: logo-white.png (شعار أبيض شفاف) و poster-bg.jpg (صورة الحرم الجامعي)
export const YEARS=["أولى","ثانية","ثالثة","رابعة","خامسة"];
export const YT={أولى:"السنة الأولى",ثانية:"السنة الثانية",ثالثة:"السنة الثالثة",رابعة:"السنة الرابعة",خامسة:"السنة الخامسة"};
const AR="'IBM Plex Sans Arabic',Tahoma,sans-serif",LT="Manrope,Arial,sans-serif";
const NAVY="#1a2679",GOLD="#f4d17a";

export const cohort=(sem,y)=>{const m=String((sem&&sem.startYear)||(sem&&sem.title)||"").match(/20\d\d/);return String((m?+m[0]:new Date().getFullYear())-YEARS.indexOf(y))};
export const semTitle=t=>"لوحة الشرف لكلية الطب البيطري "+String(t||"").replace(/^ال/,"لل");

const img=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=s});
async function assets(){
  // document.fonts.ready لا يحمّل الأوزان غير المستخدمة بالصفحة، لذلك نحمّلها صراحة
  await Promise.all(["500 30px 'IBM Plex Sans Arabic'","700 30px 'IBM Plex Sans Arabic'","800 30px 'IBM Plex Sans Arabic'","700 30px Manrope","800 30px Manrope"].map(f=>document.fonts.load(f,"أب1").catch(()=>0)));
  const [w,l,b]=await Promise.all([img("logo-white.png"),img("logo.jpeg"),img("poster-bg.jpg")]);
  return{w,l,b};
}
function rr(c,x,y,w,h,r){const t=Array.isArray(r)?r:[r,r,r,r];c.beginPath();c.moveTo(x+t[0],y);c.lineTo(x+w-t[1],y);c.arcTo(x+w,y,x+w,y+t[1],t[1]);c.lineTo(x+w,y+h-t[2]);c.arcTo(x+w,y+h,x+w-t[2],y+h,t[2]);c.lineTo(x+t[3],y+h);c.arcTo(x,y+h,x,y+h-t[3],t[3]);c.lineTo(x,y+t[0]);c.arcTo(x,y,x+t[0],y,t[0]);c.closePath()}
function fit(c,t,maxW,size,wt,fam){let s=size;c.font=`${wt} ${s}px ${fam}`;while(c.measureText(t).width>maxW&&s>14){s--;c.font=`${wt} ${s}px ${fam}`}return s}

function background(c,W,H){
  const g=c.createLinearGradient(0,0,W*.4,H);g.addColorStop(0,"#4a59cf");g.addColorStop(.5,"#2f3ea8");g.addColorStop(1,"#18247a");
  c.fillStyle=g;c.fillRect(0,0,W,H);
  let r=c.createRadialGradient(W*.5,0,10,W*.5,0,W*.65);r.addColorStop(0,"rgba(255,255,255,.16)");r.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=r;c.fillRect(0,0,W,H);
  r=c.createRadialGradient(W*.92,H,10,W*.92,H,W*.5);r.addColorStop(0,"rgba(209,170,92,.2)");r.addColorStop(1,"rgba(209,170,92,0)");c.fillStyle=r;c.fillRect(0,0,W,H);
}
function logo(c,A,cx,cy,h){
  if(A.w){const w=A.w.width*h/A.w.height;c.drawImage(A.w,cx-w/2,cy-h/2,w,h);return}
  if(A.l){c.save();c.beginPath();c.arc(cx,cy,h/2,0,7);c.clip();c.drawImage(A.l,cx-h/2,cy-h/2,h,h);c.restore();c.strokeStyle="#d1aa5c";c.lineWidth=Math.max(3,h/28);c.beginPath();c.arc(cx,cy,h/2,0,7);c.stroke()}
}

// عمود: لسان السنة + بطاقة داكنة بالأسماء
function column(c,A,o){
  const {x,y,w,h,tab,rows,showGpa,rowMax,nRows}=o, tabW=o.tabW||w*.46,tabH=90;
  c.save();rr(c,x,y+tabH-4,w,h-tabH+4,30);
  c.fillStyle="rgba(14,18,52,.58)";c.fill();c.clip();
  if(A.b){const k=Math.max(w/A.b.width,(h*.7)/A.b.height),bw=A.b.width*k,bh=A.b.height*k;c.globalAlpha=.3;c.drawImage(A.b,x+(w-bw)/2,y+h-bh,bw,bh);c.globalAlpha=1}
  c.restore();
  c.strokeStyle="rgba(255,255,255,.38)";c.lineWidth=3;rr(c,x,y+tabH-4,w,h-tabH+4,30);c.stroke();
  // اللسان
  const tg=c.createLinearGradient(0,y,0,y+tabH);tg.addColorStop(0,"#eaf4ff");tg.addColorStop(1,"#b7d8ff");
  rr(c,x+w-tabW,y,tabW,tabH+2,[28,28,0,0]);c.fillStyle=tg;c.fill();
  c.textAlign="center";c.fillStyle=NAVY;const ts=fit(c,tab,tabW-30,tabH*.62,800,LT);c.fillText(tab,x+w-tabW/2,y+tabH/2+3);
  // الصفوف
  const top=y+tabH+22,areaH=h-tabH-44,n=Math.max(nRows||rows.length,8),rh=Math.min(rowMax,areaH/n),fs=Math.round(rh*.6);
  rows.forEach((s,i)=>{
    const cy=top+rh*i+rh/2;
    if(i)c.fillStyle="rgba(255,255,255,.08)",c.fillRect(x+34,top+rh*i-.5,w-68,1.5);
    const gold=i<3;let gw=0;
    if(showGpa&&s.gpa!=null){c.textAlign="left";c.font=`700 ${Math.round(fs*.82)}px ${LT}`;c.fillStyle=gold?GOLD:"rgba(255,255,255,.86)";const t=Number(s.gpa).toFixed(2);gw=c.measureText(t).width+34;c.fillText(t,x+34,cy+2)}
    c.textAlign="right";c.fillStyle="#fff";const nf=fit(c,s.name||"",w-68-gw,fs,700,AR);c.fillText(s.name||"",x+w-34,cy+2);
  });
}

export async function renderPoster(cv,o){
  const A=await assets(),sem=o.sem||{},mode=o.mode||"wide",showGpa=o.showGpa!==false,page=o.page||0;
  const by=y=>(o.entries||[]).filter(e=>e.year===y).sort((a,b)=>b.gpa-a.gpa||String(a.name).localeCompare(b.name,"ar"));
  const wide=mode==="wide",W=wide?2400:1080,H=wide?1200:(mode==="story"?1920:1350);
  cv.width=W;cv.height=H;const c=cv.getContext("2d");c.direction="rtl";c.textBaseline="middle";
  background(c,W,H);
  const per=wide?16:(mode==="story"?22:14);
  const yrs=wide?YEARS.filter(y=>by(y).length):[o.year||"أولى"];
  const pages=Math.max(1,...yrs.map(y=>Math.ceil(by(y).length/per)));
  const pg=Math.min(page,pages-1);
  // الترويسة
  const title=semTitle(sem.title);
  c.textAlign="center";c.fillStyle="#fff";
  if(wide){logo(c,A,150,105,150);fit(c,title,W-620,76,800,AR);c.fillText(title,W/2+60,104)}
  else{logo(c,A,W/2,128,150);fit(c,"لوحة الشرف لكلية الطب البيطري",W-120,56,800,AR);c.fillText("لوحة الشرف لكلية الطب البيطري",W/2,262);
    const t2=String(sem.title||"");c.fillStyle="#cfe0ff";fit(c,t2,W-120,36,500,AR);c.fillText(t2,W/2,324)}
  // الأعمدة
  const top=wide?205:352,bot=H-(wide?100:150);
  const nRows=Math.max(8,...yrs.map(y=>Math.min(per,Math.max(0,by(y).length-pg*per))));
  if(!yrs.length||!yrs.some(y=>by(y).length)){c.fillStyle="rgba(255,255,255,.7)";c.font=`600 40px ${AR}`;c.fillText("لا يوجد طلاب مقبولون في هذه الفئة بعد",W/2,H/2)}
  else if(wide){
    const n=yrs.length,gap=44,cw=Math.min(560,(W-150-(n-1)*gap)/n),tot=n*cw+(n-1)*gap,x0=(W-tot)/2;
    yrs.forEach(y=>{const i=YEARS.indexOf(y),k=yrs.indexOf(y);
      column(c,A,{x:x0+tot-(k+1)*cw-k*gap,y:top,w:cw,h:bot-top,tab:cohort(sem,y),rows:by(y).slice(pg*per,(pg+1)*per),showGpa,rowMax:66,nRows})});
  }else{
    const y=yrs[0],cw=W-110;
    column(c,A,{x:55,y:top,w:cw,h:bot-top,tab:cohort(sem,y)+" · "+YT[y],tabW:Math.min(cw,560),rows:by(y).slice(pg*per,(pg+1)*per),showGpa,rowMax:104,nRows});
  }
  // التذييل
  c.textAlign="center";c.fillStyle="rgba(255,255,255,.9)";
  const ft="ألف مبارك لطلبتنا المتفوقين · معدل "+Number(sem.minGpa||3.75).toFixed(2)+" فأعلى"+(pages>1?" · "+(pg+1)+"/"+pages:"");
  c.font=`600 ${wide?32:28}px ${AR}`;c.fillText(ft,W/2,H-(wide?48:92));
  c.fillStyle="rgba(255,255,255,.55)";c.font=`700 ${wide?24:20}px ${LT}`;
  if(wide){c.textAlign="left";c.fillText("VETCOMMITTO · JUST",70,H-48)}else{c.fillText("VETCOMMITTO · JUST",W/2,H-46)}
  return{pages,count:(o.entries||[]).length};
}

// بطاقة تهنئة فردية للطالب (1080×1350)
export async function renderCard(cv,o){
  const A=await assets(),{st,sem}=o,W=1080,H=1350;
  cv.width=W;cv.height=H;const c=cv.getContext("2d");c.direction="rtl";c.textBaseline="middle";
  background(c,W,H);
  c.strokeStyle="rgba(255,255,255,.4)";c.lineWidth=3;rr(c,44,44,W-88,H-88,34);c.stroke();
  logo(c,A,W/2,200,170);
  c.textAlign="center";c.fillStyle="#cfe0ff";fit(c,"لجنة الطب والجراحة البيطرية · جامعة العلوم والتكنولوجيا الأردنية",W-160,28,500,AR);c.fillText("لجنة الطب والجراحة البيطرية · جامعة العلوم والتكنولوجيا الأردنية",W/2,335);
  c.fillStyle="#fff";c.font=`800 70px ${AR}`;c.fillText("بطاقة تهنئة وتفوّق",W/2,440);
  c.fillStyle="rgba(255,255,255,.35)";c.fillRect(W/2-120,500,240,3);
  c.fillStyle="#dbe7ff";c.font=`500 34px ${AR}`;c.fillText("تتقدّم اللجنة بأحرّ التهاني للطالب / الطالبة",W/2,575);
  c.fillStyle=GOLD;fit(c,st.name||"",W-150,76,800,AR);c.fillText(st.name||"",W/2,690);
  c.fillStyle="#dbe7ff";c.font=`500 34px ${AR}`;c.fillText("لإدراجه في لوحة شرف كلية الطب البيطري",W/2,790);
  c.fillStyle="rgba(14,18,52,.58)";rr(c,120,865,W-240,170,28);c.fill();c.strokeStyle="rgba(255,255,255,.38)";c.lineWidth=2;c.stroke();
  c.fillStyle="#fff";fit(c,sem.title||"",W-320,38,700,AR);c.fillText(sem.title||"",W/2,920);
  const d="دفعة "+cohort(sem,st.year)+" · "+(YT[st.year]||st.year)+(sem.showGpa&&st.gpa!=null?" · المعدل "+Number(st.gpa).toFixed(2):"");
  c.fillStyle=GOLD;fit(c,d,W-320,34,700,AR);c.fillText(d,W/2,985);
  c.fillStyle="#cfe0ff";c.font=`500 30px ${AR}`;c.fillText("مع أطيب الأمنيات بدوام التميّز والنجاح",W/2,1150);
  c.fillStyle="rgba(255,255,255,.6)";c.font=`700 26px ${LT}`;c.fillText("VETCOMMITTO · JUST",W/2,1240);
}

// حفظ الصورة: مشاركة مباشرة على الموبايل (ستوري)، وتحميل على الكمبيوتر
export async function saveCanvas(cv,name){
  const blob=await new Promise(r=>cv.toBlob(r,"image/png"));
  const f=new File([blob],name,{type:"image/png"});
  if(/Mobi|iPad|iPhone|Android/i.test(navigator.userAgent)&&navigator.canShare&&navigator.canShare({files:[f]})){
    try{await navigator.share({files:[f]});return}catch(e){if(e.name==="AbortError")return}
  }
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);
}
