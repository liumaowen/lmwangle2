import { HttpResponse } from '@angular/common/http';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Http } from '@angular/http';
import { saveAs } from 'file-saver';


@Directive({
  selector: '[down-file]',
  exportAs: 'downFile',
  host: {
    '(click)': '_click()'
  }
})
export class DownFileDirective {
  private isFileSaverSupported = true;
  /** URL请求参数 */
  @Input('http-data') httpData: {};
  /** 请求类型 */
  @Input('http-method') httpMethod = 'get';
  /** 下载地址 */
  @Input('http-url') httpUrl: string;
  /** 指定文件名，若为空从服务端返回的 `header` 中获取 `filename`、`x-filename` */
  @Input('file-name') fileName: string;
  /** 成功回调 */
  @Output() readonly success = new EventEmitter<HttpResponse<Blob>>();
  /** 错误回调 */
  @Output() readonly error = new EventEmitter<any>();

  private getDisposition(data: string | null) {
    const arr: Array<{}> = (data || '')
      .split(';')
      .filter(i => i.includes('='))
      .map(v => {
        const strArr = v.split('=');
        const utfId = `UTF-8''`;
        let value = strArr[1];
        if (value.startsWith(utfId)) value = value.substr(utfId.length);
        return { [strArr[0].trim()]: value };
      });
    return arr.reduce((_o, item) => item, {});
  }

  constructor(private el: ElementRef, private _http: Http) {
    let isFileSaverSupported = false;
    try {
      isFileSaverSupported = !!new Blob();
    } catch (error) {

    }
    this.isFileSaverSupported = isFileSaverSupported;
    if (!isFileSaverSupported) {
      el.nativeElement.classList.add(`down-file__not-support`);
    }
  }

  private setDisabled(status: boolean): void {
    const el = this.el.nativeElement;
    el.disabled = status;
    el.classList[status ? 'add' : 'remove'](`down-file__disabled`);
  }

  _click() {
    if (!this.isFileSaverSupported) {
      return;
    }
    this.setDisabled(true);


    this.request().subscribe(
        (res: Response) => {
          let body: any
          try {
            body = res.json();
          } catch (error) {
            body = res.text();
          }
          if (res.status !== 200 || body!.size <= 0) {
            this.error.emit(res);
            return;
          }
          const disposition = this.getDisposition(
            res.headers.get('content-disposition')
          );
          const fileName =
            this.fileName ||
            disposition[`filename*`] ||
            disposition[`filename`] ||
            res.headers.get('filename') ||
            res.headers.get('x-filename');
            if(body instanceof Blob){
              saveAs(body, decodeURI(fileName));
            } else {
              saveAs(new Blob([body]), decodeURI(fileName));
            }
          
          // this.success.emit(res);
        },
        err => this.error.emit(err),
        () => this.setDisabled(false)
      );
  }

  request(): any {
    if (this.httpMethod !== 'get') {
      return this._http.post(this.httpUrl,  this.httpData || {},{
        method: this.httpMethod,
        responseType: 0
      });
    } else {
      return this._http.get(this.httpUrl, {
        method: this.httpMethod,
        params: this.httpData || {},
        body: null,
        responseType: 3
      });
    }

  }
}
