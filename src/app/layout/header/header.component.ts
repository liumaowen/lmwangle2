import { Router } from '@angular/router';
import { StorageService } from './../../dnn/service/storage.service';
import { UserapiService } from './../../dnn/service/userapi.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
const screenfull = require('screenfull');
const browser = require('jquery.browser');
declare var $: any;

declare var dd: any;

declare var messenger: any;

import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 开始时间
  start: any = new Date();

  // 结束时间
  end: any = new Date();
  // 显示代理人功能模块
  isshowagent;
  isnotuseragent: Boolean = true;

  body: any = { start: this.datepipe.transform(new Date(), 'y-MM-dd'), end: this.datepipe.transform(new Date(), 'y-MM-dd'), self: true };

  cusers = {
    'aadmin': null,
    'userimg': '',
    'name': '',
    'aorgid': NaN,
    'admin': '',
    'company': '',
    'id': NaN,
    'aid': NaN,
    'arealname': '',
    'orgid': null,
    'finance': '',
    'realname': '',
    'agent': ''
  };

  navCollapsed = true; // for horizontal layout
  menuItems = []; // for horizontal layout

  isNavSearchVisible: boolean;
  @ViewChild('fsbutton') fsbutton;  // the fullscreen button

  constructor(public menu: MenuService, public userblockService: UserblockService, public settings: SettingsService,
    private userApi: UserapiService, private storage: StorageService, private router: Router,
    private renderer: Renderer2, private datepipe: DatePipe, private http: Http,
    private el: ElementRef) {
    // show only a few items on demo
    this.menuItems = menu.getMenu().slice(0, 4); // for horizontal layout
    // 判断有没有token   没有token进入登录页面
    if (this.storage.get('token')) {
      this.init();
    } else {
      this.ddLogin().then(() => {
        this.init();
      }).catch(() => {
        this.storage.reomveOther();
        if (environment.ismenhu) {
          window.open(`${environment.mainappUrl}`, '_self');
          return;
        }
        this.router.navigate(['/login']);
      });

    }

    // 判断有没有token   没有token进入登录页面
    // if (this.storage.get('token')) {
    //     if (this.storage.getObject('cuser')) {
    //         this.cusers = this.storage.getObject('cuser');
    //         this.isshowagent = (this.cusers.aadmin || this.cusers.aorgid === 674|| this.cusers.id === 513 || this.cusers.id === 602);
    //     } else {
    //         this.userApi.userInfo().then(data => {
    //             this.cusers = data;
    //             this.storage.setObject('cuser', data);
    //             this.isshowagent = (this.cusers.aadmin || this.cusers.aorgid === 674|| this.cusers.id === 513 || this.cusers.id === 602);
    //         });
    //     }

    // } else {
    //     this.storage.reomveOther();
    //     this.router.navigate(['/login']);
    // }

  }

  init() {
    if (this.storage.getObject('cuser')) {
      this.cusers = this.storage.getObject('cuser');
      this.isshowagent = (this.cusers.aadmin || this.cusers.agent);
      if (this.cusers.aid !== this.cusers.id) {
        this.isnotuseragent = false;
      }
      if (this.cusers.aadmin) {
        this.isnotuseragent = true;
      }
    } else {
      this.userApi.userInfo().then(data => {
        this.cusers = data;
        this.storage.setObject('cuser', data);
        this.isshowagent = (this.cusers.aadmin || this.cusers.agent);
        if (this.cusers.aid !== this.cusers.id) {
          this.isnotuseragent = false;
        }
        if (this.cusers.aadmin) {
          this.isnotuseragent = true;
        }
      });
    }
  }


  // 注销登录方法
  logout() {
    this.userApi.wisdomdelToken().then(data => {// 注销登录的同时删除redis中的token记录不再等到过期之后再操作
      this.storage.reomveOther(); // 如果出错，删除session中所有数据
      if (environment.ismenhu) {
        window.open(`${environment.mainappUrl}`, '_self');
        return;
      }
      this.router.navigate(['/login']);
    }, err => {
      console.log(err);
    });
  }

  // 清除缓存，并刷新浏览器
  clearDate() {
    const token = this.storage.get('token');
    this.storage.reomveOther();
    this.storage.set('token', token);
    location.reload();
  }
  /**
   * BPM 表格下载弹窗
   */
  bpmDown() {
    this.classicModal.show();
    const wrapper = this.el.nativeElement;
    this.renderer.addClass(wrapper, 'headerindex');
  }
  close() {
    this.classicModal.hide();
    const wrapper = this.el.nativeElement;
    this.renderer.removeClass(wrapper, 'headerindex');
  }
  onHidden() {
    const wrapper = this.el.nativeElement;
    this.renderer.removeClass(wrapper, 'headerindex');
  }
  selectstart(e) {
    this.body.start = this.datepipe.transform(e, 'y-MM-dd');
  }
  selectend(e) {
    this.body.end = this.datepipe.transform(e, 'y-MM-dd');
  }
  ngOnInit() {
    this.isNavSearchVisible = false;
    if (browser.msie) { // Not supported under IE
      this.fsbutton.nativeElement.style.display = 'none';
    }
  }

  toggleUserBlock(event) {
    event.preventDefault();
    this.userblockService.toggleVisibility();
  }

  openNavSearch(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setNavSearchVisible(true);
  }

  setNavSearchVisible(stat: boolean) {
    // console.log(stat);
    this.isNavSearchVisible = stat;
  }

  getNavSearchVisible() {
    return this.isNavSearchVisible;
  }

  toggleOffsidebar() {
    this.settings.layout.offsidebarOpen = !this.settings.layout.offsidebarOpen;
  }

  toggleCollapsedSideabar() {
    this.settings.layout.isCollapsed = !this.settings.layout.isCollapsed;
  }

  isCollapsedText() {
    return this.settings.layout.isCollapsedText;
  }

  toggleFullScreen(event) {

    if (screenfull.enabled) {
      screenfull.toggle();
    }
    // Switch icon indicator
    const el = $(this.fsbutton.nativeElement);
    if (screenfull.isFullscreen) {
      el.children('em').removeClass('fa-expand').addClass('fa-compress');
    }
    else {
      el.children('em').removeClass('fa-compress').addClass('fa-expand');
    }
  }


  ddLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (dd.env.platform === 'notInDingTalk') {
        reject();
        // this.presentAlert('错误', '运行环境不正确');
        return;
      }
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({
          corpId: 'dingdb8047017e82978f',
          onSuccess: (result) => {
            if (result && result.code) {
              this.userApi.ddLogin(result.code).then((data: { token: string }) => {
                if (data) {
                  localStorage.setItem('token', data.token);
                  resolve();
                } else {
                  reject();
                }
              });
            }
          },
          onFail: (err) => {
            console.log('失败');
            reject();
          }

        });
      });
    });
  }
  // 跳转SCC
  goSCC() {
    const token = localStorage.getItem('token');
    if (!token) {
      if (environment.ismenhu) {
        window.open(`${environment.mainappUrl}`, '_self');
        return;
      }
      this.router.navigateByUrl('/passport/login');
      return;
    }
    const url = `${environment.sccUrl}`;
    if (url) {
      const esystem = window.open(`${url}`);
      const setToken = () => {
        esystem.postMessage({ type: 'wsdtoken', data: token }, url);
      };
      const timer = setInterval(setToken, 100);
      const timeOutr = setTimeout(() => {
        if (timer) {
          clearInterval(timer);
        }
      }, 5000);
      window.addEventListener('message', (e: any) => {
        if (e.data === 'wsdloginsuccess') {
          window.removeEventListener('message', setToken, true);
          clearTimeout(timeOutr);
          clearInterval(timer);
        }
      }, true);
    }
  }



}
