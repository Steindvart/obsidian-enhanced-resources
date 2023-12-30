import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceRibbon } from 'obsidian';

import { ResourcesView } from './resourcesView'

const PLUGIN_NAME: string = "Obisdian Enhanced Resources"

class EnhancedResourcesPluginSettings {
	pathResInfo: string;
}

const DEFAULT_SETTINGS: EnhancedResourcesPluginSettings = {
	pathResInfo: '.obsidian/enhanced-resources-info.json'
}

export default class EnhancedResourcesPlugin extends Plugin {
	settings: EnhancedResourcesPluginSettings;
	exampleRibbot: HTMLElement
	resourcesView: ResourcesView

	async onload() {
		await this.loadSettings();

		this.exampleRibbot = this.addRibbonIcon('dice', 'Example ribbon', (evt: MouseEvent) => {
			new Notice(this.settings.pathResInfo);
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
		this.addSettingTab(new SampleSettingTab(this.app, this));

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

class SampleSettingTab extends PluginSettingTab {
	plugin: EnhancedResourcesPlugin;

	constructor(app: App, plugin: EnhancedResourcesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;  // #EDU, Alternative: const containerEl = this.containerEl;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Resource info file path')
			.setDesc('A file that contains information about all resources')
			.addText(text => text
				.setPlaceholder('File path')
				.setValue(this.plugin.settings.pathResInfo)
				.onChange(async (value) => {
					this.plugin.settings.pathResInfo = value;
					await this.plugin.saveSettings();
				}));
	}
}
