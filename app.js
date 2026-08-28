const roles=["Dirección","Guion","Dirección de Fotografía","Cámara","Dirección de Arte","Producción","Sonido","Montaje / Edición","Color","VFX / Motion Graphics","Música"];
const cameraIcon=`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 10l5-3v10l-5-3z"/><path d="M7 7l1.5-2h4L14 7"/></svg>`;
const appState={route:"realizadores"};
const initialAuthHash=window.location.hash||"";
let passwordRecoveryIntent=(()=>{
  try{
    const query=new URLSearchParams(window.location.search);
    if(query.get("recovery")==="1")return true;

    const raw=initialAuthHash.startsWith("#")?initialAuthHash.slice(1):initialAuthHash;
    const params=new URLSearchParams(raw);
    return params.get("type")==="recovery" || initialAuthHash==="#recuperar-clave";
  }catch(e){
    return window.location.search.includes("recovery=1")
      || initialAuthHash.includes("type=recovery")
      || initialAuthHash==="#recuperar-clave";
  }
})();
let profiles=[];
let resourcesCache=[];
const app=document.getElementById("app"),modal=document.getElementById("modal"),backdrop=document.getElementById("modalBackdrop"),modalContent=document.getElementById("modalContent"),accountBtn=document.getElementById("openAccountBtn");
const adminNavLink=document.getElementById("adminNavLink");
const notificationsBtn=document.getElementById("notificationsBtn");
const notificationCount=document.getElementById("notificationCount");

const realState={session:null,user:null,isAdmin:false,profile:null,privateProfile:null,moderation:null,tags:[],roles:[],notifications:[]};

