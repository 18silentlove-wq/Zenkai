const anime = [
{id:1,title:"Jujutsu Kaisen",genre:"Action",year:2024,score:"9.2",episodes:"23 Episodes",symbol:"呪",poster:"linear-gradient(145deg,#4c1c67,#171b38 60%,#080c19)",description:"A high-energy supernatural adventure where courage, friendship and mysterious cursed forces collide.",tags:["Action","Supernatural","Fantasy"]},
{id:2,title:"Attack on Titan",genre:"Drama",year:2023,score:"9.8",episodes:"87 Episodes",symbol:"進",poster:"linear-gradient(145deg,#9a512d,#392b35 60%,#111522)",description:"Humanity faces an extraordinary mystery beyond its walls in this intense story of freedom and truth.",tags:["Drama","Action","Mystery"]},
{id:3,title:"Demon Slayer",genre:"Adventure",year:2024,score:"9.5",episodes:"55 Episodes",symbol:"滅",poster:"linear-gradient(145deg,#236d78,#18334a 60%,#111522)",description:"A determined young swordsman sets out on a heartfelt journey filled with beautiful worlds and formidable challenges.",tags:["Adventure","Action","Fantasy"]},
{id:4,title:"Your Name",genre:"Drama",year:2016,score:"9.1",episodes:"Movie",symbol:"君",poster:"linear-gradient(145deg,#e08c8c,#514b8c 58%,#111522)",description:"Two strangers discover a surprising connection across distance, time and the changing sky.",tags:["Drama","Romance","Fantasy"]},
{id:5,title:"One Piece",genre:"Adventure",year:2024,score:"9.7",episodes:"1000+ Episodes",symbol:"海",poster:"linear-gradient(145deg,#c17a38,#335c79 58%,#101522)",description:"Join a crew of dreamers as they sail across a vast ocean in search of the ultimate treasure.",tags:["Adventure","Action","Comedy"]},
{id:6,title:"Violet Evergarden",genre:"Drama",year:2018,score:"9.3",episodes:"13 Episodes",symbol:"愛",poster:"linear-gradient(145deg,#7189aa,#464b72 60%,#111522)",description:"A moving story about understanding emotions, finding words and discovering the meaning of connection.",tags:["Drama","Slice of Life"]},
{id:7,title:"Dr. Stone",genre:"Sci-Fi",year:2023,score:"8.9",episodes:"35 Episodes",symbol:"科",poster:"linear-gradient(145deg,#8eaa48,#3d654e 58%,#111522)",description:"A brilliant young scientist sets out to rebuild civilisation through curiosity, teamwork and discovery.",tags:["Sci-Fi","Adventure"]},
{id:8,title:"Spy x Family",genre:"Action",year:2024,score:"9.0",episodes:"37 Episodes",symbol:"家",poster:"linear-gradient(145deg,#c68a55,#75456e 60%,#111522)",description:"An unusual family tries to keep its secrets while navigating everyday life and unexpected adventures.",tags:["Action","Comedy","Family"]}
];
const grid=document.getElementById("animeGrid"),empty=document.getElementById("emptyState"),search=document.getElementById("searchInput");
let genre="All",view="home",activeAnime=null,toastTimer;
let saved=new Set(JSON.parse(localStorage.getItem("zenkai-watchlist")||"[]"));
function showToast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2100)}
function updateCount(){document.getElementById("listCount").textContent=saved.size}
function render(){
 const q=search.value.trim().toLowerCase();
 let items=anime.filter(a=>(genre==="All"||a.genre===genre||a.tags.includes(genre))&&(!q||(a.title+" "+a.genre+" "+a.tags.join(" ")).toLowerCase().includes(q)));
 if(view==="watchlist")items=items.filter(a=>saved.has(a.id));
 if(view==="home"&&!q&&genre==="All")items=items.slice(0,8);
 grid.innerHTML=items.map(a=>`<article class="anime-card" data-id="${a.id}"><div class="poster" style="--poster:${a.poster}" data-symbol="${a.symbol}"><span class="poster-score">★ ${a.score}</span><button class="save-btn ${saved.has(a.id)?"saved":""}" data-save="${a.id}" aria-label="Toggle watchlist">${saved.has(a.id)?"✓":"＋"}</button><span class="poster-label">ZENKAI ORIGINAL PICKS</span></div><div class="card-info"><h3 class="card-title">${a.title}</h3><div class="card-sub"><span>${a.genre} · ${a.year}</span><span>${a.episodes}</span></div></div></article>`).join("");
 empty.classList.toggle("hidden",items.length>0);grid.classList.toggle("hidden",items.length===0);
 document.getElementById("sectionTitle").innerHTML=view==="watchlist"?'My watchlist<span>.</span>':view==="explore"?'Explore anime<span>.</span>':'Trending now<span>.</span>';
 document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
 updateCount();
}
function setView(next){view=next;genre="All";document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("selected",b.dataset.genre==="All"));render();document.getElementById("catalog").scrollIntoView({behavior:"smooth"});document.querySelector(".desktop-nav").classList.remove("open")}
function toggleSave(id){id=Number(id);if(saved.has(id)){saved.delete(id);showToast("Removed from your list")}else{saved.add(id);showToast("Added to your list")}localStorage.setItem("zenkai-watchlist",JSON.stringify([...saved]));render();if(activeAnime&&activeAnime.id===id)document.getElementById("modalSave").textContent=saved.has(id)?"✓ Added to list":"＋ Add to list"}
function openModal(id){const a=anime.find(x=>x.id===Number(id));if(!a)return;activeAnime=a;document.getElementById("modalArt").style.setProperty("--poster",a.poster);document.getElementById("modalArt").textContent=a.symbol;document.getElementById("modalTitle").textContent=a.title;document.getElementById("modalMeta").textContent=a.genre.toUpperCase()+" · "+a.year+" · ★ "+a.score;document.getElementById("modalDescription").textContent=a.description;document.getElementById("modalTags").innerHTML=a.tags.map(t=>"<span>"+t+"</span>").join("");document.getElementById("modalSave").textContent=saved.has(a.id)?"✓ Added to list":"＋ Add to list";document.getElementById("animeModal").classList.remove("hidden")}
grid.addEventListener("click",e=>{const save=e.target.closest("[data-save]");if(save){e.stopPropagation();toggleSave(save.dataset.save);return}const card=e.target.closest("[data-id]");if(card)openModal(card.dataset.id)});
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
document.getElementById("filters").addEventListener("click",e=>{const b=e.target.closest("[data-genre]");if(!b)return;genre=b.dataset.genre;document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("selected",x===b));render()});
search.addEventListener("input",render);
document.getElementById("exploreBtn").addEventListener("click",()=>setView("explore"));
document.getElementById("viewAllBtn").addEventListener("click",()=>setView("explore"));
document.getElementById("surpriseBtn").addEventListener("click",()=>openModal(anime[Math.floor(Math.random()*anime.length)].id));
document.getElementById("resetBtn").addEventListener("click",()=>{search.value="";genre="All";document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("selected",b.dataset.genre==="All"));render()});
document.getElementById("modalClose").addEventListener("click",()=>document.getElementById("animeModal").classList.add("hidden"));
document.querySelector(".modal-backdrop").addEventListener("click",()=>document.getElementById("animeModal").classList.add("hidden"));
document.getElementById("modalSave").addEventListener("click",()=>activeAnime&&toggleSave(activeAnime.id));
document.getElementById("modalWatch").addEventListener("click",()=>showToast("Episode streaming is not connected yet"));
document.getElementById("menuBtn").addEventListener("click",()=>document.querySelector(".desktop-nav").classList.toggle("open"));
document.getElementById("profileBtn").addEventListener("click",()=>showToast("Profile accounts are not enabled in this demo"));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.getElementById("animeModal").classList.add("hidden");if(e.key==="/"&&document.activeElement!==search){e.preventDefault();search.focus()}});
render();