import { UserapiService } from 'app/dnn/service/userapi.service';
import { environment } from './../../../../environments/environment';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StorageService } from './../../../dnn/service/storage.service';
declare var messenger: any;

declare var dd: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  isComputer = true;

  slides = [];

  Url: any;
  isBpm = true;

  constructor(
    private router: Router,
    private zone: NgZone,
    private userApi: UserapiService,
    public settings: SettingsService,
    private sanitizer: DomSanitizer,
    private storage: StorageService) {

    // goToRouter = (msg) => { this.router.navigate([msg]); }
    let users = { id: '', aid: '' };
    if (this.storage.getObject('cuser')) {
      users = this.storage.getObject('cuser');
      this.yanzheng(users);
    } else {
      this.userApi.userInfo().then(data => {
        users = data;
        this.storage.setObject('cuser', data);
        this.yanzheng(users);
      });
    }
  }
  yanzheng(users) {
    if (users.id) {
      this.goRouter();
      this.slides.push({
        image: 'assets/img/bg' + 8 + '.jpg',
        text: `${['More', 'Extra', 'Lots of', 'Surplus'][this.slides.length % 4]}
        ${['Cats', 'Kittys', 'Felines', 'Cutes'][this.slides.length % 4]}`
      });
      const token = localStorage.getItem('token');
      if (token) {
        const url = `${environment.bpmUrl}/?token=${token}`;
        this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else {
        this.ddLogin().then(() => {
          const url = `${environment.bpmUrl}/?token=${localStorage.getItem('token')}`;
          this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }).catch(() => {
          localStorage.clear();
          if (environment.ismenhu) {
            window.open(`${environment.mainappUrl}`, '_self');
            return;
          }
          this.router.navigate(['/login']);
        });
        // setTimeout(() => {
        //   const url = `${environment.bpmUrl}/?token=${localStorage.getItem('token')}`;
        //   this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        // }, 3000);
        this.isBpm = true;
      }
    } else {
      this.isBpm = true;
    }
  }

  ngAfterViewInit() {
    const iframe1 = document.getElementById('iframe1');
    messenger.addTarget(iframe1['contentWindow'], 'iframe1');
  }

  ngOnInit() {
  }
  setToken() {
    // outer.emit('GETTOKEN', { from: '12312332456' });
    const token = localStorage.getItem('token');
    messenger.targets['iframe1'].send(token);
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

  goRouter() {
    messenger.listen((msg) => {

      this.zone.run(() => {
        if (msg === 401) {
          this.error401();
          return;
        }
        this.router.navigate([msg]);
      });
    });
  }

  error401() {
    localStorage.clear();
    if (environment.ismenhu) {
      window.open(`${environment.mainappUrl}`, '_self');
      return;
    }
    this.router.navigateByUrl('/login');
  }
}
