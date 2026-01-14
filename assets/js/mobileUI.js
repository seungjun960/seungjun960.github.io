(function () {
  // 모바일에서만 적용
  if (window.matchMedia && window.matchMedia('(min-width: 981px)').matches) return;

  // closest() 폴백 (구형 브라우저 대비)
  function closest(el, selector) {
    if (!el) return null;
    if (el.closest) return el.closest(selector);

    // polyfill-lite
    while (el && el.nodeType === 1) {
      if (matches(el, selector)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function matches(el, selector) {
    var p = Element.prototype;
    var fn = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector;
    if (fn) return fn.call(el, selector);
    return false;
  }

  document.addEventListener('click', function (e) {
    var tiles = document.getElementById('tiles');
      if (!tiles) return;

    var link = closest(e.target, 'a');
      if (!link || !tiles.contains(link)) return;
      if (!link) return;

    var article = closest(link, 'article');
    if (!article) return;

    e.preventDefault(); // 즉시 이동 막기

    article.classList.add('is-entering');

    var href = link.getAttribute('href');

    setTimeout(function () {
      window.location.href = href;
    }, 500);
  }, false);
})();
