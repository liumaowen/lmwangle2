import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Router } from '@angular/router';
import { CaigouService } from './../caigou.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cgorgtypes } from 'app/shared/const';

@Component({
  selector: 'app-jsbucha',
  templateUrl: './jsbucha.component.html',
  styleUrls: ['./jsbucha.component.scss']
})
export class JsbuchaComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  // 时序表格的数据
  buchaData;
  // 分页显示的总数量
  totalItems;
  // 分页初始化页码
  currentPage = 1;
  // 查询数据
  search: object = { pagenum: 1, pagesize: 10, type: '', sorgid: '' };
  // 创建
  create: object = { sorgid: '', type: '', beizhu: '',orgid: '' };
  orgtypes: any = Cgorgtypes;
  types: any[];
  // 分页点击查询数据
  pageChanged(event) {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.querydata();
  }
  constructor(private caigouApi: CaigouService, private router: Router, private toast: ToasterService) {
    this.querydata();
  }

  ngOnInit() {
  }
  // 查询时序表数据
  querydata() {
    this.caigouApi.buchalist(this.search).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.buchaData = data.json();
      this.buchaData.forEach(element => {
        if (element['status'] === 0) {
          element['status'] = '制单中';
        } else if (element['status'] === 1) {
          element['status'] = '待审核';
        } else if (element['status'] === 2) {
          element['status'] = '已审核';
        }
      });
    });
  }
  createDialog() {
    this.create = { sorgid: '', type: '', beizhu: '' };
    this.types = [{ id: '1', text: '退补' }, { id: '2', text: '质量异议' }, { id: '3', text: '其他' }];
    this.createModal.show();
  }
  showDialog() {
    this.types = [{ id: '1', text: '退补' }, { id: '2', text: '质量异议' }, { id: '3', text: '其他' }];
    this.search = { pagenum: 1, pagesize: 10, type: '', sorgid: '' };
    this.classicModal.show();
  }
  query() {
    this.querydata();
  }
  hideDialog() {
    this.classicModal.hide();
  }
  closecreateDialog() {
    this.createModal.hide();
  }
  selectetype(value) {
    this.create['type'] = value.id;
  }
  createbucha() {
    if (this.create['sorgid'] === '') {
      this.toast.pop('error', '请选择收货机构！', '');
      return;
    }
    if (this.create['type'] === '') {
      this.toast.pop('error', '请选择补差类型！', '');
      return;
    }
    this.caigouApi.createjsbucha(this.create).then(data => {
      this.buchaData = data;
      this.closecreateDialog();
      this.router.navigate(['jsbucha', data.id]);
    });
  }
  selected(value) {
    this.search['type'] = value.id;
  }

}
