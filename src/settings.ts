import { App, ButtonComponent, Modal, PluginSettingTab, Setting } from "obsidian";

import type EnhancedResourcesPlugin from "./main";
import { AcceptModal } from "./accept-modal";

export class EnhancedResourcesPluginSettings {
	pathInfoSource: string;
}

export const DEFAULT_SETTINGS: EnhancedResourcesPluginSettings = {
	pathInfoSource: '.obsidian/enhanced-resources-info.json'
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
		let settings = this.plugin.getSettings();

		const filePathSetting = new Setting(containerEl);
		filePathSetting.setName('Resource info file path');
		filePathSetting.setDesc('A file that contains information about all resources')
		filePathSetting.addText(text => text
			.setPlaceholder('File path')
			.setValue(settings.pathInfoSource)
			.onChange(async (value) => {
				settings.pathInfoSource = value;
				await this.plugin.saveSettings(settings);
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