const esc=s=>String(s??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const initials=n=>n.split(" ").map(x=>x[0]).slice(0,2).join("");
function embedUrl(url){try{const u=new URL(url);if(u.hostname.includes("youtube.com")){const id=u.searchParams.get("v");return id?`https://www.youtube-nocookie.com/embed/${id}?rel=0`:null}if(u.hostname==="youtu.be")return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}?rel=0`;if(u.hostname.includes("vimeo.com")){const id=u.pathname.split("/").filter(Boolean)[0];return /^\d+$/.test(id||"")?`https://player.vimeo.com/video/${id}`:null}}catch(e){}return null}
function verifiedBadge(label=true){return`<span class="verified" title="Perfil verificado por Córdoba Casting">${cameraIcon}${label?"VERIFICADO":""}</span>`}
function topBadge(p){return p.isTopRecommended?`<span class="top-badge">★ MUY RECOMENDADO</span>`:""}
function openModal(html,wide=false){modalContent.innerHTML=html;modal.classList.toggle("wide",wide);modal.classList.remove("hidden");backdrop.classList.remove("hidden")}
function closeModal(){
  modal.classList.add("hidden");backdrop.classList.add("hidden");modal.classList.remove("wide");
  if((location.hash||"").startsWith("#perfil/")) history.replaceState(null,"",`${location.pathname}#realizadores`);
}
document.getElementById("closeModalBtn").onclick=closeModal;backdrop.onclick=closeModal;accountBtn.onclick=()=>realAccountModal();
if(notificationsBtn)notificationsBtn.onclick=notificationsModal;window.addEventListener("hashchange",route);document.querySelectorAll("[data-route]").forEach(a=>a.addEventListener("click",()=>{}));
async function route(){
  const raw=(location.hash||"#realizadores").slice(1);
  if(raw.startsWith("perfil/")){
    appState.route="realizadores";
    const id=decodeURIComponent(raw.slice("perfil/".length));
    await renderProfilePage(id);
    return;
  }
  if(raw.startsWith("recurso/")){
    appState.route="recursos";
    const id=Number(decodeURIComponent(raw.slice("recurso/".length)));
    await renderResourceDetail(id);
    return;
  }
  if(raw==="recuperar-clave" || passwordRecoveryIntent){
    appState.route="realizadores";
    renderDirectory();
    if(passwordRecoveryIntent){
      enterRecoveryMode();
    }
    return;
  }
  appState.route=raw;
  document.title="Red de Realizadores — Córdoba Casting";
  const renderer={realizadores:renderDirectory,busquedas:renderJobs,recursos:renderResources,formacion:renderTraining,administracion:renderAdministration}[raw]||renderDirectory;
  await renderer();
}
function matchRank(p,q,roleFilter){let rank=0;const qq=q.trim().toLowerCase();if(roleFilter){if(p.primary===roleFilter)rank+=120;else if(p.tags.some(t=>t.toLowerCase()===roleFilter.toLowerCase()))rank+=55;else return -1}if(!qq)return rank;const primary=p.primary.toLowerCase(),tags=p.tags.map(t=>t.toLowerCase()),name=p.name.toLowerCase(),bio=p.bio.toLowerCase();if(primary===qq)rank+=200;else if(primary.includes(qq))rank+=150;if(tags.some(t=>t===qq))rank+=100;else if(tags.some(t=>t.includes(qq)))rank+=75;if(name.includes(qq))rank+=60;if(bio.includes(qq))rank+=20;return rank||-1}
function renderDirectory(){app.innerHTML=`<section class="hero hero-cordoba hero-compact wrap">
  <div class="hero-copy">
    <div class="eyebrow">RED DE REALIZADORES · CÓRDOBA</div>
    <h1>El audiovisual cordobés,<br><span>conectado.</span></h1>
    <p>Encontrá realizadores, armá equipos y conectá con profesionales de distintas áreas del audiovisual en Córdoba.</p>
  </div>

  <aside class="hero-photo" aria-label="Rodaje audiovisual">
    <img src="assets/hero-filmset-cordoba.jpg" alt="Operador de cámara trabajando en un rodaje">
    <div class="hero-photo-fade"></div>
  </aside>
</section><section class="search-panel wrap"><div class="search-line"><label>BUSCAR POR NOMBRE, ROL, HERRAMIENTA O PALABRA CLAVE</label><input id="searchInput" placeholder="Ej: dirección, guion, Blender, DaVinci, sonido…"></div><div class="filter-row"><select id="roleFilter"><option value="">Todos los roles</option>${realState.roles.map(r=>`<option>${esc(r.name)}</option>`).join("")}</select><label class="check"><input id="availableFilter" type="checkbox"> Disponible ahora</label><label class="check"><input id="studentFilter" type="checkbox"> Acepta estudiantiles</label><label class="check"><input id="verifiedFilter" type="checkbox"> Solo verificados</label><select id="sortFilter"><option value="relevance">Orden: relevancia</option><option value="recommendations">Más recomendados</option><option value="recent">Actualizados recientemente</option><option value="name">Nombre A–Z</option></select><button id="clearFilters" class="clear-btn">Limpiar filtros</button></div></section><section class="directory wrap"><div class="section-head"><div><span class="directory-kicker">PROFESIONALES AUDIOVISUALES DE CÓRDOBA</span><strong id="resultCount">0</strong> perfiles encontrados</div><button id="createProfile" class="gold-btn">Crear / editar mi perfil</button></div><div id="cards" class="cards"></div></section><section class="info-strip"><div class="wrap strip-grid"><div><span>01</span><strong>Un perfil claro</strong><p>Un rol principal y hasta cinco etiquetas útiles, sin spam.</p></div><div><span>02</span><strong>Reel o guion</strong><p>Video embebido; los guionistas principales pueden mostrar PDF.</p></div><div><span>03</span><strong>Recomendaciones</strong><p>Una recomendación por usuario, siempre vinculada a un proyecto.</p></div><div><span>04</span><strong>Perfiles verificados</strong><p>Distinción administrada por Córdoba Casting para trayectoria acreditada.</p></div></div></section>`;bindDirectory()}
function bindDirectory(){const q=document.getElementById("searchInput"),rf=document.getElementById("roleFilter"),av=document.getElementById("availableFilter"),st=document.getElementById("studentFilter"),vf=document.getElementById("verifiedFilter"),sort=document.getElementById("sortFilter");const draw=()=>{let arr=profiles.map(p=>({p,rank:matchRank(p,q.value,rf.value)})).filter(x=>x.rank>=0).filter(x=>!av.checked||x.p.available).filter(x=>!st.checked||x.p.students).filter(x=>!vf.checked||x.p.verified).filter(x=>x.p.status==="approved"&&x.p.visibility!=="hidden");if(sort.value==="recommendations")arr.sort((a,b)=>b.p.recommendationCount-a.p.recommendationCount||b.rank-a.rank);else if(sort.value==="name")arr.sort((a,b)=>a.p.name.localeCompare(b.p.name));else if(sort.value==="recent")arr.sort((a,b)=>new Date(b.p.updatedAt||0)-new Date(a.p.updatedAt||0));else arr.sort((a,b)=>b.rank-a.rank||b.p.recommendationCount-a.p.recommendationCount);document.getElementById("resultCount").textContent=arr.length;document.getElementById("cards").innerHTML=arr.map(x=>cardHtml(x.p)).join("");document.querySelectorAll("[data-profile]").forEach(x=>x.onclick=()=>{location.hash=`#perfil/${encodeURIComponent(x.dataset.profile)}`})};[q,rf,av,st,vf,sort].forEach(x=>x.addEventListener(x.tagName==="INPUT"&&x.type==="text"?"input":"change",draw));document.getElementById("clearFilters").onclick=()=>{q.value="";rf.value="";av.checked=st.checked=vf.checked=false;sort.value="relevance";draw()};document.getElementById("createProfile").onclick=()=>realState.user?realAccountModal():realAuthModal("register");

draw()}
function cardHtml(p){return`<article class="card" data-profile="${p.id}"><div><div class="card-index"><span>PERFIL PROFESIONAL</span>${p.verified?verifiedBadge(false):""}${topBadge(p)}</div><div class="role">${esc(p.primary)}</div><div class="person">${esc(p.name)}</div><div class="secondary">${p.tags.map(esc).join(" · ")}</div><div class="status-row">${p.available?'<span class="pill on">DISPONIBLE</span>':'<span class="pill">NO DISPONIBLE</span>'}${p.students?'<span class="pill on">ESTUDIANTILES</span>':''}</div><div class="recommendation-count"><b>★ ${p.recommendationCount}</b> recomendaciones</div></div><div class="avatar">${liveAvatarUrl(p)?`<img src="${liveAvatarUrl(p)}" alt="${esc(p.name)}">`:initials(p.name)}</div></article>`}
function profileShareUrl(id){
  return `${window.location.origin}${window.location.pathname}#perfil/${encodeURIComponent(id)}`;
}

async function sharePublicProfile(p){
  const url=profileShareUrl(p.id);
  const data={title:`${p.name} — Red de Realizadores`,text:`${p.name} · ${p.primary} · Red de Realizadores Córdoba`,url};
  try{
    if(navigator.share){await navigator.share(data);return}
    await navigator.clipboard.writeText(url);
    showToast("Enlace del perfil copiado");
  }catch(e){
    if(e?.name!=="AbortError") prompt("Copiá este enlace:",url);
  }
}

function showToast(message){
  let toast=document.getElementById("siteToast");
  if(!toast){toast=document.createElement("div");toast.id="siteToast";toast.className="site-toast";document.body.appendChild(toast)}
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2200);
}

function professionalMedia(p,embed){
  if(p.primary==="Guion"){
    return `<section class="portfolio-block portfolio-media"><div class="portfolio-section-label">MATERIAL PROFESIONAL</div><h3>Muestra de guion</h3>${p.scriptPdfName?`<div class="portfolio-pdf"><div><span>PDF</span><strong>${esc(p.scriptPdfName)}</strong><small>Muestra de escritura</small></div><button id="openPdfBtn" class="profile-cta secondary">Abrir muestra ↗</button></div>`:`<div class="profile-empty">Este perfil todavía no publicó una muestra de guion.</div>`}</section>`;
  }
  return `<section class="portfolio-block portfolio-media"><div class="portfolio-section-label">MATERIAL PROFESIONAL</div><div class="portfolio-title-row"><h3>Reel / portfolio audiovisual</h3>${p.reel?'<span class="portfolio-live">VIDEO</span>':''}</div>${embed?`<div class="portfolio-video"><iframe src="${embed}" title="Reel de ${esc(p.name)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`:`<div class="profile-empty">Este perfil todavía no publicó un reel.</div>`}</section>`;
}

async function hydrateProfileRecommendations(p){
  const {data,error}=await sb.from("recommendations")
    .select("id,project_name,comment,recommender_id,created_at")
    .eq("recommended_id",p.id)
    .order("created_at",{ascending:false});
  if(error){console.error("recommendations",error);return p}
  const rows=data||[];
  const ids=[...new Set(rows.map(r=>r.recommender_id))];
  let names=new Map();
  if(ids.length){
    const {data:people}=await sb.from("profiles").select("id,full_name").in("id",ids);
    names=new Map((people||[]).map(x=>[x.id,x.full_name]));
  }
  p.recommendations=rows.map(r=>({id:r.id,author:names.get(r.recommender_id)||"Realizador",authorId:r.recommender_id,project:r.project_name,comment:r.comment}));
  p.recommendationCount=rows.length;
  return p;
}

function professionalProfileMarkup(p){
  const embed=embedUrl(p.reel),avatar=liveAvatarUrl(p);
  const ownRecommendation=realState.user&&p.recommendations.some(r=>String(r.authorId)===String(realState.user.id));
  const reviews=p.recommendations.length?p.recommendations.map(r=>`<article class="portfolio-review"><div class="review-quote">“</div><p>${esc(r.comment)}</p><div><strong>${esc(r.author)}</strong><span>${esc(r.project)}</span></div></article>`).join(""):`<div class="profile-empty">Todavía no recibió recomendaciones públicas.</div>`;
  return `<article class="pro-profile">
    <header class="pro-profile-hero">
      <div class="pro-profile-meta">RED DE REALIZADORES <span>/</span> CÓRDOBA</div>
      <div class="pro-profile-main">
        <div class="pro-profile-avatar">${avatar?`<img src="${avatar}" alt="${esc(p.name)}">`:`<span>${initials(p.name)}</span>`}</div>
        <div class="pro-profile-identity">
          <div class="pro-role">${esc(p.primary)}</div>
          <h2>${esc(p.name)}</h2>
          <div class="pro-badges">${p.verified?verifiedBadge(true):''}${p.isTopRecommended?'<span class="top-badge">★ MUY RECOMENDADO</span>':''}</div>
          <div class="pro-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join("")}</div>
        </div>
        <div class="pro-profile-actions">
          <button data-profile-share class="profile-cta share">↗ Compartir perfil</button>
          <button data-profile-contact class="profile-cta secondary">Contactar</button>
          <button data-profile-recommend class="profile-cta primary">${ownRecommendation?'★ Editar recomendación':'★ Recomendar'}</button>
        </div>
      </div>
      <div class="pro-profile-stats">
        <div><span>RECOMENDACIONES</span><strong>★ ${p.recommendationCount}</strong></div>
        <div><span>DISPONIBILIDAD</span><strong class="${p.available?'positive':''}">${p.available?'Disponible ahora':'No disponible'}</strong></div>
        <div><span>ESTUDIANTILES</span><strong>${p.students?'Acepta proyectos':'No indicado'}</strong></div>
        <div><span>ACTUALIZADO</span><strong>${esc(p.updated)}</strong></div>
      </div>
    </header>
    <div class="pro-profile-grid">
      <main>
        <section class="portfolio-block about-block"><div class="portfolio-section-label">PERFIL PROFESIONAL</div><h3>Sobre ${esc(p.name.split(" ")[0])}</h3><p class="pro-bio">${esc(p.bio||"Este perfil todavía no agregó una presentación profesional.")}</p></section>
        ${professionalMedia(p,embed)}
      </main>
      <aside class="portfolio-sidebar">
        <section class="portfolio-block recommendation-block"><div class="portfolio-section-label">REFERENCIAS DE TRABAJO</div><div class="portfolio-title-row"><h3>Recomendaciones</h3><strong class="sidebar-score">★ ${p.recommendationCount}</strong></div><div class="portfolio-reviews">${reviews}</div></section>
        <section class="portfolio-block share-card"><span>PERFIL PÚBLICO</span><strong>Tu carta profesional dentro de la red.</strong><p>Este enlace abre directamente el perfil, reel y referencias. Podés usarlo en CV, mail, Instagram o presentaciones.</p><button data-profile-share class="profile-cta secondary">Copiar / compartir enlace</button></section>
      </aside>
    </div>
    <footer class="pro-profile-footer"><span>RED DE REALIZADORES · CÓRDOBA</span><span>Una iniciativa de Córdoba Casting</span></footer>
  </article>`;
}

function bindProfessionalProfileActions(p,root=document){
  root.querySelectorAll("[data-profile-share]").forEach(b=>b.onclick=()=>sharePublicProfile(p));
  const contact=root.querySelector("[data-profile-contact]");if(contact)contact.onclick=()=>contactModal(p);
  const recommend=root.querySelector("[data-profile-recommend]");if(recommend)recommend.onclick=()=>recommendModal(p);
  const pdf=root.querySelector("#openPdfBtn");if(pdf)pdf.onclick=()=>openSignedScript(p.scriptPdfPath||p.scriptPdfUrl);
}

async function renderProfilePage(id){
  const p=profiles.find(x=>String(x.id)===String(id));
  if(!p){
    app.innerHTML=`<section class="wrap profile-not-found"><div class="eyebrow">RED DE REALIZADORES · CÓRDOBA</div><h1>Perfil no disponible.</h1><p>Puede haber sido ocultado, eliminado o todavía no estar aprobado.</p><a href="#realizadores" class="gold-btn">Volver al directorio</a></section>`;
    return;
  }
  await hydrateProfileRecommendations(p);
  appState.route="perfil";
  app.innerHTML=`<section class="profile-page-wrap wrap"><div class="profile-page-nav"><a href="#realizadores">← Volver a realizadores</a><button id="pageShareProfile" class="text-btn">Compartir perfil ↗</button></div>${professionalProfileMarkup(p)}</section>`;
  bindProfessionalProfileActions(p,app);
  document.getElementById("pageShareProfile").onclick=()=>sharePublicProfile(p);
  document.title=`${p.name} — ${p.primary} | Red de Realizadores`;
}

async function profileModal(id){
  const p=profiles.find(x=>String(x.id)===String(id));if(!p)return;
  await hydrateProfileRecommendations(p);
  openModal(professionalProfileMarkup(p),true);
  bindProfessionalProfileActions(p,modalContent);
}
async function recommendModal(p){
  if(!realState.user){
    realAuthModal("login");
    return;
  }

  if(String(p.id)===String(realState.user.id)){
    openModal(`<div class="eyebrow">RECOMENDACIÓN</div><h2>No podés recomendar tu propio perfil</h2><p>Las recomendaciones están pensadas para personas con las que trabajaste.</p>`);
    return;
  }

  const {data:existing,error:existingError}=await sb
    .from("recommendations")
    .select("id,project_name,comment")
    .eq("recommender_id",realState.user.id)
    .eq("recommended_id",p.id)
    .maybeSingle();

  if(existingError){
    openModal(`<div class="eyebrow">RECOMENDACIÓN</div><h2>No se pudo cargar tu recomendación</h2><p>${esc(existingError.message)}</p>`);
    return;
  }

  if(existing){
    openModal(`<div class="eyebrow">MI RECOMENDACIÓN</div>
      <h2>Editar recomendación a ${esc(p.name)}</h2>
      <form id="realRecommendationForm" class="form-grid">
        <label>¿En qué proyecto trabajaste con el realizador?
          <input id="realRecProject" maxlength="55" required value="${esc(existing.project_name)}">
        </label>
        <label>Comentario breve
          <textarea id="realRecComment" maxlength="120" required>${esc(existing.comment)}</textarea>
          <span id="realRecCount" class="char-count">${existing.comment.length} / 120</span>
        </label>
        <div class="profile-actions">
          <button class="primary gold">Guardar cambios</button>
          <button id="deleteRealRecommendation" type="button" class="danger">Eliminar recomendación</button>
        </div>
        <div id="realRecFeedback"></div>
      </form>`);

    const ta=document.getElementById("realRecComment");
    ta.oninput=()=>document.getElementById("realRecCount").textContent=`${ta.value.length} / 120`;

    document.getElementById("realRecommendationForm").onsubmit=async e=>{
      e.preventDefault();
      const fb=document.getElementById("realRecFeedback");
      fb.innerHTML=authNotice("Guardando…");

      const {error}=await sb.from("recommendations").update({
        project_name:document.getElementById("realRecProject").value.trim(),
        comment:ta.value.trim()
      }).eq("id",existing.id);

      if(error){fb.innerHTML=authNotice(error.message);return}
      await loadPublicProfilesIntoExistingUI();
      profileModal(p.id);
    };

    document.getElementById("deleteRealRecommendation").onclick=async()=>{
      if(!confirm("¿Eliminar esta recomendación?"))return;
      const {error}=await sb.from("recommendations").delete().eq("id",existing.id);
      if(error){alert(error.message);return}
      await loadPublicProfilesIntoExistingUI();
      profileModal(p.id);
    };

    return;
  }

  openModal(`<div class="eyebrow">RECOMENDACIÓN</div>
    <h2>Recomendar a ${esc(p.name)}</h2>
    <form id="realRecommendationForm" class="form-grid">
      <label>¿En qué proyecto trabajaste con el realizador?
        <input id="realRecProject" maxlength="55" required placeholder="Nombre del proyecto">
      </label>
      <label>Comentario breve
        <textarea id="realRecComment" maxlength="120" required placeholder="Máximo 120 caracteres"></textarea>
        <span id="realRecCount" class="char-count">0 / 120</span>
      </label>
      <div class="profile-actions">
        <button class="primary gold">Publicar recomendación</button>
      </div>
      <div id="realRecFeedback"></div>
    </form>`);

  const ta=document.getElementById("realRecComment");
  ta.oninput=()=>document.getElementById("realRecCount").textContent=`${ta.value.length} / 120`;

  document.getElementById("realRecommendationForm").onsubmit=async e=>{
    e.preventDefault();
    const fb=document.getElementById("realRecFeedback");
    fb.innerHTML=authNotice("Publicando…");

    const {error}=await sb.from("recommendations").insert({
      recommender_id:realState.user.id,
      recommended_id:p.id,
      project_name:document.getElementById("realRecProject").value.trim(),
      comment:ta.value.trim()
    });

    if(error){fb.innerHTML=authNotice(error.message);return}

    await loadPublicProfilesIntoExistingUI();
    profileModal(p.id);
  };
}
function contactModal(p){
  if(!realState.user){
    realAuthModal("login");
    return;
  }

  const senderName=realState.profile?.full_name || "Un realizador";
  const senderRole=realState.profile?.roles?.name || "Realizador";

  openModal(`<div class="eyebrow">CONTACTO ENTRE PERFILES</div>
    <h2>Contactar a ${esc(p.name)}</h2>
    <p>Tu teléfono o email no se comparte automáticamente. El destinatario recibirá una solicitud indicando qué perfil quiere contactarlo y el mensaje que escribas.</p>

    <form id="contactForm" class="form-grid">
      <label>Mensaje
        <textarea id="contactMessage" maxlength="500" required placeholder="Contale brevemente por qué querés contactarlo."></textarea>
        <span class="char-count">Máximo 500 caracteres</span>
      </label>

      <div class="notice">
        <strong>Vista previa:</strong><br><br>
        <strong>${esc(senderName)}</strong> (${esc(senderRole)}) quiere contactarse con vos y dejó el siguiente mensaje.
      </div>

      <button class="primary">Enviar solicitud de contacto</button>
    </form>`);

  document.getElementById("contactForm").onsubmit=e=>{
    e.preventDefault();
    const msg=document.getElementById("contactMessage").value.trim();

    openModal(`<div class="eyebrow">SOLICITUD DE CONTACTO</div>
      <h2>Solicitud preparada</h2>
      <p>La solicitud quedó preparada. El envío automático al canal privado se habilitará cuando Córdoba Casting defina el sistema de contacto definitivo.</p>

      <div class="notice">
        <strong>${esc(senderName)}</strong> (${esc(senderRole)}) quiere contactarse con vos:<br><br>
        ${esc(msg)}
      </div>

      <p><small>Todavía no definimos si el envío final será por email, WhatsApp o ambos.</small></p>`);
  };
}

let realJobsCache=[];

function remainingLabel(expiresAt){
  const ms=new Date(expiresAt)-new Date();
  if(ms<=0)return "EXPIRADA";
  const mins=Math.max(1,Math.floor(ms/60000));
  if(mins>=1440){
    const d=Math.floor(mins/1440);
    return `${d} día${d===1?"":"s"}`;
  }
  if(mins>=60){
    const h=Math.floor(mins/60);
    return `${h} hora${h===1?"":"s"}`;
  }
  return `${mins} minuto${mins===1?"":"s"}`;
}

async function loadRealJobs(){
  const nowIso=new Date().toISOString();

  const {data,error}=await sb
    .from("job_posts")
    .select("*")
    .gt("expires_at",nowIso)
    .order("created_at",{ascending:false});

  if(error){
    console.error("job_posts",error);
    realJobsCache=[];
    return error;
  }

  const rows=data||[];
  const jobIds=rows.map(x=>x.id);
  const authorIds=[...new Set(rows.map(x=>x.author_id))];

  let authors=[],jobRoles=[];
  if(authorIds.length){
    const r=await sb.from("profiles").select("id,full_name").in("id",authorIds);
    if(r.error)console.error("job authors",r.error);
    authors=r.data||[];
  }
  if(jobIds.length){
    const r=await sb.from("job_post_roles").select("job_post_id,role_id").in("job_post_id",jobIds);
    if(r.error)console.error("job roles",r.error);
    jobRoles=r.data||[];
  }

  const authorMap=new Map(authors.map(x=>[x.id,x.full_name]));
  const roleMap=new Map(realState.roles.map(x=>[Number(x.id),x.name]));

  realJobsCache=rows.map(j=>({
    id:j.id,
    authorId:j.author_id,
    author:authorMap.get(j.author_id)||"Realizador",
    title:j.title,
    description:j.description,
    student:Boolean(j.is_student_project),
    paid:Boolean(j.is_paid),
    createdAt:j.created_at,
    expiresAt:j.expires_at,
    remainingText:remainingLabel(j.expires_at),
    roles:jobRoles
      .filter(r=>Number(r.job_post_id)===Number(j.id))
      .map(r=>roleMap.get(Number(r.role_id)))
      .filter(Boolean)
  }));

  return null;
}
async function renderJobs(){
  app.innerHTML=`<section class="jobs-hero wrap">
    <div class="eyebrow">BÚSQUEDAS / PROYECTOS</div>
    <h1 class="page-title">Encontrá equipo.<br>Sumate a proyectos.</h1>
    <p class="lead">Publicaciones activas por hasta 10 días. Participás directamente con tu perfil profesional.</p>
  </section>
  <section class="jobs-controls wrap">
    <div class="job-filters">
      <label class="check"><input id="jobStudentFilter" type="checkbox"> Estudiantiles</label>
      <label class="check"><input id="jobPaidFilter" type="checkbox"> Remunerados</label>
    </div>
    <button id="newJobBtn" class="gold-btn">+ Publicar búsqueda</button>
  </section>
  <section class="jobs wrap">
    <div id="jobGrid" class="job-grid"><div class="notice">Cargando búsquedas…</div></div>
  </section>`;

  const student=document.getElementById("jobStudentFilter");
  const paid=document.getElementById("jobPaidFilter");

  const error=await loadRealJobs();
  if(error){
    document.getElementById("jobGrid").innerHTML=`<div class="notice">${esc(error.message)}</div>`;
    return;
  }

  const draw=()=>{
    const arr=realJobsCache.filter(j=>(!student.checked||j.student)&&(!paid.checked||j.paid));
    document.getElementById("jobGrid").innerHTML=arr.length?arr.map(realJobCard).join(""):`<div class="notice">No hay búsquedas activas con esos filtros.</div>`;
    document.querySelectorAll("[data-real-job]").forEach(x=>x.onclick=()=>realJobModal(Number(x.dataset.realJob)));
  };

  student.onchange=paid.onchange=draw;
  document.getElementById("newJobBtn").onclick=newRealJobModal;
  draw();
}

function realJobCard(j){
  return `<article class="job-card" data-real-job="${j.id}">
    <div class="job-meta">
      <span>BÚSQUEDA</span>
      <span>CADUCA EN ${esc(j.remainingText).toUpperCase()}</span>
    </div>
    <h3>${esc(j.title)}</h3>
    <p>${esc(j.description)}</p>
    <div class="role-tags">${j.roles.map(r=>`<span class="tag">${esc(r)}</span>`).join("")}</div>
    <div class="category-tags">
      ${j.student?'<span class="tag red">ESTUDIANTIL</span>':""}
      ${j.paid?'<span class="tag gold">REMUNERADO</span>':'<span class="tag">NO INDICA REMUNERACIÓN</span>'}
    </div>
    <div class="job-bottom">
      <span>Publicado por <strong>${esc(j.author)}</strong></span>
      <span>${esc(j.remainingText)} restantes</span>
    </div>
  </article>`;
}

async function realJobModal(id){
  const j=realJobsCache.find(x=>Number(x.id)===Number(id));
  if(!j)return;

  let ownApplication=null;
  if(realState.user){
    const r=await sb.from("job_applications")
      .select("id,is_visible")
      .eq("job_post_id",id)
      .eq("applicant_id",realState.user.id)
      .maybeSingle();
    ownApplication=r.data||null;
  }

  const isAuthor=String(j.authorId)===String(realState.user?.id);
  let applications=[];

  if(isAuthor || realState.isAdmin){
    const ar=await sb.from("job_applications")
      .select("id,applicant_id,created_at,is_visible")
      .eq("job_post_id",id)
      .order("created_at",{ascending:false});
    applications=ar.data||[];
  }

  let applicantProfiles=[];
  const applicantIds=[...new Set(applications.map(a=>a.applicant_id))];
  if(applicantIds.length){
    const pr=await sb.from("profiles")
      .select("id,full_name,primary_role_id,verified,reel_url,script_pdf_path,roles:primary_role_id(name)")
      .in("id",applicantIds);
    applicantProfiles=pr.data||[];
  }
  const pmap=new Map(applicantProfiles.map(p=>[p.id,p]));

  openModal(`<div class="eyebrow">BÚSQUEDA ACTIVA</div>
    <h2>${esc(j.title)}</h2>
    <div class="category-tags">
      ${j.student?'<span class="tag red" style="color:#8e2732;border-color:#b78e94">PROYECTO ESTUDIANTIL</span>':""}
      ${j.paid?'<span class="tag gold" style="color:#7b651f;border-color:#baa55e">REMUNERADO</span>':'<span class="tag" style="color:#59666c;border-color:#bbb">NO INDICA REMUNERACIÓN</span>'}
    </div>
    <div class="profile-section">
      <h4>Roles buscados</h4>
      <div class="role-tags">${j.roles.map(r=>`<span class="pill on" style="color:#6d5a19;border-color:#c5ae62">${esc(r)}</span>`).join("")}</div>
    </div>
    <div class="profile-section"><h4>Descripción</h4><p>${esc(j.description)}</p></div>
    <div class="profile-section">
      <h4>Publicación</h4>
      <p>Publicó <strong>${esc(j.author)}</strong> · quedan <strong>${esc(j.remainingText)}</strong>.</p>
      ${!isAuthor?`<button id="realParticipateBtn" class="primary gold">${ownApplication?"✓ Ya participás":"Participar con mi perfil"}</button>`:"<div class='notice'>Esta búsqueda fue publicada por vos.</div>"}
    </div>
    ${isAuthor||realState.isAdmin?`<div class="profile-section">
      <h4>Perfiles interesados</h4>
      <div class="participants">
        ${applications.length?applications.map(a=>realApplicantHtml(a,pmap.get(a.applicant_id))).join(""):"<p>Todavía no hay postulaciones.</p>"}
      </div>
    </div>`:""}`,true);

  const btn=document.getElementById("realParticipateBtn");
  if(btn){
    btn.onclick=()=>ownApplication?removeRealApplication(ownApplication.id,id):createRealApplication(id);
  }
  document.querySelectorAll("[data-applicant-profile]").forEach(b=>b.onclick=()=>profileModal(b.dataset.applicantProfile));
}

function realApplicantHtml(a,p){
  if(!p)return "";
  const role=p.roles?.name||"Sin rol";
  return `<div class="participant">
    <strong>${esc(p.full_name||"Realizador")} ${p.verified?verifiedBadge(false):""}</strong>
    <span>${esc(role)}</span>
    <button data-applicant-profile="${p.id}">${role==="Guion"?"Ver material":"▶ Ver reel / perfil"}</button>
  </div>`;
}

async function createRealApplication(jobId){
  if(!realState.user){realAuthModal("login");return}
  if(realState.profile?.status!=="approved"){
    alert("Tu perfil debe estar aprobado por Córdoba Casting para participar en búsquedas.");
    return;
  }
  const {error}=await sb.from("job_applications").insert({
    job_post_id:jobId,
    applicant_id:realState.user.id
  });
  if(error){alert(error.message);return}
  await realJobModal(jobId);
}

async function removeRealApplication(applicationId,jobId){
  if(!confirm("¿Querés retirar tu participación de esta búsqueda?"))return;
  const {error}=await sb.from("job_applications").delete().eq("id",applicationId);
  if(error){alert(error.message);return}
  await realJobModal(jobId);
}

function newRealJobModal(){
  if(!realState.user){realAuthModal("login");return}
  if(realState.profile?.status!=="approved"){
    openModal(`<div class="eyebrow">PUBLICAR BÚSQUEDA</div><h2>Tu perfil todavía no puede publicar</h2><p>Para publicar búsquedas, tu perfil primero debe estar aprobado por Córdoba Casting.</p>`);
    return;
  }

  openModal(`<div class="eyebrow">PUBLICAR BÚSQUEDA</div>
    <h2>Nueva búsqueda</h2>
    <form id="realJobForm" class="form-grid">
      <label>Título<input id="realJobTitle" required maxlength="120" placeholder="Ej: Buscamos DF para cortometraje"></label>
      <div class="field">
        <label>¿Qué roles buscás? <small>(máximo 3)</small></label>
        <div class="role-checks" id="realRoleChecks">
          ${realState.roles.map(r=>`<label><input type="checkbox" value="${r.id}"> ${esc(r.name)}</label>`).join("")}
        </div>
        <div id="realRoleLimit" class="char-count">0 / 3 roles</div>
      </div>
      <label>Descripción<textarea id="realJobDescription" maxlength="800" required></textarea><span id="realJobDescCount" class="char-count">0 / 800</span></label>
      <label>Caducidad<select id="realJobExpiry">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i===6?"selected":""}>${i+1} día${i?"s":""}</option>`).join("")}</select></label>
      <div class="field">
        <label>Categorías</label>
        <div class="modal-checks">
          <label class="check"><input id="realNewStudent" type="checkbox"> Proyecto estudiantil</label>
          <label class="check"><input id="realNewPaid" type="checkbox"> Remunerado</label>
        </div>
      </div>
      <button class="primary gold">Publicar búsqueda</button>
      <div id="realJobFeedback"></div>
    </form>`);

  const checks=[...document.querySelectorAll("#realRoleChecks input")];
  const limit=document.getElementById("realRoleLimit");
  checks.forEach(c=>c.onchange=()=>{
    const selected=checks.filter(x=>x.checked);
    if(selected.length>3)c.checked=false;
    limit.textContent=`${checks.filter(x=>x.checked).length} / 3 roles`;
  });

  const ta=document.getElementById("realJobDescription");
  ta.oninput=()=>document.getElementById("realJobDescCount").textContent=`${ta.value.length} / 800`;

  document.getElementById("realJobForm").onsubmit=async e=>{
    e.preventDefault();
    const selected=checks.filter(x=>x.checked).map(x=>Number(x.value));
    if(!selected.length){limit.textContent="Elegí al menos 1 rol";return}

    const feedback=document.getElementById("realJobFeedback");
    feedback.innerHTML=authNotice("Publicando…");

    const days=Number(document.getElementById("realJobExpiry").value);
    const expires=new Date(Date.now()+days*86400000).toISOString();

    const {data:created,error}=await sb.from("job_posts").insert({
      author_id:realState.user.id,
      title:document.getElementById("realJobTitle").value.trim(),
      description:ta.value.trim(),
      is_student_project:document.getElementById("realNewStudent").checked,
      is_paid:document.getElementById("realNewPaid").checked,
      expires_at:expires
    }).select("id").single();

    if(error){feedback.innerHTML=authNotice(error.message);return}

    const {error:rolesError}=await sb.from("job_post_roles").insert(
      selected.map(role_id=>({job_post_id:created.id,role_id}))
    );

    if(rolesError){
      await sb.from("job_posts").delete().eq("id",created.id);
      feedback.innerHTML=authNotice(rolesError.message);
      return;
    }

    await loadRealJobs();
    closeModal();
    location.hash="#busquedas";
    await renderJobs();
  };
}

function resourceTypeLabel(type){return type==="article"?"GUÍA / TUTORIAL":"DESCARGABLE"}
function resourceDateLabel(value){
  if(!value)return "";
  try{return new Intl.DateTimeFormat("es-AR",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(value)).replace(".","")}catch(e){return ""}
}
function resourceInline(text){
  let s=esc(text||"");
  s=s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
  s=s.replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  return s;
}
function renderResourceBody(content){
  const lines=String(content||"").replace(/\r/g,"").split("\n");
  let html="",list=[];
  const flush=()=>{if(list.length){html+=`<ul>${list.map(x=>`<li>${resourceInline(x)}</li>`).join("")}</ul>`;list=[]}};
  for(const raw of lines){
    const line=raw.trim();
    if(!line){flush();continue}
    if(line.startsWith("- ")){list.push(line.slice(2));continue}
    flush();
    if(line.startsWith("### "))html+=`<h3>${resourceInline(line.slice(4))}</h3>`;
    else if(line.startsWith("## "))html+=`<h2>${resourceInline(line.slice(3))}</h2>`;
    else if(line.startsWith("> "))html+=`<blockquote>${resourceInline(line.slice(2))}</blockquote>`;
    else html+=`<p>${resourceInline(line)}</p>`;
  }
  flush();
  return html;
}
function resourceCardHtml(r){
  const cover=r.cover_url?`<div class="resource-cover"><img src="${esc(r.cover_url)}" alt=""></div>`:`<div class="resource-cover resource-cover-fallback"><span>${r.resource_type==="article"?"LEER":"DESCARGAR"}</span></div>`;
  const actions=r.resource_type==="article"
    ? `<a class="resource-read" href="#recurso/${r.id}">Leer guía <span>→</span></a>`
    : `<div class="resource-download-actions">
        ${r.pdf_url?`<a href="${esc(r.pdf_url)}" target="_blank" rel="noopener noreferrer">PDF <span>↓</span></a>`:""}
        ${r.editable_url?`<a href="${esc(r.editable_url)}" target="_blank" rel="noopener noreferrer">Editable <span>↓</span></a>`:""}
      </div>`;
  return `<article class="resource-card" data-resource-type="${esc(r.resource_type)}" data-resource-category="${esc(r.category||"Otros")}">
    ${cover}
    <div class="resource-card-body">
      <div class="resource-meta"><span>${resourceTypeLabel(r.resource_type)}</span><span>${esc(r.category||"Otros")}</span></div>
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.excerpt||"")}</p>
      <div class="resource-card-bottom">${actions}${r.is_featured?'<span class="resource-featured">DESTACADO</span>':""}</div>
    </div>
  </article>`;
}
async function loadPublicResources(){
  const {data,error}=await sb.from("resources")
    .select("id,resource_type,title,excerpt,category,cover_url,content,pdf_url,editable_url,is_featured,sort_order,created_at,updated_at")
    .eq("is_visible",true)
    .order("is_featured",{ascending:false})
    .order("sort_order",{ascending:true})
    .order("created_at",{ascending:false});
  if(error)throw error;
  resourcesCache=data||[];
  return resourcesCache;
}
async function renderResources(){
  app.innerHTML=`<section class="resources-hero wrap">
    <div class="eyebrow">RECURSOS / RED DE REALIZADORES</div>
    <h1 class="page-title">Herramientas para<br><span>hacer mejor audiovisual.</span></h1>
    <p class="lead">Plantillas descargables, documentos editables y pequeñas guías para preproducción, rodaje y postproducción.</p>
  </section>
  <section class="resources-library wrap">
    <div class="resources-toolbar">
      <div class="resource-filter-group">
        <button class="active" data-resource-filter="all">Todos</button>
        <button data-resource-filter="download">Descargables</button>
        <button data-resource-filter="article">Guías / tutoriales</button>
      </div>
      <select id="resourceCategoryFilter"><option value="">Todas las categorías</option></select>
    </div>
    <div id="resourcePublicContent" class="resource-public-content">${authNotice("Cargando recursos…")}</div>
  </section>`;

  const target=document.getElementById("resourcePublicContent");
  try{
    const rows=await loadPublicResources();
    if(!rows.length){target.innerHTML=`<div class="resources-empty"><span>RR / BIBLIOTECA</span><h2>Estamos preparando los primeros recursos.</h2><p>Pronto vas a encontrar plantillas, documentos y pequeñas guías para trabajar mejor.</p></div>`;return}
    const categories=[...new Set(rows.map(r=>r.category||"Otros"))].sort((a,b)=>a.localeCompare(b,"es"));
    const select=document.getElementById("resourceCategoryFilter");
    select.innerHTML=`<option value="">Todas las categorías</option>${categories.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("")}`;
    let type="all";
    const draw=()=>{
      const cat=select.value;
      const filtered=rows.filter(r=>(type==="all"||r.resource_type===type)&&(!cat||(r.category||"Otros")===cat));
      target.innerHTML=`<div class="resource-results-head"><strong>${filtered.length}</strong> recurso${filtered.length===1?"":"s"}</div><div class="resource-grid-new">${filtered.map(resourceCardHtml).join("")||'<div class="resources-empty compact"><h2>No hay recursos con estos filtros.</h2></div>'}</div>`;
    };
    document.querySelectorAll("[data-resource-filter]").forEach(b=>b.onclick=()=>{
      type=b.dataset.resourceFilter;
      document.querySelectorAll("[data-resource-filter]").forEach(x=>x.classList.toggle("active",x===b));
      draw();
    });
    select.onchange=draw;
    draw();
  }catch(e){
    console.error("Resources:",e);
    target.innerHTML=`<div class="resources-empty"><span>RECURSOS</span><h2>No pudimos cargar la biblioteca.</h2><p>Si sos administrador y acabás de actualizar la web, verificá que hayas ejecutado <strong>09_resources.sql</strong> en Supabase.</p></div>`;
  }
}
async function renderResourceDetail(id){
  if(!Number.isFinite(id))return renderResources();
  app.innerHTML=`<section class="wrap resource-detail-shell">${authNotice("Cargando recurso…")}</section>`;
  const {data:r,error}=await sb.from("resources")
    .select("id,resource_type,title,excerpt,category,cover_url,content,pdf_url,editable_url,is_featured,created_at,updated_at")
    .eq("id",id).single();
  if(error||!r){
    app.innerHTML=`<section class="wrap resource-detail-shell"><a class="resource-back" href="#recursos">← Volver a Recursos</a><div class="resources-empty"><h2>Este recurso no está disponible.</h2></div></section>`;
    return;
  }
  document.title=`${r.title} | Recursos · Red de Realizadores`;
  if(r.resource_type!=="article"){
    app.innerHTML=`<section class="wrap resource-detail-shell">
      <a class="resource-back" href="#recursos">← Volver a Recursos</a>
      <div class="resource-download-detail">
        ${r.cover_url?`<img src="${esc(r.cover_url)}" alt="">`:""}
        <div><div class="resource-meta"><span>DESCARGABLE</span><span>${esc(r.category||"Otros")}</span></div><h1>${esc(r.title)}</h1><p>${esc(r.excerpt||"")}</p>
        <div class="resource-download-actions large">${r.pdf_url?`<a href="${esc(r.pdf_url)}" target="_blank" rel="noopener noreferrer">Descargar PDF <span>↓</span></a>`:""}${r.editable_url?`<a href="${esc(r.editable_url)}" target="_blank" rel="noopener noreferrer">Descargar editable <span>↓</span></a>`:""}</div></div>
      </div></section>`;
    return;
  }
  app.innerHTML=`<section class="wrap resource-detail-shell">
    <a class="resource-back" href="#recursos">← Volver a Recursos</a>
    <article class="resource-article">
      <header>
        <div class="resource-meta"><span>GUÍA / TUTORIAL</span><span>${esc(r.category||"Otros")}</span><span>${resourceDateLabel(r.created_at)}</span></div>
        <h1>${esc(r.title)}</h1>
        <p class="resource-article-deck">${esc(r.excerpt||"")}</p>
        ${r.cover_url?`<img class="resource-article-cover" src="${esc(r.cover_url)}" alt="">`:""}
      </header>
      <div class="resource-article-body">${renderResourceBody(r.content)}</div>
      <footer><span>RED DE REALIZADORES · CÓRDOBA</span><strong>Un recurso de Córdoba Casting</strong></footer>
    </article>
  </section>`;
}

function renderTraining(){app.innerHTML=`<section class="training"><div class="training-shell"><div class="training-brand"><div><img src="assets/cordoba-casting-white.png" alt="Córdoba Casting"><h1 class="page-title">Formación<br>audiovisual.</h1><p>Cursos, talleres y experiencias para seguir formando profesionales frente y detrás de cámara.</p></div><small>FORMACIÓN AUDIOVISUAL · CÓRDOBA</small></div><div class="training-content"><div class="eyebrow">FORMACIÓN · CÓRDOBA CASTING</div><h2>Nuestras Propuestas</h2><p>Formación para seguir desarrollando herramientas, ampliar tu práctica y crecer dentro de la industria audiovisual.</p><div class="course-list"><article class="course"><div><span class="course-tag">CURSO</span><h3>Dirección actoral para cámara</h3><p>Herramientas prácticas para dirigir intérpretes y escenas audiovisuales.</p></div><button class="outline">Más información</button></article><article class="course"><div><span class="course-tag">TALLER</span><h3>Taller de escenas</h3><p>Ensayo, práctica frente a cámara y filmación de material.</p></div><button class="outline">Más información</button></article></div></div></div></section>`}
async function loadPublicProfilesIntoExistingUI(){
  const {data,error}=await sb
    .from("profiles")
    .select(`
      id,
      full_name,
      avatar_path,
      primary_role_id,
      bio,
      available,
      accepts_student_projects,
      reel_url,
      script_pdf_path,
      verified,
      is_visible,
      status,
      profile_updated_at,
      roles:primary_role_id(name),
      profile_tags(tag)
    `)
    .eq("status","approved")
    .eq("is_visible",true)
    .order("profile_updated_at",{ascending:false});

  if(error){
    console.error("public profiles",error);
    profiles=[];
    return;
  }

  const {data:stats}=await sb.from("profile_recommendation_stats").select("*");
  const statsMap=new Map((stats||[]).map(x=>[x.profile_id,x]));

  profiles=(data||[]).map((p,i)=>{
    const stat=statsMap.get(p.id)||{};
    return {
      id:p.id,
      name:p.full_name||"(Sin nombre)",
      primary:p.roles?.name||"Sin rol",
      tags:(p.profile_tags||[]).map(x=>x.tag),
      available:Boolean(p.available),
      students:Boolean(p.accepts_student_projects),
      bio:p.bio||"",
      reel:p.reel_url||"",
      scriptPdfName:p.script_pdf_path?"Muestra de guion.pdf":"",
      scriptPdfPath:p.script_pdf_path||null,
      scriptPdfUrl:"",
      updated:new Date(p.profile_updated_at).toLocaleDateString("es-AR"),updatedAt:p.profile_updated_at,
      verified:Boolean(p.verified),
      recommendations:[],
      recommendationCount:Number(stat.recommendation_count||0),
      isTopRecommended:Boolean(stat.is_top_recommended),
      avatarPath:p.avatar_path||null,
      status:p.status,
      visibility:"visible",
      contactType:null,
      contactValue:null
    };
  });
}

function liveAvatarUrl(p){
  if(!p?.avatarPath)return null;
  const {data}=sb.storage.from("avatars").getPublicUrl(p.avatarPath);
  return data?.publicUrl||null;
}

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
  await loadNotifications();
  updateRealAccountButton();
}

function updateRealAccountButton(){
  if(!realState.user){
    accountBtn.textContent="Ingresar";
    if(adminNavLink)adminNavLink.hidden=true;
    if(notificationsBtn)notificationsBtn.hidden=true;
    if(notificationCount)notificationCount.hidden=true;
    return;
  }

  accountBtn.textContent="Mi cuenta";
  if(adminNavLink)adminNavLink.hidden=!realState.isAdmin;
  if(notificationsBtn)notificationsBtn.hidden=false;

  const unread=(realState.notifications||[]).filter(n=>!n.is_read).length;
  if(notificationCount){
    notificationCount.textContent=unread>99?"99+":String(unread);
    notificationCount.hidden=unread===0;
  }
}

function authNotice(message,type=""){
  return `<div class="notice ${type}">${esc(message)}</div>`;
}


async function loadNotifications(){
  if(!realState.user){
    realState.notifications=[];
    return;
  }

  const {data,error}=await sb
    .from("notifications")
    .select("*")
    .order("created_at",{ascending:false})
    .limit(50);

  if(error){
    console.error("notifications",error);
    realState.notifications=[];
    return;
  }

  realState.notifications=data||[];
}

function notificationIcon(type){
  if(type==="profile_approved")return "✓";
  if(type==="profile_rejected")return "!";
  if(type==="job_application")return "→";
  if(type==="recommendation")return "★";
  return "•";
}

function timeAgoNotification(date){
  const ms=Date.now()-new Date(date).getTime();
  const mins=Math.max(0,Math.floor(ms/60000));
  if(mins<1)return "Ahora";
  if(mins<60)return `Hace ${mins} min`;
  const hours=Math.floor(mins/60);
  if(hours<24)return `Hace ${hours} h`;
  const days=Math.floor(hours/24);
  return `Hace ${days} día${days===1?"":"s"}`;
}

async function notificationsModal(){
  if(!realState.user){
    realAuthModal("login");
    return;
  }

  await loadNotifications();
  updateRealAccountButton();

  openModal(`<div class="eyebrow">NOTIFICACIONES</div>
    <div class="notifications-head">
      <h2>Actividad reciente</h2>
      ${realState.notifications.some(n=>!n.is_read)?'<button id="markAllNotifications" class="outline mini-action">Marcar todas como leídas</button>':""}
    </div>

    <div class="notifications-list">
      ${realState.notifications.length
        ? realState.notifications.map(n=>`
          <article class="notification-item ${n.is_read?"":"unread"}" data-notification-id="${n.id}">
            <div class="notification-symbol">${notificationIcon(n.type)}</div>
            <div class="notification-copy">
              <div class="notification-title-row">
                <strong>${esc(n.title)}</strong>
                ${!n.is_read?'<span class="unread-dot"></span>':""}
              </div>
              <p>${esc(n.message)}</p>
              <small>${timeAgoNotification(n.created_at)}</small>
            </div>
          </article>`).join("")
        : '<div class="empty-notifications"><strong>No tenés notificaciones todavía.</strong><p>Las aprobaciones, rechazos, postulaciones y recomendaciones aparecerán acá.</p></div>'
      }
    </div>`);

  const markAll=document.getElementById("markAllNotifications");
  if(markAll){
    markAll.onclick=async()=>{
      const {error}=await sb.rpc("mark_all_notifications_read");
      if(error){alert(error.message);return}
      await loadNotifications();
      updateRealAccountButton();
      notificationsModal();
    };
  }

  document.querySelectorAll("[data-notification-id]").forEach(item=>{
    item.onclick=async()=>{
      const id=Number(item.dataset.notificationId);
      const n=realState.notifications.find(x=>Number(x.id)===id);
      if(!n)return;

      if(!n.is_read){
        await sb.from("notifications").update({is_read:true}).eq("id",id);
        n.is_read=true;
        updateRealAccountButton();
      }

      if(n.type==="profile_rejected"){
        closeModal();
        realAccountModal();
        return;
      }

      if(n.type==="profile_approved"){
        closeModal();
        realAccountModal();
        return;
      }

      if(n.type==="job_application" && n.related_job_post_id){
        closeModal();
        location.hash="#busquedas";
        await renderJobs();
        await realJobModal(Number(n.related_job_post_id));
        return;
      }

      if(n.type==="recommendation"){
        closeModal();
        location.hash=`#perfil/${encodeURIComponent(n.related_profile_id||realState.user.id)}`;
      }
    };
  });
}

