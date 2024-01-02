import { App, ItemView, WorkspaceLeaf } from 'obsidian';
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

  private getCurrentFileName(): string | undefined {
    const file = this.app.workspace.getActiveFile();
    return file?.name;
  }

  public load(): void {
    super.load();
    this.draw();
  }

  private readonly draw = (): void => {
    const container = this.containerEl.children[1];  // #NOTE: [1] is important
    const rootEl = document.createElement('div');

    const currentFile = this.getCurrentFileName();
    let filename = "No file is opened";
    if (currentFile !== undefined) {
      filename = currentFile;
    }

    rootEl.createDiv()
      .createSpan({ cls: 'title' })
      .setText(filename);

    if (filename.length != 0) {
      const infoEl = rootEl.createDiv();
      infoEl.createEl('button');
    }

    container.empty();
    container.appendChild(rootEl);
  }
}