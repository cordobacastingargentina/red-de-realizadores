const roles=["Dirección","Guion","Dirección de Fotografía","Cámara","Dirección de Arte","Producción","Sonido","Montaje / Edición","Color","VFX / Motion Graphics","Música"];
const names=["Julia Romero","Mateo Ferreyra","Camila López","Tomás Herrera","Sofía Molina","Franco Acosta","Valentina Quiroga","Nicolás Suárez","Martina Vega","Agustín Pereyra","Lucía Ortiz","Joaquín Roldán","Malena Navarro","Bruno Funes","Victoria Soria","Lautaro Arias","Emilia Paz","Facundo Mercado","Clara Torres","Santiago Almada","Renata Giménez","Ignacio Ceballos","Ana Bustos","Benjamín Peralta","Mora Luna","Ramiro Ávila","Paula Correa","Gonzalo Moyano","Carolina Flores","Simón Rivero","Julieta Juárez","Marcos Villagra","Florencia Carrizo","Lucas Godoy","Milagros Sosa","Federico Salas","Delfina Méndez","Juan Aguirre","Elena Vargas","Pedro Ríos","Catalina Núñez","Emiliano Castro","Josefina Ferreyra","Manuel Toledo","Abril Mansilla","Thiago Ponce","Rocío Barrionuevo","Leandro Cabrera"];
const descriptors={
"Dirección":["Guion","Publicidad","Videoclip","Puesta en escena","Documental"],
"Guion":["Dirección","Drama","Comedia","Desarrollo","Script doctor"],
"Dirección de Fotografía":["Cámara","Iluminación","DaVinci Resolve","16mm","Publicidad"],
"Cámara":["Gimbal","Foquista","Documental","Sony","Blackmagic"],
"Dirección de Arte":["Escenografía","Utilería","Vestuario","Publicidad","Ambientación"],
"Producción":["Presupuesto","Locaciones","Plan de rodaje","Logística","Asistencia de dirección"],
"Sonido":["Sonido directo","Pro Tools","Mezcla","Diseño sonoro","Postproducción"],
"Montaje / Edición":["Premiere Pro","DaVinci Resolve","Avid","Documental","Ficción"],
"Color":["DaVinci Resolve","Color grading","Finishing","HDR","Cine"],
"VFX / Motion Graphics":["Blender","After Effects","Cinema 4D","Composición","3D"],
"Música":["Composición","Banda sonora","Ableton Live","Pro Tools","Producción musical"]};
const videoUrls=["https://www.youtube.com/watch?v=aqz-KE-bpKQ","https://vimeo.com/76979871"];
const reviewTexts=["Gran compañero de equipo y muy resolutivo.","Excelente criterio y comunicación en rodaje.","Muy sólido técnicamente y siempre aporta soluciones.","Trabajaría nuevamente sin dudarlo."];
const cameraIcon=`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 10l5-3v10l-5-3z"/><path d="M7 7l1.5-2h4L14 7"/></svg>`;
const profiles=names.map((name,i)=>{const primary=roles[i%roles.length];const pool=descriptors[primary];const tags=[pool[i%pool.length],pool[(i+2)%pool.length],...(i%3===0?[pool[(i+4)%pool.length]]:[])].filter((v,idx,a)=>a.indexOf(v)===idx).slice(0,5);const recs=(i*7)%20;const verified=[1,4,8,12,18,24,31,37,43].includes(i+1);return{id:i+1,name,primary,tags,available:i%5!==0,students:i%3!==0,bio:`Trabajo principalmente en ${primary.toLowerCase()} para ficción, publicidad y proyectos independientes. Me interesan los equipos colaborativos y los procesos de producción cuidados.`,reel:primary==="Guion"?"":videoUrls[i%2],scriptPdfName:primary==="Guion"&&i%2===1?"muestra-guion.pdf":"",scriptPdfUrl:"",updated:`${String((i%18)+1).padStart(2,'0')} ago 2026`,verified,recommendations:Array.from({length:Math.min(recs,4)},(_,j)=>({author:names[(i+j+8)%names.length],authorId:((i+j+8)%names.length)+1,project:["Luz de fondo","Las horas quietas","Proyecto Umbral","Casa tomada"][j%4],comment:reviewTexts[(i+j)%reviewTexts.length]})),recommendationCount:recs};});
profiles.forEach((p,i)=>{p.status=i===5?"pending":i===9?"rejected":"approved";p.rejectionReason=i===9?"Revisá el material cargado y volvé a enviar el perfil.":"";});
profiles.forEach((p,i)=>{p.visibility=p.visibility||"visible";p.contactType=i%2===0?"email":"whatsapp";p.contactValue=i%2===0?`realizador${p.id}@demo.com`:`+54 9 351 555 ${String(1000+p.id)}`;});
const jobs=[
{id:11,title:"Buscamos DF y sonidista para corto",roles:["Dirección de Fotografía","Sonido"],description:"Cortometraje de ficción de dos jornadas. Buscamos un equipo pequeño y con ganas de trabajar una propuesta visual cuidada.",student:true,paid:false,days:4,author:"Mateo Ferreyra",participants:[3,8,18]},
{id:12,title:"Dirección de arte para videoclip",roles:["Dirección de Arte"],description:"Videoclip independiente con una propuesta de arte basada en espacios intervenidos y paleta de color muy marcada.",student:false,paid:true,days:7,author:"Camila López",participants:[5,16]},
{id:13,title:"Equipo de post para pieza institucional",roles:["Montaje / Edición","Color","VFX / Motion Graphics"],description:"Buscamos perfiles de postproducción para una pieza breve. Trabajo coordinado y entrega en dos semanas.",student:false,paid:true,days:2,author:"Santiago Almada",participants:[9,20,31,42]},
{id:14,title:"Guionista para proyecto universitario",roles:["Guion"],description:"Proyecto final universitario. Buscamos una persona interesada en trabajar estructura y diálogos durante desarrollo.",student:true,paid:false,days:9,author:"Mora Luna",participants:[2,13]}];
const state={isAdmin:false,route:"realizadores",loggedIn:false,currentUserId:1};
const app=document.getElementById("app"),modal=document.getElementById("modal"),backdrop=document.getElementById("modalBackdrop"),modalContent=document.getElementById("modalContent"),accountBtn=document.getElementById("openAccountBtn");
const realState={session:null,user:null,isAdmin:false,profile:null,privateProfile:null,moderation:null,tags:[],roles:[]};

