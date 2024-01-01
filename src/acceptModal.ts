import { App, Modal, ButtonComponent } from "obsidian";

export class AcceptModal extends Modal {
  private text: string
  private onAccept: () => void;

  constructor(app: App, text: string, onAccept: () => void) {
    super(app);
    this.text = text;
    this.onAccept = onAccept;
  }

  public onOpen() {
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

  public onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}