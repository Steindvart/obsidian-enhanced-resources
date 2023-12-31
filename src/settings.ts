import { App, PluginSettingTab, Setting } from "obsidian";

import type EnhancedResourcesPlugin from "./main";

export class EnhancedResourcesPluginSettings {
	pathResInfo: string;
}

export const DEFAULT_SETTINGS: EnhancedResourcesPluginSettings = {
	pathResInfo: '.obsidian/enhanced-resources-info.json'
}

export class EnhancedResourcesSettingTab extends PluginSettingTab {
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