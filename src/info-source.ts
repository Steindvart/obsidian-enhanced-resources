import { Vault } from 'obsidian';

export class InfoSource {
  private vault: Vault;
  private readonly path: string;
  private jsonObj: any;

  constructor(path: string, vault: Vault) {
    this.vault = vault;
    this.path = path;
  }

  private async initJsonObj(jsonFilePath: string) {
    const jsonContent = await this.vault.adapter.read(jsonFilePath);
    this.jsonObj = JSON.parse(jsonContent);
  }

  public static async build(path: string, vault: Vault) {
    const src = new InfoSource(path, vault);
    await src.initJsonObj(path);

    return src;
  }

  public setJson(newJsonObj: any) {
    this.jsonObj = newJsonObj;
  }

  public getJson() {
    return this.jsonObj;
  }

  public getResJsonInfo(resPath: string) {
    return this.jsonObj[resPath];
  }

  public setResJsonInfo(resPath: string, newJsonObj: any) {
    this.jsonObj[resPath] = newJsonObj;
  }

  public deleteResJsonInfo(resPath: string) {
    delete this.jsonObj[resPath];
  }

  public async saveToFile() {
    await this.vault.adapter.write(this.path, JSON.stringify(this.jsonObj));
  }
}