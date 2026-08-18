const state={
 resources:{Para:["💵","2.45M"],Petrol:["🛢️","1.87M"],Çelik:["🔩","3.24M"],Bakır:["🟫","1.12M"],Altın:["🪙","8,250"]},
 buildings:[
  {id:"hq",name:"KOMUTA MERKEZİ",lv:20,x:52,y:37,hp:100,power:9800,prod:"Komuta"},
  {id:"research",name:"ARAŞTIRMA MERKEZİ",lv:18,x:31,y:41,hp:96,power:6200,prod:"Teknoloji"},
  {id:"air",name:"HAVA ÜSSÜ",lv:17,x:72,y:36,hp:91,power:7300,prod:"Uçak"},
  {id:"tank",name:"TANK ÜRETİM MERKEZİ",lv:16,x:46,y:66,hp:93,power:6800,prod:"Zırhlı"},
  {id:"steel",name:"ÇELİK FABRİKASI",lv:18,x:27,y:72,hp:88,power:5100,prod:"+18K/s"},
  {id:"dock",name:"TERSANE",lv:16,x:70,y:67,hp:94,power:7900,prod:"Donanma"},
  {id:"radar",name:"RADAR MERKEZİ",lv:14,x:20,y:48,hp:87,power:3900,prod:"İstihbarat"},
  {id:"defense",name:"HAVA SAVUNMA",lv:15,x:82,y:54,hp:99,power:8600,prod:"Savunma"},
 ],
 queue:[
  ["ÇELİK FABRİKASI","Lv.18","03:42:11"],
  ["TANK ÜRETİM MERKEZİ","Lv.16","01:25:45"],
  ["UÇAK ÜSSÜ","Lv.15","02:19:07"]
 ]
};
function render(){
 document.getElementById("resources").innerHTML=Object.entries(state.resources).map(([k,v])=>`<div class="res">${v[0]} <b>${v[1]}</b><small>${k}</small></div>`).join("");
 document.getElementById("buildQueue").innerHTML=state.queue.map(q=>`<div class="queue"><b>${q[0]}</b><button onclick="showToast('Hızlandırma kullanıldı')">HIZLANDIR</button><small>${q[1]} &nbsp; ${q[2]}</small></div>`).join("");
 document.getElementById("baseGrid").innerHTML=state.buildings.map(b=>`<div class="building" style="left:${b.x}%;top:${b.y}%" onclick="openBuilding('${b.id}')"><div class="structure"></div><label>${b.name}<br>Lv.${b.lv}</label></div>`).join("");
}
function openBuilding(id){
 const b=state.buildings.find(x=>x.id===id);
 document.getElementById("modalTitle").textContent=b.name+" — Lv."+b.lv;
 document.getElementById("modalBody").innerHTML=`<div class="stats"><div class="stat"><b>${b.hp}%</b>Dayanıklılık</div><div class="stat"><b>${b.power.toLocaleString()}</b>Güç</div><div class="stat"><b>${b.prod}</b>Üretim</div></div><div class="action"><button onclick="upgrade('${id}')">⬆ SEVİYE YÜKSELT</button><button onclick="showToast('Detaylar açıldı')">ℹ DETAYLAR</button></div>`;
 document.getElementById("modal").classList.remove("hidden");
}
function upgrade(id){const b=state.buildings.find(x=>x.id===id);b.lv++;b.power=Math.round(b.power*1.12);closeModal();render();showToast(`${b.name} Lv.${b.lv} oldu`)}
function openProduction(){document.getElementById("modalTitle").textContent="ASKERİ ÜRETİM";document.getElementById("modalBody").innerHTML=`<div class="stats"><div class="stat"><b>120</b>M1 Tank</div><div class="stat"><b>48</b>Savaş Uçağı</div><div class="stat"><b>16</b>Fırkateyn</div></div><div class="action"><button onclick="showToast('Tank üretimi başladı')">TANK ÜRET</button><button onclick="showToast('Uçak üretimi başladı')">UÇAK ÜRET</button></div>`;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function showToast(t){const e=document.getElementById("toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1600)}
function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()}
function drawBackground(){
 const c=document.getElementById("bg"),ctx=c.getContext("2d");function resize(){c.width=c.clientWidth*devicePixelRatio;c.height=c.clientHeight*devicePixelRatio;paint()}function paint(){let w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.save();ctx.scale(devicePixelRatio,devicePixelRatio);w=c.clientWidth;h=c.clientHeight;
 ctx.strokeStyle="rgba(170,210,190,.08)";ctx.lineWidth=1;for(let y=0;y<h;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y+80);ctx.stroke()}for(let x=0;x<w;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-170,h);ctx.stroke()}
 ctx.fillStyle="rgba(20,55,70,.85)";ctx.beginPath();ctx.moveTo(w*.76,0);ctx.lineTo(w,0);ctx.lineTo(w,h);ctx.lineTo(w*.64,h);ctx.bezierCurveTo(w*.78,h*.75,w*.66,h*.45,w*.76,0);ctx.fill();
 ctx.strokeStyle="rgba(105,185,205,.3)";for(let i=0;i<20;i++){let yy=h*(.1+i/22);ctx.beginPath();ctx.moveTo(w*.72+Math.sin(i)*15,yy);ctx.lineTo(w,yy+Math.sin(i*2)*18);ctx.stroke()}
 ctx.restore()}
 window.addEventListener("resize",resize);resize()
}
render();drawBackground();
