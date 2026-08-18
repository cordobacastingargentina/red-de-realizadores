const roles = [
  'Dirección','Guion','Dirección de Fotografía','Cámara','Dirección de Arte','Producción','Sonido','Montaje / Edición','Color','VFX / Motion Graphics','Música','Otros'
];

let profiles = [
  {id:1,name:'Lucía Ferrero',primary:'Dirección',secondary:['Guion'],available:true,students:true,photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',bio:'Directora y guionista enfocada en ficción breve, videoclips y proyectos con equipos pequeños.',reel:'https://vimeo.com/',updated:'18 ago 2026'},
  {id:2,name:'Tomás Quiroga',primary:'Dirección de Fotografía',secondary:['Cámara','Color'],available:true,students:false,photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',bio:'DF orientado a narrativa, luz natural y cámara en movimiento. Trabajo en ficción, publicidad y contenido musical.',reel:'https://vimeo.com/',updated:'16 ago 2026'},
  {id:3,name:'Marina López',primary:'Dirección de Arte',secondary:['Producción'],available:false,students:true,photo:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',bio:'Dirección de arte y producción de objetos para cortometrajes, publicidad y fotografía editorial.',reel:'https://www.behance.net/',updated:'10 ago 2026'},
  {id:4,name:'Nicolás Herrera',primary:'Sonido',secondary:['Música'],available:true,students:true,photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',bio:'Sonido directo, edición y diseño sonoro para ficción y documental.',reel:'https://soundcloud.com/',updated:'14 ago 2026'},
  {id:5,name:'Sofía Molina',primary:'Montaje / Edición',secondary:['VFX / Motion Graphics'],available:true,students:true,photo:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',bio:'Editora audiovisual con experiencia en ficción, branded content y piezas musicales.',reel:'https://vimeo.com/',updated:'17 ago 2026'},
  {id:6,name:'Franco Acosta',primary:'Producción',secondary:['Dirección'],available:false,students:false,photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',bio:'Producción general y ejecutiva para proyectos audiovisuales independientes.',reel:'https://vimeo.com/',updated:'02 ago 2026'}
];

const app = document.getElementById('app');
const modal = document.getElementById('modal');
const backdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');

document.getElementById('closeModalBtn').onclick = closeModal;
backdrop.onclick = closeModal;
document.getElementById('openAccountBtn').onclick = () => openAccount();

document.querySelectorAll('[data-route]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); location.hash=a.dataset.route;}));
window.addEventListener('hashchange', router);

function router(){
  const route = location.hash.replace('#','') || 'home';
  if(route==='recursos') renderTemplate('resourcesTemplate');
  else if(route==='formacion') renderTemplate('trainingTemplate');
  else renderHome();
}

function renderTemplate(id){
  app.innerHTML='';
  app.appendChild(document.getElementById(id).content.cloneNode(true));
}

function renderHome(){
  app.innerHTML='';
  app.appendChild(document.getElementById('homeTemplate').content.cloneNode(true));
  const roleFilter=document.getElementById('roleFilter');
  roles.forEach(r=>roleFilter.insertAdjacentHTML('beforeend',`<option value="${r}">${r}</option>`));
  ['searchInput','roleFilter','availableFilter','studentFilter'].forEach(id=>document.getElementById(id).addEventListener('input',renderCards));
  document.getElementById('createProfileBtn').onclick=()=>openEditor();
  renderCards();
}

function renderCards(){
  const q=(document.getElementById('searchInput')?.value||'').toLowerCase();
  const role=document.getElementById('roleFilter')?.value||'';
  const avail=document.getElementById('availableFilter')?.checked||false;
  const students=document.getElementById('studentFilter')?.checked||false;
  const filtered=profiles.filter(p=>{
    const hay=[p.name,p.primary,...p.secondary,p.bio].join(' ').toLowerCase();
    return (!q||hay.includes(q)) && (!role||p.primary===role||p.secondary.includes(role)) && (!avail||p.available) && (!students||p.students);
  });
  document.getElementById('resultsCount').textContent=filtered.length;
  const c=document.getElementById('cardsContainer');
  c.innerHTML=filtered.map(p=>`
    <article class="card" data-id="${p.id}">
      <div>
        <div class="role">${p.primary}</div>
        <div class="person">${p.name}</div>
        <div class="secondary">${p.secondary.join(' · ') || 'Perfil profesional'}</div>
        <div class="status-row">
          ${p.available?'<span class="pill on">● Disponible</span>':'<span class="pill">No disponible</span>'}
          ${p.students?'<span class="pill">Estudiantiles ✓</span>':''}
        </div>
      </div>
      <img class="avatar" src="${p.photo}" alt="${p.name}">
    </article>`).join('');
  c.querySelectorAll('.card').forEach(el=>el.onclick=()=>openProfile(Number(el.dataset.id)));
}

function openProfile(id){
  const p=profiles.find(x=>x.id===id); if(!p) return;
  modalContent.innerHTML=`
    <div class="profile-top">
      <img src="${p.photo}" alt="${p.name}">
      <div><div class="profile-role">${p.primary}</div><div class="profile-name">${p.name}</div><div class="meta">${p.secondary.join(' · ')}</div></div>
    </div>
    <section class="profile-section"><h4>Estado</h4><div class="status-row">${p.available?'<span class="pill on">● Disponible actualmente</span>':'<span class="pill">No disponible actualmente</span>'}${p.students?'<span class="pill">Acepta proyectos estudiantiles</span>':'<span class="pill">No acepta estudiantiles</span>'}</div></section>
    <section class="profile-section"><h4>Perfil</h4><p>${p.bio}</p></section>
    <section class="profile-section"><h4>Reel / Portfolio</h4><a class="video-link" href="${p.reel}" target="_blank" rel="noopener">Ver material de trabajo →</a></section>
    <section class="profile-section"><h4>Contacto</h4><div class="contact-box"><p>El email y el teléfono del realizador no se muestran públicamente.</p><div class="form-grid"><label>Tu nombre<input placeholder="Nombre y apellido"></label><label>Proyecto<textarea placeholder="Contá brevemente de qué se trata la propuesta"></textarea></label><button class="primary">Enviar consulta</button></div></div></section>
    <section class="profile-section"><div class="meta">Perfil actualizado por última vez: ${p.updated}</div></section>`;
  openModal();
}

function openEditor(existing=profiles[0]){
  modalContent.innerHTML=`
    <div class="eyebrow">MI PERFIL</div><h2>Editar perfil profesional</h2>
    <div class="form-grid">
      <label>Nombre<input id="fName" value="${existing.name}"></label>
      <label>Rol principal<select id="fPrimary">${roles.map(r=>`<option ${r===existing.primary?'selected':''}>${r}</option>`).join('')}</select></label>
      <label>Roles secundarios<input id="fSecondary" value="${existing.secondary.join(', ')}" placeholder="Guion, Cámara, Color"></label>
      <label>Descripción breve · máx. 350 caracteres<textarea id="fBio" maxlength="350">${existing.bio}</textarea></label>
      <label>Link a reel / portfolio<input id="fReel" value="${existing.reel}"></label>
      <label>Foto de perfil<input id="fPhoto" value="${existing.photo}"></label>
      <label class="check"><input id="fAvailable" type="checkbox" ${existing.available?'checked':''}> Disponible actualmente</label>
      <label class="check"><input id="fStudents" type="checkbox" ${existing.students?'checked':''}> Acepto proyectos estudiantiles</label>
    </div>
    <div class="form-actions"><button class="outline" id="cancelEdit">Cancelar</button><button class="primary" id="saveEdit">Guardar cambios</button></div>`;
  document.getElementById('cancelEdit').onclick=closeModal;
  document.getElementById('saveEdit').onclick=()=>{
    existing.name=document.getElementById('fName').value.trim()||existing.name;
    existing.primary=document.getElementById('fPrimary').value;
    existing.secondary=document.getElementById('fSecondary').value.split(',').map(x=>x.trim()).filter(Boolean);
    existing.bio=document.getElementById('fBio').value.trim();
    existing.reel=document.getElementById('fReel').value.trim();
    existing.photo=document.getElementById('fPhoto').value.trim()||existing.photo;
    existing.available=document.getElementById('fAvailable').checked;
    existing.students=document.getElementById('fStudents').checked;
    existing.updated='18 ago 2026';
    closeModal(); renderHome();
  };
  openModal();
}

function openAccount(){
  modalContent.innerHTML=`
    <div class="eyebrow">CUENTA</div><h2>Ingresar a Red de Realizadores</h2>
    <div class="account-tabs"><button class="active" id="loginTab">Ingresar</button><button id="registerTab">Crear cuenta</button></div>
    <div id="accountBody"></div>`;
  const body=document.getElementById('accountBody');
  const showLogin=()=>{body.innerHTML=`<div class="form-grid"><label>Email<input type="email" placeholder="tu@email.com"></label><label>Contraseña<input type="password" placeholder="••••••••"></label><button class="primary" id="fakeLogin">Ingresar</button><button class="text-btn" id="changePass">Cambiar contraseña</button></div>`; document.getElementById('fakeLogin').onclick=()=>openEditor(); document.getElementById('changePass').onclick=showPassword;};
  const showRegister=()=>{body.innerHTML=`<div class="form-grid"><label>Email<input type="email"></label><label>Contraseña<input type="password"></label><label>Repetir contraseña<input type="password"></label><button class="primary" id="fakeRegister">Crear cuenta y perfil</button></div>`; document.getElementById('fakeRegister').onclick=()=>openEditor({id:99,name:'Nuevo realizador',primary:'Dirección',secondary:[],available:true,students:true,photo:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',bio:'',reel:'',updated:'18 ago 2026'});};
  const showPassword=()=>{body.innerHTML=`<div class="form-grid"><label>Contraseña actual<input type="password"></label><label>Nueva contraseña<input type="password"></label><label>Repetir nueva contraseña<input type="password"></label><button class="primary" onclick="closeModal()">Actualizar contraseña</button></div>`};
  document.getElementById('loginTab').onclick=()=>{document.getElementById('loginTab').classList.add('active');document.getElementById('registerTab').classList.remove('active');showLogin();};
  document.getElementById('registerTab').onclick=()=>{document.getElementById('registerTab').classList.add('active');document.getElementById('loginTab').classList.remove('active');showRegister();};
  showLogin(); openModal();
}

function openModal(){modal.classList.remove('hidden');backdrop.classList.remove('hidden');}
function closeModal(){modal.classList.add('hidden');backdrop.classList.add('hidden');}
window.closeModal=closeModal;

router();
