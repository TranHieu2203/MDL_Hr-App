import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IModule } from 'src/app/components/modules/modules.component';
import { moduledata } from '../components/modules/moduledata';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  isOpen = new BehaviorSubject<boolean>(false);
  activeModule = new BehaviorSubject<IModule | null>(null)

  constructor() {
    if (localStorage) {
      const activeModuleCode = localStorage.getItem('activeModule')!
      if (activeModuleCode) {
        const code = JSON.parse(activeModuleCode);

        const filter = moduledata.filter(x => x.code === code)
        if (filter.length) {
          this.activeModule.next(filter[0]);
        }
      }
    }
  }
}
