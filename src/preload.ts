import { contextBridge, ipcRenderer } from "electron";

let requestId = 0;

contextBridge.exposeInMainWorld('webviewAPI', {
    requestWebview: () => {
        const newId = requestId++;
        
        const { port1, port2 } = new MessageChannel();

        ipcRenderer.postMessage('request-webview-instance', { instanceId: newId }, [port1]);
        window.postMessage('provide-main-world-webview-port', '*', [port2]);
    }
});