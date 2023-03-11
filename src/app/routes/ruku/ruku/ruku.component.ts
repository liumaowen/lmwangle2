import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { Headers } from '@angular/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RukuService } from './../ruku.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-ruku',
  templateUrl: './ruku.component.html',
  styleUrls: ['./ruku.component.scss']
})
export class RukuComponent implements OnInit {
  current = this.storage.getObject('cuser');

  public totalItems: number;
  public currentPage: number = 1;
  // 分页点击查询
  pageChanged(event: any): void {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.querydata();
  };

  constructor(private rukuapi: RukuService, private datepipe: DatePipe, private toast: ToasterService,private storage: StorageService) {
    this.querydata();
  }

  ngOnInit() {
  }

  // 分页查询的条件
  search = {
    pagenum: 1,
    pagesize: 10,
  }

  // ngtable的表格数据
  singleData = [];

  // 查询数据
  querydata() {
    this.rukuapi.query(this.search).then((data) => {
      // 获取到总条目
      this.totalItems = data.headers.get("total");
      // 获取到当前数据
      this.singleData = data.json();
    })
  }

  // 查询弹窗实例
  @ViewChild('classicModal') private classModel: ModalDirective;

  // 查询条件对象
  querys = {
    id: '',
    start: null,
    end: null
  }

  // 选择结束时间控制
  endmax = new Date();

  // 查询弹窗
  open() {
    this.classModel.show();
  }

  // 关闭查询弹窗
  coles() {
    this.classModel.hide();
  }

  // 重选
  selectNull() {
    this.querys = {
      id: '',
      start: null,
      end: null
    }
    this.search = {
      pagenum: 1,
      pagesize: 10,
    }
  }

  // 查询
  select() {
    this.querys['salemanid']=this.current.id;
    this.querys['orgid']=this.current.orgid;
    this.querys['id'] ? this.search['id'] = this.querys['id'] : '';
    this.querys['start'] ? this.search['start'] = this.datepipe.transform(this.querys['start'], 'y-MM-dd') : '';
    this.querys['end'] ? this.search['end'] = this.datepipe.transform(this.querys['end'], 'y-MM-dd') : '';
    this.querydata();
    this.coles();
  }

  // 上传弹窗实例
  @ViewChild('parentModal') private uploaderModel: ModalDirective;

  // 入库单上传弹窗
  rukuUploader() {
    this.uploaderModel.show();
  }

  // 入库单上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 1, extensions: ['xls'] };

  // 设置上传的格式
  accept = ".xls, application/xls";

  // 上传成功执行的回调方法
  uploads($event) {
    console.log($event);
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.rukuapi.create(addData).then(data => {
        // this.singleData.unshift(data);
        this.querydata();
        this.toast.pop('success', '上传成功！');
      });
    }
    this.querydata();
    this.hideDialog();
  }

  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }

}
