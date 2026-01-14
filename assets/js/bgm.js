/* assets/js/bgm.js
   - index.html의 버튼 디자인(.button.small)은 그대로 사용
   - 재생/정지 텍스트도 동일하게 유지
*/
(function () {
    const btn = document.getElementById('musicToggle');
    const audio = document.getElementById('bgm');
    if (!btn || !audio) return;
  
    // 안전장치: bgm.js가 중복 로드되어도 1번만 바인딩
    if (btn.dataset.bgmBound === '1') return;
    btn.dataset.bgmBound = '1';
  
    function setUI(isPlaying) {
      btn.textContent = isPlaying ? '❚❚ Music Stop' : '▶︎ Music Play 🎧';
      btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    }
  
    // 초기 UI
    setUI(!audio.paused && !audio.ended);
  
    async function play() {
      // iOS/모바일 정책상 "사용자 클릭"에서만 재생되는 게 정상
      await audio.play();
    }
  
    function pause() {
      audio.pause();
    }
  
    btn.addEventListener('click', async () => {
      try {
        if (audio.paused) {
          await play();
        } else {
          pause();
        }
        // play/pause 이벤트에서 UI도 다시 맞춰짐
      } catch (e) {
        console.log('BGM play failed:', e);
        // 실패해도 UI 꼬이지 않게 동기화
        setUI(false);
      }
    });
  
    // 외부 요인으로 상태 변경돼도 UI 동기화
    audio.addEventListener('play',  () => setUI(true));
    audio.addEventListener('pause', () => setUI(false));
  })();