(() => {
  let started = false;

  // --- helpers ---
  function makeNoiseBuffer(ctx, seconds = 1.0, type = "white"){
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);

    let last = 0;
    for(let i=0;i<len;i++){
      const w = Math.random()*2 - 1;
      if(type === "white"){
        d[i] = w;
      } else if(type === "brown"){
        last = (last + 0.02*w) / 1.02;
        d[i] = last * 3.0;
      } else { // pink-ish
        last = 0.98*last + 0.02*w;
        d[i] = last;
      }
    }
    return buf;
  }

  function createDelay(ctx, time=0.18, feedback=0.35, mix=0.28){
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = time;

    const fb = ctx.createGain();
    fb.gain.value = feedback;

    const wet = ctx.createGain();
    wet.gain.value = mix;

    const dry = ctx.createGain();
    dry.gain.value = 1 - mix;

    delay.connect(fb);
    fb.connect(delay);

    return { delay, wet, dry };
  }

  function startAudio(){
    if(started) return;
    started = true;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if(ctx.state === "suspended") ctx.resume().catch(()=>{});

    const master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);

    // =========================
    // 🌬 WIND
    // =========================
    const wind = ctx.createBufferSource();
    wind.buffer = makeNoiseBuffer(ctx, 2.0, "brown");
    wind.loop = true;

    const windHP = ctx.createBiquadFilter();
    windHP.type = "highpass";
    windHP.frequency.value = 35;

    const windLP = ctx.createBiquadFilter();
    windLP.type = "lowpass";
    windLP.frequency.value = 420;

    const windGain = ctx.createGain();
    windGain.gain.value = 0.22;

    // gusts
    const gust = ctx.createOscillator();
    gust.type = "sine";
    gust.frequency.value = 0.06;

    const gustAmt = ctx.createGain();
    gustAmt.gain.value = 0.14;

    gust.connect(gustAmt);
    gustAmt.connect(windGain.gain);

    wind.connect(windHP);
    windHP.connect(windLP);
    windLP.connect(windGain);
    windGain.connect(master);

    wind.start();
    gust.start();

    // =========================
    // 🔫 GUNFIRE + ECHO
    // =========================
    const gunBus = ctx.createGain();
    gunBus.gain.value = 0.22;
    gunBus.connect(master);

    // echo network (simple delay)
    const echo = createDelay(ctx, 0.16, 0.32, 0.30);
    gunBus.connect(echo.dry);
    gunBus.connect(echo.delay);
    echo.dry.connect(master);
    echo.delay.connect(echo.wet);
    echo.wet.connect(master);

    function gunShot(){
      // transient thump
      const th = ctx.createOscillator();
      th.type = "square";
      th.frequency.value = 55 + Math.random()*25;

      const thGain = ctx.createGain();
      thGain.gain.value = 0;

      // crack noise
      const n = ctx.createBufferSource();
      n.buffer = makeNoiseBuffer(ctx, 0.18, "white");

      const nBP = ctx.createBiquadFilter();
      nBP.type = "bandpass";
      nBP.frequency.value = 1200 + Math.random()*600;
      nBP.Q.value = 0.9;

      const nLP = ctx.createBiquadFilter();
      nLP.type = "lowpass";
      nLP.frequency.value = 1800;

      const out = ctx.createGain();
      out.gain.value = 0;

      th.connect(thGain);
      thGain.connect(out);

      n.connect(nBP);
      nBP.connect(nLP);
      nLP.connect(out);

      out.connect(gunBus);

      const now = ctx.currentTime;
      // envelope: fast attack, short decay
      out.gain.setValueAtTime(0.0, now);
      out.gain.linearRampToValueAtTime(0.16, now + 0.008);
      out.gain.exponentialRampToValueAtTime(0.0009, now + 0.55);

      th.start(now);
      th.stop(now + 0.12);

      n.start(now);
      n.stop(now + 0.20);
    }

    function burst(){
      const shots = 2 + ((Math.random()*6)|0);
      for(let i=0;i<shots;i++){
        setTimeout(gunShot, i*(110 + (Math.random()*70)) );
      }
    }

    setInterval(() => {
      if(Math.random() > 0.55) burst();
    }, 3800 + Math.random()*5200);

    // =========================
    // 💥 DISTANT ARTILLERY
    // =========================
    const boomBus = ctx.createGain();
    boomBus.gain.value = 0.38;
    boomBus.connect(master);

    // subtle long tail (far reverb-ish)
    const boomEcho = createDelay(ctx, 0.38, 0.22, 0.22);
    boomBus.connect(boomEcho.dry);
    boomBus.connect(boomEcho.delay);
    boomEcho.dry.connect(master);
    boomEcho.delay.connect(boomEcho.wet);
    boomEcho.wet.connect(master);

    function artilleryBoom(){
      const now = ctx.currentTime;

      // low sine body
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = 28 + Math.random()*10;

      const g = ctx.createGain();
      g.gain.value = 0;

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 220;

      // noise rumble
      const n = ctx.createBufferSource();
      n.buffer = makeNoiseBuffer(ctx, 1.3, "brown");

      const nLP = ctx.createBiquadFilter();
      nLP.type = "lowpass";
      nLP.frequency.value = 260;

      const mix = ctx.createGain();
      mix.gain.value = 0;

      o.connect(g);
      g.connect(lp);
      lp.connect(mix);

      n.connect(nLP);
      nLP.connect(mix);

      mix.connect(boomBus);

      // envelope: big hit + long decay
      mix.gain.setValueAtTime(0.0, now);
      mix.gain.linearRampToValueAtTime(0.55, now + 0.04);
      mix.gain.exponentialRampToValueAtTime(0.0008, now + 4.2);

      o.start(now);
      o.stop(now + 2.2);

      n.start(now);
      n.stop(now + 1.4);
    }

    setInterval(() => {
      // редко
      if(Math.random() > 0.72) artilleryBoom();
    }, 6500 + Math.random()*9000);

    // =========================
    // 📻 "COMBINE-LIKE" RADIO CHATTER (synthetic, not HL2 lines)
    // =========================
    const radioBus = ctx.createGain();
    radioBus.gain.value = 0.14;
    radioBus.connect(master);

    // radio noise bed
    const radioNoise = ctx.createBufferSource();
    radioNoise.buffer = makeNoiseBuffer(ctx, 1.8, "white");
    radioNoise.loop = true;

    const radioBP = ctx.createBiquadFilter();
    radioBP.type = "bandpass";
    radioBP.frequency.value = 1700;
    radioBP.Q.value = 0.9;

    const radioGain = ctx.createGain();
    radioGain.gain.value = 0.035;

    radioNoise.connect(radioBP);
    radioBP.connect(radioGain);
    radioGain.connect(radioBus);

    radioNoise.start();

    // synthetic "voice": two oscillators through bandpass, gated, to feel like coded speech
    function radioPhrase(){
      const now = ctx.currentTime;

      const v1 = ctx.createOscillator();
      const v2 = ctx.createOscillator();
      v1.type = "sawtooth";
      v2.type = "square";

      // pick “robot syllables” (no copyrighted text)
      const base = 190 + Math.random()*90;
      v1.frequency.value = base;
      v2.frequency.value = base*1.5;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1200 + Math.random()*600;
      bp.Q.value = 6.0;

      const g = ctx.createGain();
      g.gain.value = 0;

      // choppy gate (radio packet)
      const gate = ctx.createOscillator();
      gate.type = "square";
      gate.frequency.value = 10 + Math.random()*8;
      const gateAmt = ctx.createGain();
      gateAmt.gain.value = 0.06;

      gate.connect(gateAmt);
      gateAmt.connect(g.gain);

      v1.connect(bp);
      v2.connect(bp);
      bp.connect(g);
      g.connect(radioBus);

      // short “packet”
      g.gain.setValueAtTime(0.0, now);
      g.gain.linearRampToValueAtTime(0.06, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0008, now + (0.35 + Math.random()*0.5));

      v1.start(now);
      v2.start(now);
      gate.start(now);

      const dur = 0.45 + Math.random()*0.65;
      v1.stop(now + dur);
      v2.stop(now + dur);
      gate.stop(now + dur);
    }

    setInterval(() => {
      // иногда “пакеты переговоров”
      if(Math.random() > 0.55) radioPhrase();
      if(Math.random() > 0.86) setTimeout(radioPhrase, 220 + Math.random()*260);
    }, 2300 + Math.random()*2200);

    // cleanup listeners
    stopListening();
  }

  function stopListening(){
    window.removeEventListener("pointerdown", startAudio);
    window.removeEventListener("mousemove", startAudio);
    window.removeEventListener("keydown", startAudio);
    window.removeEventListener("touchstart", startAudio);
    window.removeEventListener("wheel", startAudio);
  }

  // Edge/Chromium needs a gesture
  window.addEventListener("pointerdown", startAudio, { once:true, passive:true });
  window.addEventListener("mousemove", startAudio, { once:true, passive:true });
  window.addEventListener("keydown", startAudio, { once:true, passive:true });
  window.addEventListener("touchstart", startAudio, { once:true, passive:true });
  window.addEventListener("wheel", startAudio, { once:true, passive:true });
})();