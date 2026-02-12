(() => {
  const mCanvas = document.getElementById("matrix");
  const mCtx = mCanvas.getContext("2d");

  function resize(){
    mCanvas.width = window.innerWidth;
    mCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const phrases = [
    "Груз потерян... возвращаемся на базу... конец связи...",
    "Северный Союз на связь...",
    "ГО штурмуют объект!",
    "Видишь сопротивление? а оно должно быть...",
    "Доложите статус груза... повторяю..."
  ];

  const fontSize = 18;
  const leftWidth = () => Math.floor(mCanvas.width * 0.32); // зона слева

  function makeDrops(){
    const cols = Math.max(8, Math.floor(leftWidth() / fontSize));
    return Array.from({length: cols}, () => Math.random() * (mCanvas.height/fontSize));
  }
  let drops = makeDrops();

  window.addEventListener("resize", () => { drops = makeDrops(); });

  function draw(){
    // рисуем ТОЛЬКО слева: клип-регион
    const lw = leftWidth();

    mCtx.save();
    mCtx.beginPath();
    mCtx.rect(0, 0, lw, mCanvas.height);
    mCtx.clip();

    mCtx.fillStyle = "rgba(0,0,0,0.06)";
    mCtx.fillRect(0, 0, lw, mCanvas.height);

    mCtx.fillStyle = "#8aff8a";
    mCtx.font = fontSize + "px monospace";

    for(let i=0; i<drops.length; i++){
      const phrase = phrases[(Math.random()*phrases.length)|0];
      const ch = phrase[(Math.random()*phrase.length)|0];

      const x = i * fontSize;
      const y = drops[i] * fontSize;

      mCtx.fillText(ch, x, y);

      if(y > mCanvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 1.05;
    }

    mCtx.restore();
  }

  setInterval(draw, 35);
})();