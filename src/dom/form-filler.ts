export class FormFiller {
  static fillInput(input: HTMLInputElement, value: string): void {
    if (input) {
      input.value = value;
      this.triggerEvents(input);
    }
  }

  static fillTextArea(textArea: HTMLTextAreaElement, value: string): void {
    if (textArea) {
      textArea.value = value;
      this.triggerEvents(textArea);
    }
  }

  static checkCheckbox(checkbox: HTMLInputElement, checked: boolean): void {
    if (checkbox) {
      checkbox.checked = checked;
      this.triggerEvents(checkbox);
    }
  }

  static selectOption(select: HTMLSelectElement, value: string): void {
    if (select) {
      select.value = value;
      this.triggerEvents(select);
    }
  }

  private static triggerEvents(element: HTMLElement): void {
    this.dispatchEvent(element, "input");
    this.dispatchEvent(element, "change");
    this.dispatchEvent(element, "blur");
  }

  private static dispatchEvent(element: HTMLElement, type: string): void {
    const event = new Event(type, { bubbles: true });
    element.dispatchEvent(event);
  }
}
