const { BrowserWindow, ipcMain, MessageChannelMain, MessagePortMain, BrowserView } = require('electron');

class WebViewMain {
    constructor(port) {
        this._port = port;
        this._port.on('message', (event) => this._onWebviewMessage(event));
        this._port.start();

        this._browser = new BrowserWindow({
            height: 600,
            width: 600,
            show: false,
            webPreferences: {
                offscreen: true
            }
        });

        // Setup event handlers
        this._browser.webContents.on('paint', (_event, dirtyRect, image) => {
            const arr = new Uint8ClampedArray(image.getBitmap());
            this._port.postMessage({ size: image.getSize(), img: arr });
        });

        // Load a URL
        this._browser.webContents.loadFile('www/webview.html');
    }

    close() {
        if (this._port) {
            this._port.close();
            this._port = null;
        }

        if (this._browser) {
            this._browser.close();
            this._browser = null;
        }
    }

    _onWebviewMessage(event) {
        if (event.data.kind === 'input-event') {
            this._onInputEvent(event.data);
        }
    }

    _onInputEvent(event) {
        if (event.inputEvent === 'mouse-move') {
            console.log("Mouse moved to [" + event.x + ", " + event.y + "]");
        }
    }
}

let webViewInstances = [];

function setupWebviewHandlers() {
    // Register the creation handler IPC channel
    ipcMain.on('request-webview-instance', (event, msg) => {
        
        // Setup the WebView instance attached to the main process's port
        const webView = new WebViewMain(event.ports[0]);
        webViewInstances.push(webView);
    });
}

// Module exports
exports.setupWebviewHandlers = setupWebviewHandlers;