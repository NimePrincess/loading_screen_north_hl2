(() => {
  const rCanvas = document.getElementById("rightFx");
  const rCtx = rCanvas.getContext("2d");

  function resize(){
    rCanvas.width = window.innerWidth;
    rCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const sparks = [];
  function spawn(){
    sparks.push({
      x: rCanvas.width - 200 + Math.random()*200,
      y: Math.random()*rCanvas.height,
      vx: -1 - Math.random()*2,
      vy: -Math.random()*1,
      life: 80 + Math.random()*40,
      size: 2 + Math.random()*3
    });
  }
  setInterval(spawn, 40);

  function draw(){
    rCtx.clearRect(0,0,rCanvas.width,rCanvas.height);

    const g = rCtx.createLinearGradient(rCanvas.width,0,rCanvas.width-500,0);
    g.addColorStop(0,"rgba(255,120,0,0.4)");
    g.addColorStop(1,"transparent");
    rCtx.fillStyle = g;
    rCtx.fillRect(rCanvas.width-500,0,500,rCanvas.height);

    for(let i=sparks.length-1;i>=0;i--){
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.life--;

      rCtx.fillStyle = "orange";
      rCtx.fillRect(s.x,s.y,s.size,s.size);

      if(s.life<=0) sparks.splice(i,1);
    }

    requestAnimationFrame(draw);
  }
  draw();
})();