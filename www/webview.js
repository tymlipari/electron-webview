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

document.addEventListener('mousemove', (event) => {
    elem.style.backgroundColor = randomColorHex();
})

function randomColorHex() {
    function randomInt() {
        return Math.floor(Math.random() * 256);
    }

    const [r, g, b] = [randomInt(), randomInt(), randomInt()];

    return "#" + r.toString(16).padStart(2, '0') +
                 g.toString(16).padStart(2, '0') +
                 b.toString(16).padStart(2, '0');
}