const buildings=[
{id:"hq",name:"KOMUTA MERKEZİ",level:20,power:9800,status:"AKTİF",x:43,y:18,w:20,h:30,desc:"Üssün ana yönetim merkezi."},
{id:"research",name:"ARAŞTIRMA MERKEZİ",level:18,power:6200,status:"ARAŞTIRIYOR",x:23,y:27,w:18,h:23,desc:"Yeni askeri teknolojileri araştırır."},
{id:"air",name:"HAVA ÜSSÜ",level:17,power:7300,status:"HAZIR",x:62,y:27,w:20,h:24,desc:"Savaş uçaklarının üretim ve konuşlanma merkezi."},
{id:"tank",name:"TANK ÜRETİM MERKEZİ",level:16,power:6800,status:"ÜRETİMDE",x:39,y:49,w:25,h:22,desc:"Zırhlı birlik ve tank üretir."},
{id:"steel",name:"ÇELİK FABRİKASI",level:18,power:5100,status:"+18K/s",x:21,y:60,w:20,h:24,desc:"Üs geliştirmeleri için çelik üretir."},
{id:"dock",name:"TERSANE",level:16,power:7900,status:"HAZIR",x:62,y:52,w:27,h:30,desc:"Deniz birlikleri ve savaş gemileri üretir."}
];let selected=null;
const z=document.getElementById("tapzones");buildings.forEach(b=>{const e=document.createElement("button");e.className="zone";e.style=`left:${b.x}%;top:${b.y}%;width:${b.w}%;height:${b.h}%`;e.onclick=()=>openB(b.id);z.appendChild(e)});
function openB(id){selected=buildings.find(b=>b.id===id);document.getElementById("title").textContent=selected.name;document.getElementById("desc").textContent=selected.desc;document.getElementById("level").textContent="Lv."+selected.level;document.getElementById("power").textContent=selected.power.toLocaleString()+" GÜÇ";document.getElementById("status").textContent=selected.status;document.getElementById("panel").classList.remove("hidden")}
function closePanel(){document.getElementById("panel").classList.add("hidden")}
function upgrade(){if(!selected)return;selected.level++;selected.power=Math.round(selected.power*1.12);closePanel();toast(selected.name+" Lv."+selected.level+" oldu")}
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1300)}
let orientationLocked=false;

async function lockLandscape(){
  try{
    if(screen.orientation && screen.orientation.lock){
      await screen.orientation.lock("landscape");
      orientationLocked=true;
    }
  }catch(e){
    orientationLocked=false;
  }
}

function unlockOrientation(){
  try{
    if(screen.orientation && screen.orientation.unlock){
      screen.orientation.unlock();
    }
  }catch(e){}
  orientationLocked=false;
}

async function full(){
  try{
    if(!document.fullscreenElement){
      const el=document.documentElement;
      if(el.requestFullscreen){
        await el.requestFullscreen({navigationUI:"hide"}).catch(async()=>{ await el.requestFullscreen(); });
      }
      await lockLandscape();
      toast(orientationLocked ? "Yatay mod kilitlendi" : "Tam ekran açıldı");
    }else{
      if(document.exitFullscreen) await document.exitFullscreen();
    }
  }catch(e){
    toast("Tam ekran açılamadı");
  }
}

document.addEventListener("fullscreenchange", async ()=>{
  if(document.fullscreenElement){
    await lockLandscape();
  }else{
    unlockOrientation();
  }
});

function stabilizeLayout(){
  document.body.classList.add("orientation-changing");
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      document.body.classList.remove("orientation-changing");
      window.scrollTo(0,0);
    });
  });
}

window.addEventListener("orientationchange", stabilizeLayout);
window.addEventListener("resize", stabilizeLayout);

document.addEventListener("visibilitychange", ()=>{
  if(!document.hidden && document.fullscreenElement){
    lockLandscape();
    stabilizeLayout();
  }
});

if(screen.orientation && screen.orientation.addEventListener){
  screen.orientation.addEventListener("change", stabilizeLayout);
}



let gameStarted = false;

async function requestRealFullscreen(){
  const el = document.documentElement;
  if(document.fullscreenElement) return true;
  try{
    if(el.requestFullscreen){
      try{
        await el.requestFullscreen({navigationUI:"hide"});
      }catch(e){
        await el.requestFullscreen();
      }
      return !!document.fullscreenElement;
    }
  }catch(e){}
  return false;
}

async function requestLandscapeLock(){
  try{
    if(screen.orientation && screen.orientation.lock){
      await screen.orientation.lock("landscape");
      orientationLocked = true;
      return true;
    }
  }catch(e){}
  orientationLocked = false;
  return false;
}

function fitGameToViewport(){
  const game = document.getElementById("game");
  if(!game) return;
  const vv = window.visualViewport;
  const w = vv ? vv.width : window.innerWidth;
  const h = vv ? vv.height : window.innerHeight;
  game.style.width = w + "px";
  game.style.height = h + "px";
  game.style.left = "0px";
  game.style.top = "0px";
  window.scrollTo(0,0);
}

async function startGame(){
  const btn = document.getElementById("startGameBtn");
  if(btn){
    btn.disabled = true;
    btn.textContent = "AÇILIYOR...";
  }

  await requestRealFullscreen();
  await requestLandscapeLock();

  gameStarted = true;
  document.body.classList.add("game-started");
  document.getElementById("startOverlay")?.classList.add("hidden");

  setTimeout(fitGameToViewport, 80);
  setTimeout(fitGameToViewport, 300);
}

document.addEventListener("fullscreenchange", async ()=>{
  if(document.fullscreenElement){
    if(gameStarted){
      await requestLandscapeLock();
      setTimeout(fitGameToViewport, 60);
    }
  }else{
    if(gameStarted){
      unlockOrientation();
      gameStarted = false;
      document.body.classList.remove("game-started");
      document.getElementById("startOverlay")?.classList.remove("hidden");
      const btn = document.getElementById("startGameBtn");
      if(btn){
        btn.disabled = false;
        btn.textContent = "OYUNA BAŞLA — TAM EKRAN";
      }
    }
  }
});

if(window.visualViewport){
  visualViewport.addEventListener("resize", fitGameToViewport);
}
window.addEventListener("resize", fitGameToViewport);
window.addEventListener("orientationchange", ()=>setTimeout(fitGameToViewport,120));

document.addEventListener("DOMContentLoaded", fitGameToViewport);
