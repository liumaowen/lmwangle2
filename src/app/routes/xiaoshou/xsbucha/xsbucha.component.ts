import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { element } from 'protractor';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { XsbuchaapiService } from './../xsbuchaapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-xsbucha',
  templateUrl: './xsbucha.component.html',
  styleUrls: ['./xsbucha.component.scss']
})
export class XsbuchaComponent implements OnInit {

  // 获取表格数据
  singleData;

  querys = { pagenum: 1, pagesize: 10 };

  suser;

  buyer;

  status = [{ label: '请选择补差单状态', value: '' }, { label: '制单中', value: 0 }, { label: '待审核', value: 1 }, { label: '已审核', value: 2 }];

  constructor(private xsbuchaApi: XsbuchaapiService, private customerApi: CustomerapiService, private toast: ToasterService, private router: Router) {
    this.querydata();
  }

  ngOnInit() {
  }

  // 分页点击查询
  pageChanged(event: any): void {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.querydata();
  };

  totalItems;

  public currentPage: number = 1;
  querydata() {
    this.xsbuchaApi.query(this.querys).then((data) => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    })
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  openDialog() {
    this.classicModal.show();
  }

  closeDialog() {
    this.classicModal.hide();
  }

  // 查询
  select() {
    if (this.suser) {
      this.querys['cuserid'] = '';
      this.querys['cuserid'] = this.suser['code'];
    }
    if (this.buyer) {
      this.querys['buyerid'] = '';
      this.querys['buyerid'] = this.buyer['code'];
    }
    this.querys['pagenum'] = 1;
    this.querys['pagesize'] = 10;
    this.currentPage = 1;
    console.log(this.querys);
    this.querydata();
    this.closeDialog();
  }

  // 重选
  selectNull() {
    this.buyer = null;
    this.suser = null;
    this.querys = { pagenum: 1, pagesize: 10 };
  }

  @ViewChild('creataModal') private creataModal: ModalDirective;


  showCreataDialog() {
    this.creataModal.show();
  }

  hideCreataDialog() {
    this.creataModal.hide();
  }

  buchaCompany;
  xsbuchaentity = { beizhu: '',istidanlixi: false };

  sellers = [];
  createDialog() {
    if (this.sellers.length < 1) {
      this.sellers = [{ label: '全部', value: '' }];
      this.customerApi.findwiskind().then(data => {
        data.forEach(element => {
          this.sellers.push({
            label: element['name'],
            value: element['id']
          });
        });
      });
    }

    // this.xsbuchaentity = { beizhu: '' };
    // this.xsbuchaentity['isonline'] = false;
    this.showCreataDialog();
  }

  create() {
    console.log(this.xsbuchaentity);
    if (this.xsbuchaentity['isonline'] == null) {
      this.toast.pop('warning', '输入无效,请输入选择补差单位！！！');
      return '';
    }
    if (typeof (this.buchaCompany) === 'string' || !this.buchaCompany) {
      this.toast.pop('warning', '输入无效,请输入选择补差单位！！！');
      return '';
    } else {
      this.xsbuchaentity['buyerid'] = this.buchaCompany.code;
    }
    if (!this.xsbuchaentity['buyerid']) {
      this.toast.pop('warning', '请输入补差单位！！！');
      return '';
    }
    if (!this.xsbuchaentity['sellerid']) {
      this.toast.pop('warning', '请输入卖方单位！！！');
      return '';
    }
    console.log('create', this.xsbuchaentity);
    this.xsbuchaApi.create(this.xsbuchaentity).then((data) => {
      this.router.navigate(['xsbucha', data['id']]);
    });
    this.hideCreataDialog();
  }

  Isonline;
  setisonline(value) {
    this.Isonline = value;
    this.buchaCompany = null;
  }

}
