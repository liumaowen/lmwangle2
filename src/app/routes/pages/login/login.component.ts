import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';

import { StorageService } from '../../../dnn/service/storage.service';
import { UserapiService } from '../../../dnn/service/userapi.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  users: object = {
    'username': '',
    'password': ''
  };

  paracont: string;
  authMsg: string;
  paraclass: string;
  paraevent: boolean;
  count: number;
  isqrcode: boolean;
  qrcodemsg: string;
  qr: Object = { QRCode: '' };
  handleId: number;
  istimeout: boolean;

  constructor(public settings: SettingsService, fb: FormBuilder, private storage: StorageService,
    private userApi: UserapiService, private router: Router, private tost: ToasterService) {

    this.loginForm = fb.group({
      'phone': [null, Validators.compose([Validators.required, CustomValidators.number])],
      'password': [null, Validators.required]
    });

    this.paracont = '获取验证码';
    this.authMsg = '';
    this.paraclass = 'but_null';
    this.paraevent = true;
    this.count = 0;
    this.isqrcode = false;
    this.istimeout = false;
  }

  //获取验证码
  yanzhengma() {
    if (this.loginForm.controls.phone.valid) {
      this.count++;
      if (this.count > 3) {
        // this.msgs = [];
        // this.msgs.push({severity:'error', summary:'错误消息', detail:'你获取验证码过于频繁，请稍后再试！'});
        this.tost.pop('error', '你获取验证码过于频繁，请稍后再试！');
        return;
      }
      this.authMsg = '正在发送...';
      let second = 60;
      let timePromise = setInterval(() => {
        if (second <= 0) {
          clearInterval(timePromise);
          timePromise = undefined;
          second = 60;
          this.paracont = '重发验证码';
          this.paraclass = 'but_null';
          this.paraevent = true;
        } else {
          this.paraevent = false;
          this.paracont = second + '秒后可重发';
          this.paraclass = 'not but_null';
          second--;
        }
      }, 1000);
      this.userApi.oauthGetCode(this.users['username'])
        .then((data) => {

          this.authMsg = data.msg;
        }, err => {
          this.authMsg = err.json().msg;
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.loginForm.controls['phone'].markAsDirty(false);
      return;
    }


  }

  //登录
  login() {
    this.authMsg = '';
    if (this.loginForm.controls['phone'].valid && this.loginForm.controls['password'].valid) {
      this.userApi.oauthApilogin(this.users)
        .then(data => {
          this.storage.set('token', data.token);
          this.router.navigateByUrl('home', 1)
        }, err => {
          this.authMsg = err.json().msg;
        })
    } else {
      this.loginForm.controls['phone'].markAsDirty(true);
      this.loginForm.controls['password'].markAsDirty(true);
    }
  }

  submitForm($ev, value: any) {
    $ev.preventDefault();
    for (let c in this.loginForm.controls) {
      this.loginForm.controls[c].markAsTouched();
    }
    if (this.loginForm.valid) {
      console.log('Valid!');
      console.log(value);
    }
  }

  ngOnInit() {

  }
  /**
   * 展示二维码
   */
  change() {
    this.userApi.getqrcode().then(data => {
      console.log('qrcode', data);
      this.qrcodemsg = data.msg;
      this.qr['QRCode'] = data.msg;
      this.isqrcode = true;
      this.interval(0);
    });
  }/**
     * 返回验证码登录
     */
  back() {
    clearInterval(this.handleId);
    this.isqrcode = false;
    this.istimeout = false;
  }
  /**
   * 重新获取二维码信息
   */
  refresh() {
    this.userApi.getqrcode().then(data => {
      console.log('qrcode', data);
      this.qrcodemsg = data.msg;
      this.qr['QRCode'] = data.msg;
      this.istimeout = false;
      this.interval(1);
    });
  }
  /**
   * 定时
   */
  interval(num) {
    if (num === 1) {
      clearInterval(this.handleId);
    }
    let i = setInterval(() => {
      const urls = 'https://c.wiskind.cn/login/';
      let QRCode = this.qr['QRCode'];
      QRCode = QRCode.substring(urls.length);
      this.userApi.checkqrcode({ QRCode: QRCode }).then(data => {
        console.log(data);
        if (data.code === 2) {
          this.storage.set('token', data.token);
          clearInterval(this.handleId);
          this.router.navigateByUrl('home', 1);
        } else if (data.code === 3) {
          console.log('听');
          this.istimeout = true;
          clearInterval(this.handleId);
        }
      });
    }, 5000);
    console.log('shuoming', i['data'].handleId);
    this.handleId = i['data'].handleId;
  }
}
