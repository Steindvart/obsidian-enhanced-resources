import { App, ItemView, WorkspaceLeaf, Setting, ButtonComponent } from 'obsidian';
import { EnhancedResourcesPluginSettings } from './settings';

export const RESOURCE_VIEW_TYPE = 'resource-view-toolbar';

export class ResourceView extends ItemView {
  private readonly settings: EnhancedResourcesPluginSettings;

  constructor(leaf: WorkspaceLeaf, app: App, settings: EnhancedResourcesPluginSettings) {
    super(leaf);
    this.app = app;
    this.settings = settings;
  }

  onload(): void {

  }

  onunload(): void {

  }

  public getViewType(): string {
    return RESOURCE_VIEW_TYPE;
  }

  public getDisplayText(): string {
    return 'Enhanced resources view';
  }

  public getIcon(): string {
    return 'dice';
  }

  private getCurrentFilePath(): string | undefined {
    const file = this.app.workspace.getActiveFile();
    return file?.path;
  }

  public load(): void {
    super.load();
    this.draw();
  }

  private async draw() {
    const container = this.containerEl.children[1];  // #NOTE: [1] is important
    const rootEl = document.createElement('div');

    const currentFilePath = this.getCurrentFilePath();
    let fileDesc = {
      filePath: "No file is opened",
      isOpen: false
    }
    if (currentFilePath !== undefined) {
      fileDesc.filePath = currentFilePath;
      fileDesc.isOpen = true;
    }

    rootEl.createDiv()
      .createSpan({ cls: 'title' })
      .setText(fileDesc.filePath);

    const infoEl = rootEl.createDiv();

    // #TODO: decompose
    if (fileDesc.isOpen) {
      const infoContent = await this.app.vault.adapter.read(this.settings.pathResInfo);
      const infoObj = JSON.parse(infoContent);
      const fileInfo = infoObj[fileDesc.filePath];
      if (fileInfo !== undefined) {
        const newFileInfo = fileInfo;
        const keys = Object.keys(newFileInfo);

        for (const key of keys) {
          const value = newFileInfo[key];

          new Setting(infoEl)
          .setName(key)
          .addText(text => text.setValue(value)
          .onChange((value) => {
            newFileInfo[key] = value;
          }));
        }

        new ButtonComponent(infoEl)
          .setButtonText('Save')
          .onClick(async (evt: MouseEvent) => {
            infoObj[fileDesc.filePath] = newFileInfo;
            await this.app.vault.adapter.write(this.settings.pathResInfo, JSON.stringify(infoObj));
            this.draw();
          });

        new ButtonComponent(infoEl)
          .setButtonText('Remove')
          .onClick(async (evt: MouseEvent) => {
            delete infoObj[fileDesc.filePath];
            await this.app.vault.adapter.write(this.settings.pathResInfo, JSON.stringify(infoObj));
            this.draw();
          });
     } else {
      infoEl.createSpan('This resource not have info.')

      new ButtonComponent(infoEl)
        .setButtonText('Add basic info')
        .onClick(async (evt: MouseEvent) => {
          const newFileInfo = {
            'comment': '',
            'tags': ''
          };
          infoObj[fileDesc.filePath] = newFileInfo;

          await this.app.vault.adapter.write(this.settings.pathResInfo, JSON.stringify(infoObj));
          // #TODO: find better way to update UI after data change
          this.draw();
        });
    }

    }

    container.empty();
    container.appendChild(rootEl);
  }
}