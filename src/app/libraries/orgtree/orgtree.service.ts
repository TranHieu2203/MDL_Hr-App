import { Injectable } from '@angular/core';

export interface IOrgListItem {
  KEY?: string;
  CODE: string;
  CREATE_DATE: Object;
  EXPAND: string;
  HAS_CHILD: number;
  ID: number;
  LEVEL_ORG: number;
  MANAGER_NAME: object;
  MNG_ID: object;
  NAME: string;
  NAME_EN: string;
  PARENT_ID: number;
  PARENT_NAME: string;
  SHORT_NAME: string;
  STATUS: string;
  UY_BAN: number;
  CHILDREN?: IOrgListItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrgtreeService {

  constructor() { }

  listToTree(originalList: IOrgListItem[]): Promise<any> {
    const list: IOrgListItem[] = [];

    // If we want originalList to be immutable, simple copy [...originalList] is not enought
    // So we must copy each object in the list, like so:
    originalList.map(item => {
      list.push({
        ...item
      })
    })

    list.sort((a, b) => (a.NAME > b.NAME) ? 1 : ((b.NAME > a.NAME) ? -1 : 0))
    let map: any = {}, node, roots: any = [], i

    for (i = 0; i < list.length; i += 1) {
      map[list[i].ID] = i
      list[i].CHILDREN = []
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i]
      if (node.PARENT_ID) {
        if (list[map[node.PARENT_ID]]?.CHILDREN) {
          node.KEY = node.ID.toString()
          list[map[node.PARENT_ID]].CHILDREN!.push(node)
        }
      } else {
        try {
          node.KEY = node.ID.toString()
          roots.push({
            key: node.KEY,
            title: node.NAME,
            children: node.CHILDREN,
          })
        } catch (e) {
          console.error("e", e, "node", node, "list", list, "i", i)
        }
      }
    }

    return new Promise(resolve => resolve(roots))

  }
}
