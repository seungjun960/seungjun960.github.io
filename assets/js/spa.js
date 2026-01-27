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
      const file = u.pathname.split('/').pop() || 'index.html';
      return file + u.search;
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

  const isElements = /(^|\/)elements\.html(\?|$)/.test(url);
  document.body.classList.toggle('page-elements', isElements);


    if (push) history.pushState({ url }, '', url);
    afterSwap();
  if (window.Prism && isElements) {
    if (typeof Prism.highlightAllUnder === 'function') {
      Prism.highlightAllUnder(c);
    } else {
      Prism.highlightAll();
    }
  }
}


  // 최초 state 고정
  if (!history.state || !history.state.url) {
    const current = location.pathname.split('/').pop() || 'index.html';
    history.replaceState({ url: current }, '', current);
  }


  document.addEventListener('click', (e) => {
    const a = e.target.closest('#menu a');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href) return;

    if (href === '#menu' || href.startsWith('#')) return;
    if (a.target === '_blank') return;

    const url = isSameOriginUrl(href);
    if (!url) return;

    e.preventDefault();
    e.stopPropagation();

    navigate(url, true).catch(() => (location.href = href));
  }, true); // capture=true

  // 타일(.tiles a) 클릭도 SPA 처리 (헤더 고정 유지)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.tiles a');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href) return;

    if (href === '#menu' || href.startsWith('#')) return;
    if (a.target === '_blank') return;

    const url = isSameOriginUrl(href);
    if (!url) return;

    e.preventDefault();
    e.stopPropagation();

    navigate(url, true).catch(() => {
      location.href = href;
    });
  });

  // 뒤로가기
  window.addEventListener('popstate', (e) => {
    const url = (e.state && e.state.url) ? e.state.url : 'index.html';
    navigate(url, false).catch(() => location.href = url);
  });

  // bfcache 복원 대응
  window.addEventListener('pageshow', () => afterSwap());
})();
