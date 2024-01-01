import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';

import { DEFAULT_SETTINGS, EnhancedResourcesPluginSettings,
			   EnhancedResourcesSettingTab } from './settings';

import { ResourcesView } from './resourcesView';
import { ExecFileException } from 'child_process';

const PLUGIN_NAME: string = "Obisdian Enhanced Resources";

export default class EnhancedResourcesPlugin extends Plugin {
	/* Properties */
	settings: EnhancedResourcesPluginSettings;
	exampleRibbot: HTMLElement;
	resourcesView: ResourcesView;

	/* Methods */
	async onload() {
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

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new EnhancedResourcesSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async restoreDefSettings() {
		this.settings = DEFAULT_SETTINGS;
		await this.saveSettings();
	}

	async createInfoFile() {
		let vault = this.app.vault;
		let path = this.settings.pathResInfo;
		await vault.create(path, "{}");
	}
}
