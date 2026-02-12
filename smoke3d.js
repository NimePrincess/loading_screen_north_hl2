(() => {
  const sCanvas = document.getElementById("smoke");
  const sCtx = sCanvas.getContext("2d");

  let w,h;
  function resize(){
    w = sCanvas.width = window.innerWidth;
    h = sCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const particles = [];

  function spawn(side){
    for(let i=0;i<8;i++){
      particles.push({
        x: side==="left" ? Math.random()*w*0.25 : w-(Math.random()*w*0.25),
        y: Math.random()*h,
        size: 120+Math.random()*260,
        alpha:0.02+Math.random()*0.04,
        speed:0.1+Math.random()*0.3,
        drift:(Math.random()-.5)*0.4
      });
    }
  }

  setInterval(()=>{ spawn("left"); spawn("right"); }, 200);

  function draw(){
    sCtx.clearRect(0,0,w,h);

    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.y -= p.speed;
      p.x += p.drift;

      sCtx.beginPath();
      const g = sCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size);
      g.addColorStop(0, `rgba(220,220,220,${p.alpha})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      sCtx.fillStyle = g;
      sCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
      sCtx.fill();

      if(p.y < -300) particles.splice(i,1);
    }

    requestAnimationFrame(draw);
  }
  draw();
})();