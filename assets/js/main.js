/* Created by. SeungJun Lee */

(function ($) {

	var $window = $(window),
		$body = $('body');
  
	// Breakpoints
	breakpoints({
	  xlarge:  ['1281px', '1680px'],
	  large:   ['981px',  '1280px'],
	  medium:  ['737px',  '980px'],
	  small:   ['481px',  '736px'],
	  xsmall:  ['361px',  '480px'],
	  xxsmall: [null,     '360px']
	});
  
	// Initial animation
	$window.on('load', function () {
	  window.setTimeout(function () {
		$body.removeClass('is-preload');
	  }, 100);
	});
  
	// Touch
	if (browser.mobile)
	  $body.addClass('is-touch');
  
	// Menu
	var $menu = $('#menu');
	$menu.wrapInner('<div class="inner"></div>');
	$menu._locked = false;
  
	$menu._lock = function () {
	  if ($menu._locked) return false;
	  $menu._locked = true;
	  setTimeout(() => $menu._locked = false, 350);
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
	  .on('click', function (e) { e.stopPropagation(); })
	  .on('click', 'a', function (e) {
		var href = $(this).attr('href');
		e.preventDefault();
		e.stopPropagation();
		$menu._hide();
		if (href === '#menu') return;
		// ❌ SPA가 처리 → location 이동 제거
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
  
  
  /* ✅ 모바일 타일 오버레이 (단 하나만 유지) */
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
  
	document.addEventListener('touchstart', (e) => {
	  if (e.target.closest('.tiles article')) return;
	  articles.forEach(a => a.classList.remove('is-active'));
	}, { passive: true });
  })();
  