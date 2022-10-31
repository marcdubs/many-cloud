import Item from "./item";

export default interface File extends Item {
  type: "file";
  download_to(localPath: string): Promise<void>;
  get_checksum(): Promise<string>;
}
