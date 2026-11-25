"use strict";

const signals = [
  [215, "Hijsen", "De rechterarm is omhoog. De handpalm wijst naar voren. De hand maakt langzaam een cirkel."],
  [216, "Vieren", "De rechterarm wijst omlaag. De handpalm is naar het lichaam gericht. De hand maakt langzaam een cirkel."],
  [237, "Gevaar – noodstop", "Beide armen zijn omhoog. Beide handpalmen wijzen naar voren."],
  [213, "Stop beweging", "De rechterarm is omhoog. De handpalm wijst naar voren. De hand blijft stil."],
  [212, "Begin", "Beide armen zijn op schouderhoogte opzij gestrekt. Beide handpalmen wijzen naar voren."],
  [214, "Einde van het werk", "De handen komen voor de borst bij elkaar."],
  [224, "Verticale afstand", "De handen zijn boven elkaar. De ruimte tussen de handen geeft de afstand aan."],
  [229, "Horizontale afstand", "De handen zijn naast elkaar. De ruimte tussen de handen geeft de afstand aan."],
  [225, "Vooruit", "Beide armen zijn gebogen. De handpalmen wijzen naar het lichaam. De onderarmen bewegen langzaam naar het lichaam toe."],
  [226, "Achteruit", "Beide armen zijn gebogen. De handpalmen wijzen van het lichaam af. De onderarmen bewegen langzaam van het lichaam af."],
  [227, "Naar rechts", "De seingever strekt de rechterarm opzij, met de handpalm omlaag, en wijst langzaam naar rechts."],
  [228, "Naar links", "De seingever strekt de linkerarm opzij, met de handpalm omlaag, en wijst langzaam naar links."]
].map(([id, name, description]) => ({id, name, description}));
const byId = new Map(signals.map(signal => [signal.id, signal]));
const core = signals.slice(0, 4);
const pairs = {215:213, 213:237, 237:213, 216:215, 224:229, 229:224, 225:226, 226:225, 227:228, 228:227, 212:214, 214:212};
const main = document.querySelector("main");
const modal = document.querySelector("#modal");
const body = document.querySelector("#modalBody");
let selection = "core";
let round = null;
let view = "home";

function shuffled(items) {
  const copy = [...items];
  for (let i=copy.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]] = [copy[j],copy[i]];
  }
  return copy;
}

function nav(where) {
  view = where;
  for (const [id, active] of [["kaart",where==="atlas"],["training",where!=="atlas"]]) {
    const btn = document.getElementById(id);
    if(active) btn.setAttribute("aria-current","page");
    else btn.removeAttribute("aria-current");
  }
}

function cards(items) {
  return items.map(s => '<button class="card'+(core.includes(s)?' core':'')+'" data-detail="'+s.id+'">'+signalPhoto(s.id, "")+'<strong>'+s.name+'</strong></button>').join("");
}

function home() {
  nav("home");
  main.innerHTML = '<section class="hero"><div class="herotext"><h1>Herken het hijssein</h1><p>Kijk naar de seingever en kies wat het gebaar betekent. Met elk goed antwoord hijs je de container hoger.</p><fieldset class="chooser" aria-label="Kies een oefenronde"><label><input type="radio" name="mode" value="core">4 kernseinen</label><label><input type="radio" name="mode" value="all">Alle 12 seinen</label></fieldset><button class="primary" data-action="start">Start de oefening</button></div></section><div class="sectionhead"><h2>De vier kernseinen</h2><button class="textbtn" data-action="atlas">Bekijk de seinenkaart</button></div><div class="grid">'+cards(core)+'</div>';
  main.querySelector('input[value="'+selection+'"]').checked = true;
}

function atlas() {
  nav("atlas");
  main.innerHTML = '<h1 class="title">Seinenkaart</h1><p class="lead atlasintro">Kies een sein voor de foto, de tekening en de uitleg. Links en rechts gelden vanuit de seingever.</p><div class="sectionhead"><h2>De vier kernseinen</h2><button class="secondary" data-action="training">'+(round?'Terug naar de oefening':'Naar de oefening')+'</button></div><div class="grid">'+cards(core)+'</div><div class="sectionhead"><h2>Overige seinen</h2></div><div class="grid">'+cards(signals.slice(4))+'</div><p class="source">Bron van de gebaren en de tekeningen <a href="https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:31992L0058" target="_blank" rel="noopener">Richtlijn 92/58/EEG, bijlage IX</a>.</p>';
  window.scrollTo(0,0);
}

