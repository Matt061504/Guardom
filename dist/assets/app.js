const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Ouvrir le menu');}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('is-open')){closeMenu();menuButton.focus();}});

const config=window.GUARDOM_CONFIG||{};
const validEmail=typeof config.email==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)?config.email:'';
const endpoint=(()=>{try{if(!config.contactEndpoint)return '';const u=new URL(config.contactEndpoint,location.origin);return u.protocol==='https:'?u.href:'';}catch{return '';}})();
document.querySelectorAll('[data-config]').forEach(el=>{const value=config[el.dataset.config];if(value)el.textContent=value;});
document.querySelectorAll('[data-contact-links]').forEach(el=>{
  if(validEmail){const a=document.createElement('a');a.href='mailto:'+validEmail;a.textContent=validEmail;el.append(a);}
  if(config.phone&&/^\+?[\d ()-]+$/.test(config.phoneLink)){const a=document.createElement('a');a.href='tel:'+config.phoneLink.replace(/[ ()-]/g,'');a.textContent=config.phone;el.append(a);}
});
const scenes={retour:{light:'Ambiance douce',heat:'Mode confort',blinds:'Selon la luminosité'},nuit:{light:'Extinction progressive',heat:'Consigne de nuit',blinds:'Fermés'},absence:{light:'Éteint',heat:'Mode absence',blinds:'Scénario programmé'}};
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{
  const scene=scenes[button.dataset.scene];
  document.querySelectorAll('[data-scene]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
  document.querySelectorAll('[data-reading]').forEach(el=>{el.textContent=scene[el.dataset.reading];});
}));

const form=document.querySelector('#quote-form');
if(form){
  const params=new URLSearchParams(location.search);
  for(const input of form.elements){if(input.name==='services'&&input.value===params.get('service'))input.checked=true;if(input.name==='project'&&input.value===params.get('projet'))input.checked=true;}
  const note=document.querySelector('#form-mode-note');
  const submit=document.querySelector('#submit-quote');
  const status=document.querySelector('#form-status');
  const result=document.querySelector('#quote-result');
  const summary=document.querySelector('#quote-summary');
  const resultNote=document.querySelector('#result-note');
  let summaryText='';
  if(endpoint){note.textContent='Vos informations seront transmises à GUARDOM uniquement pour traiter votre demande. Consultez les informations de confidentialité.';submit.textContent='Envoyer ma demande de devis';}
  else if(validEmail){note.textContent='Préparez votre demande puis ouvrez votre messagerie pour l’envoyer à GUARDOM. Aucun envoi automatique ne sera effectué.';}
  form.addEventListener('submit',async e=>{
    e.preventDefault();status.textContent='';
    if(!form.reportValidity())return;
    const d=new FormData(form);if(d.get('website'))return;
    const models={installation:'Installation complète',existant:'Équipements déjà présents',conseil:'Besoin de conseil'};
    const data={name:String(d.get('name')).trim(),email:String(d.get('email')).trim(),phone:String(d.get('phone')||'').trim(),town:String(d.get('town')).trim(),message:String(d.get('message')).trim(),project:models[d.get('project')],services:d.getAll('services').map(s=>'GUARDOM '+s.toUpperCase()),privacyAccepted:true};
    if(!data.name||!data.town||data.message.length<20){status.textContent='Précisez votre nom, votre commune et votre projet (20 caractères minimum, hors espaces).';return;}
    summaryText=`DEMANDE DE DEVIS — GUARDOM\n\nNom : ${data.name}\nE-mail : ${data.email}\nTéléphone : ${data.phone||'Non renseigné'}\nCommune : ${data.town}\n\nServices : ${data.services.join(', ')||'À préciser ensemble'}\nSituation : ${data.project}\n\nVotre projet :\n${data.message}`;
    if(endpoint){
      submit.disabled=true;submit.textContent='Envoi en cours…';
      try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});const payload=await response.json();if(!response.ok||payload.ok!==true)throw new Error('delivery');result.querySelector('h2').textContent='Votre demande a été transmise.';resultNote.textContent='GUARDOM a reçu votre demande. Vous pouvez en télécharger une copie.';}
      catch{status.textContent='L’envoi n’a pas pu être confirmé. Votre saisie est conservée. Vous pouvez réessayer.';return;}
      finally{submit.disabled=false;submit.textContent='Envoyer ma demande de devis';}
    }else if(validEmail){
      resultNote.textContent='Votre demande n’a pas encore été envoyée. Ouvrez votre messagerie, puis vérifiez et envoyez le message.';
      const emailLink=document.querySelector('#email-quote');emailLink.hidden=false;emailLink.href='mailto:'+validEmail+'?subject='+encodeURIComponent('Demande de devis GUARDOM — '+data.town)+'&body='+encodeURIComponent(summaryText);
    }
    summary.textContent=summaryText;form.hidden=true;result.hidden=false;result.focus();result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  });
  document.querySelector('#edit-quote').addEventListener('click',()=>{result.hidden=true;form.hidden=false;form.querySelector('input[name="name"]').focus();});
  document.querySelector('#download-quote').addEventListener('click',()=>{const blob=new Blob(['\uFEFF'+summaryText],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='demande-devis-guardom.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
}
const privacyMode=document.querySelector('#privacy-mode');
if(privacyMode&&(endpoint||validEmail))privacyMode.textContent=endpoint?'Le formulaire transmet les coordonnées et la description du projet au service de réception configuré pour GUARDOM. Aucune copie n’est enregistrée dans le stockage du navigateur.':'Le formulaire prépare un message pour votre logiciel de messagerie. Il n’effectue aucun envoi automatique. L’envoi dépend de votre validation dans votre messagerie.';
