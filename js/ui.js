/* ui.js */
(function(){
  'use strict';

  // ── PANEL SYSTEM ────────────────────────────────────────────
  const bd = document.getElementById('bd');

  window.openPanel = function(id){
    closeAll();
    const el = document.getElementById(id);
    if(!el) return;
    el.classList.add('open');
    bd.classList.add('on');
    // Update nav
    const navMap = { 'p-about':'About', 'p-projects':'Projects', 'p-contact':'Contact' };
    setNav(navMap[id]||null);
  };

  function closeAll(){
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('open'));
    bd.classList.remove('on');
  }

  document.querySelectorAll('.p-close').forEach(btn=>{
    btn.addEventListener('click',()=>{ closeAll(); setNav('Home'); });
  });
  bd.addEventListener('click',()=>{ closeAll(); setNav('Home'); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeAll(); setNav('Home'); } });

  // ── NAV ─────────────────────────────────────────────────────
  function setNav(label){
    document.querySelectorAll('.nb').forEach(b=>{
      b.classList.toggle('active', b.textContent.trim()===label);
    });
  }

  document.querySelectorAll('.nb').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const panel = btn.dataset.panel;
      if(!panel){ closeAll(); setNav('Home'); }
      else window.openPanel('p-'+panel);
    });
  });

  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const panel = btn.dataset.panel;
      if(panel) window.openPanel('p-'+panel);
    });
  });

  // ── TYPING EFFECT ────────────────────────────────────────────
  const roleEl = document.getElementById('hero-role');
  if(roleEl){
    const roles = [
      'Full Stack Developer',
      'Creative Coder',
      'WebGL Enthusiast',
      'Open Source Contributor',
      'UI / UX Craftsperson',
    ];
    let ri=0,ci=0,del=false;
    function type(){
      const cur = roles[ri];
      if(!del){ roleEl.textContent=cur.slice(0,ci+1); ci++; if(ci===cur.length){ del=true; setTimeout(type,1800); return; } }
      else { roleEl.textContent=cur.slice(0,ci-1); ci--; if(ci===0){ del=false; ri=(ri+1)%roles.length; } }
      setTimeout(type, del?42:68);
    }
    setTimeout(type, 3200);
  }

})();
