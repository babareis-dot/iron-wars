
(()=>{
 const buildings=[
  {name:"Çelik Fabrikası",icon:"🏭",level:18,prod:8450,hp:100,x:.29,y:.68,w:.16,h:.18},
  {name:"Tank Üretim Merkezi",icon:"🛡️",level:16,prod:0,hp:100,x:.43,y:.49,w:.22,h:.18},
  {name:"Araştırma Merkezi",icon:"📡",level:18,prod:3200,hp:100,x:.27,y:.28,w:.18,h:.19},
  {name:"Komuta Merkezi",icon:"🏢",level:20,prod:12540,hp:100,x:.48,y:.18,w:.19,h:.24},
  {name:"Hava Üssü",icon:"✈️",level:17,prod:0,hp:100,x:.68,y:.27,w:.18,h:.20},
  {name:"Tersane",icon:"⚓",level:16,prod:2100,hp:100,x:.65,y:.58,w:.18,h:.20}
 ];
 let resources=JSON.parse(localStorage.getItem("iw15res")||'{"money":2450000,"oil":1870000,"steel":3240000}');
 let levels=JSON.parse(localStorage.getItem("iw15levels")||"{}");
 buildings.forEach(b=>{if(levels[b.name]) b.level=levels[b.name]});
 let current=null, upgrading=null, end=0;

 const $=id=>document.getElementById(id);
 function compact(n){return n>=1e6?(n/1e6).toFixed(2)+"M":n>=1e3?(n/1e3).toFixed(1)+"K":Math.floor(n)}
 function save(){localStorage.setItem("iw15res",JSON.stringify(resources));localStorage.setItem("iw15levels",JSON.stringify(levels))}
 function renderRes(){if($("v15Money"))$("v15Money").textContent=compact(resources.money);if($("v15Oil"))$("v15Oil").textContent=compact(resources.oil);if($("v15Steel"))$("v15Steel").textContent=compact(resources.steel)}
 function open(b){
   current=b;$("v15Icon").textContent=b.icon;$("v15Title").textContent=b.name;
   $("v15Level").textContent="Seviye "+b.level;$("v15Production").textContent=b.prod?("+"+compact(b.prod)+"/s"):"Birlik üretimi";
   $("v15Hp").textContent=b.hp+"%";$("v15Panel").classList.remove("hidden");updatePanel();
 }
 function updatePanel(){
   if(!current)return;
   const cost=50000+current.level*25000;
   $("v15Upgrade").textContent=upgrading===current?"GELİŞTİRİLİYOR":"GELİŞTİR • "+compact(cost)+" Çelik";
 }
 function upgrade(){
   if(!current||upgrading)return;
   const cost=50000+current.level*25000;
   if(resources.steel<cost){$("v15Timer").textContent="Yeterli çelik yok";return}
   resources.steel-=cost; upgrading=current; end=Date.now()+8000; save();renderRes();updatePanel();
 }
 function tick(){
   let gain=0;buildings.forEach(b=>gain+=b.prod*(1+(b.level-1)*.025));
   resources.money+=gain/10;
   resources.oil+=923;
   resources.steel+=845;
   if(upgrading){
     const left=Math.max(0,end-Date.now()), pct=1-left/8000;
     $("v15Bar").style.width=(pct*100)+"%";$("v15Timer").textContent=left?("Geliştirme: "+Math.ceil(left/1000)+" sn"):"Tamamlandı";
     if(!left){
       upgrading.level++;levels[upgrading.name]=upgrading.level;upgrading=null;
       $("v15Level").textContent="Seviye "+current.level;$("v15Bar").style.width="0";save();updatePanel();
     }
   }
   renderRes();
 }
 function bindStage(){
   const stage=$("designStage"); if(!stage)return;
   stage.addEventListener("click",e=>{
     if(e.target.closest("#fullscreenButton"))return;
     const r=stage.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
     const b=buildings.find(q=>x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h);
     if(b)open(b);
   });
 }
 window.addEventListener("DOMContentLoaded",()=>{
   bindStage();$("v15Close")?.addEventListener("click",()=> $("v15Panel").classList.add("hidden"));
   $("v15Upgrade")?.addEventListener("click",upgrade);renderRes();setInterval(tick,100);
 });
})();
