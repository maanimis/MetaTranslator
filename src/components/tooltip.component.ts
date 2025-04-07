import { ITooltip } from "./interfaces.components";

export class DOMTooltip implements ITooltip {
  private element: HTMLDivElement;

  constructor() {
    this.element = document.createElement("div");
    this.setupStyles();
    document.body.appendChild(this.element);
  }

  private setupStyles(): void {
    Object.assign(this.element.style, {
      position: "absolute",
      background: "rgba(0, 0, 0, 0.85)",
      color: "#fff",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "14px",
      pointerEvents: "none",
      zIndex: "9999",
      maxWidth: "350px",
      lineHeight: "1.4",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      display: "none",
      transition: "opacity 0.2s ease",
      whiteSpace: "pre-line",
      direction: "rtl", // Added RTL direction
      textAlign: "right",
    });
  }

  show(text: string, x: number, y: number): void {
    this.element.innerHTML = text;
    this.element.style.top = `${y}px`;
    this.element.style.left = `${x}px`;
    this.element.style.display = "block";
    this.element.style.opacity = "1";
  }

  hide(): void {
    this.element.style.opacity = "0";
    this.element.style.display = "none";
  }
}