function showModal(title, html) {
  document.getElementById("modalTitle").textContent=title;
  body.innerHTML=html;
  modal.showModal();
}

function showDetail(id) {
  const s = byId.get(id);
  showModal(s.name, '<div class="detailimages">'+signalPhoto(id, "Foto van de seingever")+'<img src="./assets/schema-'+id+'.webp" alt="Tekening van het sein uit de richtlijn"></div><p>'+s.description+'</p>'+(signalMovements[id] ? '<p class="movement-note">De pijlen tonen de bewegingsrichting. De doorschijnende armen en handen tonen een andere stand van hetzelfde gebaar.</p>' : ""));
}

function lift(done,total) {
  return '<div class="liftpanel"><div class="liftlabel"><strong>Jouw hijslast</strong><span id="liftcount">'+done+' van '+total+' goed</span></div><div class="scene" aria-hidden="true" style="--rise:'+(2+66*done/total)+'%"><div class="mast"></div><div class="beam"></div><div class="dock"></div><div class="winch"><div class="wire"></div><div class="container"></div></div></div></div>';
}

function makeOptions(id) {
  const choices = selection==="core" ? core.map(s=>s.id) : [id,pairs[id]];
  const fillers = shuffled(signals.map(s=>s.id).filter(n=>!choices.includes(n)));
  return shuffled(choices.concat(fillers.slice(0,5-choices.length)));
}

function startRound(ids) {
  round = {ids:shuffled(ids), index:0, done:0, missed:new Set(), picked:null, options:[]};
  newQuestion();
}

function newQuestion() {
  round.picked=null;
  round.options=makeOptions(round.ids[round.index]);
  question();
  main.querySelector("h1").focus({preventScroll:true});
  window.scrollTo(0,0);
}

function question() {
  nav("game");
  const {ids,index,options,done}=round;
  const signal=byId.get(ids[index]);
  main.innerHTML='<div class="gamehead"><p>Sein '+(index+1)+' van '+ids.length+'</p><button class="textbtn" data-action="exit">Ronde afsluiten</button></div><div class="game"><section class="panel"><div class="questionbar"><h1 tabindex="-1">Welk sein zie je?</h1></div><figure class="picture">'+signalPhoto(signal.id, "Seingever op de kade. De houding en beweging staan onder de foto.")+'<figcaption><strong>Let op de beweging.</strong> '+signal.description+'</figcaption></figure>'+lift(done,ids.length)+'</section><section class="panel"><h2>Kies het juiste sein</h2><div class="answers">'+options.map((id,i)=>'<button class="answer" data-answer="'+id+'"><span>'+String.fromCharCode(65+i)+'</span>'+byId.get(id).name+'</button>').join("")+'</div><div id="feedback" aria-live="polite"></div></section></div>';
  if(round.picked!==null) showFeedback(false);
}

function showFeedback(raise) {
  const id=round.ids[round.index];
  const ok=round.picked===id;
  main.querySelectorAll("[data-answer]").forEach(btn=>{
    btn.disabled=true;
    if(Number(btn.dataset.answer)===round.picked) btn.classList.add(ok?"correct":"wrong");
  });
  const next=round.index===round.ids.length-1?"Bekijk je resultaat":"Volgend sein";
  const f=document.getElementById("feedback");
  f.innerHTML='<div class="feedback"><strong>'+(ok?'Goed! '+byId.get(id).name+'.':'Dit sein betekent '+byId.get(id).name.toLowerCase()+'.')+'</strong>'+(ok?'De container is een stap hoger.':byId.get(id).description)+'</div><button class="primary" data-action="'+(ok?'next':'again')+'">'+(ok?next:'Oefen dit gebaar opnieuw')+'</button>';
  if(raise) {
    document.querySelector(".scene").style.setProperty("--rise",(2+66*round.done/round.ids.length)+"%");
    document.getElementById("liftcount").textContent=round.done+' van '+round.ids.length+' goed';
  }
  f.querySelector("button").focus({preventScroll:true});
}

