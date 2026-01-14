/* assets/js/bgm.js - iframe(bgm.html) 제어 */
(function () {
    const btn = document.getElementById('musicToggle');
    const frame = document.getElementById('bgm-frame');
    if (!btn || !frame) return;
  
    if (btn.dataset.bgmBound === '1') return;
    btn.dataset.bgmBound = '1';
  
    function setUI(isPlaying) {
      btn.textContent = isPlaying ? '❚❚ Music Stop' : '▶︎ Music Play 🎧';
      btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    }
  
    function post(type) {
      frame.contentWindow?.postMessage({ type }, '*');
    }
  
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'BGM_STATUS_REPLY') setUI(!!e.data.playing);
    });
  
    window.addEventListener('load', () => post('BGM_STATUS'));
  
    btn.addEventListener('click', () => {
      post('BGM_TOGGLE');
      setTimeout(() => post('BGM_STATUS'), 120);
    });
  
    setUI(false);
  })();
  