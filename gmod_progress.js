(() => {
const fill = document.getElementById("gpFill");
const percentEl = document.getElementById("gpPercent");
const statusEl = document.getElementById("gpStatus");
const fileEl = document.getElementById("gpFile");
const titleEl = document.getElementById("gpTitle");

let total = 0;
let needed = 0;

function update(){
if(total <= 0){
fill.style.width = "0%";
percentEl.textContent = "0%";
return;
}

```
const done = Math.max(0, total - needed);
const pct = Math.floor((done / total) * 100);

fill.style.width = pct + "%";
percentEl.textContent = pct + "%";
```

}

window.GameDetails = function(servername){
titleEl.textContent = servername ? "CONNECTING: " + servername : "CONNECTING";
};

window.SetFilesTotal = function(t){
total = Number(t) || 0;
update();
};

window.SetFilesNeeded = function(n){
needed = Number(n) || 0;
update();
};

window.DownloadingFile = function(file){
fileEl.textContent = file || "—";
};

window.SetStatusChanged = function(status){
statusEl.textContent = status || "Загрузка...";
};
})();
