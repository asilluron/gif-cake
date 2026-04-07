interface ElectronAPI {
  copyToClipboard: (text: string) => void;
}

interface Window {
  electronAPI: ElectronAPI;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.css';

