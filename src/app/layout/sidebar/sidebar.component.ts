import { UserapiService } from 'app/dnn/service/userapi.service';
import { environment } from './../../../environments/environment';
import { NavapiService } from './navapi.service';
import { StorageService } from './../../dnn/service/storage.service';
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
declare var dd: any;

import { MenuService } from '../../core/menu/menu.service';
import { SettingsService } from '../../core/settings/settings.service';
import { HttpInterceptorService } from '../../dnn/service/http-interceptor.service';
import { ToasterService } from 'angular2-toaster';

const TOKENKET = 'token';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  menuItems: Array<any>;
  router: Router;
  sbclickEvent = 'click.sidebar-toggle';
  $doc: any = null;

  constructor(
    private userApi: UserapiService,
    private toasterService: ToasterService,
    public menu: MenuService, public settings: SettingsService, public injector: Injector, private storage: StorageService, private navapi: NavapiService, private route: Router) {

    // this.menuItems = menu.getMenu();
    HttpInterceptorService.getError401().subscribe((data) => {
      if (data) {
        this.ddLogin().then((e) => {
          this.toasterService.pop('info', '请重新操作！');
          location.reload();
        }).catch(e => {
          this.toasterService.pop('error', '网络错误：' + 401 + ' - 请重新登录！');
          this.storage.reomveOther();
          if(environment.ismenhu){
            window.open(`${environment.mainappUrl}`, '_self');
            return;
          }
          this.router.navigate(['/login']);
        })
      }
    })
    //获取token
    if (this.storage.get("token")) {
      this.init();
    } else {
      this.ddLogin().then(() => {
        this.init();
      }).catch(() => {
        this.storage.reomveOther();
        if(environment.ismenhu){
          window.open(`${environment.mainappUrl}`, '_self');
          return;
        }
        this.route.navigateByUrl("/login")
      });

    }


    if (dd.env.platform === 'notInDingTalk') {
      // this.presentAlert('错误', '运行环境不正确');
      return;
    }

  }

  init() {
    const NAVKEY = 'nav2' + environment.version;
    let nav = this.storage.getObject(NAVKEY);
    if (nav) {
      this.menuItems = nav;
    } else {
      let navdemo = this.storage.get("navdemo");
      if (navdemo) {
        this.menuItems = this.menu.getMenu();
      } else {
        this.storage.removeNav();
        let version = { 'ver': 2 }
        this.navapi.mynav(version).then(data => {
          this.menuItems = data;
          this.storage.setObject(NAVKEY, data);
        }, err => {
          console.error(err)
        })
      }
    }
  }

  ngOnInit() {

    this.router = this.injector.get(Router);

    this.router.events.subscribe((val) => {
      // close any submenu opened when route changes
      this.removeFloatingNav();
      // scroll view to top
      window.scrollTo(0, 0);
      // close sidebar on route change
      this.settings.layout.asideToggled = false;
    });

    // enable sidebar autoclose from extenal clicks
    this.anyClickClose();

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
                  localStorage.setItem(TOKENKET, data.token);
                  // this.rootPage = HomePage;
                  // this.checkPc();
                  resolve();
                } else {
                  reject();
                }
              });
              // this.http.post('wisdom/oauth/dinglogin', { code: result.code }).subscribe((data: { token: string }) => {
              //   if (data) {
              //     localStorage.setItem(TOKENKET, data.token);
              //     // this.rootPage = HomePage;
              //     // this.checkPc();
              //     resolve();
              //   } else {
              //     reject();
              //   }
              // });
            }
            /*{
                code: 'hYLK98jkf0m' //string authCode
            }*/
          },
          onFail: (err) => {
            console.log('失败');
            reject();
            // this.getDcode();
            // this.ddLogin();
          }

        });
      });
    })
  }

  anyClickClose() {
    this.$doc = $(document).on(this.sbclickEvent, (e) => {
      if (!$(e.target).parents('.aside').length) {
        this.settings.layout.asideToggled = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.$doc)
      this.$doc.off(this.sbclickEvent);
  }

  toggleSubmenuClick(event) {
    if (!this.isSidebarCollapsed() && !this.isSidebarCollapsedText() && !this.isEnabledHover()) {
      event.preventDefault();

      let target = $(event.target || event.srcElement || event.currentTarget);
      let ul, anchor = target;

      // find the UL
      if (!target.is('a')) {
        anchor = target.parent('a').first();
      }
      ul = anchor.next();

      // hide other submenus
      let parentNav = ul.parents('.sidebar-subnav');
      $('.sidebar-subnav').each((idx, el) => {
        let $el = $(el);
        // if element is not a parent or self ul
        if (!$el.is(parentNav) && !$el.is(ul)) {
          this.closeMenu($el);
        }
      });

      // abort if not UL to process
      if (!ul.length) {
        return;
      }

      // any child menu should start closed
      ul.find('.sidebar-subnav').each((idx, el) => {
        this.closeMenu($(el));
      });

      // toggle UL height
      if (parseInt(ul.height(), 0)) {
        this.closeMenu(ul);
      }
      else {
        // expand menu
        ul.on('transitionend', () => {
          ul.height('auto').off('transitionend');
        }).height(ul[0].scrollHeight);
        // add class to manage animation
        ul.addClass('opening');
      }

    }

  }

  // Close menu collapsing height
  closeMenu(elem) {
    elem.height(elem[0].scrollHeight); // set height
    elem.height(0); // and move to zero to collapse
    elem.removeClass('opening');
  }

  toggleSubmenuHover(event) {
    let self = this;
    if (this.isSidebarCollapsed() || this.isSidebarCollapsedText() || this.isEnabledHover()) {
      event.preventDefault();

      this.removeFloatingNav();

      let target = $(event.target || event.srcElement || event.currentTarget);
      let ul, anchor = target;
      // find the UL
      if (!target.is('a')) {
        anchor = target.parent('a');
      }
      ul = anchor.next();

      if (!ul.length) {
        return; // if not submenu return
      }

      let $aside = $('.aside');
      let $asideInner = $aside.children('.aside-inner'); // for top offset calculation
      let $sidebar = $asideInner.children('.sidebar');
      let mar = parseInt($asideInner.css('padding-top'), 0) + parseInt($aside.css('padding-top'), 0);
      let itemTop = ((anchor.parent().position().top) + mar) - $sidebar.scrollTop();

      let floatingNav = ul.clone().appendTo($aside);
      let vwHeight = $(window).height();

      // let itemTop = anchor.position().top || anchor.offset().top;

      floatingNav
        .removeClass('opening') // necesary for demo if switched between normal//collapsed mode
        .addClass('nav-floating')
        .css({
          position: this.settings.layout.isFixed ? 'fixed' : 'absolute',
          top: itemTop,
          bottom: (floatingNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
        });

      floatingNav
        .on('mouseleave', () => { floatingNav.remove(); })
        .find('a').on('click', function (e) {
          e.preventDefault(); // prevents page reload on click
          // get the exact route path to navigate
          let routeTo = $(this).attr('route');
          if (routeTo) self.router.navigate([routeTo]);
        });

      this.listenForExternalClicks();

    }

  }

  listenForExternalClicks() {
    let $doc = $(document).on('click.sidebar', (e) => {
      if (!$(e.target).parents('.aside').length) {
        this.removeFloatingNav();
        $doc.off('click.sidebar');
      }
    });
  }

  removeFloatingNav() {
    $('.nav-floating').remove();
  }

  isSidebarCollapsed() {
    return this.settings.layout.isCollapsed;
  }
  isSidebarCollapsedText() {
    return this.settings.layout.isCollapsedText;
  }
  isEnabledHover() {
    return this.settings.layout.asideHover;
  }
}