const esc=s=>String(s??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const initials=n=>n.split(" ").map(x=>x[0]).slice(0,2).join("");
function embedUrl(url){try{const u=new URL(url);if(u.hostname.includes("youtube.com")){const id=u.searchParams.get("v");return id?`https://www.youtube-nocookie.com/embed/${id}?rel=0`:null}if(u.hostname==="youtu.be")return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}?rel=0`;if(u.hostname.includes("vimeo.com")){const id=u.pathname.split("/").filter(Boolean)[0];return /^\d+$/.test(id||"")?`https://player.vimeo.com/video/${id}`:null}}catch(e){}return null}
function verifiedBadge(label=true){return`<span class="verified" title="Perfil verificado por Córdoba Casting">${cameraIcon}${label?"VERIFICADO":""}</span>`}
function topBadge(p){return p.recommendationCount>=15?`<span class="top-badge">★ MUY RECOMENDADO</span>`:""}
function openModal(html,wide=false){modalContent.innerHTML=html;modal.classList.toggle("wide",wide);modal.classList.remove("hidden");backdrop.classList.remove("hidden")}
function closeModal(){modal.classList.add("hidden");backdrop.classList.add("hidden");modal.classList.remove("wide")}
document.getElementById("closeModalBtn").onclick=closeModal;backdrop.onclick=closeModal;accountBtn.onclick=()=>state.isAdmin?demoAdminPanel():accountModal();window.addEventListener("hashchange",route);document.querySelectorAll("[data-route]").forEach(a=>a.addEventListener("click",()=>{}));
function route(){state.route=(location.hash||"#realizadores").slice(1);({realizadores:renderDirectory,busquedas:renderJobs,recursos:renderResources,formacion:renderTraining}[state.route]||renderDirectory)()}
function matchRank(p,q,roleFilter){let rank=0;const qq=q.trim().toLowerCase();if(roleFilter){if(p.primary===roleFilter)rank+=120;else if(p.tags.some(t=>t.toLowerCase()===roleFilter.toLowerCase()))rank+=55;else return -1}if(!qq)return rank;const primary=p.primary.toLowerCase(),tags=p.tags.map(t=>t.toLowerCase()),name=p.name.toLowerCase(),bio=p.bio.toLowerCase();if(primary===qq)rank+=200;else if(primary.includes(qq))rank+=150;if(tags.some(t=>t===qq))rank+=100;else if(tags.some(t=>t.includes(qq)))rank+=75;if(name.includes(qq))rank+=60;if(bio.includes(qq))rank+=20;return rank||-1}
function renderDirectory(){app.innerHTML=`<section class="hero wrap"><div><div class="eyebrow">RED PROFESIONAL AUDIOVISUAL · CÓRDOBA</div><h1>Encontrá a quienes<br><span>hacen posible cada proyecto.</span></h1><p>Buscá por rol principal, otros oficios, herramientas o habilidades. El rol principal siempre tiene prioridad en los resultados.</p></div><aside class="hero-brand-panel"><img src="assets/rr-logo.svg" alt="Red de Realizadores"><div class="cc"><span>UNA INICIATIVA DE</span><img src="assets/cordoba-casting-white.png" alt="Córdoba Casting"></div></aside></section><section class="search-panel wrap"><div class="search-line"><label>BUSCAR POR NOMBRE, ROL, HERRAMIENTA O PALABRA CLAVE</label><input id="searchInput" placeholder="Ej: dirección, guion, Blender, DaVinci, sonido…"></div><div class="filter-row"><select id="roleFilter"><option value="">Todos los roles</option>${roles.map(r=>`<option>${r}</option>`).join("")}</select><label class="check"><input id="availableFilter" type="checkbox"> Disponible ahora</label><label class="check"><input id="studentFilter" type="checkbox"> Acepta estudiantiles</label><label class="check"><input id="verifiedFilter" type="checkbox"> Solo verificados</label><select id="sortFilter"><option value="relevance">Orden: relevancia</option><option value="recommendations">Más recomendados</option><option value="recent">Actualizados recientemente</option><option value="name">Nombre A–Z</option></select><button id="clearFilters" class="clear-btn">Limpiar filtros</button></div></section><section class="directory wrap"><div class="section-head"><div><strong id="resultCount">0</strong> perfiles encontrados</div><button id="createProfile" class="gold-btn">Crear / editar mi perfil</button></div><div id="cards" class="cards"></div></section><section class="info-strip"><div class="wrap strip-grid"><div><span>01</span><strong>Un perfil claro</strong><p>Un rol principal y hasta cinco etiquetas útiles, sin spam.</p></div><div><span>02</span><strong>Reel o guion</strong><p>Video embebido; los guionistas principales pueden mostrar PDF.</p></div><div><span>03</span><strong>Recomendaciones</strong><p>Una recomendación por usuario, siempre vinculada a un proyecto.</p></div><div><span>04</span><strong>Perfiles verificados</strong><p>Distinción administrada por Córdoba Casting para trayectoria acreditada.</p></div></div></section>`;bindDirectory()}
function bindDirectory(){const q=document.getElementById("searchInput"),rf=document.getElementById("roleFilter"),av=document.getElementById("availableFilter"),st=document.getElementById("studentFilter"),vf=document.getElementById("verifiedFilter"),sort=document.getElementById("sortFilter");const draw=()=>{let arr=profiles.map(p=>({p,rank:matchRank(p,q.value,rf.value)})).filter(x=>x.rank>=0&&!av.checked||false);arr=profiles.map(p=>({p,rank:matchRank(p,q.value,rf.value)})).filter(x=>x.rank>=0).filter(x=>!av.checked||x.p.available).filter(x=>!st.checked||x.p.students).filter(x=>!vf.checked||x.p.verified).filter(x=>x.p.status==="approved"&&x.p.visibility!=="hidden");if(sort.value==="recommendations")arr.sort((a,b)=>b.p.recommendationCount-a.p.recommendationCount||b.rank-a.rank);else if(sort.value==="name")arr.sort((a,b)=>a.p.name.localeCompare(b.p.name));else if(sort.value==="recent")arr.sort((a,b)=>a.p.id-b.p.id);else arr.sort((a,b)=>b.rank-a.rank||b.p.recommendationCount-a.p.recommendationCount);document.getElementById("resultCount").textContent=arr.length;document.getElementById("cards").innerHTML=arr.map(x=>cardHtml(x.p)).join("");document.querySelectorAll("[data-profile]").forEach(x=>x.onclick=()=>profileModal(+x.dataset.profile))};[q,rf,av,st,vf,sort].forEach(x=>x.addEventListener(x.tagName==="INPUT"&&x.type==="text"?"input":"change",draw));document.getElementById("clearFilters").onclick=()=>{q.value="";rf.value="";av.checked=st.checked=vf.checked=false;sort.value="relevance";draw()};document.getElementById("createProfile").onclick=()=>accountModal();draw()}
function cardHtml(p){return`<article class="card" data-profile="${p.id}"><div><div class="card-index"><span>RR / ${String(p.id).padStart(3,"0")}</span>${p.verified?verifiedBadge(false):""}${topBadge(p)}</div><div class="role">${esc(p.primary)}</div><div class="person">${esc(p.name)}</div><div class="secondary">${p.tags.map(esc).join(" · ")}</div><div class="status-row">${p.available?'<span class="pill on">DISPONIBLE</span>':'<span class="pill">NO DISPONIBLE</span>'}${p.students?'<span class="pill on">ESTUDIANTILES</span>':''}</div><div class="recommendation-count"><b>★ ${p.recommendationCount}</b> recomendaciones</div></div><div class="avatar">${initials(p.name)}</div></article>`}
function profileModal(id){const p=profiles.find(x=>x.id===id),embed=embedUrl(p.reel),isWriter=p.primary==="Guion";openModal(`<div class="eyebrow">PERFIL / RR ${String(p.id).padStart(3,"0")}</div><div class="profile-top"><div class="profile-avatar">${initials(p.name)}</div><div><div class="profile-role">${esc(p.primary)}</div><div class="profile-name">${esc(p.name)} ${p.verified?verifiedBadge(true):""}</div><div class="secondary" style="color:#74858a">${p.tags.map(esc).join(" · ")}</div></div><div class="profile-score"><strong>★ ${p.recommendationCount}</strong>RECOMENDACIONES${p.recommendationCount>=15?'<br><span style="color:#8d762d">MUY RECOMENDADO</span>':''}</div></div><div class="profile-section"><h4>Perfil</h4><p>${esc(p.bio)}</p><div class="status-row"><span class="pill on">${p.available?'DISPONIBLE AHORA':'NO DISPONIBLE'}</span>${p.students?'<span class="pill on">ACEPTA ESTUDIANTILES</span>':''}</div></div>${isWriter?writerMaterial(p):videoMaterial(p,embed)}<div class="profile-section"><h4>Recomendaciones</h4><div class="reviews">${p.recommendations.length?p.recommendations.map((r,ri)=>`<div class="review"><strong>${esc(r.author)}</strong><span>${esc(r.project)}</span><p>${esc(r.comment)}</p>${state.loggedIn&&r.authorId===state.currentUserId?`<div class="review-actions"><button data-edit-review="${ri}">Editar</button><button data-delete-review="${ri}">Eliminar</button></div>`:""}${state.isAdmin?`<div class="review-actions"><button class="danger" data-mod-review="${ri}">Quitar recomendación</button></div>`:""}</div>`).join(""):'<p>Todavía no tiene comentarios visibles.</p>'}</div><div class="profile-actions"><button id="recommendBtn" class="primary gold">★ Recomendar</button><button id="contactBtn" class="outline">Contactar</button></div></div><div class="profile-section"><h4>Actualización</h4><p style="font-size:12px">Perfil actualizado por última vez: <strong>${esc(p.updated)}</strong></p></div>`,true);document.getElementById("recommendBtn").onclick=()=>recommendModal(p);document.getElementById("contactBtn").onclick=()=>contactModal(p);
document.querySelectorAll("[data-edit-review]").forEach(b=>b.onclick=()=>editRecommendationModal(p,+b.dataset.editReview));
document.querySelectorAll("[data-delete-review]").forEach(b=>b.onclick=()=>deleteRecommendation(p,+b.dataset.deleteReview));
document.querySelectorAll("[data-mod-review]").forEach(b=>b.onclick=()=>deleteRecommendation(p,+b.dataset.modReview));const pdfBtn=document.getElementById("openPdfBtn");if(pdfBtn)pdfBtn.onclick=()=>{if(p.scriptPdfUrl)window.open(p.scriptPdfUrl,"_blank");else alert("Este PDF es un ejemplo visual del prototipo. En la versión conectada se abrirá el archivo almacenado en Supabase.")}}
function videoMaterial(p,embed){return`<div class="profile-section"><h4>Reel / portfolio audiovisual</h4><div class="video-card">${embed?`<iframe src="${embed}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`:`<div class="play-placeholder"><div><div class="play-icon">▶</div><small>VIDEO NO DISPONIBLE</small></div></div>`}</div></div>`}
function writerMaterial(p){return`<div class="profile-section"><h4>Muestra de guion</h4>${p.scriptPdfName?`<div class="pdf-card"><div><strong>PDF · ${esc(p.scriptPdfName)}</strong><small>Material de escritura del perfil</small></div><button id="openPdfBtn">Ver PDF</button></div>`:`<p>Este guionista todavía no cargó una muestra en PDF.</p>`}</div>`}
function recommendModal(p){if(!state.loggedIn){accountModal(null,()=>recommendModal(p));return}if(p.id===state.currentUserId){openModal(`<div class="eyebrow">RECOMENDACIÓN</div><h2>No podés recomendar tu propio perfil</h2><p>Las recomendaciones están pensadas para personas con las que trabajaste.</p>`);return}if(p.recommendations.some(r=>r.authorId===state.currentUserId)){openModal(`<div class="eyebrow">RECOMENDACIÓN</div><h2>Ya recomendaste a ${esc(p.name)}</h2><p>Cada usuario puede recomendar a una persona una sola vez.</p>`);return}openModal(`<div class="eyebrow">RECOMENDACIÓN</div><h2>Recomendar a ${esc(p.name)}</h2><form id="recommendForm" class="form-grid"><label>¿En qué proyecto trabajaste con el realizador?<input id="projectName" maxlength="55" required placeholder="Nombre del proyecto"></label><label>Comentario breve<textarea id="reviewComment" maxlength="120" required placeholder="Máximo 120 caracteres"></textarea><span id="reviewCount" class="char-count">0 / 120</span></label><div class="profile-actions"><button class="primary gold">Publicar recomendación</button></div></form>`);const ta=document.getElementById("reviewComment");ta.oninput=()=>document.getElementById("reviewCount").textContent=`${ta.value.length} / 120`;document.getElementById("recommendForm").onsubmit=e=>{e.preventDefault();p.recommendationCount++;p.recommendations.unshift({author:profiles.find(x=>x.id===state.currentUserId).name,authorId:state.currentUserId,project:document.getElementById("projectName").value,comment:ta.value});profileModal(p.id)}}

function editRecommendationModal(p,idx){const r=p.recommendations[idx];openModal(`<div class="eyebrow">MI RECOMENDACIÓN</div><h2>Editar recomendación</h2><form id="editRecForm" class="form-grid"><label>Proyecto<input id="editRecProject" maxlength="55" value="${esc(r.project)}" required></label><label>Comentario<textarea id="editRecComment" maxlength="120" required>${esc(r.comment)}</textarea><span class="char-count">${r.comment.length} / 120</span></label><button class="primary gold">Guardar cambios</button><button id="deleteRecInside" type="button" class="danger">Eliminar recomendación</button></form>`);document.getElementById("editRecForm").onsubmit=e=>{e.preventDefault();r.project=document.getElementById("editRecProject").value.trim();r.comment=document.getElementById("editRecComment").value.trim();profileModal(p.id)};document.getElementById("deleteRecInside").onclick=()=>deleteRecommendation(p,idx)}
function deleteRecommendation(p,idx){if(!confirm("¿Eliminar esta recomendación?"))return;p.recommendations.splice(idx,1);p.recommendationCount=Math.max(0,p.recommendationCount-1);profileModal(p.id)}
function demoAdminPanel(){if(!state.isAdmin){openModal(`<div class="eyebrow">ADMINISTRACIÓN</div><h2>Acceso administrador</h2><p>Ingresá con el usuario administrador del prototipo.</p><form id="adminLogin" class="form-grid"><label>Email<input value="admin@cordobacasting.com"></label><label>Contraseña<input type="password" value="admin123"></label><button class="primary gold">Ingresar como administrador</button></form>`);document.getElementById("adminLogin").onsubmit=e=>{e.preventDefault();state.loggedIn=true;state.isAdmin=true;accountBtn.textContent="Administrar";demoAdminPanel()};return}openModal(`<div class="eyebrow">CÓRDOBA CASTING / ADMIN</div><h2>Gestión de realizadores</h2><p>Aprobá solicitudes, rechazalas con motivo, verificá perfiles y administrá usuarios publicados.</p><div class="admin-toolbar"><button data-admin-filter="pending">Pendientes</button><button data-admin-filter="approved">Publicados</button><button data-admin-filter="rejected">Rechazados</button><button data-admin-filter="all">Todos</button></div><div id="adminList" class="admin-panel"></div>`,true);demoDrawAdmin("pending")}
function demoDrawAdmin(filter){const arr=profiles.filter(p=>filter==="all"||p.status===filter);document.getElementById("adminList").innerHTML=arr.map(p=>`<div class="admin-row"><div><h4>${esc(p.name)} ${p.verified?verifiedBadge(false):""}</h4><div class="secondary">${esc(p.primary)} · ${p.tags.map(esc).join(" · ")}</div><small>Estado: ${p.status.toUpperCase()} · ${p.visibility==="hidden"?"OCULTO EN LA WEB":"VISIBLE EN LA WEB"}${p.rejectionReason?` · ${esc(p.rejectionReason)}`:""}</small></div><div class="admin-actions"><button data-admin-view="${p.id}">Ver perfil completo</button>${p.status!=="approved"?`<button data-approve="${p.id}">Aprobar</button><button data-approve-verify="${p.id}">Aprobar + verificar</button>`:""}${p.status!=="rejected"?`<button data-reject="${p.id}">Rechazar</button>`:""}${p.status==="approved"?`<button data-edit-user="${p.id}">Editar</button><button data-verify="${p.id}">${p.verified?"Quitar verificación":"Verificar"}</button><button data-hide="${p.id}">${p.visibility==="hidden"?"Mostrar en web":"Ocultar de la web"}</button>`:""}<button class="danger" data-delete-user="${p.id}">Eliminar</button></div></div>`).join("")||"<p>No hay perfiles en esta categoría.</p>";document.querySelectorAll("[data-admin-filter]").forEach(b=>b.onclick=()=>demoDrawAdmin(b.dataset.adminFilter));document.querySelectorAll("[data-approve]").forEach(b=>b.onclick=()=>{const p=profiles.find(x=>x.id===+b.dataset.approve);p.status="approved";p.rejectionReason="";demoDrawAdmin(filter)});document.querySelectorAll("[data-approve-verify]").forEach(b=>b.onclick=()=>{const p=profiles.find(x=>x.id===+b.dataset.approveVerify);p.status="approved";p.verified=true;p.rejectionReason="";demoDrawAdmin(filter)});document.querySelectorAll("[data-reject]").forEach(b=>b.onclick=()=>{const p=profiles.find(x=>x.id===+b.dataset.reject),reason=prompt("Motivo del rechazo. En la versión conectada se enviará al email del usuario:","Revisá la información o el material cargado y volvé a enviar el perfil.");if(reason===null)return;p.status="rejected";p.rejectionReason=reason;demoDrawAdmin(filter)});document.querySelectorAll("[data-verify]").forEach(b=>b.onclick=()=>{const p=profiles.find(x=>x.id===+b.dataset.verify);p.verified=!p.verified;demoDrawAdmin(filter)});document.querySelectorAll("[data-hide]").forEach(b=>b.onclick=()=>{const p=profiles.find(x=>x.id===+b.dataset.hide);p.visibility=p.visibility==="hidden"?"visible":"hidden";demoDrawAdmin(filter)});document.querySelectorAll("[data-delete-user]").forEach(b=>b.onclick=()=>{if(!confirm("¿Eliminar este perfil de la plataforma?"))return;const i=profiles.findIndex(x=>x.id===+b.dataset.deleteUser);profiles.splice(i,1);demoDrawAdmin(filter)});document.querySelectorAll("[data-admin-view]").forEach(b=>b.onclick=()=>demoAdminPreviewProfile(+b.dataset.adminView));document.querySelectorAll("[data-edit-user]").forEach(b=>b.onclick=()=>demoAdminEditUser(+b.dataset.editUser))}

function demoAdminPreviewProfile(id){const p=profiles.find(x=>x.id===id),embed=embedUrl(p.reel),isWriter=p.primary==="Guion";openModal(`<div class="eyebrow">REVISIÓN ADMINISTRATIVA</div><div class="profile-top"><div class="profile-avatar">${initials(p.name)}</div><div><div class="profile-role">${esc(p.primary)}</div><div class="profile-name">${esc(p.name)} ${p.verified?verifiedBadge(true):""}</div><div class="secondary" style="color:#74858a">${p.tags.map(esc).join(" · ")}</div></div><div class="profile-score"><strong>${p.status.toUpperCase()}</strong>${p.visibility==="hidden"?"OCULTO EN WEB":"VISIBLE EN WEB"}</div></div><div class="profile-section"><h4>Descripción</h4><p>${esc(p.bio)}</p><div class="status-row"><span class="pill on">${p.available?"DISPONIBLE AHORA":"NO DISPONIBLE"}</span>${p.students?'<span class="pill on">ACEPTA ESTUDIANTILES</span>':''}</div></div>${isWriter?writerMaterial(p):videoMaterial(p,embed)}<div class="profile-section"><h4>Datos privados de contacto</h4><p><strong>${p.contactType==="whatsapp"?"WhatsApp":"Email"}:</strong> ${esc(p.contactValue)}</p><small>Solo visible para administración. En la web pública nunca se expone.</small></div>${p.rejectionReason?`<div class="notice"><strong>Motivo de rechazo anterior:</strong> ${esc(p.rejectionReason)}</div>`:""}<div class="profile-actions">${p.status!=="approved"?`<button id="adminApprovePreview" class="primary">Aprobar</button><button id="adminApproveVerifyPreview" class="primary gold">Aprobar + verificar</button>`:""}${p.status!=="rejected"?`<button id="adminRejectPreview" class="outline">Rechazar</button>`:""}<button id="adminBackBtn" class="outline">Volver al panel</button></div>`,true);const approve=document.getElementById("adminApprovePreview");if(approve)approve.onclick=()=>{p.status="approved";p.rejectionReason="";demoAdminPanel()};const av=document.getElementById("adminApproveVerifyPreview");if(av)av.onclick=()=>{p.status="approved";p.verified=true;p.rejectionReason="";demoAdminPanel()};const reject=document.getElementById("adminRejectPreview");if(reject)reject.onclick=()=>{const reason=prompt("Motivo del rechazo. En la versión conectada se enviará al email del usuario:","Revisá la información o el material cargado y volvé a enviar el perfil.");if(reason===null)return;p.status="rejected";p.rejectionReason=reason;demoAdminPanel()};document.getElementById("adminBackBtn").onclick=adminPanel}
function demoAdminEditUser(id){const p=profiles.find(x=>x.id===id);openModal(`<div class="eyebrow">ADMIN / EDITAR PERFIL</div><h2>${esc(p.name)}</h2><form id="adminEditForm" class="form-grid"><label>Nombre<input id="aName" value="${esc(p.name)}"></label><label>Rol principal<select id="aPrimary">${roles.map(r=>`<option ${r===p.primary?"selected":""}>${r}</option>`).join("")}</select></label><label>Descripción<textarea id="aBio" maxlength="350">${esc(p.bio)}</textarea></label><label>Etiquetas secundarias<input id="aTags" value="${esc(p.tags.join(", "))}"><span class="char-count">Máximo 5, separadas por coma.</span></label><button class="primary">Guardar como administrador</button></form>`);document.getElementById("adminEditForm").onsubmit=e=>{e.preventDefault();p.name=document.getElementById("aName").value.trim();p.primary=document.getElementById("aPrimary").value;p.bio=document.getElementById("aBio").value.trim();p.tags=document.getElementById("aTags").value.split(",").map(x=>x.trim()).filter(Boolean).slice(0,5);demoAdminPanel()}}

function contactModal(p){if(!state.loggedIn){accountModal(null,()=>contactModal(p));return}const sender=profiles.find(x=>x.id===state.currentUserId);openModal(`<div class="eyebrow">CONTACTO ENTRE PERFILES</div><h2>Contactar a ${esc(p.name)}</h2><p>Tu teléfono o email no se comparte automáticamente. El realizador recibirá una notificación indicando qué perfil quiere contactarlo y el mensaje que escribas.</p><form id="contactForm" class="form-grid"><label>Mensaje<textarea id="contactMessage" maxlength="500" required placeholder="Contale brevemente por qué querés contactarlo."></textarea><span class="char-count">Máximo 500 caracteres</span></label><div class="notice"><strong>Vista previa de la notificación:</strong><br><br><strong>${esc(sender.name)}</strong> (${esc(sender.primary)}) quiere contactarse con vos y dejó el siguiente mensaje.</div><button class="primary">Enviar solicitud de contacto</button></form>`);document.getElementById("contactForm").onsubmit=e=>{e.preventDefault();openModal(`<div class="eyebrow">DEMO DE CONTACTO</div><h2>Solicitud enviada</h2><p>En la versión real, esta notificación se enviaría al ${p.contactType==="whatsapp"?"WhatsApp":"email"} privado que ${esc(p.name)} configuró en su cuenta.</p><div class="notice"><strong>${esc(sender.name)}</strong> quiere contactarse con vos:<br><br>${esc(document.getElementById("contactMessage")?.value||"Mensaje enviado desde Red de Realizadores.")}</div><p><small>Este flujo queda en prueba; todavía no define si la implementación final usará email, WhatsApp o ambos.</small></p>`)}}
function renderJobs(){app.innerHTML=`<section class="jobs-hero wrap"><div class="eyebrow">BÚSQUEDAS / PROYECTOS</div><h1 class="page-title">Encontrá equipo.<br>Sumate a proyectos.</h1><p class="lead">Publicaciones activas por hasta 10 días. Participás directamente con tu perfil profesional.</p></section><section class="jobs-controls wrap"><div class="job-filters"><label class="check"><input id="jobStudentFilter" type="checkbox"> Estudiantiles</label><label class="check"><input id="jobPaidFilter" type="checkbox"> Remunerados</label></div><button id="newJobBtn" class="gold-btn">+ Publicar búsqueda</button></section><section class="jobs wrap"><div id="jobGrid" class="job-grid"></div></section>`;const js=document.getElementById("jobStudentFilter"),jp=document.getElementById("jobPaidFilter");const draw=()=>{const arr=jobs.filter(j=>(!js.checked||j.student)&&(!jp.checked||j.paid));document.getElementById("jobGrid").innerHTML=arr.map(jobCard).join("");document.querySelectorAll("[data-job]").forEach(x=>x.onclick=()=>jobModal(+x.dataset.job))};js.onchange=jp.onchange=draw;document.getElementById("newJobBtn").onclick=newJobModal;draw()}
function jobCard(j){return`<article class="job-card" data-job="${j.id}"><div class="job-meta"><span>BÚSQUEDA / ${String(j.id).padStart(3,"0")}</span><span>CADUCA EN ${j.days} DÍAS</span></div><h3>${esc(j.title)}</h3><p>${esc(j.description)}</p><div class="role-tags">${j.roles.map(r=>`<span class="tag">${esc(r)}</span>`).join("")}</div><div class="category-tags">${j.student?'<span class="tag red">ESTUDIANTIL</span>':''}${j.paid?'<span class="tag gold">REMUNERADO</span>':'<span class="tag">NO INDICA REMUNERACIÓN</span>'}</div><div class="job-bottom"><span>Publicado por <strong>${esc(j.author)}</strong></span><span>${j.participants.length} interesados</span></div></article>`}
function jobModal(id){const j=jobs.find(x=>x.id===id);openModal(`<div class="eyebrow">BÚSQUEDA / ${String(j.id).padStart(3,"0")}</div><h2>${esc(j.title)}</h2><div class="category-tags">${j.student?'<span class="tag red" style="color:#8e2732;border-color:#b78e94">PROYECTO ESTUDIANTIL</span>':''}${j.paid?'<span class="tag gold" style="color:#7b651f;border-color:#baa55e">REMUNERADO</span>':'<span class="tag" style="color:#59666c;border-color:#bbb">NO INDICA REMUNERACIÓN</span>'}</div><div class="profile-section"><h4>Roles buscados</h4><div class="role-tags">${j.roles.map(r=>`<span class="pill on" style="color:#6d5a19;border-color:#c5ae62">${esc(r)}</span>`).join("")}</div></div><div class="profile-section"><h4>Descripción</h4><p>${esc(j.description)}</p></div><div class="profile-section"><h4>Publicación</h4><p>Publicó <strong>${esc(j.author)}</strong> · caduca en <strong>${j.days} días</strong>.</p><button id="participateBtn" class="primary gold">Participar con mi perfil</button></div><div class="profile-section"><h4>Perfiles interesados</h4><div class="participants">${j.participants.map(id=>participantHtml(profiles.find(p=>p.id===id))).join("")}</div></div>`,true);document.getElementById("participateBtn").onclick=()=>participate(j);document.querySelectorAll("[data-reel-profile]").forEach(b=>b.onclick=e=>{e.stopPropagation();profileModal(+b.dataset.reelProfile)})}
function participantHtml(p){return`<div class="participant"><strong>${esc(p.name)} ${p.verified?verifiedBadge(false):""}</strong><span>${esc(p.primary)}</span><button data-reel-profile="${p.id}">${p.primary==="Guion"?"Ver material":"▶ Ver reel"}</button></div>`}
function participate(j){if(!state.loggedIn){accountModal(null,()=>participate(j));return}if(!j.participants.includes(state.currentUserId))j.participants.push(state.currentUserId);jobModal(j.id)}
function newJobModal(){if(!state.loggedIn){accountModal(null,newJobModal);return}openModal(`<div class="eyebrow">PUBLICAR BÚSQUEDA</div><h2>Nueva búsqueda</h2><form id="jobForm" class="form-grid"><label>Título<input id="jobTitle" required maxlength="80" placeholder="Ej: Buscamos DF para cortometraje"></label><div class="field"><label>¿Qué roles buscás? <small>(máximo 3)</small></label><div class="role-checks" id="roleChecks">${roles.map(r=>`<label><input type="checkbox" value="${esc(r)}"> ${esc(r)}</label>`).join("")}</div><div id="roleLimit" class="char-count">0 / 3 roles</div></div><label>Descripción<textarea id="jobDescription" maxlength="800" required></textarea><span id="jobDescCount" class="char-count">0 / 800</span></label><label>Caducidad<select id="jobExpiry">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===6?"selected":""}>${i+1} día${i?"s":""}</option>`).join("")}</select></label><div class="field"><label>Categorías</label><div class="modal-checks"><label class="check"><input id="newStudent" type="checkbox"> Proyecto estudiantil</label><label class="check"><input id="newPaid" type="checkbox"> Remunerado</label></div></div><button class="primary gold">Publicar búsqueda</button></form>`);const checks=[...document.querySelectorAll("#roleChecks input")],limit=document.getElementById("roleLimit");checks.forEach(c=>c.onchange=()=>{const selected=checks.filter(x=>x.checked);if(selected.length>3)c.checked=false;limit.textContent=`${checks.filter(x=>x.checked).length} / 3 roles`});const ta=document.getElementById("jobDescription");ta.oninput=()=>document.getElementById("jobDescCount").textContent=`${ta.value.length} / 800`;document.getElementById("jobForm").onsubmit=e=>{e.preventDefault();const selected=checks.filter(x=>x.checked).map(x=>x.value);if(!selected.length){limit.textContent="Elegí al menos 1 rol";return}jobs.unshift({id:Math.max(...jobs.map(j=>j.id))+1,title:document.getElementById("jobTitle").value,roles:selected,description:ta.value,student:document.getElementById("newStudent").checked,paid:document.getElementById("newPaid").checked,days:+document.getElementById("jobExpiry").value,author:profiles.find(p=>p.id===state.currentUserId).name,participants:[]});closeModal();location.hash="#busquedas";renderJobs()}}
function renderResources(){app.innerHTML=`<section class="simple-page narrow"><div class="eyebrow">RECURSOS / RR</div><h1 class="page-title">Material útil<br>para realizar.</h1><p class="lead">Una biblioteca práctica para preproducción, rodaje y trabajo colaborativo.</p><div class="resource-grid"><article><span>01</span><h3>Checklist de rodaje</h3><p>Equipo, permisos, continuidad y necesidades antes de filmar.</p><button class="text-btn">Ver recurso →</button></article><article><span>02</span><h3>Plan de rodaje</h3><p>Modelo base para organizar jornadas, escenas y necesidades técnicas.</p><button class="text-btn">Ver recurso →</button></article><article><span>03</span><h3>Guía de casting</h3><p>Cómo armar una convocatoria clara y profesional.</p><button class="text-btn">Ver recurso →</button></article><article><span>04</span><h3>Breakdown de guion</h3><p>Plantilla inicial para desglosar necesidades por escena.</p><button class="text-btn">Ver recurso →</button></article></div></section>`}
function renderTraining(){app.innerHTML=`<section class="training"><div class="training-shell"><div class="training-brand"><div><img src="assets/cordoba-casting-white.png" alt="Córdoba Casting"><h1 class="page-title">Formación<br>audiovisual.</h1><p>Cursos, talleres y experiencias para seguir formando profesionales frente y detrás de cámara.</p></div><small>FORMACIÓN AUDIOVISUAL · CÓRDOBA</small></div><div class="training-content"><div class="eyebrow">FORMACIÓN · CÓRDOBA CASTING</div><h2>Nuestras Propuestas</h2><p>Formación para seguir desarrollando herramientas, ampliar tu práctica y crecer dentro de la industria audiovisual.</p><div class="course-list"><article class="course"><div><span class="course-tag">CURSO</span><h3>Dirección actoral para cámara</h3><p>Herramientas prácticas para dirigir intérpretes y escenas audiovisuales.</p></div><button class="outline">Más información</button></article><article class="course"><div><span class="course-tag">TALLER</span><h3>Taller de escenas</h3><p>Ensayo, práctica frente a cámara y filmación de material.</p></div><button class="outline">Más información</button></article></div></div></div></section>`}
function demoAccountModal(tab="login",afterLogin=null){openModal(`<div class="eyebrow">MI CUENTA</div><h2>${state.loggedIn?"Cuenta y perfil":"Ingresar a la red"}</h2>${state.loggedIn?`<div class="account-tabs"><button class="active">Mi perfil</button><button id="passwordTab">Contraseña</button></div><div id="accountPanel">${demoProfileEditHtml()}</div>`:`<div class="notice">Prototipo: usá el acceso demo para probar edición, recomendaciones, búsquedas y postulaciones.</div><form id="loginForm" class="form-grid" style="margin-top:16px"><label>Email<input type="email" value="demo@redrealizadores.com"></label><label>Contraseña<input type="password" value="demo123"></label><button class="primary gold">Ingresar demo</button></form><button id="adminAccessBtn" class="outline" style="margin-top:10px">Acceso administrador demo</button>`}`);if(!state.loggedIn){document.getElementById("adminAccessBtn").onclick=adminPanel;document.getElementById("loginForm").onsubmit=e=>{e.preventDefault();state.loggedIn=true;accountBtn.textContent="Mi cuenta";closeModal();if(afterLogin)afterLogin()}}else{document.getElementById("passwordTab").onclick=demoPasswordPanel;demoBindProfileEdit()}}
function demoProfileEditHtml(){const p=profiles.find(x=>x.id===state.currentUserId);return`<form id="profileEdit" class="form-grid"><label>Nombre<input id="editName" value="${esc(p.name)}"></label><label>Rol principal<select id="editPrimary">${roles.map(r=>`<option ${r===p.primary?"selected":""}>${r}</option>`).join("")}</select></label><div class="field"><label>Otros roles / palabras clave <small>(máximo 5)</small></label><div class="tag-editor"><input id="tagInput" maxlength="30" placeholder="Ej: Guion, Blender, DaVinci…"><button id="addTagBtn" type="button">Agregar</button></div><div id="tagPreview" class="tag-preview"></div><div id="tagCount" class="char-count">${p.tags.length} / 5 etiquetas</div></div><label>Descripción breve<textarea id="editBio" maxlength="350">${esc(p.bio)}</textarea><span class="char-count">Máximo 350 caracteres</span></label><div id="materialFields"></div><div class="modal-checks"><label class="check"><input id="editAvailable" type="checkbox" ${p.available?"checked":""}> Disponible actualmente</label><label class="check"><input id="editStudents" type="checkbox" ${p.students?"checked":""}> Acepta estudiantiles</label></div><div class="conditional-box"><h5>Contacto privado</h5><p>Elegí un único medio de contacto. Este dato nunca se muestra públicamente.</p><label>Canal<select id="editContactType"><option value="email" ${p.contactType==="email"?"selected":""}>Email</option><option value="whatsapp" ${p.contactType==="whatsapp"?"selected":""}>WhatsApp</option></select></label><label>Dato de contacto<input id="editContactValue" value="${esc(p.contactValue||"")}" placeholder="tu@email.com o +54..."></label></div>${p.verified?`<div class="notice">${verifiedBadge(true)} Este perfil está verificado por Córdoba Casting. La verificación solo puede ser administrada por el equipo.</div>`:""}<button class="primary">Guardar cambios</button></form>`}
function demoBindProfileEdit(){const p=profiles.find(x=>x.id===state.currentUserId),form=document.getElementById("profileEdit"),primary=document.getElementById("editPrimary");if(!form)return;let tags=[...p.tags],pendingPdfName=p.scriptPdfName,pendingPdfUrl=p.scriptPdfUrl;const renderTags=()=>{document.getElementById("tagPreview").innerHTML=tags.map((t,i)=>`<span class="edit-tag">${esc(t)} <button type="button" data-remove-tag="${i}">×</button></span>`).join("");document.getElementById("tagCount").textContent=`${tags.length} / 5 etiquetas`;document.querySelectorAll("[data-remove-tag]").forEach(b=>b.onclick=()=>{tags.splice(+b.dataset.removeTag,1);renderTags()})};const addTag=()=>{const input=document.getElementById("tagInput"),v=input.value.trim();if(!v||tags.length>=5)return;if(!tags.some(t=>t.toLowerCase()===v.toLowerCase()))tags.push(v);input.value="";renderTags()};document.getElementById("addTagBtn").onclick=addTag;document.getElementById("tagInput").onkeydown=e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();addTag()}};const material=()=>{const writer=primary.value==="Guion";document.getElementById("materialFields").innerHTML=writer?`<div class="conditional-box"><h5>Muestra de guion · PDF</h5><p>Como tu rol principal es Guion, el video queda deshabilitado. Podés cargar un único PDF.</p><input id="editPdf" type="file" accept="application/pdf"><div id="pdfCurrent" class="char-count">${pendingPdfName?`Actual: ${esc(pendingPdfName)}`:"Sin PDF cargado"}</div></div>`:`<label>Reel / video único<input id="editReel" value="${esc(p.reel)}"><span class="char-count">Solo YouTube o Vimeo. Un único video.</span></label>`;const pdf=document.getElementById("editPdf");if(pdf)pdf.onchange=()=>{const file=pdf.files[0];if(!file)return;if(file.type!=="application/pdf"){alert("El archivo debe ser PDF.");pdf.value="";return}if(pendingPdfUrl&&pendingPdfUrl.startsWith("blob:"))URL.revokeObjectURL(pendingPdfUrl);pendingPdfName=file.name;pendingPdfUrl=URL.createObjectURL(file);document.getElementById("pdfCurrent").textContent=`Listo para guardar: ${file.name}`}};primary.onchange=material;renderTags();material();form.onsubmit=e=>{e.preventDefault();const writer=primary.value==="Guion";if(!writer){const url=document.getElementById("editReel").value;if(!embedUrl(url)){alert("El reel debe ser un link válido de YouTube o Vimeo.");return}p.reel=url;p.scriptPdfName="";p.scriptPdfUrl=""}else{p.reel="";p.scriptPdfName=pendingPdfName;p.scriptPdfUrl=pendingPdfUrl}p.name=document.getElementById("editName").value;p.primary=primary.value;p.tags=tags.slice(0,5);p.bio=document.getElementById("editBio").value;p.available=document.getElementById("editAvailable").checked;p.students=document.getElementById("editStudents").checked;p.contactType=document.getElementById("editContactType").value;p.contactValue=document.getElementById("editContactValue").value.trim();p.updated="19 ago 2026";closeModal();if(state.route==="realizadores")renderDirectory()}}
function demoPasswordPanel(){document.getElementById("accountPanel").innerHTML=`<form id="passwordForm" class="form-grid"><label>Contraseña actual<input type="password" required></label><label>Nueva contraseña<input type="password" minlength="8" required></label><label>Repetir nueva contraseña<input type="password" minlength="8" required></label><button class="primary">Cambiar contraseña</button></form>`;document.getElementById("passwordForm").onsubmit=e=>{e.preventDefault();openModal(`<h2>Contraseña actualizada</h2><p>En la versión conectada, este cambio se hará mediante Supabase Auth.</p>`)}}

// =========================================================
// SUPABASE REAL — FASE 1
// =========================================================

async function loadRealRoles(){
  const {data,error}=await sb.from("roles").select("id,name,sort_order").eq("active",true).order("sort_order");
  if(error){console.error("roles",error);return}
  realState.roles=data||[];
}

async function loadRealAccount(){
  const {data:{session}}=await sb.auth.getSession();
  realState.session=session||null;
  realState.user=session?.user||null;
  realState.isAdmin=false;
  realState.profile=null; realState.privateProfile=null; realState.moderation=null; realState.tags=[];
  if(!realState.user){updateRealAccountButton();return}

  const uid=realState.user.id;
  const [p,pr,m,t,ur]=await Promise.all([
    sb.from("profiles").select("*, roles:primary_role_id(id,name)").eq("id",uid).maybeSingle(),
    sb.from("profile_private").select("*").eq("profile_id",uid).maybeSingle(),
    sb.from("profile_moderation").select("*").eq("profile_id",uid).maybeSingle(),
    sb.from("profile_tags").select("id,tag").eq("profile_id",uid).order("id"),
    sb.from("user_roles").select("role").eq("user_id",uid).maybeSingle()
  ]);
  if(p.error) console.error("profile",p.error);
  if(pr.error) console.error("private",pr.error);
  if(m.error) console.error("moderation",m.error);
  if(t.error) console.error("tags",t.error);
  if(ur.error) console.error("role",ur.error);
  realState.profile=p.data||null;
  realState.privateProfile=pr.data||null;
  realState.moderation=m.data||null;
  realState.tags=(t.data||[]).map(x=>x.tag);
  realState.isAdmin=ur.data?.role==="admin";
  updateRealAccountButton();
}

function updateRealAccountButton(){
  if(!realState.user){accountBtn.textContent="Ingresar";return}
  accountBtn.textContent=realState.isAdmin?"Administrar":"Mi cuenta";
}

function authNotice(message,type=""){
  return `<div class="notice ${type}">${esc(message)}</div>`;
}

function realAccountModal(){
  if(!realState.user){return realAuthModal("login")}
  if(realState.isAdmin){return realAdminPanel()}
  return realProfileModal();
}

function realAuthModal(mode="login"){
  const register=mode==="register";
  openModal(`<div class="eyebrow">RED DE REALIZADORES / CUENTA</div>
    <h2>${register?"Crear perfil":"Ingresar"}</h2>
    <p>${register?"Creá tu cuenta. Tu perfil no se publicará hasta que Córdoba Casting lo apruebe.":"Ingresá para editar tu perfil profesional."}</p>
    <form id="realAuthForm" class="form-grid">
      ${register?`<label>Nombre completo<input id="authName" maxlength="100" required></label>`:""}
      <label>Email<input id="authEmail" type="email" required autocomplete="email"></label>
      <label>Contraseña<input id="authPassword" type="password" minlength="8" required autocomplete="${register?"new-password":"current-password"}"></label>
      ${register?`<label>Repetir contraseña<input id="authPassword2" type="password" minlength="8" required></label>`:""}
      <button class="primary gold">${register?"Crear cuenta":"Ingresar"}</button>
      <div id="authFeedback"></div>
    </form>
    <button id="switchAuthMode" class="outline" style="margin-top:10px">${register?"Ya tengo cuenta":"Crear mi perfil"}</button>`);
  document.getElementById("switchAuthMode").onclick=()=>realAuthModal(register?"login":"register");
  document.getElementById("realAuthForm").onsubmit=async e=>{
    e.preventDefault();
    const feedback=document.getElementById("authFeedback");
    const email=document.getElementById("authEmail").value.trim();
    const password=document.getElementById("authPassword").value;
    feedback.innerHTML=authNotice("Procesando…");
    if(register){
      const p2=document.getElementById("authPassword2").value;
      if(password!==p2){feedback.innerHTML=authNotice("Las contraseñas no coinciden.");return}
      const full_name=document.getElementById("authName").value.trim();
      const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name}}});
      if(error){feedback.innerHTML=authNotice(error.message);return}
      if(!data.session){
        feedback.innerHTML=authNotice("Cuenta creada. Revisá tu email para confirmar la cuenta y después ingresá.");
        return;
      }
    }else{
      const {error}=await sb.auth.signInWithPassword({email,password});
      if(error){feedback.innerHTML=authNotice(error.message);return}
    }
    await loadRealAccount();
    closeModal();
    realAccountModal();
  };
}

function profileStatusCopy(){
  const p=realState.profile,m=realState.moderation;
  if(!p)return "";
  if(p.status==="draft") return authNotice("BORRADOR · Completá tu perfil y envialo a revisión.");
  if(p.status==="pending") return authNotice("PENDIENTE · Córdoba Casting está revisando tu perfil.");
  if(p.status==="rejected") return authNotice(`RECHAZADO · ${m?.rejection_reason?esc(m.rejection_reason):"Revisá el perfil y volvé a enviarlo."}`);
  if(p.status==="approved") return authNotice(`${p.is_visible?"PUBLICADO":"APROBADO, OCULTO"}${p.verified?" · VERIFICADO POR CÓRDOBA CASTING":""}`);
  return "";
}

function realProfileFormHtml(){
  const p=realState.profile||{}, priv=realState.privateProfile||{}, roleName=p.roles?.name||"";
  return `<div class="account-tabs">
      <button id="realProfileTab" class="active">Mi perfil</button>
      <button id="realPasswordTab">Contraseña</button>
      <button id="realLogoutBtn">Salir</button>
    </div>
    ${profileStatusCopy()}
    <form id="realProfileForm" class="form-grid" style="margin-top:16px">
      <label>Nombre<input id="realName" maxlength="100" required value="${esc(p.full_name||"")}"></label>
      <label>Rol principal
        <select id="realPrimaryRole" required>
          <option value="">Elegir rol</option>
          ${realState.roles.map(r=>`<option value="${r.id}" ${Number(p.primary_role_id)===Number(r.id)?"selected":""}>${esc(r.name)}</option>`).join("")}
        </select>
      </label>
      <div class="field">
        <label>Otros roles / palabras clave <small>(máximo 5)</small></label>
        <div class="tag-editor"><input id="realTagInput" maxlength="30" placeholder="Ej: Blender, Guion, DaVinci…"><button id="realAddTag" type="button">Agregar</button></div>
        <div id="realTagPreview" class="tag-preview"></div>
        <div id="realTagCount" class="char-count">${realState.tags.length} / 5 etiquetas</div>
      </div>
      <label>Descripción breve<textarea id="realBio" maxlength="350" required>${esc(p.bio||"")}</textarea><span class="char-count">Máximo 350 caracteres</span></label>
      <div id="realMaterialFields"></div>
      <div class="modal-checks">
        <label class="check"><input id="realAvailable" type="checkbox" ${p.available?"checked":""}> Disponible actualmente</label>
        <label class="check"><input id="realStudents" type="checkbox" ${p.accepts_student_projects?"checked":""}> Acepta estudiantiles</label>
      </div>
      <div class="conditional-box">
        <h5>Contacto privado</h5>
        <p>Este dato nunca se muestra públicamente.</p>
        <label>Canal<select id="realContactType"><option value="email" ${priv.contact_type==="email"?"selected":""}>Email</option><option value="whatsapp" ${priv.contact_type==="whatsapp"?"selected":""}>WhatsApp</option></select></label>
        <label>Dato de contacto<input id="realContactValue" maxlength="200" value="${esc(priv.contact_value||"")}" required placeholder="tu@email.com o +54..."></label>
      </div>
      <div class="profile-actions">
        <button class="primary">Guardar cambios</button>
        ${(p.status==="draft"||p.status==="rejected")?`<button id="realSubmitReview" type="button" class="primary gold">Enviar a revisión</button>`:""}
      </div>
      <div id="profileFeedback"></div>
    </form>`;
}

function realProfileModal(){
  openModal(`<div class="eyebrow">MI CUENTA</div><h2>Mi perfil profesional</h2><div id="realAccountPanel">${realProfileFormHtml()}</div>`,true);
  bindRealProfile();
}

function bindRealProfile(){
  const p=realState.profile;
  if(!p)return;
  document.getElementById("realLogoutBtn").onclick=realLogout;
  document.getElementById("realPasswordTab").onclick=realPasswordPanel;

  let tags=[...realState.tags];
  const preview=document.getElementById("realTagPreview"),count=document.getElementById("realTagCount");
  const drawTags=()=>{
    preview.innerHTML=tags.map((t,i)=>`<span class="edit-tag">${esc(t)} <button type="button" data-real-remove-tag="${i}">×</button></span>`).join("");
    count.textContent=`${tags.length} / 5 etiquetas`;
    document.querySelectorAll("[data-real-remove-tag]").forEach(b=>b.onclick=()=>{tags.splice(+b.dataset.realRemoveTag,1);drawTags()});
  };
  const addTag=()=>{
    const input=document.getElementById("realTagInput"),v=input.value.trim();
    if(!v||tags.length>=5)return;
    if(!tags.some(t=>t.toLowerCase()===v.toLowerCase()))tags.push(v);
    input.value="";drawTags();
  };
  document.getElementById("realAddTag").onclick=addTag;
  document.getElementById("realTagInput").onkeydown=e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();addTag()}};

  const roleSelect=document.getElementById("realPrimaryRole");
  const renderMaterial=()=>{
    const role=realState.roles.find(r=>String(r.id)===String(roleSelect.value))?.name;
    document.getElementById("realMaterialFields").innerHTML=role==="Guion"
      ? `<div class="conditional-box"><h5>Muestra de guion · PDF</h5><p>Solo para Guion como rol principal. Se guarda un único PDF.</p><input id="realScriptFile" type="file" accept="application/pdf"><small>${p.script_pdf_path?"PDF cargado. Podés reemplazarlo.":"Sin PDF cargado."}</small></div>`
      : `<label>Reel / video único<input id="realReel" value="${esc(p.reel_url||"")}" placeholder="https://youtube.com/..."><span class="char-count">Solo YouTube o Vimeo.</span></label>`;
  };
  roleSelect.onchange=renderMaterial; drawTags(); renderMaterial();

  document.getElementById("realProfileForm").onsubmit=async e=>{
    e.preventDefault();
    const fb=document.getElementById("profileFeedback");
    fb.innerHTML=authNotice("Guardando…");
    const role=realState.roles.find(r=>String(r.id)===String(roleSelect.value))?.name;
    const reel=role==="Guion"?null:document.getElementById("realReel").value.trim()||null;
    if(reel && !embedUrl(reel)){fb.innerHTML=authNotice("El reel debe ser un enlace válido de YouTube o Vimeo.");return}

    const {error:pe}=await sb.from("profiles").update({
      full_name:document.getElementById("realName").value.trim(),
      primary_role_id:Number(roleSelect.value),
      bio:document.getElementById("realBio").value.trim(),
      available:document.getElementById("realAvailable").checked,
      accepts_student_projects:document.getElementById("realStudents").checked,
      reel_url:reel,
      profile_updated_at:new Date().toISOString()
    }).eq("id",realState.user.id);
    if(pe){fb.innerHTML=authNotice(pe.message);return}

    const {error:pr}=await sb.from("profile_private").update({
      contact_type:document.getElementById("realContactType").value,
      contact_value:document.getElementById("realContactValue").value.trim()
    }).eq("profile_id",realState.user.id);
    if(pr){fb.innerHTML=authNotice(pr.message);return}

    const {error:del}=await sb.from("profile_tags").delete().eq("profile_id",realState.user.id);
    if(del){fb.innerHTML=authNotice(del.message);return}
    if(tags.length){
      const {error:ins}=await sb.from("profile_tags").insert(tags.map(tag=>({profile_id:realState.user.id,tag})));
      if(ins){fb.innerHTML=authNotice(ins.message);return}
    }

    if(role==="Guion"){
      const file=document.getElementById("realScriptFile")?.files?.[0];
      if(file){
        if(file.type!=="application/pdf"){fb.innerHTML=authNotice("La muestra debe ser PDF.");return}
        if(file.size>10*1024*1024){fb.innerHTML=authNotice("El PDF supera los 10 MB.");return}
        const path=`${realState.user.id}/script.pdf`;
        const {error:up}=await sb.storage.from("scripts").upload(path,file,{upsert:true,contentType:"application/pdf"});
        if(up){fb.innerHTML=authNotice(up.message);return}
        const {error:rpc}=await sb.rpc("set_my_script_pdf_path");
        if(rpc){fb.innerHTML=authNotice(rpc.message);return}
      }
    }else if(p.script_pdf_path){
      await sb.storage.from("scripts").remove([`${realState.user.id}/script.pdf`]);
      await sb.rpc("clear_my_script_pdf_path");
    }

    await loadRealAccount();
    realProfileModal();
  };

  const submit=document.getElementById("realSubmitReview");
  if(submit)submit.onclick=async()=>{
    const fb=document.getElementById("profileFeedback");
    fb.innerHTML=authNotice("Enviando a revisión…");
    const {error}=await sb.rpc("submit_profile_for_review");
    if(error){fb.innerHTML=authNotice(error.message);return}
    await loadRealAccount(); realProfileModal();
  };
}

function realPasswordPanel(){
  document.getElementById("realAccountPanel").innerHTML=`<div class="account-tabs"><button id="backProfile">Mi perfil</button><button class="active">Contraseña</button><button id="realLogoutBtn2">Salir</button></div><form id="realPasswordForm" class="form-grid" style="margin-top:16px"><label>Nueva contraseña<input id="newRealPassword" type="password" minlength="8" required></label><label>Repetir contraseña<input id="newRealPassword2" type="password" minlength="8" required></label><button class="primary">Cambiar contraseña</button><div id="passwordFeedback"></div></form>`;
  document.getElementById("backProfile").onclick=()=>{document.getElementById("realAccountPanel").innerHTML=realProfileFormHtml();bindRealProfile()};
  document.getElementById("realLogoutBtn2").onclick=realLogout;
  document.getElementById("realPasswordForm").onsubmit=async e=>{
    e.preventDefault();
    const a=document.getElementById("newRealPassword").value,b=document.getElementById("newRealPassword2").value,fb=document.getElementById("passwordFeedback");
    if(a!==b){fb.innerHTML=authNotice("Las contraseñas no coinciden.");return}
    const {error}=await sb.auth.updateUser({password:a});
    fb.innerHTML=error?authNotice(error.message):authNotice("Contraseña actualizada correctamente.");
  };
}

async function realLogout(){
  await sb.auth.signOut();
  await loadRealAccount();
  closeModal();
}

async function realAdminPanel(){
  openModal(`<div class="eyebrow">CÓRDOBA CASTING / ADMIN REAL</div><h2>Gestión de perfiles</h2><p>Esta vista ya consulta tu proyecto Supabase real.</p><div class="admin-toolbar"><button data-real-admin-filter="pending">Pendientes</button><button data-real-admin-filter="approved">Publicados</button><button data-real-admin-filter="rejected">Rechazados</button><button data-real-admin-filter="all">Todos</button><button id="realAdminLogout">Salir</button></div><div id="realAdminList" class="admin-panel">${authNotice("Cargando…")}</div>`,true);
  document.getElementById("realAdminLogout").onclick=realLogout;
  document.querySelectorAll("[data-real-admin-filter]").forEach(b=>b.onclick=()=>drawRealAdmin(b.dataset.realAdminFilter));
  await drawRealAdmin("pending");
}

async function drawRealAdmin(filter){
  let query=sb.from("profiles").select("*, roles:primary_role_id(name), profile_moderation(rejection_reason,submitted_at,reviewed_at), profile_tags(tag)").order("created_at",{ascending:false});
  if(filter!=="all")query=query.eq("status",filter);
  const {data,error}=await query;
  const list=document.getElementById("realAdminList");
  if(error){list.innerHTML=authNotice(error.message);return}
  list.innerHTML=(data||[]).map(p=>`<div class="admin-row"><div><h4>${esc(p.full_name||"(Sin nombre)")} ${p.verified?verifiedBadge(false):""}</h4><div class="secondary">${esc(p.roles?.name||"Sin rol")} · ${(p.profile_tags||[]).map(t=>esc(t.tag)).join(" · ")}</div><small>Estado: ${String(p.status).toUpperCase()} · ${p.is_visible?"VISIBLE":"OCULTO"}${p.profile_moderation?.[0]?.rejection_reason?` · ${esc(p.profile_moderation[0].rejection_reason)}`:""}</small></div><div class="admin-actions"><button data-real-review="${p.id}">Ver completo</button>${p.status!=="approved"?`<button data-real-approve="${p.id}">Aprobar</button><button data-real-approve-verify="${p.id}">Aprobar + verificar</button>`:""}${p.status!=="rejected"?`<button data-real-reject="${p.id}">Rechazar</button>`:""}${p.status==="approved"?`<button data-real-verify="${p.id}" data-value="${p.verified?"false":"true"}">${p.verified?"Quitar verificación":"Verificar"}</button><button data-real-visible="${p.id}" data-value="${p.is_visible?"false":"true"}">${p.is_visible?"Ocultar":"Mostrar"}</button>`:""}</div></div>`).join("")||"<p>No hay perfiles en esta categoría.</p>";
  bindRealAdminActions(filter);
}

function bindRealAdminActions(filter){
  document.querySelectorAll("[data-real-review]").forEach(b=>b.onclick=()=>realAdminPreview(b.dataset.realReview));
  document.querySelectorAll("[data-real-approve]").forEach(b=>b.onclick=async()=>{const {error}=await sb.rpc("admin_approve_profile",{target_profile:b.dataset.realApprove,make_verified:false});if(error)alert(error.message);else drawRealAdmin(filter)});
  document.querySelectorAll("[data-real-approve-verify]").forEach(b=>b.onclick=async()=>{const {error}=await sb.rpc("admin_approve_profile",{target_profile:b.dataset.realApproveVerify,make_verified:true});if(error)alert(error.message);else drawRealAdmin(filter)});
  document.querySelectorAll("[data-real-reject]").forEach(b=>b.onclick=async()=>{const reason=prompt("Motivo de rechazo:");if(!reason)return;const {error}=await sb.rpc("admin_reject_profile",{target_profile:b.dataset.realReject,reason});if(error)alert(error.message);else drawRealAdmin(filter)});
  document.querySelectorAll("[data-real-verify]").forEach(b=>b.onclick=async()=>{const {error}=await sb.rpc("admin_set_verified",{target_profile:b.dataset.realVerify,value:b.dataset.value==="true"});if(error)alert(error.message);else drawRealAdmin(filter)});
  document.querySelectorAll("[data-real-visible]").forEach(b=>b.onclick=async()=>{const {error}=await sb.rpc("admin_set_visibility",{target_profile:b.dataset.realVisible,value:b.dataset.value==="true"});if(error)alert(error.message);else drawRealAdmin(filter)});
}

async function realAdminPreview(id){
  const [p,priv,mod,tags]=await Promise.all([
    sb.from("profiles").select("*, roles:primary_role_id(name)").eq("id",id).single(),
    sb.from("profile_private").select("*").eq("profile_id",id).maybeSingle(),
    sb.from("profile_moderation").select("*").eq("profile_id",id).maybeSingle(),
    sb.from("profile_tags").select("tag").eq("profile_id",id)
  ]);
  if(p.error){alert(p.error.message);return}
  const x=p.data,embed=embedUrl(x.reel_url);
  openModal(`<div class="eyebrow">REVISIÓN ADMINISTRATIVA REAL</div><div class="profile-top"><div class="profile-avatar">${initials(x.full_name||"RR")}</div><div><div class="profile-role">${esc(x.roles?.name||"Sin rol")}</div><div class="profile-name">${esc(x.full_name||"(Sin nombre)")}</div><div class="secondary">${(tags.data||[]).map(t=>esc(t.tag)).join(" · ")}</div></div><div class="profile-score"><strong>${String(x.status).toUpperCase()}</strong>${x.is_visible?"VISIBLE":"OCULTO"}</div></div><div class="profile-section"><h4>Descripción</h4><p>${esc(x.bio||"Sin descripción")}</p></div>${x.roles?.name==="Guion"?`<div class="profile-section"><h4>Muestra de guion</h4><p>${x.script_pdf_path?"PDF cargado en Storage privado.":"Sin PDF cargado."}</p></div>`:`<div class="profile-section"><h4>Reel</h4>${embed?`<div class="video-card"><iframe src="${embed}" allowfullscreen></iframe></div>`:"<p>Sin reel válido.</p>"}</div>`}<div class="profile-section"><h4>Contacto privado</h4><p>${esc(priv.data?.contact_type||"—")}: <strong>${esc(priv.data?.contact_value||"—")}</strong></p></div>${mod.data?.rejection_reason?authNotice(`Motivo anterior: ${mod.data.rejection_reason}`):""}<div class="profile-actions"><button id="backRealAdmin" class="outline">Volver</button></div>`,true);
  document.getElementById("backRealAdmin").onclick=realAdminPanel;
}

async function bootstrapReal(){
  await loadRealRoles();
  await loadRealAccount();
  sb.auth.onAuthStateChange(async()=>{await loadRealAccount()});
  route();
}

bootstrapReal();
