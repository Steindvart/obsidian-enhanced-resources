import { App, ItemView, WorkspaceLeaf, Setting, ButtonComponent } from 'obsidian';

import { EnhancedResourcesPluginSettings } from './settings';
import { AcceptModal } from './accept-modal';
import { InfoSource } from './info-source';

export const RESOURCE_VIEW_TYPE = 'resource-view-toolbar';

export class ResourceView extends ItemView {
  private readonly settings: EnhancedResourcesPluginSettings;
  private infoSource: InfoSource;

  constructor(leaf: WorkspaceLeaf, app: App, settings: EnhancedResourcesPluginSettings,
              infoSource: InfoSource) {
    super(leaf);
    this.app = app;
    this.settings = settings;
    this.infoSource = infoSource;

		this.app.workspace.on("file-open", () => {
      this.onload();
      //console.info(`${PLUGIN_NAME}: resource view is reloaded.`);
		});
  }

  onload(): void {
    const currentFilePath = this.getCurrentFilePath();
    this.draw(currentFilePath);
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
    return 'book-a';
  }

  private getCurrentFilePath(): string | undefined {
    const file = this.app.workspace.getActiveFile();
    return file?.path;
  }

  private drawTitle(resInfoEl: HTMLElement, text: string) {
    resInfoEl.createSpan({ cls: 'title' })
    .setText(text);
  }

  private async drawResInfo(resInfoEl: HTMLElement) {

  }

  private async draw(filePath: string | undefined) {
    const container = this.containerEl.children[1];  // #NOTE: [1] is important
    const rootEl = document.createElement('div');

    const resInfoEl = rootEl.createDiv();

    if (filePath !== undefined) {
      this.drawTitle(resInfoEl, filePath);
      const resInfo = this.infoSource.getResJsonInfo(filePath);

      if (resInfo !== undefined) {
        const keys = Object.keys(resInfo);

        for (const key of keys) {
          const value = resInfo[key];

          new Setting(resInfoEl)
          .setName(key)
          .addText(text => text.setValue(value)
          .onChange((value) => {
            resInfo[key] = value;
          }));
        }

        new ButtonComponent(resInfoEl)
          .setButtonText('Save')
          .onClick(async (evt: MouseEvent) => {
            this.infoSource.setResJsonInfo(filePath, resInfo);
            this.infoSource.saveToFile();
          });

        new ButtonComponent(resInfoEl)
          .setButtonText('Remove')
          .setWarning()
          .onClick(async (evt: MouseEvent) => {
            new AcceptModal(this.app, "Remove all info about resource?", async () => {
              this.infoSource.deleteResJsonInfo(filePath);
              this.infoSource.saveToFile();
              // #TODO: find better way to update UI after data change
              this.draw(filePath);
            }).open();
          });
     } else {
      resInfoEl.createSpan('This resource not have info.')

      new ButtonComponent(resInfoEl)
        .setButtonText('Add basic info')
        .onClick(async (evt: MouseEvent) => {
          const basicFileInfo = {
            'comment': '',
            'tags': ''
          };

          this.infoSource.setResJsonInfo(filePath, basicFileInfo);
          this.infoSource.saveToFile();
          this.draw(filePath);
        });
    }
    } else {
      this.drawTitle(resInfoEl, 'No file is opened');
    }

    container.empty();
    container.appendChild(rootEl);
  }
}