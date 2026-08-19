const buildings=[
{id:"hq",name:"KOMUTA MERKEZİ",level:20,power:9800,state:"AKTİF",x:43,y:17,w:20,h:28,text:"Üssün ana yönetim ve komuta merkezi."},
{id:"research",name:"ARAŞTIRMA MERKEZİ",level:18,power:6200,state:"ARAŞTIRIYOR",x:24,y:26,w:18,h:23,text:"Yeni askeri teknolojiler burada araştırılır."},
{id:"air",name:"HAVA ÜSSÜ",level:17,power:7300,state:"HAZIR",x:63,y:27,w:21,h:24,text:"Savaş uçakları ve hava birlikleri burada konuşlanır."},
{id:"tank",name:"TANK ÜRETİM MERKEZİ",level:16,power:6800,state:"ÜRETİMDE",x:40,y:47,w:24,h:22,text:"Tank ve zırhlı birlik üretim merkezi."},
{id:"steel",name:"ÇELİK FABRİKASI",level:18,power:5100,state:"+18K/s",x:20,y:58,w:22,h:27,text:"Bina ve birlikler için çelik üretir."},
{id:"dock",name:"TERSANE",level:16,power:7900,state:"HAZIR",x:62,y:51,w:29,h:31,text:"Savaş gemileri ve deniz birlikleri burada hazırlanır."}
];
let selected=null;

function setupZones(){
 const root=document.getElementById("zones");
 const stage=document.getElementById("designStage");
 if(root && stage && root.parentElement!==stage) stage.appendChild(root);
 buildings.forEach(b=>{
   const z=document.createElement("button");
   z.className="zone";
   z.style.left=b.x+"%";z.style.top=b.y+"%";z.style.width=b.w+"%";z.style.height=b.h+"%";
   z.onclick=()=>openBuilding(b.id);
   root.appendChild(z);
 });
}

function openBuilding(id){
 selected=buildings.find(b=>b.id===id);
 document.getElementById("panelTitle").textContent=selected.name;
 document.getElementById("panelText").textContent=selected.text;
 document.getElementById("statLevel").textContent="Lv."+selected.level;
 document.getElementById("statPower").textContent=selected.power.toLocaleString();
 document.getElementById("statState").textContent=selected.state;
 document.getElementById("buildingPanel").classList.remove("hidden");
}
function closePanel(){document.getElementById("buildingPanel").classList.add("hidden")}
function upgradeSelected(){
 if(!selected)return;
 selected.level++;
 selected.power=Math.round(selected.power*1.12);
 closePanel();
 toast(selected.name+" Lv."+selected.level+" oldu");
}
function toast(t){
 const e=document.getElementById("toast");
 e.textContent=t;e.classList.add("show");
 clearTimeout(window._toast);
 window._toast=setTimeout(()=>e.classList.remove("show"),1500);
}

function setupSmoke(){
 document.querySelectorAll(".smoke-emitter").forEach((emitter,ei)=>{
   const count=ei===0?8:ei===1?5:4;
   for(let i=0;i<count;i++){
     const p=document.createElement("i");
     p.className="smoke-puff";
     p.style.setProperty("--dur",(6.3+(i%4)*.75+ei*.4)+"s");
     p.style.setProperty("--delay",(-i*(6.2/count))+"s");
     p.style.setProperty("--drift",((i%2? -1:1)*(7+i*1.5))+"px");
     p.style.setProperty("--drift2",((i%3?1:-1)*(16+i*2))+"px");
     emitter.appendChild(p);
   }
 });
}

async function toggleFullscreen(ev){
 if(ev){ev.preventDefault();ev.stopPropagation();}
 try{
   if(!document.fullscreenElement){
     const el=document.documentElement;
     if(el.requestFullscreen){
       try{await el.requestFullscreen({navigationUI:"hide"});}
       catch(e){await el.requestFullscreen();}
     }
     try{
       if(screen.orientation && screen.orientation.lock){
         await screen.orientation.lock("landscape");
       }
     }catch(e){}
     fitToViewport();
     setTimeout(fitToViewport,80);
     setTimeout(fitToViewport,260);
     setTimeout(fitToViewport,650);
     toast(document.fullscreenElement?"Tam ekran açıldı":"Tam ekran desteklenmedi");
   }else{
     if(document.exitFullscreen) await document.exitFullscreen();
   }
 }catch(err){
   console.warn("Fullscreen error:",err);
   toast("Tam ekran açılamadı");
 }
 return false;
}

function fitToViewport(){
 const vv=window.visualViewport;
 const vw=Math.max(1, vv ? vv.width : window.innerWidth);
 const vh=Math.max(1, vv ? vv.height : window.innerHeight);
 const game=document.getElementById("game");
 const stage=document.getElementById("designStage");
 if(game){
   game.style.width=vw+"px";
   game.style.height=vh+"px";
 }
 if(stage){
   const DW=1536, DH=674;
   // TRUE contain: never crop a single pixel of the designed interface.
   const scale=Math.min(vw/DW, vh/DH);
   stage.style.left=(vw/2)+"px";
   stage.style.top=(vh/2)+"px";
   stage.style.transform="translate(-50%,-50%) scale("+scale+")";
 }
 document.documentElement.style.width=vw+"px";
 document.documentElement.style.height=vh+"px";
 window.scrollTo(0,0);
}

document.addEventListener("fullscreenchange",()=>{
 if(!document.fullscreenElement){
   try{screen.orientation?.unlock?.();}catch(e){}
 }
 [0,60,160,350,700].forEach(ms=>setTimeout(fitToViewport,ms));
});
window.addEventListener("resize",fitToViewport);
window.addEventListener("orientationchange",()=>setTimeout(fitToViewport,120));
if(window.visualViewport) visualViewport.addEventListener("resize",fitToViewport);

document.addEventListener("DOMContentLoaded",()=>{
 setupZones();
 setupSmoke();
 fitToViewport();
});
