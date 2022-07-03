import { StorageService } from './../../service/storage.service';
import { FileUploader } from 'ng2-file-upload';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'wisk-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  //配置上传路径格式等信息 格式为：uploadParam:any = {module:'ruku'/*请求路径*/,count:1/*上传文件个数*/,sizemax:10/*文件最大M*/,extensions:['xls']/*文件格式*/};
  @Input() public uploadParam: any;

  //限制上传文件类型
  @Input() public accept: any;

  @Output() public select = new EventEmitter<any>();


  //上传文件
  public uploader: FileUploader;

  uploads() {
    const urls = [];
    if (this.uploader.queue.length > 1) {

    } else {
      this.uploader.queue[0].onSuccess = (response, status, headers) => {
        // 上传文件后获取服务器返回的数据
        let tempRes = JSON.parse(response);
        this.select.emit(tempRes);
        this.uploader.clearQueue();
      };
      this.uploader.queue[0].onError = (response, status, headers) => {
        this.uploader.clearQueue();
      };
    }
    this.uploader.uploadAll();
    console.log('clearQueue');
    if (this.uploader.queue.length > 1) {
      this.uploader.onCompleteItem = (fileItem, response, status, headers) => {
        console.log(response);
        const tempRes = JSON.parse(response);
        urls.push(tempRes.url);
        if (this.uploader.queue.length === urls.length) {
          this.select.emit(urls);
          this.uploader.clearQueue();
        }
      };
    }
  }

  constructor(private storage: StorageService) {
  }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: '/store/api/file/upload/' + this.uploadParam["module"],
      //上传文件的过滤信息
      filters: [{
        name: 'customFilter',
        fn: (item: any, option: any) => {
          return this.uploader['queue'].length < this.uploadParam["count"];
        }
      }, {
        name: 'extensionFilter',
        fn: (item: any, option: any) => {
          let filename = item.name;
          let extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
          let namestrs = '';
          let returnobj = false;
          this.uploadParam["extensions"].forEach((value, index) => {
            namestrs = namestrs + '/' + value;
            if (extension == value) returnobj = true;
          });
          if (returnobj) {
            return true;
          } else {
            //提示信息。以后会修改
            alert("仅支持" + namestrs);
            return false;
          };
        }
      }, {
        name: 'sizeFilter',
        fn: (item: any, options: any) => {
          let fileSize = item.size;
          fileSize = parseInt(fileSize) / (1024 * 1024);
          if (fileSize <= this.uploadParam["sizemax"]) {
            return true;
          } else {
            //提示信息，以后修改
            alert("文件不能超过" + this.uploadParam["sizemax"] + "M");
            return false;
          }
        }
      }],
      //上传文件的请求头部信息
      headers: [{
        name: "token", value: this.storage.get('token')
      }, {
        name: 'version', value: environment.version
      }]
    })
  }

}
