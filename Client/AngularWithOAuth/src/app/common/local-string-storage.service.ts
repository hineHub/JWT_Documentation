import { Injectable } from '@angular/core';
import { IStorageService } from './Istorage.service';

@Injectable()
export class LocalStringStorageService implements IStorageService {
  constructor() { }

  get(key: string) {
    return localStorage.getItem(key);
  }
  set(key: string, value: any) {
    localStorage.setItem(key, value);
  }
  delete(key: string) {
    localStorage.removeItem(key);
  }
}
