import Item from "./item";
import File from "./file";

export default interface Folder extends Item {
  type: "folder";
  list_files(): Promise<Item[]>;
  upload_file(localPath: string): Promise<File>;
  new_folder(name: string): Promise<Folder>;
}
