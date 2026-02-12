let progress = document.getElementById("progress");
let percent = 0;

/* Фейковая анимация (GMod сам обновляет загрузку) */
let interval = setInterval(() => {
    if (percent < 100) {
        percent += Math.random() * 4;
        progress.style.width = percent + "%";
    } else {
        progress.style.width = "100%";
        clearInterval(interval);
    }
}, 100);