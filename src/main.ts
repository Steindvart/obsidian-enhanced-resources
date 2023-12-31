import { Editor, MarkdownView, Vault, Notice, Plugin } from 'obsidian';

import { DEFAULT_SETTINGS, EnhancedResourcesPluginSettings,
			   EnhancedResourcesSettingTab } from './settings';

import { ResourcesView } from './resourcesView';

const PLUGIN_NAME: string = "Obisdian Enhanced Resources";

export default class EnhancedResourcesPlugin extends Plugin {
	/* Properties */
	settings: EnhancedResourcesPluginSettings;
	exampleRibbot: HTMLElement;
	resourcesView: ResourcesView;

	/* Methods */
	async onload() {
		await this.loadSettings();

		this.exampleRibbot = this.addRibbonIcon('dice', 'Example ribbon', (evt: MouseEvent) => {
			let vault = this.app.vault;
			new Notice(vault.getName());
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

		console.info("%s is load.", PLUGIN_NAME);
	}

	onunload() {
		console.info("%s is unload.", PLUGIN_NAME);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


}
