(() => {
  const fill = document.getElementById("gpFill");
  const percentEl = document.getElementById("gpPercent");
  const statusEl = document.getElementById("gpStatus");
  const fileEl = document.getElementById("gpFile");
  const titleEl = document.getElementById("gpTitle");

  let total = 0;
  let needed = 0;

  function clamp01(x){ return Math.max(0, Math.min(1, x)); }

  function updateProgress(){
    if(!total || total <= 0){
      fill.style.width = "0%";
      percentEl.textContent = "0%";
      return;
    }
    const done = total - needed;
    const p = clamp01(done / total);
    const pct = Math.floor(p * 100);
    fill.style.width = pct + "%";
    percentEl.textContent = pct + "%";
  }

  // ===== GMOD callbacks (Facepunch Wiki) =====
  window.GameDetails = function(servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language){
    // можно вывести сервер/карту, но аккуратно
    titleEl.textContent = (servername ? "CONNECTING: " + servername : "CONNECTING");
  };

  window.SetFilesTotal = function(t){
    total = Number(t) || 0;
    updateProgress();
  };

  window.SetFilesNeeded = function(n){
    needed = Number(n) || 0;
    updateProgress();
  };

  window.DownloadingFile = function(fileName){
    fileEl.textContent = fileName || "—";
  };

  window.SetStatusChanged = function(status){
    statusEl.textContent = status || "Загрузка…";
  };

  // На случай если что-то не приходит — базовый текст
  statusEl.textContent = "Загрузка ресурсов…";
  fileEl.textContent = "—";
})();