function realAccountModal(){
  if(!realState.user){return realAuthModal("login")}
  if(realState.profile?.status==="rejected" && !realState.isAdmin){return rejectedProfileModal()}
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
    ${!register?'<button id="forgotPasswordBtn" class="text-link auth-forgot">¿Olvidaste tu contraseña?</button>':""}
    <button id="switchAuthMode" class="outline auth-switch">${register?"Ya tengo cuenta":"Crear mi perfil"}</button>`);

  document.getElementById("switchAuthMode").onclick=()=>realAuthModal(register?"login":"register");
  const forgot=document.getElementById("forgotPasswordBtn");
  if(forgot)forgot.onclick=requestPasswordResetModal;

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
      if(!data.session){feedback.innerHTML=authNotice("Cuenta creada. Ya podés ingresar con tus datos.");return}
    }else{
      const {error}=await sb.auth.signInWithPassword({email,password});
      if(error){feedback.innerHTML=authNotice(error.message);return}
    }
    await loadRealAccount();closeModal();realAccountModal();
  };
}

function requestPasswordResetModal(){
  openModal(`<div class="eyebrow">RECUPERAR ACCESO</div><h2>Restablecer contraseña</h2><p>Ingresá el email de tu cuenta. Te enviaremos un enlace para elegir una contraseña nueva.</p><form id="resetRequestForm" class="form-grid"><label>Email<input id="resetEmail" type="email" autocomplete="email" required></label><button class="primary gold">Enviar enlace</button><div id="resetFeedback"></div></form><button id="backToLogin" class="outline auth-switch">Volver a ingresar</button>`);
  document.getElementById("backToLogin").onclick=()=>realAuthModal("login");
  document.getElementById("resetRequestForm").onsubmit=async e=>{
    e.preventDefault();const fb=document.getElementById("resetFeedback");fb.innerHTML=authNotice("Enviando…");
    const email=document.getElementById("resetEmail").value.trim();
    const redirectTo=`${window.location.origin}${window.location.pathname}?recovery=1`;
    const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo});
    fb.innerHTML=error?authNotice(error.message):authNotice("Te enviamos el enlace. Revisá tu correo y también la carpeta de spam.");
  };
}

function showRecoveryPasswordModal(){
  openModal(`<div class="eyebrow">RECUPERAR ACCESO</div><h2>Elegí una contraseña nueva</h2><p>La nueva contraseña debe tener al menos 8 caracteres.</p><form id="recoveryPasswordForm" class="form-grid"><label>Nueva contraseña<input id="recoveryPassword" type="password" minlength="8" autocomplete="new-password" required></label><label>Repetir contraseña<input id="recoveryPassword2" type="password" minlength="8" autocomplete="new-password" required></label><button class="primary gold">Guardar nueva contraseña</button><div id="recoveryFeedback"></div></form>`);
  document.getElementById("recoveryPasswordForm").onsubmit=async e=>{
    e.preventDefault();const fb=document.getElementById("recoveryFeedback");const a=document.getElementById("recoveryPassword").value,b=document.getElementById("recoveryPassword2").value;
    if(a!==b){fb.innerHTML=authNotice("Las contraseñas no coinciden.");return}
    fb.innerHTML=authNotice("Guardando…");
    const {error}=await sb.auth.updateUser({password:a});
    if(error){fb.innerHTML=authNotice(error.message);return}
    passwordRecoveryIntent=false;
    history.replaceState(null,"",`${window.location.pathname}#realizadores`);
    fb.innerHTML=authNotice("Contraseña actualizada correctamente. Ya podés seguir usando tu cuenta.");
    setTimeout(async()=>{
      await loadRealAccount();
      closeModal();
      realAccountModal();
    },900);
  };
}

