import { contextBridge, clipboard } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  copyToClipboard: (text: string) => clipboard.writeText(text),
});

