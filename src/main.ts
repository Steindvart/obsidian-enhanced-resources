import { Notice, Plugin, WorkspaceLeaf } from 'obsidian';

import { DEFAULT_SETTINGS, EnhancedResourcesPluginSettings,
			   EnhancedResourcesSettingTab } from './settings';

import { ResourceView, RESOURCE_VIEW_TYPE } from './resource-view';

const PLUGIN_NAME: string = "Enhanced Resources";

export default class EnhancedResourcesPlugin extends Plugin {
	/* Properties */
	private settings: EnhancedResourcesPluginSettings;

	/* Methods */
	public async onload() {
		await this.loadSettings();

		this.initializeResourceView();
		this.initializeCommands();

		this.addRibbonIcon('dice', 'Example ribbon',
			async (evt: MouseEvent) => {
				try {
					await this.createInfoFile();
					new Notice(`Info file ${this.settings.pathResInfo} is create`);
				} catch (e) {
					new Notice(`Info file ${this.settings.pathResInfo} already exist`);
				}
			})
			.addClass('example-ribbon-class');

		this.addSettingTab(new EnhancedResourcesSettingTab(this.app, this));
		console.info(`${PLUGIN_NAME}: is load.`);
	}

	onunload() {
		console.info(`${PLUGIN_NAME}: is unload.`);
	}

	private initializeResourceView() {
		this.registerView(
      RESOURCE_VIEW_TYPE,
      (leaf) => new ResourceView(leaf, this.app, this.settings),
    );

		this.app.workspace.on("file-open", () => {
			const resourceLeaf = this.getExistingResourceViewLeaf();
			if (resourceLeaf !== null) {
				resourceLeaf.view.load();
			}

			console.log("New file is open");
		});
	}

	private initializeCommands() {
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
		console.info(`${PLUGIN_NAME}: default settings is set.`);
	}

	async createInfoFile() {
		let vault = this.app.vault;
		let path = this.settings.pathResInfo;
		await vault.create(path, "{}");

		console.info(`${PLUGIN_NAME}: resources info file ${path} is created.`);
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