function rejectedProfileModal(){
  const reason=realState.moderation?.rejection_reason || "Tu perfil necesita correcciones antes de poder publicarse.";

  openModal(`
    <div class="rejected-screen">
      <div class="rejected-icon">!</div>
      <div class="eyebrow rejected-eyebrow">REVISIÓN DE CÓRDOBA CASTING</div>
      <h2>Tu perfil fue rechazado</h2>
      <p class="rejected-intro">No está publicado en Red de Realizadores. Antes de volver a enviarlo necesitamos que corrijas la información indicada.</p>

      <div class="rejection-reason">
        <span>MOTIVO DEL RECHAZO</span>
        <strong>${esc(reason)}</strong>
      </div>

      <div class="rejected-next">
        <h4>¿Qué tenés que hacer?</h4>
        <p>Editá tu perfil y corregí lo indicado arriba. <strong>Cuando guardes los cambios, tu perfil se enviará automáticamente otra vez a Córdoba Casting para una nueva revisión.</strong></p>
        <p>Hasta que sea aprobado nuevamente, no aparecerá en el directorio público.</p>
      </div>

      <div class="profile-actions">
        <button id="fixRejectedProfile" class="primary gold">Corregir mi perfil</button>
        <button id="logoutRejectedProfile" class="outline">Cerrar sesión</button>
      </div>
    </div>
  `,true);

  document.getElementById("fixRejectedProfile").onclick=realProfileModal;
  document.getElementById("logoutRejectedProfile").onclick=realLogout;
}

