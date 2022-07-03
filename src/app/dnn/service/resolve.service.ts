import { NavapiService } from './../../layout/sidebar/navapi.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { environment } from 'environments/environment';

@Injectable()
export class ResolveService implements CanActivate, CanActivateChild {

  constructor(private storage: StorageService, private router: Router, private navapi: NavapiService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const NAVKEY = 'nav2' + environment.version;
    //判断有没有token
    if (this.storage.get("token")) {
      let url = '';
      url = this.getUrl(route, url);
      let nav2 = this.storage.get(NAVKEY);
      if (!nav2 || nav2.indexOf('"link":"/' + url + '",') == -1) {
        this.router.navigateByUrl("/home");
        return false;
      } return true;
    } else {
      if (environment.ismenhu) {
        window.open(`${environment.mainappUrl}`, '_self');
        return;
      }
      this.router.navigateByUrl("/login");
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const NAVKEY = 'nav2' + environment.version;
    // return this.canActivate(route, state);
    if (this.storage.get("token")) {
      let url = '';
      url = this.getParent(route, url);
      let nav2 = this.storage.get(NAVKEY);
      if (!nav2 || nav2.indexOf('"link":"/' + url) == -1) {
        this.router.navigateByUrl("/home");
        return false;
      } return true;
    } else {
      if (environment.ismenhu) {
        window.open(`${environment.mainappUrl}`, '_self');
        return;
      }
      this.router.navigateByUrl("/login");
      return false;
    }
  }

  getUrl(route, url) {
    let parent = '';
    let i = route.parent;
    while (i.url.length > 0) {
      parent += i.url.join('/');
      i = i.parent;
    }
    url = route.url.join("/");
    if (!url) url = parent;
    else if (!parent) return url
    else url = parent + '/' + url;
    return url;
  }

  getParent(route, url) {
    let parent = '';
    let i = route.parent;
    while (i.url.length > 0) {
      parent += i.url.join('/');
      i = i.parent;
    }
    return parent;
  }

}

