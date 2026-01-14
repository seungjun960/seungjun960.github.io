/*

	Created by. SeungJun Lee

*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile)
			$body.addClass('is-touch');

	// Forms.
		var $form = $('form');

		// Auto-resizing textareas.
			$form.find('textarea').each(function() {

				var $this = $(this),
					$wrapper = $('<div class="textarea-wrapper"></div>'),
					$submits = $this.find('input[type="submit"]');

				$this
					.wrap($wrapper)
					.attr('rows', 1)
					.css('overflow', 'hidden')
					.css('resize', 'none')
					.on('keydown', function(event) {

						if (event.keyCode == 13
						&&	event.ctrlKey) {

							event.preventDefault();
							event.stopPropagation();

							$(this).blur();

						}

					})
					.on('blur focus', function() {
						$this.val($.trim($this.val()));
					})
					.on('input blur focus --init', function() {

						$wrapper
							.css('height', $this.height());

						$this
							.css('height', 'auto')
							.css('height', $this.prop('scrollHeight') + 'px');

					})
					.on('keyup', function(event) {

						if (event.keyCode == 9)
							$this
								.select();

					})
					.triggerHandler('--init');

				// Fix.
					if (browser.name == 'ie'
					||	browser.mobile)
						$this
							.css('max-height', '10em')
							.css('overflow-y', 'auto');

			});

	// Menu.
		var $menu = $('#menu');

		$menu.wrapInner('<div class="inner"></div>');

		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					if (href == '#menu')
						return;

					window.setTimeout(function() {
						window.location.href = href;
					}, 350);

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});

})(jQuery);


(function () {
	// 모바일(터치 환경)에서만
	const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
	if (!isTouch) return;
  
	const tiles = document.querySelectorAll('.tiles article');
	tiles.forEach(article => {
	  const link = article.querySelector('a[href]');
	  if (!link) return;
  
	  link.addEventListener('click', (e) => {
		// 이미 활성화면 -> 두번째 탭: 이동 허용
		if (article.classList.contains('is-active')) return;
  
		// 첫 탭: 오버레이 보여주고 이동 막기
		e.preventDefault();
  
		// 다른 타일은 꺼주기
		tiles.forEach(a => a.classList.remove('is-active'));
		article.classList.add('is-active');
	  });
	});
  
	// 빈 곳 탭하면 닫기
	document.addEventListener('touchstart', (e) => {
	  if (e.target.closest('.tiles article')) return;
	  tiles.forEach(a => a.classList.remove('is-active'));
	}, { passive: true });
  })();


  (function () {
	// 터치(모바일)에서만 동작
	const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
	if (!isTouch) return;
  
	const articles = Array.from(document.querySelectorAll('.tiles article'));
	if (!articles.length) return;
  
	articles.forEach((article) => {
	  const link = article.querySelector('a[href]');
	  if (!link) return;
  
	  link.addEventListener('click', (e) => {
		// 이미 활성화면: 2번째 탭 -> 이동 허용
		if (article.classList.contains('is-active')) return;
  
		// 첫 탭: 활성화만 하고 이동 막기
		e.preventDefault();
  
		// 다른 타일은 닫기
		articles.forEach(a => a.classList.remove('is-active'));
		article.classList.add('is-active');
	  });
	});
  
	// 타일 밖을 터치하면 닫기
	document.addEventListener('touchstart', (e) => {
	  if (e.target.closest('.tiles article')) return;
	  articles.forEach(a => a.classList.remove('is-active'));
	}, { passive: true });
  })();







  (function () {
	// SPA-lite: tile 클릭 시 페이지 이동 대신 내용만 로드(음악 유지)
	const container = document.querySelector('#main .inner');
	if (!container) return;
  
	// 타일 내부 링크 클릭 가로채기
	document.addEventListener('click', async (e) => {
	  const a = e.target.closest('.tiles a');
	  if (!a) return;
  
	  const url = a.getAttribute('href');
	  if (!url || url.startsWith('#') || url.startsWith('http')) return;
  
	  e.preventDefault();
  
	  try {
		const res = await fetch(url, { cache: 'no-cache' });
		if (!res.ok) throw new Error('Fetch failed: ' + res.status);
  
		const html = await res.text();
  
		// 받아온 페이지에서 "#main .inner"만 추출해서 교체
		const tmp = document.createElement('div');
		tmp.innerHTML = html;
  
		const next = tmp.querySelector('#main .inner');
		if (!next) {
		  // fallback: 그냥 이동
		  window.location.href = url;
		  return;
		}
  
		container.innerHTML = next.innerHTML;
  
		// 주소창/뒤로가기 대응
		history.pushState({ url }, '', url);
  
		// 메뉴 닫기(원 테마 동작 유지)
		document.body.classList.remove('is-menu-visible');
  
		// 맨 위로 스크롤
		window.scrollTo({ top: 0, behavior: 'smooth' });
	  } catch (err) {
		console.log(err);
		window.location.href = url; // 실패 시 원래대로 이동
	  }
	});
  
	// 뒤로가기 처리
	window.addEventListener('popstate', async (e) => {
	  const url = (e.state && e.state.url) ? e.state.url : 'index.html';
	  try {
		const res = await fetch(url, { cache: 'no-cache' });
		const html = await res.text();
		const tmp = document.createElement('div');
		tmp.innerHTML = html;
		const next = tmp.querySelector('#main .inner');
		if (next) container.innerHTML = next.innerHTML;
	  } catch (err) {
		console.log(err);
		window.location.href = url;
	  }
	});
  })();
  
  <script src="assets/js/mobileUI.js"></script>