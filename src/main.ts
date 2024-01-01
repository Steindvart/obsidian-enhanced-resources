import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';

import { DEFAULT_SETTINGS, EnhancedResourcesPluginSettings,
			   EnhancedResourcesSettingTab } from './settings';

import { ResourcesView } from './resourcesView';

const PLUGIN_NAME: string = "Obisdian Enhanced Resources";

export default class EnhancedResourcesPlugin extends Plugin {
	/* Properties */
	public settings: EnhancedResourcesPluginSettings;
	private exampleRibbot: HTMLElement;
	private resourcesView: ResourcesView;

	/* Methods */
	public async onload() {
		await this.loadSettings();

		this.exampleRibbot = this.addRibbonIcon('dice', 'Example ribbon',
			async (evt: MouseEvent) => {
				try {
					await this.createInfoFile();
					new Notice(`Info file ${this.settings.pathResInfo} is create`);
				} catch (e) {
					new Notice(`Info file ${this.settings.pathResInfo} already exist`);
				}
			});
		this.exampleRibbot.addClass('example-ribbon-class');

		this.addSettingTab(new EnhancedResourcesSettingTab(this.app, this));
	}

	onunload() {

	}

	private async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	public async saveSettings() {
		await this.saveData(this.settings);
	}

	public async restoreDefaultSettings() {
		this.settings = DEFAULT_SETTINGS;
		await this.saveSettings();
	}

	async createInfoFile() {
		let vault = this.app.vault;
		let path = this.settings.pathResInfo;
		await vault.create(path, "{}");
	}
}
