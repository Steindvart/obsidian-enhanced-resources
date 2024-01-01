import { Editor, ItemView, MarkdownView, Notice, WorkspaceLeaf } from 'obsidian';
import { EnhancedResourcesPluginSettings } from './settings';

export const RESOURCE_VIEW_TYPE = 'resource-view-toolbar';

export class ResourceView extends ItemView {
  private readonly settings: EnhancedResourcesPluginSettings;

  constructor(leaf: WorkspaceLeaf, settings: EnhancedResourcesPluginSettings) {
    super(leaf);
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

  public load(): void {
    super.load();
    // this.draw();
  }
}