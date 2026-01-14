// assets/js/mobileUI.js
(function () {
  // 전역으로 init 함수 노출 (SPA로 DOM 교체 후 재실행용)
  window.initMobileTiles = function initMobileTiles(root = document) {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isTouch) return;

    const articles = Array.from(root.querySelectorAll('.tiles article'));
    if (!articles.length) return;

    // 기존 이벤트가 중복으로 붙지 않게 dataset 가드
    articles.forEach((article) => {
      if (article.dataset.tileBound === '1') return;
      article.dataset.tileBound = '1';

      const link = article.querySelector('a[href]');
      if (!link) return;

      link.addEventListener('click', (e) => {
        // 첫 탭: 활성화만 하고 이동 막기
        if (!article.classList.contains('is-active')) {
          e.preventDefault();
          articles.forEach(a => a.classList.remove('is-active'));
          article.classList.add('is-active');
          return;
        }
        // 두번째 탭: 이동 허용 (SPA라면 data-spa 붙은 링크가 가로챔)
      });
    });

    // 바깥 터치하면 닫기 (문서에 1번만)
    if (!window.__tilesOutsideBound) {
      window.__tilesOutsideBound = true;
      document.addEventListener('touchstart', (e) => {
        if (e.target.closest('.tiles article')) return;
        document.querySelectorAll('.tiles article.is-active').forEach(a => a.classList.remove('is-active'));
      }, { passive: true });
    }
  };

  // 최초 1회 실행
  window.initMobileTiles(document);
})();