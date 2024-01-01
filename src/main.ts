import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';

import { DEFAULT_SETTINGS, EnhancedResourcesPluginSettings,
			   EnhancedResourcesSettingTab } from './settings';

import { ResourcesView } from './resourcesView';

const PLUGIN_NAME: string = "Enhanced Resources";

export default class EnhancedResourcesPlugin extends Plugin {
	/* Properties */
	private settings: EnhancedResourcesPluginSettings;
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
		console.info(`${PLUGIN_NAME}: is load.`);
	}

	onunload() {
		console.info(`${PLUGIN_NAME}: is unload.`);
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
}