function profileStatusCopy(){
  const p=realState.profile,m=realState.moderation;
  if(!p)return "";
  if(p.status==="draft") return authNotice("BORRADOR · Completá tu perfil y envialo a revisión.");
  if(p.status==="pending") return authNotice("PENDIENTE · Córdoba Casting está revisando tu perfil.");
  if(p.status==="rejected") return `<div class="rejected-inline"><strong>PERFIL RECHAZADO</strong><span>${m?.rejection_reason?esc(m.rejection_reason):"Revisá el perfil y corregí lo solicitado."}</span><small>Al guardar tus correcciones se enviará automáticamente a una nueva revisión.</small></div>`;
  if(p.status==="approved") return authNotice(`${p.is_visible?"PUBLICADO":"APROBADO, OCULTO"}${p.verified?" · VERIFICADO POR CÓRDOBA CASTING":""}`);
  return "";
}


function avatarPublicUrlFromPath(path){
  if(!path)return "";
  const {data}=sb.storage.from("avatars").getPublicUrl(path);
  return data?.publicUrl||"";
}

async function compressAvatarFile(file){
  if(!file)return null;
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)) throw new Error("La foto debe ser JPG, PNG o WEBP.");
  const bitmap=await createImageBitmap(file);
  const maxSide=800;
  const scale=Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));
  const width=Math.max(1,Math.round(bitmap.width*scale));
  const height=Math.max(1,Math.round(bitmap.height*scale));
  const canvas=document.createElement("canvas");
  canvas.width=width; canvas.height=height;
  canvas.getContext("2d").drawImage(bitmap,0,0,width,height);
  bitmap.close?.();
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("No se pudo procesar la imagen.")),"image/webp",0.82));
  if(blob.size>2*1024*1024) throw new Error("La imagen procesada sigue superando los 2 MB. Probá con otra foto.");
  return blob;
}

async function uploadMyAvatar(file){
  const blob=await compressAvatarFile(file);
  const path=`${realState.user.id}/avatar`;
  const {error}=await sb.storage.from("avatars").upload(path,blob,{upsert:true,contentType:"image/webp",cacheControl:"3600"});
  if(error)throw error;
  const {error:rpcError}=await sb.rpc("set_my_avatar_path");
  if(rpcError)throw rpcError;
  return path;
}

async function removeMyAvatar(){
  const path=`${realState.user.id}/avatar`;
  await sb.storage.from("avatars").remove([path]);
  const {error}=await sb.rpc("clear_my_avatar_path");
  if(error)throw error;
}

