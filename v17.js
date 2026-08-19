
(()=>{
 const MAX_LEVEL=25;
 const PRODUCTION_SECONDS=60;

 // User-requested new-player balances.
 const DEFAULT_RESOURCES={
   money:0,
   steel:100000,
   oil:50000,
   copper:100000,
   gold:25000
 };

 // Per-second production rates at each building level.
 // Level 1 -> Level 2 is deliberately a large jump (e.g. 2500 -> 4000)
 // and then scales progressively through Lv.25.
 const rateTable=(base,l2,growth=1.20)=>{
   const arr=[0,base,l2];
   for(let lv=3;lv<=MAX_LEVEL;lv++){
     arr[lv]=Math.round(arr[lv-1]*growth/10)*10;
   }
   return arr;
 };

 const buildings=[
  {id:"steel",name:"Çelik Fabrikası",icon:"🏭",level:1,hp:100,x:.29,y:.68,w:.16,h:.18,resource:"steel",rates:rateTable(2500,4000,1.18)},
  {id:"fuel",name:"Yakıt Rafinerisi",icon:"🛢️",level:1,hp:100,x:.34,y:.58,w:.14,h:.15,resource:"oil",rates:rateTable(1500,2500,1.18)},
  {id:"copper",name:"Bakır Tesisi",icon:"🟫",level:1,hp:100,x:.58,y:.58,w:.14,h:.14,resource:"copper",rates:rateTable(2500,4000,1.18)},
  {id:"gold",name:"Altın Rafinerisi",icon:"🪙",level:1,hp:100,x:.56,y:.36,w:.12,h:.12,resource:"gold",rates:rateTable(120,200,1.16)},
  {id:"tank",name:"Tank Üretim Merkezi",icon:"🛡️",level:1,hp:100,x:.43,y:.49,w:.22,h:.18,resource:null,rates:null},
  {id:"research",name:"Araştırma Merkezi",icon:"📡",level:1,hp:100,x:.27,y:.28,w:.18,h:.19,resource:null,rates:null},
  {id:"hq",name:"Komuta Merkezi",icon:"🏢",level:1,hp:100,x:.48,y:.18,w:.19,h:.24,resource:null,rates:null},
  {id:"air",name:"Hava Üssü",icon:"✈️",level:1,hp:100,x:.68,y:.27,w:.18,h:.20,resource:null,rates:null},
  {id:"dock",name:"Tersane",icon:"⚓",level:1,hp:100,x:.65,y:.58,w:.18,h:.20,resource:null,rates:null}
 ];

 // Copper upgrade costs. User examples:
 // Lv1->2 = 50k, Lv2->3 = 100k, Lv3->4 = 300k.
 const COSTS={
   1:50000,2:100000,3:300000,4:500000,5:750000,
   6:1100000,7:1600000,8:2300000,9:3200000,10:4500000,
   11:6200000,12:8500000,13:11500000,14:15500000,15:20500000,
   16:27000000,17:35000000,18:45000000,19:58000000,20:74000000,
   21:94000000,22:119000000,23:150000000,24:190000000
 };

 // Building upgrade times in seconds, increasingly longer DW5-style.
 const UPGRADE_SECONDS={
   1:15,2:30,3:60,4:120,5:180,
   6:300,7:420,8:600,9:900,10:1200,
   11:1800,12:2400,13:3000,14:3600,15:5400,
   16:7200,17:9000,18:10800,19:14400,20:18000,
   21:21600,22:28800,23:36000,24:43200
 };

 const resourceNames={steel:"Çelik",oil:"Fuel",copper:"Bakır",gold:"Altın",money:"Para"};

 const $=id=>document.getElementById(id);
 const fmt=n=>Math.floor(n).toLocaleString("tr-TR");
 const fmtTime=s=>{
   s=Math.max(0,Math.ceil(s));
   const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
   return h>0?`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
 };

 // New v17 save namespace intentionally gives fresh members the requested starting balances.
 let save=JSON.parse(localStorage.getItem("ironWarsV17")||"null") || {
   resources:{...DEFAULT_RESOURCES},
   levels:{},
   production:{},
   upgrades:{}
 };
 save.resources={...DEFAULT_RESOURCES,...save.resources};
 buildings.forEach(b=>b.level=Math.min(MAX_LEVEL,save.levels[b.id]||1));

 let current=null;

 function persist(){localStorage.setItem("ironWarsV17",JSON.stringify(save));}

 function liveRate(b){return b.resource?b.rates[b.level]:0;}
 function costFor(b){return b.level>=MAX_LEVEL?0:(COSTS[b.level]||0);}
 function upgradeSecs(b){return b.level>=MAX_LEVEL?0:(UPGRADE_SECONDS[b.level]||60);}

 function renderTop(){
   $("v17Money").textContent=fmt(save.resources.money||0);
   $("v17Oil").textContent=fmt(save.resources.oil||0);
   $("v17Steel").textContent=fmt(save.resources.steel||0);
   $("v17Copper").textContent=fmt(save.resources.copper||0);
   $("v17Gold").textContent=fmt(save.resources.gold||0);
 }

 function ensurePanel(){
   const up=$("v15Upgrade");
   if(!up)return;
   if(!$("v15Produce")){
     const row=document.createElement("div"); row.className="v15-actions";
     up.parentNode.insertBefore(row,up);
     const produce=document.createElement("button");
     produce.id="v15Produce"; produce.textContent="ÜRET";
     row.appendChild(produce); row.appendChild(up);
     produce.addEventListener("click",startProduction);
   }
   if(!$("v17ProdLine")){
     const p=document.createElement("div");p.id="v17ProdLine";p.className="v17-prodline";
     const u=document.createElement("div");u.id="v17UpgradeInfo";u.className="v17-upgradeinfo";
     const actions=$("v15Upgrade").parentElement;
     actions.parentNode.insertBefore(p,actions);
     actions.parentNode.insertBefore(u,actions);
   }
 }

 function openBuilding(b){
   current=b;
   $("v15Icon").textContent=b.icon;
   $("v15Title").textContent=b.name;
   $("v15Level").textContent=`Seviye ${b.level} / ${MAX_LEVEL}`;
   $("v15Hp").textContent=b.hp+"%";
   if(b.resource){
     $("v15Production").textContent=`+${fmt(liveRate(b))}/sn`;
   }else{
     $("v15Production").textContent="Askeri bina";
   }
   $("v15Panel").classList.remove("hidden");
   renderPanel();
 }

 function renderPanel(){
   if(!current)return;
   const prod=$("v15Produce"), up=$("v15Upgrade");
   const session=save.production[current.id];
   const upgrade=save.upgrades[current.id];

   if(current.resource){
     const rate=liveRate(current);
     $("v17ProdLine").innerHTML=
       `<b>${resourceNames[current.resource]}</b>: +${fmt(rate)}/sn • 1 dakikada +${fmt(rate*60)}`;
     prod.disabled=!!session || !!upgrade;
     prod.textContent=session?"ÜRETİM SÜRÜYOR":"ÜRET • 01:00";
   }else{
     $("v17ProdLine").innerHTML="Bu bina kaynak üretmez.";
     prod.disabled=true; prod.textContent="ÜRETİM YOK";
   }

   if(current.level>=MAX_LEVEL){
     $("v17UpgradeInfo").innerHTML=`<b class="v17-levelcap">MAKSİMUM SEVİYE 25</b>`;
     up.disabled=true; up.textContent="MAKSİMUM SEVİYE";
   }else{
     const cost=costFor(current), sec=upgradeSecs(current);
     const nextRate=current.resource?current.rates[current.level+1]:0;
     $("v17UpgradeInfo").innerHTML=
       `<b>Geliştirme:</b> ${fmt(cost)} Bakır • Süre ${fmtTime(sec)}`
       +(current.resource?`<br>Sonraki üretim: +${fmt(nextRate)}/sn`:"");
     up.disabled=!!upgrade || !!session;
     up.textContent=upgrade?"GELİŞTİRİLİYOR":`GELİŞTİR → Lv.${current.level+1}`;
   }
 }

 function startProduction(){
   if(!current || !current.resource || save.production[current.id] || save.upgrades[current.id])return;
   const now=Date.now();
   save.production[current.id]={
     start:now,
     end:now+PRODUCTION_SECONDS*1000,
     lastSecond:Math.floor(now/1000)
   };
   persist();renderPanel();renderQueue();
 }

 function startUpgrade(){
   if(!current || current.level>=MAX_LEVEL || save.upgrades[current.id] || save.production[current.id])return;
   const cost=costFor(current);
   if((save.resources.copper||0)<cost){
     $("v15Timer").textContent="Yeterli Bakır yok";
     return;
   }
   save.resources.copper-=cost;
   const now=Date.now();
   save.upgrades[current.id]={
     start:now,
     end:now+upgradeSecs(current)*1000,
     from:current.level,
     to:current.level+1
   };
   persist();renderTop();renderPanel();createUpgradeMarker(current);
 }

 function processProduction(now){
   let dirty=false;
   Object.entries(save.production).forEach(([id,s])=>{
     const b=buildings.find(x=>x.id===id);
     if(!b || !b.resource){delete save.production[id];dirty=true;return;}

     const nowSec=Math.floor(now/1000);
     const endSec=Math.floor(s.end/1000);
     const capped=Math.min(nowSec,endSec);
     const due=Math.max(0,capped-s.lastSecond);

     if(due>0){
       save.resources[b.resource]=(save.resources[b.resource]||0)+liveRate(b)*due;
       s.lastSecond+=due;
       dirty=true;
     }

     if(now>=s.end){
       delete save.production[id];
       dirty=true;
       if(current && current.id===id)$("v15Timer").textContent="Üretim tamamlandı";
     }
   });
   if(dirty){persist();renderTop();}
 }

 function processUpgrades(now){
   let dirty=false;
   Object.entries(save.upgrades).forEach(([id,u])=>{
     const b=buildings.find(x=>x.id===id);
     if(!b){delete save.upgrades[id];dirty=true;return;}
     if(now>=u.end){
       b.level=Math.min(MAX_LEVEL,u.to);
       save.levels[id]=b.level;
       delete save.upgrades[id];
       removeUpgradeMarker(id);
       updateLevelBadge(b);
       dirty=true;
       if(current && current.id===id){
         $("v15Level").textContent=`Seviye ${b.level} / ${MAX_LEVEL}`;
         $("v15Production").textContent=b.resource?`+${fmt(liveRate(b))}/sn`:"Askeri bina";
         $("v15Timer").textContent=`Lv.${b.level} tamamlandı`;
       }
     }else{
       updateUpgradeMarker(b,u,now);
     }
   });
   if(dirty){persist();renderPanel();}
 }

 function renderQueue(){
   const entries=Object.entries(save.production);
   const q=$("v17Queue");
   if(!entries.length){q.classList.add("hidden");return;}
   const [id,s]=entries[0], b=buildings.find(x=>x.id===id);
   if(!b){q.classList.add("hidden");return;}
   const now=Date.now(), left=Math.max(0,(s.end-now)/1000);
   const pct=Math.max(0,Math.min(100,(1-left/PRODUCTION_SECONDS)*100));
   $("v17QueueName").textContent=b.name;
   $("v17QueueTime").textContent=fmtTime(left);
   $("v17QueueBar").style.width=pct+"%";
   $("v17QueueGain").textContent=`+${fmt(liveRate(b))}/sn`;
   q.classList.remove("hidden");
 }

 function markerRoot(){
   return $("designStage");
 }

 function makeLevelBadges(){
   const root=markerRoot(); if(!root)return;
   root.querySelectorAll(".v16-marker").forEach(n=>n.remove());
   buildings.forEach(b=>{
     const m=document.createElement("div");
     m.className="v16-marker";m.dataset.v16=b.id;
     m.style.left=(b.x+b.w/2)*100+"%";
     m.style.top=(b.y+b.h/2)*100+"%";
     m.innerHTML=`<span class="pulse"></span><span class="badge">Lv.${b.level}</span>`;
     root.appendChild(m);
   });
 }

 function updateLevelBadge(b){
   const m=document.querySelector(`[data-v16="${b.id}"] .badge`);
   if(m)m.textContent=`Lv.${b.level}`;
 }

 function createUpgradeMarker(b){
   if(document.querySelector(`[data-upgrade="${b.id}"]`))return;
   const root=markerRoot();if(!root)return;
   const m=document.createElement("div");
   m.className="v17-upgrading";m.dataset.upgrade=b.id;
   m.style.left=(b.x+b.w/2)*100+"%";m.style.top=((b.y+b.h/2)*100+5)+"%";
   m.innerHTML=`GELİŞİYOR <span></span><i></i>`;
   root.appendChild(m);
 }

 function updateUpgradeMarker(b,u,now){
   createUpgradeMarker(b);
   const m=document.querySelector(`[data-upgrade="${b.id}"]`);
   if(!m)return;
   const total=u.end-u.start,left=Math.max(0,u.end-now),pct=(1-left/total)*100;
   const span=m.querySelector("span"),bar=m.querySelector("i");
   span.textContent=fmtTime(left/1000);
   bar.style.width=Math.max(0,Math.min(100,pct))+"%";
 }

 function removeUpgradeMarker(id){
   document.querySelector(`[data-upgrade="${id}"]`)?.remove();
 }

 function bindStage(){
   const stage=$("designStage");if(!stage)return;
   makeLevelBadges();
   Object.keys(save.upgrades).forEach(id=>{
     const b=buildings.find(x=>x.id===id);if(b)createUpgradeMarker(b);
   });
   stage.addEventListener("click",e=>{
     if(e.target.closest("#fullscreenButton") || e.target.closest(".v16-marker") || e.target.closest(".v17-upgrading"))return;
     const r=stage.getBoundingClientRect();
     const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
     const b=buildings.find(q=>x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h);
     if(b)openBuilding(b);
   });
 }

 function updateCurrentTimer(now){
   if(!current)return;
   const prod=save.production[current.id], up=save.upgrades[current.id];
   if(prod){
     $("v15Timer").textContent=`Üretim: ${fmtTime((prod.end-now)/1000)} • +${fmt(liveRate(current))}/sn`;
   }else if(up){
     $("v15Timer").textContent=`Geliştirme: ${fmtTime((up.end-now)/1000)}`;
   }else if(!$("v15Timer").textContent.includes("Yeterli")){
     $("v15Timer").textContent="Hazır";
   }
 }

 function tick(){
   const now=Date.now();
   processProduction(now);
   processUpgrades(now);
   renderQueue();
   updateCurrentTimer(now);
   if(current)renderPanel();
 }

 window.addEventListener("DOMContentLoaded",()=>{
   ensurePanel();
   renderTop();
   bindStage();
   $("v15Close")?.addEventListener("click",()=>$("v15Panel").classList.add("hidden"));
   $("v15Upgrade")?.addEventListener("click",startUpgrade);
   setInterval(tick,250);
   tick();
 });
})();
