// assets/js/spa.js - 헤더/오디오 고정, #main .inner만 교체
(function () {
    if (window.__spaBound) return;
    window.__spaBound = true;
  
    function container() {
      return document.querySelector('#main .inner');
    }
  
    function isSameOriginUrl(href) {
      try {
        const u = new URL(href, location.href);
        if (u.origin !== location.origin) return null;
        // 파일 경로만 사용 (index.html, generic.html 등)
        const file = u.pathname.split('/').pop() || 'index.html';
        return file + u.search; // 필요하면 query 포함
      } catch {
        return null;
      }
    }
  
    async function fetchInner(url) {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Fetch failed: ' + res.status);
  
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const next = doc.querySelector('#main .inner');
      if (!next) throw new Error('No #main .inner in ' + url);
      return next.innerHTML;
    }
  
    function afterSwap() {
      // 메뉴 닫기
      document.body.classList.remove('is-menu-visible');
      // 모바일 타일 잔상 제거
      document.querySelectorAll('.tiles article.is-active').forEach(a => a.classList.remove('is-active'));
      // 새로 들어온 타일에 모바일 이벤트 재바인딩
      if (typeof window.initMobileTiles === 'function') window.initMobileTiles(document);
      // 스크롤 위로
      window.scrollTo(0, 0);
    }
  
    async function navigate(url, push = true) {
      const c = container();
      if (!c) return;
  
      const html = await fetchInner(url);
      c.innerHTML = html;
  
      if (push) history.pushState({ url }, '', url);
      afterSwap();
    }
  
// ✅ 메뉴(#menu) 클릭은 main.js가 stopPropagation으로 막아서 bubble로는 못 받음
// capture 단계에서 먼저 가로채서 SPA 처리
document.addEventListener('click', (e) => {
  const a = e.target.closest('#menu a');
  if (!a) return;

  const href = a.getAttribute('href');
  if (!href) return;

  // 메뉴 토글/해시/새탭 제외
  if (href === '#menu' || href.startsWith('#')) return;
  if (a.target === '_blank') return;

  const url = isSameOriginUrl(href);
  if (!url) return;

  // 여기서 main.js 리다이렉트 막고 SPA로 처리
  e.preventDefault();
  e.stopPropagation();

  navigate(url, true).catch(() => {
    location.href = href;
  });
}, true); // ✅ capture=true (핵심)
  
    // 뒤로가기
    window.addEventListener('popstate', (e) => {
      const url = (e.state && e.state.url) ? e.state.url : 'index.html';
      navigate(url, false).catch(() => location.href = url);
    });
  
    // bfcache 복원 대응
    window.addEventListener('pageshow', () => afterSwap());
  })();
  

