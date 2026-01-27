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
		//  SPA가 처리 → location 이동 제거
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
  
  
  /*  모바일 타일 오버레이 (단 하나만 유지) */
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

  /* ===== IG slider dots (create + sync) ===== */
(function () {
	function initIGSlider(root = document) {
	  const sliders = root.querySelectorAll('.ig-slider');
	  if (!sliders.length) return;
  
	  sliders.forEach((slider) => {
		const track = slider.querySelector('.ig-track');
		if (!track) return;
  
		// 구조: <div class="ig-slider">...</div> 다음에 <div class="ig-dots"></div>
		// 혹시 구조가 달라도 대응
		const post = slider.closest('.post') || slider.parentElement;
		const dotsWrap =
		  post?.querySelector('.ig-dots') ||
		  slider.nextElementSibling?.classList?.contains('ig-dots')
			? slider.nextElementSibling
			: null;
  
		if (!dotsWrap) return;
  
		const slides = Array.from(track.querySelectorAll('.ig-slide'));
		if (slides.length <= 1) {
		  dotsWrap.innerHTML = '';
		  return;
		}
  
		// 중복 초기화 방지(중요: SPA에서 같은 페이지 여러번 들어갈 때)
		if (slider.dataset.igInit === '1') return;
		slider.dataset.igInit = '1';
  
		// dots 생성
		dotsWrap.innerHTML = slides.map((_, i) => `<span data-i="${i}"></span>`).join('');
		const dots = Array.from(dotsWrap.querySelectorAll('span'));
  
		function setActive(idx) {
		  dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
		}
  
		function updateByScroll() {
		  const w = track.clientWidth || 1;
		  const idx = Math.round(track.scrollLeft / w);
		  setActive(Math.max(0, Math.min(idx, slides.length - 1)));
		}
  
		// 초기
		setActive(0);
  
		// 스크롤 동기화
		let raf = 0;
		track.addEventListener('scroll', () => {
		  cancelAnimationFrame(raf);
		  raf = requestAnimationFrame(updateByScroll);
		}, { passive: true });
  
		// 점 클릭 이동
		dotsWrap.addEventListener('click', (e) => {
		  const dot = e.target.closest('span[data-i]');
		  if (!dot) return;
		  const i = Number(dot.dataset.i);
		  track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
		});
  
		// 리사이즈(가로/세로 회전) 시 정확도 보정
		window.addEventListener('resize', updateByScroll, { passive: true });
	  });
	}
  
	// 전역으로 노출 (SPA에서 afterSwap 때 재호출하려고)
	window.initIGSlider = initIGSlider;
  
	// 일반 새로고침 진입 시 1회 실행
	if (document.readyState === 'loading') {
	  document.addEventListener('DOMContentLoaded', () => initIGSlider(document));
	} else {
	  initIGSlider(document);
	}
  })();
  