import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  keyword: string = "";
  searchActive: boolean = false;

  toggleActive(keyword: string, searchActive: boolean): void {
    this.keyword = keyword;
    this.searchActive = searchActive;
  }

  constructor() { }
}
