(() => {
  const logEl = document.getElementById("termLog");
  const statusEl = document.getElementById("termStatus");

  const phrases = [
    "Груз потерян... возвращаемся на базу... конец связи...",
    "Северный Союз на связь...",
    "ГО штурмуют объект!",
    "Видишь сопротивление? а оно должно быть...",
    "Доложите статус груза... повторяю..."
  ];

  const headers = [
    "RX//",
    "TX//",
    "COMMS//",
    "OPS//",
    "ALERT//"
  ];

  function ts(){
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,"0");
    const mm = String(d.getMinutes()).padStart(2,"0");
    const ss = String(d.getSeconds()).padStart(2,"0");
    return `${hh}:${mm}:${ss}`;
  }

  // эффект “печати”
  let busy = false;
  function typeLine(text, cls=""){
    if(busy) return;
    busy = true;

    const span = document.createElement("span");
    span.className = `term-line ${cls}`.trim();
    logEl.prepend(span);

    const prefix = `${ts()} ${headers[(Math.random()*headers.length)|0]} `;
    const full = prefix + text;

    let i = 0;
    const speed = 12 + ((Math.random()*10)|0);

    const tick = () => {
      i += 1 + ((Math.random()*2)|0);
      span.textContent = full.slice(0, i);

      // лёгкий “глич статуса”
      if(Math.random() > 0.92){
        statusEl.textContent = `CH: ${String(1+((Math.random()*8)|0)).padStart(2,"0")} • ENCRYPT: ${Math.random()>0.15?"ON":"SYNC"}`;
      }

      if(i < full.length){
        setTimeout(tick, speed);
      } else {
        busy = false;

        // ограничим лог
        while(logEl.children.length > 14) logEl.removeChild(logEl.lastChild);
      }
    };
    tick();
  }

  // периодическая генерация строк
  function pushRandom(){
    const p = phrases[(Math.random()*phrases.length)|0];

    // класс строки по смыслу
    let cls = "term-dim";
    if(p.includes("штурмуют") || p.includes("сопротивление")) cls = "term-warn";
    if(p.includes("потерян")) cls = "term-err";

    typeLine(p, cls);
  }

  // стартовый “бут”
  const boot = [
    "Инициализация канала связи...",
    "Шифрование: AES-256 // активировано",
    "Спутниковый ретранслятор: ONLINE",
    "Сигнал: стабилен"
  ];
  let b = 0;
  const bootTimer = setInterval(() => {
    typeLine(boot[b], "term-dim");
    b++;
    if(b >= boot.length){
      clearInterval(bootTimer);
      setInterval(pushRandom, 2400);
      setTimeout(pushRandom, 700);
    }
  }, 520);
})();