import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  public examcount = 0;
  constructor() { }

  /**
   * 存储字符串
   * @param key 存储键
   * @param value 存储值
   */
  set(key: string, value: string) {
    window.localStorage[key] = value;
  }

  /**
   * 获取存储的字符串
   * @param key 读取存储键
   */
  get(key: string) {
    return window.localStorage[key];
  }

  /** 存储对象 */
  setObject(key: string, value: object) {
    window.localStorage[key] = JSON.stringify(value);
  }

  /**
   * 获取存储对象
   * @param key 获取对象的键
   */
  getObject(key: string) {
    if (window.localStorage[key]) {
      return JSON.parse(window.localStorage[key]);
    } else {
      return null;
    }
  }

  /**
   * 删除单个存储
   * @param key 删除键
   */
  remove(key: string) {
    window.localStorage.removeItem(key);
  }

  /**
   * 删除nav导航
   */
  removeNav() {
    for (const key in window.localStorage) {
      if (key.substring(0, 4) === 'nav2') {
        window.localStorage.removeItem(key);
      }
    }
  }

  /**
   * 清除所有localStorage的值
   */
  clear() {
    window.localStorage.clear();
  }

  /**
   * 清除所有没有permanent前缀的字符串值
   */
  reomveOther() {
    for (let key in window.localStorage) {
      if (key.substring(0, 9) !== "permanent") {
        window.localStorage.removeItem(key);
      }
    }
  }

}
