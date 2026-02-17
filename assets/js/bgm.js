// assets/js/bgm.js (audio 직접 제어 버전)
(function () {
    const btn = document.getElementById('musicToggle');
    const audio = document.getElementById('bgm');
    if (!btn || !audio) return;
  
    if (btn.dataset.bgmBound === '1') return;
    btn.dataset.bgmBound = '1';
  
    function setUI(isPlaying) {
      btn.textContent = isPlaying ? '❚❚ STOP' : '▶︎ 🎧';
      btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    }
  
    setUI(!audio.paused && !audio.ended);
  
    btn.addEventListener('click', async () => { 
      try {
        if (audio.paused) await audio.play();
        else audio.pause();
      } catch (e) {
        // 모바일 정책/실패 시 UI만 정리
        setUI(false);
      }
    });
  
    audio.addEventListener('play',  () => setUI(true));
    audio.addEventListener('pause', () => setUI(false));
  })();