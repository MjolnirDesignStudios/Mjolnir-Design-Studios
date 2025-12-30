// types.d.ts
interface Window {
  Calendly: {
    initPopupWidget: (options: {
      url: string;
      prefill?: { email?: string; [key: string]: string };
    }) => void;
  };
}