import { App, Modal, ButtonComponent } from "obsidian";

export class AcceptModal extends Modal {
  text: string
  onAccept: () => void;

  constructor(app: App, text: string, onAccept: () => void) {
    super(app);
    this.text = text;
    this.onAccept = onAccept;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.setText(this.text);

    new ButtonComponent(contentEl)
      .setButtonText("Yes")
      .onClick(() => {
        this.close();
        this.onAccept();
      });

    new ButtonComponent(contentEl)
      .setButtonText("No")
      .onClick(() => {
        this.close();
      });
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}