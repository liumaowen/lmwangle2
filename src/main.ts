import './vendor.ts';
import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { fromEvent } from "rxjs/observable/fromEvent";
import { filter, map, take, race } from "rxjs/operators";
import { timer } from "rxjs/observable/timer";
import { Observable } from "rxjs/Observable";

declare var dd: any;

const bootstarp = () => {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule, {
      defaultEncapsulation: ViewEncapsulation.Emulated,
    })
    .then(res => {
      if ((window as any).appBootstrap) {
        (window as any).appBootstrap();
      }
      return res;
    });
}
declare var window;

if (environment.ismenhu) {


  const wsdToken = 'wsdtoken';
  const wsdLoginSuccess = 'wsdloginsuccess';


  const newddLogin = () => {
    return new Promise((resolve, reject) => {
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({
          corpId: 'dingdb8047017e82978f',
          onSuccess: (result) => {
            // alert(result.code);
            if (result && result.code) {
              lshttp("smgcoresvc/pub/login/dinglogin?code="+ result.code).then((data2:any) => {
                if (data2) {
                  const data3 = JSON.parse(data2);
                  localStorage.setItem('token', data3.token);
                  localStorage.setItem('_token', data2);
                  //     resolve();
                }
                resolve();
              },(err)=>{
                reject();
              });
              // this.userApi.ddLogin(result.code).then((data: { token: string }) => {
              //   if (data) {
              //     localStorage.setItem('token', data.token);
              //     resolve();
              //   } else {
              //     reject();
              //   }
              // });
            }
          },
          onFail: (err) => {
            alert(JSON.stringify(err));
            console.log('失败');
            reject();
          }

        });
      });
    });
  };


  let load = () => {
    return new Promise((resolve, reject) => {
        getToken(resolve, reject);
    })
  }
  const initApp = (resolve) => {
    resolve();
  }
  const showModal = (message = "登录失败") => {
    console.error(message);
    window.location.href = environment.mainappUrl;
  }

  const getWisToken = (resolve, reject, token: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("_token", `{"token":"${token}"}`);
    resolve();
  }

  const getToken = (resolve, reject) => {

    var t = Observable.range(0, 10);
    t.pipe
    var s = Observable.fromEvent(window, 'message');
    s.pipe
    const eventSource: Observable<any> = fromEvent(window, 'message').pipe(
      filter(
        (messageEvent: MessageEvent) => messageEvent.data && messageEvent.data.type === wsdToken,
      ),
      take(1),
      map((messageEvent: MessageEvent) => ({ token: messageEvent.data && messageEvent.data.data, origin: messageEvent.origin }))
    );
    const timerSource: Observable<number> = timer(1000);
    let combined = race(eventSource, timerSource);
    const subscribe = combined(timerSource).subscribe((latestValues) => {
      console.log(latestValues)
      if (latestValues === 0) {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          initApp(resolve);
          subscribe.unsubscribe();
        } else {
          // resolve();
          showModal();
        }
      }
      if (typeof latestValues !== 'number') {
        const { token, origin } = latestValues;
        getWisToken(resolve, reject, token);
        window.opener && window.opener.postMessage({ type: wsdLoginSuccess }, origin);
      } else {
        reject();
      }
    }, (error) => {
      reject(error);
      showModal();
    })
  }

  if(dd.env.platform === 'notInDingTalk'){
    load().then(() => {
      if (environment.production) {
        enableProdMode();
      }
      bootstarp();
      //let p = platformBrowserDynamic().bootstrapModule(AppModule);
      // p.then(() => { (<any>window).appBootstrap && (<any>window).appBootstrap(); })
      // .catch(err => console.error(err));
    }, (error) => {
      showModal(error);
    });
  } else{
    newddLogin().then((data) =>{
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        if (environment.production) {
          enableProdMode();
        }
        bootstarp();
      } else {
        // resolve();
        showModal();
      }
    }, (err)=>{
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        if (environment.production) {
          enableProdMode();
        }
        bootstarp();
      } else {
        // resolve();
        showModal();
      }
    })
  }


  } else {
  if (environment.production) {
    enableProdMode();
  }


  bootstarp();
  // let p = platformBrowserDynamic().bootstrapModule(AppModule);
  // p.then(() => { (<any>window).appBootstrap && (<any>window).appBootstrap(); }).catch(err => console.error(err));
}

const lshttp = (url) =>{
  return new Promise((resolve, reject) =>{
    let xhr = new XMLHttpRequest();
    xhr.open('GET', environment.api + url,true);
    xhr.send();
    xhr.onreadystatechange =  ()=> {
      // 这步为判断服务器是否正确响应
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(xhr.responseText);
      }else if ((xhr.readyState == 2 && xhr.status == 200)||(xhr.readyState == 3 && xhr.status == 200)){

      }else {
        reject();
      }
    };
  })
}
