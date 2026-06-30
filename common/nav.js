/* 사이드바 자동 생성 */
(function(){
  const MENUS = [
    {href:'/',       ico:'🏦', label:'적금/예금'},
    {href:'/salary/',ico:'💰', label:'연봉/급여'},
    {href:'/pension/',ico:'👵', label:'연금/보험'},
    {href:'/loan/',  ico:'🏠', label:'대출/이자'},
    {href:'/health/',ico:'💪', label:'건강'},
    {href:'/daily/', ico:'📅', label:'일상'},
    {href:'/realestate/',ico:'🏢', label:'부동산'},
    {href:'/tax/',   ico:'🧾', label:'세금'}
  ];
  const path = location.pathname.replace(/index\.html$/,'');
  let navHtml = MENUS.map(m=>{
    const active = (path===m.href || (m.href!=='/' && path.startsWith(m.href))) ? ' active':'';
    return `<a href="${m.href}" class="sb-item${active}"><span class="sb-ico">${m.ico}</span>${m.label}</a>`;
  }).join('');

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';
  sidebar.innerHTML = `<div class="sb-header"><span class="sb-logo">모든 계산기</span><button class="sb-close" id="sbClose">&times;</button></div><nav class="sb-nav">${navHtml}</nav>`;

  const overlay = document.createElement('div');
  overlay.className = 'sb-overlay';
  overlay.id = 'sbOverlay';

  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.id = 'hamburger';
  hamburger.textContent = '☰';

  document.body.prepend(sidebar, overlay, hamburger);

  // Wrap existing content in .content div
  const content = document.createElement('div');
  content.className = 'content';
  while(document.body.children.length > 3){
    content.appendChild(document.body.children[3]);
  }
  document.body.appendChild(content);

  // Toggle
  function open(){ sidebar.classList.add('open'); overlay.classList.add('open'); }
  function close(){ sidebar.classList.remove('open'); overlay.classList.remove('open'); }
  hamburger.addEventListener('click', open);
  document.getElementById('sbClose').addEventListener('click', close);
  overlay.addEventListener('click', close);
})();

const won = n => Math.round(n).toLocaleString('ko-KR') + '원';
