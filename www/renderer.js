class WebViewProxy {

    constructor(port, canvasElement) {
        this._webviewPort = port;
        this._canvas = canvasElement;

        // Setup message handlers
        this._webviewPort.onmessage = (event) => {
            this._onWebviewUpdate(event.data.size, event.data.img);
        }

        this._webviewPort.start();

        // Register HTML element input handlers
        this._canvas.addEventListener('mousedown', (event) => this._onMouseEvent(event));
        this._canvas.addEventListener('mouseup', (event) => this._onMouseEvent(event));
        this._canvas.addEventListener('mousemove', (event) => this._onMouseEvent(event));
        this._canvas.addEventListener('mouseenter', (event) => this._onMouseEvent(event));
        this._canvas.addEventListener('mouseleave', (event) => this._onMouseEvent(event));
    }

    _onWebviewUpdate(size, pixelBuffer) {
        // Copy the webview contents onto the canvas
        const ctx = this._canvas.getContext('bitmaprenderer');
        const newImageData = new ImageData(pixelBuffer, size.width);
        createImageBitmap(newImageData).then((img) => {
            ctx.transferFromImageBitmap(img);
        });
        // let ctx = this._canvas.getContext('2d');
        // let newImage = new ImageData(pixelBuffer, size.width, size.height);
        // ctx.putImageData(newImage, 0, 0);
    }

    _onMouseEvent(event) {
        const msg = {
            kind: 'input-event',
            inputType: event.type,
            x: event.offsetX,
            y: event.offsetY,
        };

        this._webviewPort.postMessage(msg);
    }
}

// Request a webview from the main process
let _webView = null;
window.webviewAPI.requestWebview();

window.onmessage = (event) => {
    if (event.data === 'provide-main-world-webview-port') {
        _webVeiw = new WebViewProxy(event.ports[0], document.getElementById('webview-canvas'));
    }
};