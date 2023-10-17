export class SettingReport {
  name?: string;
  idMap?: number;
  parentId?: number;
  typeId?: number;
  idOrigin?: number;
  hasChild?: boolean;
  text?: string;
  elements: any[] = [];
}
