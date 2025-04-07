import { ITooltip } from "./interfaces.components";

export class DOMTooltip implements ITooltip {
  private element: HTMLDivElement;
  private hideTimeout: number | null = null;
  private isSelecting: boolean = false;

  constructor() {
    this.element = document.createElement("div");
    this.setupStyles();
    this.setupListeners();
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
      pointerEvents: "auto",
      zIndex: "9999",
      maxWidth: "350px",
      lineHeight: "1.4",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      display: "none",
      transition: "opacity 0.2s ease",
      whiteSpace: "pre-line",
      direction: "rtl",
      textAlign: "right",
      userSelect: "text",
      WebkitUserSelect: "text",
      MozUserSelect: "text",
      msUserSelect: "text",
      cursor: "text",
    });
  }

  private setupListeners(): void {
    // Prevent hiding when hovering the tooltip
    this.element.addEventListener("mouseenter", (): void => {
      if (this.hideTimeout !== null) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
    });

    // Hide when mouse leaves the tooltip (with a small delay)
    this.element.addEventListener("mouseleave", (): void => {
      // Don't hide if user is in the middle of selecting text
      if (!this.isSelecting) {
        this.hide();
      }
    });

    // Track when selection starts
    this.element.addEventListener("mousedown", (): void => {
      this.isSelecting = true;
    });

    // Track when selection ends
    document.addEventListener("mouseup", (event: MouseEvent): void => {
      if (this.isSelecting) {
        this.isSelecting = false;

        // Check if mouse is outside the tooltip when selection ends
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          // Keep tooltip visible if text is selected
          if (this.hideTimeout !== null) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
          }
        } else {
          // If no text is selected, only hide if mouse is outside the tooltip
          const rect = this.element.getBoundingClientRect();
          const mouseX = event.clientX;
          const mouseY = event.clientY;

          if (
            mouseX < rect.left ||
            mouseX > rect.right ||
            mouseY < rect.top ||
            mouseY > rect.bottom
          ) {
            this.hide();
          }
        }
      }
    });
  }

  public show(text: string, x: number, y: number): void {
    this.element.innerHTML = text;
    this.element.style.top = `${y}px`;
    this.element.style.left = `${x}px`;
    this.element.style.display = "block";
    requestAnimationFrame((): void => {
      this.element.style.opacity = "1";
    });
  }

  public hide(): void {
    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = window.setTimeout((): void => {
      this.element.style.opacity = "0";
      this.element.style.display = "none";
      this.hideTimeout = null;
    }, 300); // Small delay to allow hover
  }
}
