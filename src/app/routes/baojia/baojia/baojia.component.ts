import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaojiaService } from '../baojia.service';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { StorageService } from '../../../dnn/service/storage.service';
import { enableProdMode } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-baojia',
  templateUrl: './baojia.component.html',
  styleUrls: ['./baojia.component.scss'],
})
export class BaojiaComponent implements OnInit {

  accept = ".xls, application/xls";
  search = {isall:true};
  singleData;
  //定义的上传路径格式等信息
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 10, extensions: ['xls'] };

  constructor(private baojiaApi: BaojiaService, private storage: StorageService, private toast: ToasterService) {
    //查询报价管理
    this.querydata(this.search);
  }

  querydata(search) {
    this.baojiaApi.queryBaojia(search).then(data => {
      this.singleData = data;
    })
  }

  ngOnInit() {
  }

  //弹窗
  @ViewChild('classicModal') private classModel: ModalDirective;

  //点击上传显示弹窗
  showDialog() {
    this.classModel.show();
  }

  //关闭弹窗
  hideDialog() {
    this.classModel.hide();
  }

  //上传文件
  uploads($event) {
    console.log($event)
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.baojiaApi.create(addData).then(data => {
        // this.singleData.unshift(data);
        this.querydata(this.search);
        this.toast.pop('success', '上传成功！')
      });
    }
    this.querydata(this.search);
    this.hideDialog();
  }

}
