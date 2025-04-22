// Makes YouTube captions/subtitles selectable for easy text copying

class YoutubeCaptionSelector {
  private static readonly POLL_INTERVAL_MS = 750;
  private static readonly SELECTABLE_ATTRIBUTE = "selectable";
  private static readonly SELECTABLE_VALUE = "true";

  private selectionInterval: number | null = null;
  private isRunning = false;

  public initialize(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.startSelectionProcess();
  }

  public stop(): void {
    if (this.selectionInterval !== null) {
      clearInterval(this.selectionInterval);
      this.selectionInterval = null;
    }
    this.isRunning = false;
  }

  private startSelectionProcess(): void {
    this.selectionInterval = window.setInterval(
      () => this.processAllCaptionElements(),
      YoutubeCaptionSelector.POLL_INTERVAL_MS,
    );
  }

  private processAllCaptionElements(): void {
    this.processCaptionWindow();
    this.processCaptionSegments();
    this.processCaption1Window();
  }

  private processCaptionWindow(): void {
    const captionWindow = document.querySelector("div.caption-window");
    if (!captionWindow || this.isElementAlreadyProcessed(captionWindow)) {
      return;
    }

    this.makeElementSelectable(captionWindow);
    this.preventEventPropagation(captionWindow);
    this.preventDragging(captionWindow);
  }

  private processCaptionSegments(): void {
    const captionSegment = document.querySelector(
      `span.ytp-caption-segment:not([${YoutubeCaptionSelector.SELECTABLE_ATTRIBUTE}='${YoutubeCaptionSelector.SELECTABLE_VALUE}'])`,
    );

    if (!captionSegment) {
      return;
    }

    this.makeElementSelectable(captionSegment);
  }

  private processCaption1Window(): void {
    const caption1Window = document.querySelector(
      `#caption-window-1:not([${YoutubeCaptionSelector.SELECTABLE_ATTRIBUTE}='${YoutubeCaptionSelector.SELECTABLE_VALUE}'])`,
    );

    if (!caption1Window) {
      return;
    }

    this.preventEventPropagation(caption1Window);
    this.preventDragging(caption1Window);
    this.markElementAsProcessed(caption1Window);
  }

  private makeElementSelectable(element: Element): void {
    const htmlElement = element as HTMLElement;

    htmlElement.style.userSelect = "text";
    htmlElement.style.webkitUserSelect = "text"; // For Safari
    htmlElement.style.cursor = "text";

    this.markElementAsProcessed(element);
  }

  private preventEventPropagation(element: any): void {
    element.addEventListener(
      "mousedown",
      (event: MouseEvent) => {
        event.stopPropagation();
      },
      true,
    );
  }

  private preventDragging(element: Element): void {
    element.setAttribute("draggable", "false");
  }

  private markElementAsProcessed(element: Element): void {
    element.setAttribute(
      YoutubeCaptionSelector.SELECTABLE_ATTRIBUTE,
      YoutubeCaptionSelector.SELECTABLE_VALUE,
    );
  }

  private isElementAlreadyProcessed(element: Element): boolean {
    return (
      element.getAttribute(YoutubeCaptionSelector.SELECTABLE_ATTRIBUTE) ===
      YoutubeCaptionSelector.SELECTABLE_VALUE
    );
  }
}

class YouTube {
  public static init(): void {
    const captionSelector = new YoutubeCaptionSelector();
    captionSelector.initialize();

    (window as any).YoutubeCaptionSelector = captionSelector;
  }
}

export { YouTube };
