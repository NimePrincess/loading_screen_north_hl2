// данные игрока приходят из Garry's Mod
window.GameDetails = function(servername, serverurl, mapname, maxplayers, steamid, gamemode){

 // ник
 document.getElementById("phName").textContent = servername 
   ? "Подключение..."
   : "Игрок подключается";

 // steamid
 document.getElementById("phSteam").textContent = "STEAMID: " + steamid;

 // аватар через steam api
 if(steamid){
   fetch("https://steamcommunity.com/profiles/"+steamid+"?xml=1")
   .then(r=>r.text())
   .then(str=>{
      const xml = new DOMParser().parseFromString(str,"text/xml");
      const avatar = xml.querySelector("avatarFull");
      const name = xml.querySelector("steamID");

      if(avatar){
        document.getElementById("phAvatar").src = avatar.textContent;
      }
      if(name){
        document.getElementById("phName").textContent = name.textContent;
      }
   }).catch(()=>{});
 }
};