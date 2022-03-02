let id = null;

let elem = document.getElementById('animated');
setInterval(animCallback, 10);

let pos = 0;
let dir = 1;
function animCallback() {
    if (pos < 0 || pos > 350) {
        dir *= -1;
    }

    pos += dir;
    elem.style.top = pos + 'px';
    elem.style.left = pos + 'px';
}