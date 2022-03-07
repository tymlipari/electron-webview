import { BrowserWindow, ipcMain, MessagePortMain } from "electron";

export default class WebViewMain {
    _port: MessagePortMain = null;
    _browser: BrowserWindow = null;


    constructor(port: MessagePortMain) {
        // Setup the bidirectional comms w/ the hosted web app
        this._port = port;
        this._port.on('message', (event) => this._onWebviewMessage(event));
        this._port.start();

        this._browser = new BrowserWindow({
            height: 800,
            width: 600,
            show: false,
            webPreferences: {
                offscreen: true
            }
        });

        // Setup event handlers
        this._browser.webContents.on('paint', (event, dirtyRect, image) => this._onPaint(dirtyRect, image));

        // Load a URL
        this._browser.webContents.loadFile('../www/webview.html');
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

    _onPaint(dirtyRect: Electron.Rectangle, image: Electron.NativeImage) {
        const arr = new Uint8ClampedArray(image.getBitmap());
        this._port.postMessage({ size: image.getSize(), img: arr });
    }

    _onWebviewMessage(event: Electron.MessageEvent) {
        if (event.data.kind === 'input-event')  {
            this._onInputEvent(event.data);
        }
    }

    _onInputEvent(event: any) {
        if (event.inputEvent) {
            const inputReport = {
                type: event.inputEvent,
                x: event.x,
                y: event.y
            };
            console.log(inputReport);
            this._browser.webContents.sendInputEvent(inputReport);
        } else {
            console.log("Unknown input event: " + JSON.stringify(event));
        }
    }
}

let webViewInstances: Array<WebViewMain> = [];

export function setupWebviewHandlers() {
    // Register the creation handler IPC channel
    ipcMain.on('request-webview-instance', (event, msg) => {
        const webView = new WebViewMain(event.ports[0]);
        webViewInstances.push(webView);
    });
}