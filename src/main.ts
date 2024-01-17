import { Notice, Plugin, WorkspaceLeaf } from 'obsidian';

import { DEFAULT_SETTINGS, EnhancedResourcesPluginSettings,
			   EnhancedResourcesSettingTab } from './settings';

import { ResourceView, RESOURCE_VIEW_TYPE } from './resource-view';
import { InfoSource } from './info-source';

const PLUGIN_NAME: string = "Enhanced Resources";

export default class EnhancedResourcesPlugin extends Plugin {
	/* Properties */
	private settings: EnhancedResourcesPluginSettings;
	private infoSource: InfoSource;

	/* Methods */
	public async onload() {
		await this.loadSettings();

		await this.initializeInfoSource(this.settings.pathInfoSource);
		this.initResourceView();
		this.initCommands();

		this.addSettingTab(new EnhancedResourcesSettingTab(this.app, this));
		console.log(`${PLUGIN_NAME}: is load.`);
	}

	onunload() {
		console.log(`${PLUGIN_NAME}: is unload.`);
	}

	private async initializeInfoSource(path: string) {
		try {
			await this.createInfoSourceFile(path);
			console.log(`Info file ${path} is create`);
		} catch (e) {
			console.log(`Info file ${path} already exist`);
		}

		this.infoSource = await InfoSource.build(path, this.app.vault);
	}

	private initResourceView() {
		this.registerView(
      RESOURCE_VIEW_TYPE,
      (leaf) => new ResourceView(leaf, this.app, this.settings, this.infoSource)
    );
	}

	private initCommands() {
		this.addCommand({
			id: 'resource-info-view',
			name: 'Open resource info view',
			callback: () => {
				this.toggleResourceView();
			}
		});
	}

	public getSettings() {
		return this.settings;
	}

	private async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	public async saveSettings(newSettings: EnhancedResourcesPluginSettings) {
		this.settings = newSettings;
		await this.saveData(this.settings);
	}

	public async restoreDefaultSettings() {
		await this.saveSettings(DEFAULT_SETTINGS);
		console.log(`${PLUGIN_NAME}: default settings is set.`);
	}

	async createInfoSourceFile(path: string) {
		let vault = this.app.vault;
		await vault.create(path, "{}");

		console.log(`${PLUGIN_NAME}: info resources source ${path} is created.`);
	}

	private getExistingResourceViewLeaf(): WorkspaceLeaf | null {
		const existing = this.app.workspace.getLeavesOfType(RESOURCE_VIEW_TYPE);
    if (existing.length == 0) {
			return null;
		}

		return existing[0];
	}

	private readonly toggleResourceView = async (): Promise<void> => {
		let resourceLeaf = this.getExistingResourceViewLeaf();
		if (resourceLeaf == null) {
			await this.app.workspace.getRightLeaf(false).setViewState({
				type: RESOURCE_VIEW_TYPE,
				active: true,
			});

			resourceLeaf = this.getExistingResourceViewLeaf();
		}

		if (resourceLeaf !== null) this.app.workspace.revealLeaf(resourceLeaf);
  };
}
