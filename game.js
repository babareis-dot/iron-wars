const state={
 resources:{Para:["💵","2.45M"],Petrol:["🛢️","1.87M"],Çelik:["🔩","3.24M"],Bakır:["🟫","1.12M"],Altın:["🪙","8,250"]},
 buildings:[
  {id:"hq",name:"KOMUTA MERKEZİ",lv:20,x:50,y:37,hp:100,power:9800,prod:"Komuta"},
  {id:"research",name:"ARAŞTIRMA MERKEZİ",lv:18,x:33,y:42,hp:96,power:6200,prod:"Teknoloji"},
  {id:"air",name:"HAVA ÜSSÜ",lv:17,x:69,y:39,hp:91,power:7300,prod:"Uçak"},
  {id:"tank",name:"TANK ÜRETİM MERKEZİ",lv:16,x:48,y:64,hp:93,power:6800,prod:"Zırhlı"},
  {id:"steel",name:"ÇELİK FABRİKASI",lv:18,x:31,y:69,hp:88,power:5100,prod:"+18K/s"},
  {id:"dock",name:"TERSANE",lv:16,x:68,y:66,hp:94,power:7900,prod:"Donanma"},
  {id:"defense",name:"HAVA SAVUNMA",lv:15,x:77,y:52,hp:99,power:8600,prod:"Savunma"}
 ],
 queue:[
  ["ÇELİK FABRİKASI","Lv.18","03:42:11"],
  ["TANK MERKEZİ","Lv.16","01:25:45"],
  ["HAVA ÜSSÜ","Lv.15","02:19:07"]
 ]
};

function render(){
 document.getElementById("resources").innerHTML=Object.entries(state.resources).map(([k,v])=>`<div class="res">${v[0]} <b>${v[1]}</b><small>${k}</small></div>`).join("");
 document.getElementById("buildQueue").innerHTML=state.queue.map(q=>`<div class="queue"><b>${q[0]}</b><button onclick="event.stopPropagation();showToast('Hızlandırıldı')">HIZLANDIR</button><small>${q[1]} · ${q[2]}</small></div>`).join("");
 document.getElementById("hotspots").innerHTML=state.buildings.map(b=>`<button class="hotspot" style="left:${b.x}%;top:${b.y}%" onclick="openBuilding('${b.id}')"><span>${b.name}<br>Lv.${b.lv}</span></button>`).join("");
}
function openBuilding(id){
 const b=state.buildings.find(x=>x.id===id);
 document.getElementById("modalTitle").textContent=`${b.name} — Lv.${b.lv}`;
 document.getElementById("modalBody").innerHTML=`<div class="stats"><div class="stat"><b>${b.hp}%</b>DAYANIKLILIK</div><div class="stat"><b>${b.power.toLocaleString()}</b>GÜÇ</div><div class="stat"><b>${b.prod}</b>ÜRETİM</div></div><div class="action"><button onclick="upgrade('${id}')">⬆ SEVİYE YÜKSELT</button><button onclick="showToast('Bina detayları')">ℹ DETAYLAR</button></div>`;
 document.getElementById("modal").classList.remove("hidden");
}
function upgrade(id){
 const b=state.buildings.find(x=>x.id===id);
 b.lv++; b.power=Math.round(b.power*1.12);
 closeModal(); render(); showToast(`${b.name} Lv.${b.lv} oldu`);
}
function openProduction(){
 document.getElementById("modalTitle").textContent="ASKERİ ÜRETİM";
 document.getElementById("modalBody").innerHTML=`<div class="stats"><div class="stat"><b>120</b>M1 TANK</div><div class="stat"><b>48</b>SAVAŞ UÇAĞI</div><div class="stat"><b>16</b>FIRKATEYN</div></div><div class="action"><button onclick="showToast('Tank üretimi başladı')">TANK ÜRET</button><button onclick="showToast('Uçak üretimi başladı')">UÇAK ÜRET</button></div>`;
 document.getElementById("modal").classList.remove("hidden");
}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function showToast(t){const e=document.getElementById("toast");e.textContent=t;e.classList.add("show");clearTimeout(window._tt);window._tt=setTimeout(()=>e.classList.remove("show"),1400)}
function toggleBuild(){document.getElementById("buildPanel").classList.toggle("open")}
function toggleFullscreen(){if(!document.fullscreenElement){document.documentElement.requestFullscreen?.().catch(()=>{})}else{document.exitFullscreen?.()}}
render();
