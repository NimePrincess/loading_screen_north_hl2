window.GameDetails = function(servername, serverurl, mapname, maxplayers, steamid){

const avatar = document.getElementById("phAvatar");
const nameEl = document.getElementById("phName");
const steamEl = document.getElementById("phSteam");

nameEl.textContent = "Подключение...";
steamEl.textContent = "STEAMID: " + steamid;

// ⚡ правильный способ аватара
// gmod передает steamid64 → можно взять аватар через steam CDN
if(steamid){
const avatarUrl = "https://avatars.steamstatic.com/" + steamid + "_full.jpg";
avatar.src = avatarUrl;
}
};