async function openSignedScript(path){
  if(!path){ alert("Este perfil todavía no tiene una muestra de guion publicada."); return; }
  const {data,error}=await sb.storage.from("scripts").createSignedUrl(path,300);
  if(error){ alert("No se pudo abrir la muestra de guion: "+error.message); return; }
  window.open(data.signedUrl,"_blank","noopener,noreferrer");
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
      <div class="conditional-box avatar-editor-box"><h5>Foto de perfil</h5><div class="avatar-editor-row"><div id="realAvatarPreview" class="profile-avatar avatar-edit-preview">${p.avatar_path?`<img src="${avatarPublicUrlFromPath(p.avatar_path)}" alt="${esc(p.full_name||"Perfil")}">`:initials(p.full_name||"RR")}</div><div><input id="realAvatarFile" type="file" accept="image/jpeg,image/png,image/webp"><p>Se reduce automáticamente para web. Máximo 2 MB después de procesarla.</p>${p.avatar_path?`<button id="removeRealAvatar" type="button" class="outline mini-action">Quitar foto</button>`:""}</div></div></div>
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
        ${p.status==="draft"?`<button id="realSubmitReview" type="button" class="primary gold">Enviar a revisión</button>`:""}
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
  const avatarFileInput=document.getElementById("realAvatarFile");
  if(avatarFileInput){avatarFileInput.onchange=()=>{const file=avatarFileInput.files?.[0];if(!file)return;document.getElementById("realAvatarPreview").innerHTML=`<img src="${URL.createObjectURL(file)}" alt="Vista previa">`;};}
  const removeAvatarBtn=document.getElementById("removeRealAvatar");
  if(removeAvatarBtn){removeAvatarBtn.onclick=async()=>{if(!confirm("¿Quitar tu foto de perfil?"))return;try{await removeMyAvatar();await loadRealAccount();realProfileModal()}catch(e){alert(e.message)}};}
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
      ? `<div class="conditional-box"><h5>Muestra de guion · PDF</h5><p>Solo para Guion como rol principal. Se guarda un único PDF.</p><input id="realScriptFile" type="file" accept="application/pdf"><small>${p.script_pdf_path?"PDF cargado. Podés reemplazarlo.":"Sin PDF cargado."}</small>${p.script_pdf_path?`<button id="viewMyScriptPdf" type="button" class="outline mini-action">Ver PDF actual</button>`:""}</div>`
      : `<label>Reel / video único<input id="realReel" value="${esc(p.reel_url||"")}" placeholder="https://youtube.com/..."><span class="char-count">Solo YouTube o Vimeo.</span></label>`;
  };
  roleSelect.onchange=()=>{renderMaterial();const b=document.getElementById("viewMyScriptPdf");if(b)b.onclick=()=>openSignedScript(p.script_pdf_path)}; drawTags(); renderMaterial(); const currentPdfBtn=document.getElementById("viewMyScriptPdf");if(currentPdfBtn)currentPdfBtn.onclick=()=>openSignedScript(p.script_pdf_path);

  document.getElementById("realProfileForm").onsubmit=async e=>{
    e.preventDefault();
    const fb=document.getElementById("profileFeedback");
    fb.innerHTML=authNotice("Guardando…");
    const role=realState.roles.find(r=>String(r.id)===String(roleSelect.value))?.name;
    const reel=role==="Guion"?null:document.getElementById("realReel").value.trim()||null;
    if(reel && !embedUrl(reel)){fb.innerHTML=authNotice("El reel debe ser un enlace válido de YouTube o Vimeo.");return}

    const avatarFile=document.getElementById("realAvatarFile")?.files?.[0];
    if(avatarFile){try{fb.innerHTML=authNotice("Procesando foto…");await uploadMyAvatar(avatarFile)}catch(e){fb.innerHTML=authNotice(e.message);return}}
    fb.innerHTML=authNotice("Guardando perfil…");
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

    const wasRejected = p.status==="rejected";

    if(wasRejected){
      const {error:submitError}=await sb.rpc("submit_profile_for_review");
      if(submitError){
        fb.innerHTML=authNotice("Los cambios se guardaron, pero no pudimos reenviar el perfil a revisión: "+submitError.message);
        return;
      }
    }

    await loadRealAccount();

    if(wasRejected){
      openModal(`
        <div class="submitted-again">
          <div class="submitted-icon">✓</div>
          <div class="eyebrow">CÓRDOBA CASTING / REVISIÓN</div>
          <h2>Perfil reenviado</h2>
          <p>Guardamos tus correcciones y tu perfil volvió a quedar <strong>Pendiente de aprobación</strong>.</p>
          <p>Córdoba Casting lo revisará nuevamente antes de que vuelva a publicarse.</p>
          <button id="closeResubmitted" class="primary gold">Entendido</button>
        </div>
      `);
      document.getElementById("closeResubmitted").onclick=closeModal;
    }else{
      realProfileModal();
    }
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


async function renderAdministration(){
  if(!realState.user){
    realAuthModal("login");
    location.hash="#realizadores";
    return;
  }
  if(!realState.isAdmin){
    app.innerHTML=`<section class="wrap admin-page"><div class="eyebrow">ADMINISTRACIÓN</div><h1 class="page-title">Acceso restringido.</h1><p>Esta sección solamente está disponible para administradores de Córdoba Casting.</p></section>`;
    return;
  }

  app.innerHTML=`<section class="wrap admin-page">
    <div class="admin-page-head">
      <div>
        <div class="eyebrow">CÓRDOBA CASTING / ADMINISTRACIÓN</div>
        <h1 class="page-title">Panel de administración.</h1>
        <p>Gestioná perfiles, búsquedas, postulaciones y la biblioteca de recursos desde un único lugar.</p>
      </div>
    </div>

    <div class="admin-page-tabs">
      <button data-admin-section="profiles" class="active">Perfiles</button>
      <button data-admin-section="jobs">Búsquedas</button>
      <button data-admin-section="applications">Postulaciones</button>
      <button data-admin-section="resources">Recursos</button>
    </div>

    <div id="adminPageContent" class="admin-page-content"></div>
  </section>`;

  document.querySelectorAll("[data-admin-section]").forEach(b=>b.onclick=()=>{
    document.querySelectorAll("[data-admin-section]").forEach(x=>x.classList.toggle("active",x===b));
    if(b.dataset.adminSection==="profiles")renderAdminProfilesSection("pending");
    if(b.dataset.adminSection==="jobs")renderAdminJobsSection();
    if(b.dataset.adminSection==="applications")renderAdminApplicationsSection();
    if(b.dataset.adminSection==="resources")renderAdminResourcesSection();
  });

  await renderAdminProfilesSection("pending");
}

async function renderAdminProfilesSection(filter="pending"){
  const content=document.getElementById("adminPageContent");
  if(!content)return;
  content.innerHTML=`<div class="admin-subtoolbar">
    <button data-admin-profile-filter="pending" ${filter==="pending"?'class="active"':""}>Pendientes</button>
    <button data-admin-profile-filter="approved" ${filter==="approved"?'class="active"':""}>Publicados</button>
    <button data-admin-profile-filter="rejected" ${filter==="rejected"?'class="active"':""}>Rechazados</button>
    <button data-admin-profile-filter="all" ${filter==="all"?'class="active"':""}>Todos</button>
  </div><div id="adminProfilesList">${authNotice("Cargando perfiles…")}</div>`;

  document.querySelectorAll("[data-admin-profile-filter]").forEach(b=>b.onclick=()=>renderAdminProfilesSection(b.dataset.adminProfileFilter));

  let query=sb.from("profiles")
    .select("*, roles:primary_role_id(name), profile_moderation(rejection_reason,submitted_at,reviewed_at), profile_tags(tag)")
    .order("created_at",{ascending:false});

  if(filter!=="all")query=query.eq("status",filter);

  const {data,error}=await query;
  const list=document.getElementById("adminProfilesList");
  if(error){list.innerHTML=authNotice(error.message);return}

  list.innerHTML=(data||[]).map(p=>`<div class="admin-row">
    <div>
      <h4>${esc(p.full_name||"(Sin nombre)")} ${p.verified?verifiedBadge(false):""}</h4>
      <div class="secondary">${esc(p.roles?.name||"Sin rol")} · ${(p.profile_tags||[]).map(t=>esc(t.tag)).join(" · ")}</div>
      <small>Estado: ${String(p.status).toUpperCase()} · ${p.is_visible?"VISIBLE":"OCULTO"}${p.profile_moderation?.[0]?.rejection_reason?` · ${esc(p.profile_moderation[0].rejection_reason)}`:""}</small>
    </div>
    <div class="admin-actions">
      <button data-ap-view="${p.id}">Ver completo</button>
      ${p.status!=="approved"?`<button data-ap-approve="${p.id}">Aprobar</button><button data-ap-approveverify="${p.id}">Aprobar + verificar</button>`:""}
      ${p.status!=="rejected"?`<button data-ap-reject="${p.id}">Rechazar</button>`:""}
      ${p.status==="approved"?`<button data-ap-verify="${p.id}" data-value="${p.verified?"false":"true"}">${p.verified?"Quitar verificación":"Verificar"}</button><button data-ap-visible="${p.id}" data-value="${p.is_visible?"false":"true"}">${p.is_visible?"Ocultar":"Mostrar"}</button>`:""}
    </div>
  </div>`).join("")||"<p>No hay perfiles en esta categoría.</p>";

  document.querySelectorAll("[data-ap-view]").forEach(b=>b.onclick=()=>realAdminPreview(b.dataset.apView));
  document.querySelectorAll("[data-ap-approve]").forEach(b=>b.onclick=async()=>{
    const {error}=await sb.rpc("admin_approve_profile",{target_profile:b.dataset.apApprove,make_verified:false});
    if(error)alert(error.message);else {await loadPublicProfilesIntoExistingUI();renderAdminProfilesSection(filter)}
  });
  document.querySelectorAll("[data-ap-approveverify]").forEach(b=>b.onclick=async()=>{
    const {error}=await sb.rpc("admin_approve_profile",{target_profile:b.dataset.apApproveverify,make_verified:true});
    if(error)alert(error.message);else {await loadPublicProfilesIntoExistingUI();renderAdminProfilesSection(filter)}
  });
  document.querySelectorAll("[data-ap-reject]").forEach(b=>b.onclick=async()=>{
    const reason=prompt("Motivo del rechazo (se mostrará claramente en la cuenta del usuario):");
    if(!reason)return;
    const {error}=await sb.rpc("admin_reject_profile",{target_profile:b.dataset.apReject,reason});
    if(error)alert(error.message);else {await loadPublicProfilesIntoExistingUI();renderAdminProfilesSection(filter)}
  });
  document.querySelectorAll("[data-ap-verify]").forEach(b=>b.onclick=async()=>{
    const {error}=await sb.rpc("admin_set_verified",{target_profile:b.dataset.apVerify,value:b.dataset.value==="true"});
    if(error)alert(error.message);else {await loadPublicProfilesIntoExistingUI();renderAdminProfilesSection(filter)}
  });
  document.querySelectorAll("[data-ap-visible]").forEach(b=>b.onclick=async()=>{
    const {error}=await sb.rpc("admin_set_visibility",{target_profile:b.dataset.apVisible,value:b.dataset.value==="true"});
    if(error)alert(error.message);else {await loadPublicProfilesIntoExistingUI();renderAdminProfilesSection(filter)}
  });
}

async function renderAdminJobsSection(){
  const content=document.getElementById("adminPageContent");
  if(!content)return;
  content.innerHTML=authNotice("Cargando búsquedas…");

  const {data,error}=await sb.from("job_posts").select("*").order("created_at",{ascending:false});
  if(error){content.innerHTML=authNotice(error.message);return}

  const rows=data||[];
  const jobIds=rows.map(j=>j.id);
  const authorIds=[...new Set(rows.map(j=>j.author_id))];

  let rolesData=[],authorsData=[];
  if(jobIds.length){
    const r=await sb.from("job_post_roles").select("job_post_id,role_id").in("job_post_id",jobIds);
    rolesData=r.data||[];
  }
  if(authorIds.length){
    const r=await sb.from("profiles").select("id,full_name").in("id",authorIds);
    authorsData=r.data||[];
  }

  const rmap=new Map(realState.roles.map(r=>[Number(r.id),r.name]));
  const amap=new Map(authorsData.map(a=>[a.id,a.full_name]));

  content.innerHTML=`<div class="admin-section-intro"><strong>${rows.length}</strong> búsquedas totales · activas y expiradas.</div>
    <div class="admin-list">${rows.map(j=>{
      const active=new Date(j.expires_at)>new Date();
      const roles=rolesData.filter(r=>Number(r.job_post_id)===Number(j.id)).map(r=>rmap.get(Number(r.role_id))).filter(Boolean);
      return `<div class="admin-row">
        <div>
          <h4>${esc(j.title)}</h4>
          <div class="secondary">${roles.map(esc).join(" · ")}</div>
          <small>${active?`ACTIVA · ${esc(remainingLabel(j.expires_at))} restantes`:"EXPIRADA"} · por ${esc(amap.get(j.author_id)||"Realizador")} · ${j.is_student_project?"ESTUDIANTIL":"NO ESTUDIANTIL"} · ${j.is_paid?"REMUNERADA":"NO INDICA REMUNERACIÓN"}</small>
        </div>
        <div class="admin-actions">
          <button data-aj-view="${j.id}">Ver</button>
          <button data-aj-edit="${j.id}">Editar</button>
          <button class="danger" data-aj-delete="${j.id}">Eliminar</button>
        </div>
      </div>`;
    }).join("")||"<p>No hay búsquedas.</p>"}</div>`;

  document.querySelectorAll("[data-aj-view]").forEach(b=>b.onclick=()=>adminViewJobModal(Number(b.dataset.ajView)));
  document.querySelectorAll("[data-aj-edit]").forEach(b=>b.onclick=()=>adminEditJobModal(Number(b.dataset.ajEdit)));
  document.querySelectorAll("[data-aj-delete]").forEach(b=>b.onclick=async()=>{
    if(!confirm("¿Eliminar definitivamente esta búsqueda y sus postulaciones?"))return;
    const {error}=await sb.from("job_posts").delete().eq("id",Number(b.dataset.ajDelete));
    if(error)alert(error.message);else {await loadRealJobs();renderAdminJobsSection()}
  });
}

async function getAdminJobBundle(id){
  const [job,roles]=await Promise.all([
    sb.from("job_posts").select("*").eq("id",id).single(),
    sb.from("job_post_roles").select("role_id").eq("job_post_id",id)
  ]);
  if(job.error)throw job.error;
  if(roles.error)throw roles.error;
  return {job:job.data,roleIds:(roles.data||[]).map(x=>Number(x.role_id))};
}

async function adminViewJobModal(id){
  try{
    const {job,roleIds}=await getAdminJobBundle(id);
    const roleNames=roleIds.map(x=>realState.roles.find(r=>Number(r.id)===x)?.name).filter(Boolean);
    const active=new Date(job.expires_at)>new Date();
    openModal(`<div class="eyebrow">ADMIN / BÚSQUEDA</div>
      <h2>${esc(job.title)}</h2>
      <div class="category-tags">${job.is_student_project?'<span class="tag red">ESTUDIANTIL</span>':""}${job.is_paid?'<span class="tag gold">REMUNERADA</span>':'<span class="tag">NO INDICA REMUNERACIÓN</span>'}</div>
      <div class="profile-section"><h4>Roles</h4><div class="role-tags">${roleNames.map(r=>`<span class="pill on">${esc(r)}</span>`).join("")}</div></div>
      <div class="profile-section"><h4>Descripción</h4><p>${esc(job.description)}</p></div>
      <div class="profile-section"><h4>Estado</h4><p><strong>${active?"ACTIVA":"EXPIRADA"}</strong>${active?` · ${esc(remainingLabel(job.expires_at))} restantes`:""}</p></div>
      <div class="profile-actions"><button id="adminEditThisJob" class="primary gold">Editar búsqueda</button></div>`,true);
    document.getElementById("adminEditThisJob").onclick=()=>adminEditJobModal(id);
  }catch(e){alert(e.message)}
}

async function adminEditJobModal(id){
  try{
    const {job,roleIds}=await getAdminJobBundle(id);
    openModal(`<div class="eyebrow">ADMIN / EDITAR BÚSQUEDA</div>
      <h2>Editar búsqueda</h2>
      <form id="adminJobEditForm" class="form-grid">
        <label>Título<input id="adminJobTitle" maxlength="120" required value="${esc(job.title)}"></label>
        <div class="field">
          <label>Roles buscados <small>(máximo 3)</small></label>
          <div class="role-checks" id="adminJobRoleChecks">${realState.roles.map(r=>`<label><input type="checkbox" value="${r.id}" ${roleIds.includes(Number(r.id))?"checked":""}> ${esc(r.name)}</label>`).join("")}</div>
          <div id="adminJobRoleCount" class="char-count">${roleIds.length} / 3 roles</div>
        </div>
        <label>Descripción<textarea id="adminJobDescription" maxlength="800" required>${esc(job.description)}</textarea></label>
        <label>Vigencia desde ahora<select id="adminJobExpiry">${Array.from({length:10},(_,i)=>`<option value="${i+1}">${i+1} día${i?"s":""}</option>`).join("")}</select><span class="char-count">Al guardar, la fecha de expiración se recalcula desde ahora.</span></label>
        <div class="modal-checks">
          <label class="check"><input id="adminJobStudent" type="checkbox" ${job.is_student_project?"checked":""}> Proyecto estudiantil</label>
          <label class="check"><input id="adminJobPaid" type="checkbox" ${job.is_paid?"checked":""}> Remunerado</label>
        </div>
        <button class="primary gold">Guardar cambios</button>
        <div id="adminJobFeedback"></div>
      </form>`,true);

    const checks=[...document.querySelectorAll("#adminJobRoleChecks input")];
    const count=document.getElementById("adminJobRoleCount");
    checks.forEach(c=>c.onchange=()=>{
      if(checks.filter(x=>x.checked).length>3)c.checked=false;
      count.textContent=`${checks.filter(x=>x.checked).length} / 3 roles`;
    });

    document.getElementById("adminJobEditForm").onsubmit=async e=>{
      e.preventDefault();
      const selected=checks.filter(x=>x.checked).map(x=>Number(x.value));
      const fb=document.getElementById("adminJobFeedback");
      if(!selected.length){fb.innerHTML=authNotice("Elegí al menos un rol.");return}
      fb.innerHTML=authNotice("Guardando…");

      const days=Number(document.getElementById("adminJobExpiry").value);
      const expires=new Date(Date.now()+days*86400000).toISOString();

      const {error}=await sb.from("job_posts").update({
        title:document.getElementById("adminJobTitle").value.trim(),
        description:document.getElementById("adminJobDescription").value.trim(),
        is_student_project:document.getElementById("adminJobStudent").checked,
        is_paid:document.getElementById("adminJobPaid").checked,
        expires_at:expires
      }).eq("id",id);

      if(error){fb.innerHTML=authNotice(error.message);return}

      const del=await sb.from("job_post_roles").delete().eq("job_post_id",id);
      if(del.error){fb.innerHTML=authNotice(del.error.message);return}
      const ins=await sb.from("job_post_roles").insert(selected.map(role_id=>({job_post_id:id,role_id})));
      if(ins.error){fb.innerHTML=authNotice(ins.error.message);return}

      await loadRealJobs();
      closeModal();
      renderAdminJobsSection();
    };
  }catch(e){alert(e.message)}
}

async function renderAdminResourcesSection(){
  const content=document.getElementById("adminPageContent");
  if(!content)return;
  content.innerHTML=authNotice("Cargando recursos…");
  const {data,error}=await sb.from("resources").select("*")
    .order("sort_order",{ascending:true}).order("created_at",{ascending:false});
  if(error){content.innerHTML=`${authNotice(error.message)}<p class="admin-hint">Si todavía no creaste la tabla, ejecutá <strong>09_resources.sql</strong> en Supabase.</p>`;return}
  const rows=data||[];
  content.innerHTML=`<div class="admin-resource-head">
    <div class="admin-section-intro"><strong>${rows.length}</strong> recursos totales · ${rows.filter(r=>r.is_visible).length} publicados.</div>
    <button id="adminNewResource" class="gold-btn">+ Nuevo recurso</button>
  </div>
  <div class="admin-list">${rows.map(r=>`<div class="admin-row admin-resource-row">
    <div>
      <div class="admin-resource-type">${resourceTypeLabel(r.resource_type)} · ${esc(r.category||"Otros")}${r.is_featured?" · ★ DESTACADO":""}</div>
      <h4>${esc(r.title)}</h4>
      <div class="secondary">${esc(r.excerpt||"")}</div>
      <small>${r.is_visible?"PUBLICADO":"OCULTO"} · ORDEN ${Number(r.sort_order)||0} · actualizado ${resourceDateLabel(r.updated_at)}</small>
    </div>
    <div class="admin-actions">
      ${r.resource_type==="article"?`<button data-ar-view="${r.id}">Ver</button>`:""}
      <button data-ar-edit="${r.id}">Editar</button>
      <button data-ar-visible="${r.id}" data-value="${r.is_visible?"false":"true"}">${r.is_visible?"Ocultar":"Publicar"}</button>
      <button class="danger" data-ar-delete="${r.id}">Eliminar</button>
    </div>
  </div>`).join("")||'<div class="resources-empty compact"><h2>Todavía no cargaste recursos.</h2><p>Creá el primero desde el botón de arriba.</p></div>'}</div>`;
  document.getElementById("adminNewResource").onclick=()=>adminResourceModal();
  document.querySelectorAll("[data-ar-view]").forEach(b=>b.onclick=()=>{location.hash=`#recurso/${b.dataset.arView}`});
  document.querySelectorAll("[data-ar-edit]").forEach(b=>b.onclick=()=>adminResourceModal(rows.find(r=>Number(r.id)===Number(b.dataset.arEdit))));
  document.querySelectorAll("[data-ar-visible]").forEach(b=>b.onclick=async()=>{
    const {error}=await sb.from("resources").update({is_visible:b.dataset.value==="true"}).eq("id",Number(b.dataset.arVisible));
    if(error)alert(error.message);else renderAdminResourcesSection();
  });
  document.querySelectorAll("[data-ar-delete]").forEach(b=>b.onclick=async()=>{
    if(!confirm("¿Eliminar definitivamente este recurso? Esta acción no se puede deshacer."))return;
    const {error}=await sb.from("resources").delete().eq("id",Number(b.dataset.arDelete));
    if(error)alert(error.message);else renderAdminResourcesSection();
  });
}
function adminResourceModal(resource=null){
  const editing=!!resource;
  const r=resource||{resource_type:"download",title:"",excerpt:"",category:"Preproducción",cover_url:"",content:"",pdf_url:"",editable_url:"",is_visible:true,is_featured:false,sort_order:0};
  openModal(`<div class="eyebrow">ADMIN / RECURSOS</div>
    <h2>${editing?"Editar recurso":"Nuevo recurso"}</h2>
    <form id="adminResourceForm" class="form-grid resource-admin-form">
      <label>Tipo de recurso<select id="resourceType"><option value="download" ${r.resource_type==="download"?"selected":""}>Descargable</option><option value="article" ${r.resource_type==="article"?"selected":""}>Guía / tutorial</option></select></label>
      <label>Título<input id="resourceTitle" maxlength="140" required value="${esc(r.title)}" placeholder="Ej: Planilla de scouting de locación"></label>
      <label>Descripción breve<textarea id="resourceExcerpt" maxlength="320" required placeholder="Una o dos líneas para explicar qué va a encontrar la persona.">${esc(r.excerpt||"")}</textarea><span class="char-count">Máximo 320 caracteres.</span></label>
      <div class="resource-admin-two">
        <label>Categoría<input id="resourceCategory" maxlength="60" required value="${esc(r.category||"Preproducción")}" list="resourceCategoryOptions"></label>
        <label>Orden<input id="resourceSort" type="number" min="0" max="9999" value="${Number(r.sort_order)||0}"><span class="char-count">0 aparece antes que 10.</span></label>
      </div>
      <datalist id="resourceCategoryOptions"><option>Preproducción</option><option>Rodaje</option><option>Dirección</option><option>Guion</option><option>Producción</option><option>Postproducción</option><option>Sonido</option><option>Arte</option><option>Otros</option></datalist>
      <label>URL de portada <span class="optional-label">opcional</span><input id="resourceCover" type="url" value="${esc(r.cover_url||"")}" placeholder="https://..."><span class="char-count">Puede ser una imagen alojada en tu web, Drive público, etc.</span></label>
      <div id="resourceDownloadFields" class="resource-admin-conditional">
        <div class="resource-admin-two">
          <label>Link PDF <span class="optional-label">opcional</span><input id="resourcePdf" type="url" value="${esc(r.pdf_url||"")}" placeholder="https://..."></label>
          <label>Link editable <span class="optional-label">opcional</span><input id="resourceEditable" type="url" value="${esc(r.editable_url||"")}" placeholder="https://..."></label>
        </div>
        <span class="char-count">En un descargable debe existir al menos uno de los dos links.</span>
      </div>
      <div id="resourceArticleFields" class="resource-admin-conditional">
        <label>Contenido del tutorial<textarea id="resourceContent" class="resource-content-editor" placeholder="Escribí el tutorial acá...">${esc(r.content||"")}</textarea></label>
        <div class="resource-format-help"><strong>Formato simple:</strong> <code>## Subtítulo</code> · <code>### Subtítulo menor</code> · <code>- item de lista</code> · <code>&gt; cita</code> · <code>**negrita**</code>. Los links https:// se vuelven clickeables.</div>
      </div>
      <div class="modal-checks">
        <label class="check"><input id="resourceVisible" type="checkbox" ${r.is_visible?"checked":""}> Publicado / visible</label>
        <label class="check"><input id="resourceFeatured" type="checkbox" ${r.is_featured?"checked":""}> Destacado</label>
      </div>
      <div id="resourceAdminFeedback"></div>
      <button class="primary gold" type="submit">${editing?"Guardar cambios":"Crear recurso"}</button>
    </form>`,true);
  const type=document.getElementById("resourceType");
  const download=document.getElementById("resourceDownloadFields");
  const article=document.getElementById("resourceArticleFields");
  const sync=()=>{const isArticle=type.value==="article";download.hidden=isArticle;article.hidden=!isArticle};
  type.onchange=sync;sync();
  document.getElementById("adminResourceForm").onsubmit=async e=>{
    e.preventDefault();
    const fb=document.getElementById("resourceAdminFeedback");
    const resource_type=type.value;
    const pdf_url=document.getElementById("resourcePdf").value.trim()||null;
    const editable_url=document.getElementById("resourceEditable").value.trim()||null;
    const content=document.getElementById("resourceContent").value.trim()||null;
    if(resource_type==="download"&&!pdf_url&&!editable_url){fb.innerHTML=authNotice("Agregá al menos un link: PDF o editable.");return}
    if(resource_type==="article"&&!content){fb.innerHTML=authNotice("Escribí el contenido del tutorial.");return}
    const payload={
      resource_type,
      title:document.getElementById("resourceTitle").value.trim(),
      excerpt:document.getElementById("resourceExcerpt").value.trim(),
      category:document.getElementById("resourceCategory").value.trim(),
      cover_url:document.getElementById("resourceCover").value.trim()||null,
      content:resource_type==="article"?content:null,
      pdf_url:resource_type==="download"?pdf_url:null,
      editable_url:resource_type==="download"?editable_url:null,
      is_visible:document.getElementById("resourceVisible").checked,
      is_featured:document.getElementById("resourceFeatured").checked,
      sort_order:Math.max(0,Number(document.getElementById("resourceSort").value)||0)
    };
    fb.innerHTML=authNotice("Guardando…");
    let result;
    if(editing)result=await sb.from("resources").update(payload).eq("id",r.id);
    else result=await sb.from("resources").insert({...payload,created_by:realState.user.id});
    if(result.error){fb.innerHTML=authNotice(result.error.message);return}
    closeModal();
    renderAdminResourcesSection();
  };
}

async function renderAdminApplicationsSection(){
  const content=document.getElementById("adminPageContent");
  if(!content)return;
  content.innerHTML=authNotice("Cargando postulaciones…");

  const {data,error}=await sb.from("job_applications")
    .select("id,job_post_id,applicant_id,created_at,is_visible")
    .order("created_at",{ascending:false});

  if(error){content.innerHTML=authNotice(error.message);return}

  const apps=data||[];
  const jobIds=[...new Set(apps.map(a=>a.job_post_id))];
  const applicantIds=[...new Set(apps.map(a=>a.applicant_id))];

  let jobsData=[],profilesData=[];
  if(jobIds.length){
    const r=await sb.from("job_posts").select("id,title").in("id",jobIds);
    jobsData=r.data||[];
  }
  if(applicantIds.length){
    const r=await sb.from("profiles").select("id,full_name,primary_role_id,roles:primary_role_id(name)").in("id",applicantIds);
    profilesData=r.data||[];
  }

  const jmap=new Map(jobsData.map(j=>[Number(j.id),j]));
  const pmap=new Map(profilesData.map(p=>[p.id,p]));

  content.innerHTML=`<div class="admin-section-intro"><strong>${apps.length}</strong> postulaciones totales.</div><div class="admin-list">${
    apps.map(a=>{
      const j=jmap.get(Number(a.job_post_id)),p=pmap.get(a.applicant_id);
      return `<div class="admin-row">
        <div>
          <h4>${esc(p?.full_name||"Perfil")}</h4>
          <div class="secondary">${esc(p?.roles?.name||"Sin rol")} → ${esc(j?.title||"Búsqueda")}</div>
          <small>${a.is_visible?"VISIBLE PARA EL AUTOR":"OCULTA POR ADMINISTRACIÓN"}</small>
        </div>
        <div class="admin-actions">
          <button data-aa-view="${a.applicant_id}">Ver perfil</button>
          <button data-aa-toggle="${a.id}" data-value="${a.is_visible?"false":"true"}">${a.is_visible?"Ocultar":"Mostrar"}</button>
          <button class="danger" data-aa-delete="${a.id}">Eliminar</button>
        </div>
      </div>`;
    }).join("")||"<p>No hay postulaciones.</p>"
  }</div>`;

  document.querySelectorAll("[data-aa-view]").forEach(b=>b.onclick=()=>profileModal(b.dataset.aaView));
  document.querySelectorAll("[data-aa-toggle]").forEach(b=>b.onclick=async()=>{
    const {error}=await sb.from("job_applications").update({is_visible:b.dataset.value==="true"}).eq("id",Number(b.dataset.aaToggle));
    if(error)alert(error.message);else renderAdminApplicationsSection();
  });
  document.querySelectorAll("[data-aa-delete]").forEach(b=>b.onclick=async()=>{
    if(!confirm("¿Eliminar definitivamente esta postulación?"))return;
    const {error}=await sb.from("job_applications").delete().eq("id",Number(b.dataset.aaDelete));
    if(error)alert(error.message);else renderAdminApplicationsSection();
  });
}

async function realAdminPanel(){
  openModal(`<div class="eyebrow">CÓRDOBA CASTING / ADMIN REAL</div><h2>Gestión de perfiles</h2><p>Esta vista ya consulta tu proyecto Supabase real.</p><div class="admin-toolbar"><button data-real-admin-filter="pending">Pendientes</button><button data-real-admin-filter="approved">Publicados</button><button data-real-admin-filter="rejected">Rechazados</button><button data-real-admin-filter="all">Todos</button><button id="realAdminApplications">Postulaciones</button><button id="realAdminLogout">Salir</button></div><div id="realAdminList" class="admin-panel">${authNotice("Cargando…")}</div>`,true);
  document.getElementById("realAdminLogout").onclick=realLogout;
  document.querySelectorAll("[data-real-admin-filter]").forEach(b=>b.onclick=()=>drawRealAdmin(b.dataset.realAdminFilter));
  document.getElementById("realAdminApplications").onclick=drawRealAdminApplications;
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
  document.querySelectorAll("[data-real-approve]").forEach(b=>b.onclick=async()=>{const {error}=await sb.rpc("admin_approve_profile",{target_profile:b.dataset.realApprove,make_verified:false});if(error)alert(error.message);else {await loadPublicProfilesIntoExistingUI();drawRealAdmin(filter)}});
  document.querySelectorAll("[data-real-approve-verify]").forEach(b=>b.onclick=async()=>{const {error}=await sb.rpc("admin_approve_profile",{target_profile:b.dataset.realApproveVerify,make_verified:true});if(error)alert(error.message);else {await loadPublicProfilesIntoExistingUI();drawRealAdmin(filter)}});
  document.querySelectorAll("[data-real-reject]").forEach(b=>b.onclick=async()=>{const reason=prompt("Motivo de rechazo (se guardará en la cuenta del usuario; el email todavía no está conectado):");if(!reason)return;const {error}=await sb.rpc("admin_reject_profile",{target_profile:b.dataset.realReject,reason});if(error)alert(error.message);else {await loadPublicProfilesIntoExistingUI();drawRealAdmin(filter)}});
  document.querySelectorAll("[data-real-verify]").forEach(b=>b.onclick=async()=>{const {error}=await sb.rpc("admin_set_verified",{target_profile:b.dataset.realVerify,value:b.dataset.value==="true"});if(error)alert(error.message);else {await loadPublicProfilesIntoExistingUI();drawRealAdmin(filter)}});
  document.querySelectorAll("[data-real-visible]").forEach(b=>b.onclick=async()=>{const {error}=await sb.rpc("admin_set_visibility",{target_profile:b.dataset.realVisible,value:b.dataset.value==="true"});if(error)alert(error.message);else {await loadPublicProfilesIntoExistingUI();drawRealAdmin(filter)}});
}


async function drawRealAdminApplications(){
  const list=document.getElementById("realAdminList");
  list.innerHTML=authNotice("Cargando postulaciones…");

  const {data,error}=await sb.from("job_applications")
    .select("id,job_post_id,applicant_id,created_at,is_visible")
    .order("created_at",{ascending:false});

  if(error){list.innerHTML=authNotice(error.message);return}

  const apps=data||[];
  const jobIds=[...new Set(apps.map(a=>a.job_post_id))];
  const applicantIds=[...new Set(apps.map(a=>a.applicant_id))];

  let jobsData=[],profilesData=[];
  if(jobIds.length){
    const r=await sb.from("job_posts").select("id,title").in("id",jobIds);
    jobsData=r.data||[];
  }
  if(applicantIds.length){
    const r=await sb.from("profiles").select("id,full_name,primary_role_id,roles:primary_role_id(name)").in("id",applicantIds);
    profilesData=r.data||[];
  }

  const jmap=new Map(jobsData.map(j=>[Number(j.id),j]));
  const pmap=new Map(profilesData.map(p=>[p.id,p]));

  list.innerHTML=apps.length?apps.map(a=>{
    const j=jmap.get(Number(a.job_post_id)),p=pmap.get(a.applicant_id);
    return `<div class="admin-row">
      <div>
        <h4>${esc(p?.full_name||"Perfil")}</h4>
        <div class="secondary">${esc(p?.roles?.name||"Sin rol")} → ${esc(j?.title||"Búsqueda")}</div>
        <small>${a.is_visible?"VISIBLE PARA EL AUTOR":"OCULTA POR ADMINISTRACIÓN"}</small>
      </div>
      <div class="admin-actions">
        <button data-admin-app-view="${a.applicant_id}">Ver perfil</button>
        <button data-admin-app-toggle="${a.id}" data-value="${a.is_visible?"false":"true"}">${a.is_visible?"Ocultar":"Mostrar"}</button>
        <button class="danger" data-admin-app-delete="${a.id}">Eliminar</button>
      </div>
    </div>`;
  }).join(""):"<p>No hay postulaciones.</p>";

  document.querySelectorAll("[data-admin-app-view]").forEach(b=>b.onclick=()=>profileModal(b.dataset.adminAppView));
  document.querySelectorAll("[data-admin-app-toggle]").forEach(b=>b.onclick=async()=>{
    const {error}=await sb.from("job_applications")
      .update({is_visible:b.dataset.value==="true"})
      .eq("id",Number(b.dataset.adminAppToggle));
    if(error)alert(error.message);else drawRealAdminApplications();
  });
  document.querySelectorAll("[data-admin-app-delete]").forEach(b=>b.onclick=async()=>{
    if(!confirm("¿Eliminar definitivamente esta postulación?"))return;
    const {error}=await sb.from("job_applications").delete().eq("id",Number(b.dataset.adminAppDelete));
    if(error)alert(error.message);else drawRealAdminApplications();
  });
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
  openModal(`<div class="eyebrow">REVISIÓN ADMINISTRATIVA REAL</div><div class="profile-top"><div class="profile-avatar">${x.avatar_path?`<img src="${avatarPublicUrlFromPath(x.avatar_path)}" alt="${esc(x.full_name||"Perfil")}">`:initials(x.full_name||"RR")}</div><div><div class="profile-role">${esc(x.roles?.name||"Sin rol")}</div><div class="profile-name">${esc(x.full_name||"(Sin nombre)")}</div><div class="secondary">${(tags.data||[]).map(t=>esc(t.tag)).join(" · ")}</div></div><div class="profile-score"><strong>${String(x.status).toUpperCase()}</strong>${x.is_visible?"VISIBLE":"OCULTO"}</div></div><div class="profile-section"><h4>Descripción</h4><p>${esc(x.bio||"Sin descripción")}</p></div>${x.roles?.name==="Guion"?`<div class="profile-section"><h4>Muestra de guion</h4>${x.script_pdf_path?`<div class="pdf-card"><div><strong>PDF cargado</strong><small>Muestra de guion del perfil</small></div><button id="adminOpenScriptPdf">Ver PDF</button></div>`:"<p>Sin PDF cargado.</p>"}</div>`:`<div class="profile-section"><h4>Reel</h4>${embed?`<div class="video-card"><iframe src="${embed}" allowfullscreen></iframe></div>`:"<p>Sin reel válido.</p>"}</div>`}<div class="profile-section"><h4>Contacto privado</h4><p>${esc(priv.data?.contact_type||"—")}: <strong>${esc(priv.data?.contact_value||"—")}</strong></p></div>${mod.data?.rejection_reason?authNotice(`Motivo anterior: ${mod.data.rejection_reason}`):""}<div class="profile-actions"><button id="backRealAdmin" class="outline">Volver</button></div>`,true);
  const adminPdfBtn=document.getElementById("adminOpenScriptPdf");if(adminPdfBtn)adminPdfBtn.onclick=()=>openSignedScript(x.script_pdf_path);
  document.getElementById("backRealAdmin").onclick=closeModal;
}


function sleep(ms){
  return new Promise(resolve=>setTimeout(resolve,ms));
}

async function waitForRecoverySession(timeoutMs=8000){
  const started=Date.now();

  while(Date.now()-started < timeoutMs){
    const {data,error}=await sb.auth.getSession();

    if(error){
      console.error("Recovery getSession:",error);
    }

    if(data?.session?.user){
      return data.session;
    }

    await sleep(200);
  }

  return null;
}

async function enterRecoveryMode(){
  passwordRecoveryIntent=true;

  // No dependemos de PASSWORD_RECOVERY: esperamos de forma explícita
  // a que supabase-js procese el token/hash del enlace.
  const session=await waitForRecoverySession();

  if(!session){
    openModal(`
      <div class="eyebrow">RECUPERAR ACCESO</div>
      <h2>No pudimos validar el enlace</h2>
      <p>El enlace puede haber vencido o ya haber sido utilizado.</p>
      <p>Volvé a solicitar un correo de recuperación desde “¿Olvidaste tu contraseña?”.</p>
      <button id="retryRecoveryLogin" class="primary gold">Volver a ingresar</button>
    `);
    document.getElementById("retryRecoveryLogin").onclick=()=>realAuthModal("login");
    return false;
  }

  // Cargar el estado normal recién después de tener una sesión válida.
  await loadRealAccount();
  showRecoveryPasswordModal();
  return true;
}

async function bootstrapReal(){
  // El callback de onAuthStateChange NO hace await a métodos de Supabase.
  // Se difiere el trabajo para evitar bloquear el mutex interno de Auth.
  sb.auth.onAuthStateChange((event,session)=>{
    if(event==="PASSWORD_RECOVERY"){
      passwordRecoveryIntent=true;
    }

    setTimeout(async()=>{
      try{
        if(passwordRecoveryIntent){
          const {data}=await sb.auth.getSession();
          if(data?.session?.user){
            await loadRealAccount();
            showRecoveryPasswordModal();
            return;
          }
        }

        await loadRealAccount();
        await loadPublicProfilesIntoExistingUI();
        if(appState.route==="realizadores")renderDirectory();
      }catch(err){
        console.error("Auth state refresh:",err);
      }
    },0);
  });

  await loadRealRoles();

  // La query ?recovery=1 es nuestro marcador persistente.
  // Si está presente, no renderizamos la home primero:
  // esperamos la sesión de recuperación y mostramos el formulario.
  if(passwordRecoveryIntent){
    renderDirectory();
    openModal(`
      <div class="eyebrow">RECUPERAR ACCESO</div>
      <h2>Validando enlace…</h2>
      <p>Estamos verificando tu solicitud de recuperación.</p>
    `);

    const ok=await enterRecoveryMode();
    if(ok){
      await loadPublicProfilesIntoExistingUI();
    }
    return;
  }

  await loadRealAccount();
  await loadPublicProfilesIntoExistingUI();

  if(realState.user){
    sb.channel("my-notifications")
      .on("postgres_changes",{
        event:"INSERT",
        schema:"public",
        table:"notifications",
        filter:`user_id=eq.${realState.user.id}`
      },async()=>{
        await loadNotifications();
        updateRealAccountButton();
      })
      .subscribe();
  }

  route();
}
bootstrapReal();
