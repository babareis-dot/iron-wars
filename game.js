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
async function full(){try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen?.();else await document.exitFullscreen?.()}catch(e){}}
