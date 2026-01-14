// assets/js/spa.js
(function () {
    const mainInner = document.querySelector('#main .inner');
    if (!mainInner) return;
  
    // 같은 origin의 html만 SPA로 로드
    function isInternalHtml(url) {
      if (!url) return false;
      if (url.startsWith('http')) return false;
      if (url.startsWith('#')) return false;
      // 너는 generic.html / elements.html 같은 형태니까 html만 처리
      return url.endsWith('.html');
    }
  
    async function loadPage(url, push = true) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Fetch failed: ' + res.status);
        const html = await res.text();
  
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
  
        const nextInner = tmp.querySelector('#main .inner');
        if (!nextInner) {
          // 구조 다르면 그냥 이동
          window.location.href = url;
          return;
        }
  
        mainInner.innerHTML = nextInner.innerHTML;
  
        // 타이틀도 같이 바꾸고 싶으면
        const nextTitle = tmp.querySelector('title');
        if (nextTitle) document.title = nextTitle.textContent;
  
        if (push) history.pushState({ url }, '', url);
  
        // 메뉴 닫기(테마 유지)
        document.body.classList.remove('is-menu-visible');
  
        // 스크롤 위로
        window.scrollTo({ top: 0, behavior: 'smooth' });
  
      } catch (e) {
        console.log(e);
        window.location.href = url;
      }
    }
  
    //  타일 링크만 가로채기
    document.addEventListener('click', (e) => {
      const a = e.target.closest('.tiles a');
      if (!a) return;
  
      const href = a.getAttribute('href');
      if (!isInternalHtml(href)) return;
  
      e.preventDefault();
      loadPage(href, true);
    });
  
    // 뒤로가기 대응
    window.addEventListener('popstate', (e) => {
      const url = (e.state && e.state.url) ? e.state.url : 'index.html';
      loadPage(url, false);
    });
  })();