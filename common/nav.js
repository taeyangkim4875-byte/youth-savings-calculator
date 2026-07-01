/* 파비콘 자동 주입 */
(function(){
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = '/favicon.svg';
  document.head.appendChild(link);
})();

/* 사이드바 자동 생성 (하위 메뉴 포함) */
(function(){
  const MENUS = [
    {href:'/',       ico:'🏦', label:'도약·미래적금', sub:[
      {label:'도약 vs 미래 비교', hash:''}
    ]},
    {href:'/salary/',ico:'💰', label:'연봉/급여', sub:[
      {label:'연봉 상위%', hash:''},
      {label:'실수령액 표', hash:'', link:'/salary/table/'},
      {label:'최저시급·주휴수당', hash:'', link:'/salary/minimum/'}
    ]},
    {href:'/pension/',ico:'👵', label:'연금/보험', sub:[
      {label:'실업급여', hash:'', link:'/pension/jobless/'},
      {label:'국민연금', hash:'', link:'/pension/nps/'}
    ]},
    {href:'/loan/',  ico:'🏠', label:'대출/이자', sub:[
      {label:'원리금균등 vs 원금균등', hash:''}
    ]},
    {href:'/health/',ico:'💪', label:'건강', sub:[
      {label:'BMI', hash:'', link:'/health/bmi/'},
      {label:'기초대사량', hash:'', link:'/health/bmr/'}
    ]},
    {href:'/daily/', ico:'📅', label:'일상', sub:[
      {label:'퍼센트', hash:'', link:'/daily/percent/'},
      {label:'할인가', hash:'', link:'/daily/discount/'},
      {label:'더치페이', hash:'', link:'/daily/dutch/'},
      {label:'D-day', hash:'', link:'/daily/dday/'},
      {label:'나이', hash:'', link:'/daily/age/'},
      {label:'단위변환', hash:'', link:'/daily/unit/'},
      {label:'속도·시간', hash:'', link:'/daily/speed/'},
      {label:'연비', hash:'', link:'/daily/fuel/'}
    ]},
    {href:'/realestate/',ico:'🏢', label:'부동산', sub:[
      {label:'취득세', hash:'', link:'/realestate/acqtax/'},
      {label:'전월세 전환', hash:'', link:'/realestate/convert/'}
    ]},
    {href:'/tax/',   ico:'🧾', label:'세금', sub:[
      {label:'부가세', hash:'', link:'/tax/vat/'},
      {label:'종합소득세', hash:'', link:'/tax/income/'}
    ]}
  ];

  const path = location.pathname.replace(/index\.html$/,'');

  let navHtml = MENUS.map(m=>{
    const isActive = (path===m.href || (m.href!=='/' && path.startsWith(m.href)));
    const active = isActive ? ' active':'';
    const open = isActive ? ' open':'';

    let subHtml = '';
    if(m.sub && m.sub.length > 0){
      const subItems = m.sub.map(s=>{
        var subHref = s.link || (m.href + s.hash);
        return `<a href="${subHref}" class="sb-sub-item" data-hash="${s.hash}">${s.label}</a>`;
      }).join('');
      subHtml = `<div class="sb-sub${open}">${subItems}</div>`;
    }

    return `<div class="sb-group">
      <a href="${m.href}" class="sb-item${active}" data-href="${m.href}">
        <span class="sb-ico">${m.ico}</span>${m.label}
        ${m.sub&&m.sub.length>1?'<span class="sb-arrow">›</span>':''}
      </a>
      ${subHtml}
    </div>`;
  }).join('');

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';
  sidebar.innerHTML = `<div class="sb-header"><span class="sb-logo">모든 계산기</span><button class="sb-close" id="sbClose">&times;</button></div><nav class="sb-nav">${navHtml}</nav><div class="sb-footer"><a href="/about/">소개</a><a href="/privacy/">개인정보처리방침</a></div>`;

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

  // Toggle sidebar
  function openSb(){ sidebar.classList.add('open'); overlay.classList.add('open'); }
  function closeSb(){ sidebar.classList.remove('open'); overlay.classList.remove('open'); }
  hamburger.addEventListener('click', openSb);
  document.getElementById('sbClose').addEventListener('click', closeSb);
  overlay.addEventListener('click', closeSb);

  // Toggle sub-menus (expand/collapse)
  sidebar.querySelectorAll('.sb-item').forEach(item=>{
    item.addEventListener('click', function(e){
      const group = this.closest('.sb-group');
      const sub = group.querySelector('.sb-sub');
      if(!sub) return; // 하위 메뉴 없으면 그냥 이동

      const href = this.dataset.href;
      const isCurrentPage = (path === href || (href!=='/' && path.startsWith(href)));

      if(isCurrentPage){
        // 현재 페이지면 하위메뉴만 토글
        e.preventDefault();
        sub.classList.toggle('open');
      }
      // 다른 페이지면 링크 이동 (기본 동작)
    });
  });

  // 하위 메뉴 클릭 시 해당 탭으로 전환
  sidebar.querySelectorAll('.sb-sub-item').forEach(item=>{
    item.addEventListener('click', function(e){
      const hash = this.dataset.hash;
      const href = this.getAttribute('href');
      const targetPath = href.split('#')[0];
      const isCurrentPage = (path === targetPath || (targetPath!=='/' && path.startsWith(targetPath)));

      if(isCurrentPage && hash){
        e.preventDefault();
        // 현재 페이지의 탭 전환
        const tabId = hash.replace('#','');
        const tabBtn = document.querySelector(`#tabs [data-tab="${tabId}"], .tab-scroll [data-tab="${tabId}"]`);
        if(tabBtn){
          tabBtn.click();
          closeSb();
          window.scrollTo({top:0, behavior:'smooth'});
        }
      } else {
        // 다른 페이지로 이동 (해시 포함)
        closeSb();
      }
    });
  });

  // URL 해시로 초기 탭 설정
  if(location.hash){
    const tabId = location.hash.replace('#','');
    setTimeout(()=>{
      const tabBtn = document.querySelector(`#tabs [data-tab="${tabId}"], .tab-scroll [data-tab="${tabId}"]`);
      if(tabBtn) tabBtn.click();
    }, 100);
  }
})();

const won = n => Math.round(n).toLocaleString('ko-KR') + '원';
