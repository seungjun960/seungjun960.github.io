/* Created by. SeungJun Lee */

(function ($) {
	var $window = $(window),
	  $body = $('body');
  
	// Breakpoints
	breakpoints({
	  xlarge: ['1281px', '1680px'],
	  large: ['981px', '1280px'],
	  medium: ['737px', '980px'],
	  small: ['481px', '736px'],
	  xsmall: ['361px', '480px'],
	  xxsmall: [null, '360px']
	});
  
	// Initial animation
	$window.on('load', function () {
	  window.setTimeout(function () {
		$body.removeClass('is-preload');
	  }, 100);
	});
  
	// Touch
	if (browser.mobile) $body.addClass('is-touch');
  
	// Menu
	var $menu = $('#menu');
	$menu.wrapInner('<div class="inner"></div>');
	$menu._locked = false;
  
	$menu._lock = function () {
	  if ($menu._locked) return false;
	  $menu._locked = true;
	  setTimeout(() => ($menu._locked = false), 350);
	  return true;
	};
  
	$menu._show = function () {
	  if ($menu._lock()) $body.addClass('is-menu-visible');
	};
  
	$menu._hide = function () {
	  if ($menu._lock()) $body.removeClass('is-menu-visible');
	};
  
	$menu._toggle = function () {
	  if ($menu._lock()) $body.toggleClass('is-menu-visible');
	};
  
	$menu
	  .appendTo($body)
	  .on('click', function (e) {
		e.stopPropagation();
	  })
	  .on('click', 'a', function (e) {
		var href = $(this).attr('href');
		e.preventDefault();
		e.stopPropagation();
  
		$menu._hide();
		if (href === '#menu') return;
  
		// SPA가 처리 → location 이동 제거
	  })
	  .append('<a class="close" href="#menu">Close</a>');
  
	$body
	  .on('click', 'a[href="#menu"]', function (e) {
		e.preventDefault();
		e.stopPropagation();
		$menu._toggle();
	  })
	  .on('click', function () {
		$menu._hide();
	  })
	  .on('keydown', function (e) {
		if (e.keyCode === 27) $menu._hide();
	  });
  })(jQuery);
  
  /* 모바일 타일 오버레이 (단 하나만 유지) */
  (function () {
	const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
	if (!isTouch) return;
  
	const articles = Array.from(document.querySelectorAll('.tiles article'));
	if (!articles.length) return;
  
	articles.forEach(article => {
	  const link = article.querySelector('a[href]');
	  if (!link) return;
  
	  link.addEventListener('click', (e) => {
		if (article.classList.contains('is-active')) return;
		e.preventDefault();
  
		articles.forEach(a => a.classList.remove('is-active'));
		article.classList.add('is-active');
	  });
	});
  
	document.addEventListener(
	  'touchstart',
	  (e) => {
		if (e.target.closest('.tiles article')) return;
		articles.forEach(a => a.classList.remove('is-active'));
	  },
	  { passive: true }
	);
  })();
  
  /* IG dots 기능 사용 안 함: 혹시 남아있는 dot 컨테이너 흔적 제거 */
  (function () {
	function cleanupIGDots(root = document) {
	  // dot 컨테이너가 HTML에 남아있어도 비워서 안 보이게 처리
	  root.querySelectorAll('.ig-dots').forEach((el) => {
		el.innerHTML = '';
	  });
	}
  
	// SPA에서 필요하면 재호출할 수 있게 노출(선택)
	window.cleanupIGDots = cleanupIGDots;
  
	if (document.readyState === 'loading') {
	  document.addEventListener('DOMContentLoaded', () => cleanupIGDots(document));
	} else {
	  cleanupIGDots(document);
	}
  })();

  /* ===== IG swipe hint (auto insert) ===== */
(function () {
	function initIGSwipeHint(root = document) {
	  const sliders = root.querySelectorAll('.ig-slider');
	  if (!sliders.length) return;
  
	  sliders.forEach((slider) => {
		const track = slider.querySelector('.ig-track');
		if (!track) return;
  
		const slides = track.querySelectorAll('.ig-slide');
		if (slides.length <= 1) return; // 사진 1장이면 안내문구 안 붙임
  
		// 이미 생성돼 있으면 중복 방지
		if (slider.dataset.swipeHint === '1') return;
		slider.dataset.swipeHint = '1';
  
		// slider 바로 아래에 안내문구 삽입
		const hint = document.createElement('div');
		hint.className = 'ig-swipe-hint';
		hint.innerHTML = `<span class="arrow">←</span><span class="word">Swipe</span><span class="arrow">→</span>`;
  
		// slider 다음에 넣기
		slider.insertAdjacentElement('afterend', hint);
	  });
	}
  
	window.initIGSwipeHint = initIGSwipeHint;
  
	if (document.readyState === 'loading') {
	  document.addEventListener('DOMContentLoaded', () => initIGSwipeHint(document));
	} else {
	  initIGSwipeHint(document);
	}
  })();
  