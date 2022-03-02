const { ipcRenderer, contextBridge } = require('electron');

let requestId = 0;

contextBridge.exposeInMainWorld('webviewAPI', {
  requestWebview: () => {

    const { port1, port2 } = new MessageChannel();

    const newId = requestId++;
    ipcRenderer.postMessage('request-webview-instance', { instanceId: newId }, [port1]);

    window.postMessage('provide-main-world-webview-port', '*', [port2]);
  }
});