function answer(id) {
  if(!round || view!=="game" || round.picked!==null) return;
  round.picked=id;
  const ok=id===round.ids[round.index];
  if(ok) round.done++;
  else round.missed.add(round.ids[round.index]);
  showFeedback(ok);
}

function result() {
  nav("result");
  const {ids,missed}=round;
  main.innerHTML='<section class="panel results"><h1 class="title" tabindex="-1">Last op hoogte!</h1><p>Je hebt alle '+ids.length+' seinen goed beantwoord. Je herkende er <strong>'+(ids.length-missed.size)+' van de '+ids.length+'</strong> bij de eerste poging.</p>'+lift(ids.length,ids.length)+(missed.size?'<h2>Nog eens oefenen</h2><ul class="resultlist">'+[...missed].map(id=>'<li>'+byId.get(id).name+'</li>').join("")+'</ul>':'')+'<div class="actions">'+(missed.size?'<button class="primary" data-action="mistakes">Herhaal deze seinen</button>':'')+'<button class="secondary" data-action="home">Kies een nieuwe ronde</button></div></section>';
  main.querySelector("h1").focus({preventScroll:true});
  window.scrollTo(0,0);
}

function training() {
  if(!round) return home();
  if(round.index===round.ids.length) return result();
  question(); window.scrollTo(0,0);
}

function qr() {
  if(!/^https?:$/.test(location.protocol)) {
    showModal("QR-code voor deelnemers", "<p>Open de gepubliceerde app om een QR-code voor de groep te tonen. De uitgepakte app kun je direct op deze computer oefenen.</p>");
    return;
  }
  const url = new URL(location.pathname,location.origin).href;
  showModal("QR-code voor deelnemers",'<p>Scan de code om op je eigen telefoon te oefenen.</p><canvas class="qr" role="img" aria-label="QR-code naar deze oefenapp"></canvas><p class="qrurl"></p><div class="center"><button id="enlarge" class="secondary" aria-pressed="false">Vergroot QR-code</button></div>');
  body.querySelector(".qrurl").textContent=url;
  const matrix=new QRMatrix(-1,0);
  matrix.addData(url); matrix.make();
  const canvas=body.querySelector("canvas");
  const total=matrix.getModuleCount();
  const scale=12;
  canvas.width=canvas.height=(total+8)*scale;
  const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#000";
  for(let y=0;y<total;y++) for(let x=0;x<total;x++) if(matrix.isDark(y,x)) ctx.fillRect((x+4)*scale,(y+4)*scale,scale,scale);
  body.querySelector("#enlarge").onclick=e=>{
    const big=canvas.classList.toggle("big");
    e.currentTarget.setAttribute("aria-pressed",String(big));
    e.currentTarget.textContent=big?"Verklein QR-code":"Vergroot QR-code";
  };
}

main.addEventListener("change",e=>{if(e.target.name==="mode") selection=e.target.value;});
main.addEventListener("click",e=>{
  const btn=e.target.closest("button");if(!btn) return;
  if(btn.dataset.detail) return showDetail(Number(btn.dataset.detail));
  if(btn.dataset.answer) return answer(Number(btn.dataset.answer));
  switch(btn.dataset.action) {
    case "start": return startRound((selection==="core"?core:signals).map(s=>s.id));
    case "atlas": return atlas();
    case "training": return training();
    case "again": return newQuestion();
    case "next":
      round.index++;
      return round.index===round.ids.length ? result() : newQuestion();
    case "mistakes": return startRound([...round.missed]);
    case "home": round=null;return home();
    case "exit":
      showModal("Ronde afsluiten?",'<p>Als je afsluit, vervalt je voortgang in deze ronde.</p><div class="actions"><button id="resume" class="primary">Verder oefenen</button><button id="leave" class="secondary">Ronde afsluiten</button></div>');
      body.querySelector("#resume").onclick=()=>modal.close();
      body.querySelector("#leave").onclick=()=>{modal.close(); round=null;home();window.scrollTo(0,0);};break;
  }
});
document.getElementById("brand").onclick=training;
document.getElementById("training").onclick=training;
document.getElementById("kaart").onclick=atlas;
document.getElementById("share").onclick=qr;
document.getElementById("close").onclick=()=>modal.close();
home();
