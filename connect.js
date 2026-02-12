const log = document.getElementById("connectLog");

const lines = [
"Инициализация системы...",
"Загрузка протоколов безопасности...",
"Подключение к узлу СЕВЕР...",
"Проверка доступа...",
"Сканирование сети...",
"Синхронизация данных...",
"Подключение к серверу...",
"Вход в систему..."
];

let lineIndex = 0;

function typeLine(text){
 let i = 0;
 const span = document.createElement("div");
 log.prepend(span);

 function typing(){
   span.textContent = text.slice(0,i);
   i++;

   if(i <= text.length){
     setTimeout(typing, 25 + Math.random()*25);
   }
 }
 typing();
}

function nextLine(){
 if(lineIndex >= lines.length){
   lineIndex = 0;
 }
 typeLine(lines[lineIndex]);
 lineIndex++;

 // ограничение строк
 if(log.children.length > 6){
   log.removeChild(log.lastChild);
 }
}

setInterval(nextLine, 2200);