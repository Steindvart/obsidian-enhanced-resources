import { App, ButtonComponent, Modal, PluginSettingTab, Setting } from "obsidian";

import type EnhancedResourcesPlugin from "./main";
import { AcceptModal } from "acceptModal";

export class EnhancedResourcesPluginSettings {
	pathResInfo: string;
}

export const DEFAULT_SETTINGS: EnhancedResourcesPluginSettings = {
	pathResInfo: '.obsidian/enhanced-resources-info.json'
}

export class EnhancedResourcesSettingTab extends PluginSettingTab {
	private plugin: EnhancedResourcesPlugin;

	constructor(app: App, plugin: EnhancedResourcesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	public display(): void {
		const {containerEl} = this;

		containerEl.empty();

		const filePathSetting = new Setting(containerEl);
		filePathSetting.setName('Resource info file path');
		filePathSetting.setDesc('A file that contains information about all resources')
		filePathSetting.addText(text => text
			.setPlaceholder('File path')
			.setValue(this.plugin.settings.pathResInfo)
			.onChange(async (value) => {
				this.plugin.settings.pathResInfo = value;
				await this.plugin.saveSettings();
			}));

		const restoreDefButton = new ButtonComponent(containerEl);
		restoreDefButton.setButtonText("Restore default settings").setWarning();
		restoreDefButton.onClick(async (evt: MouseEvent) => {
			new AcceptModal(this.app, "Restore default settings?", async () => {
				await this.plugin.restoreDefaultSettings();
				this.display()
			}).open();
		});
	}
}