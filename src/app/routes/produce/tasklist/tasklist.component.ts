import { Component, OnInit, ViewChild } from '@angular/core';
import { ProduceapiService } from './../produceapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerapiService } from './../../customer/customerapi.service';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss']
})
export class TasklistComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  // 查询
  @ViewChild('querydialog') private querydialog: ModalDirective;
  isHDjiagong = false;
  cuser: any;
  totalItems: any;
  singleData;
  types: any = [{ value: '', label: '请选择打包带材料' }, { value: '1', label: '钢带' }, { value: '2', label: '其他' }];
  search = { pagenum: 1, pagesize: 10 };
  public currentPage = 1;
  cangkus = [];
  neijings = [];
  packages = [];
  tasklist: Object = {};
  mindate: Date = new Date();
  start: Date = new Date();
  am_pms = [];
  am_pm = '上午';
  companyOfCode;
  companyIsWiskind = [];
  constructor(private produceApi: ProduceapiService, private toast: ToasterService, private datepipe: DatePipe,
    private router: Router, private customerApi: CustomerapiService) {
    this.listDetail();
  }

  ngOnInit() {
  }
  listDetail() {
    this.produceApi.querytasklist(this.search).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    });
  }
  // 分页点击查询
  pageChanged(event: any): void {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.listDetail();
  }
  openQueryDialog() {
    this.querydialog.show();
  }
  // 关闭查询框
  queryclose() {
    this.querydialog.hide();
  }
  select() {
    // if (this.cuser) {
    //   this.search['cuserid'] = this.cuser['code'];
    // }
    this.search.pagenum = 1;
    this.listDetail();
    this.queryclose();
  }
  selectNull() {
    this.search = {
      pagenum: 1,
      pagesize: 10
    };
  }
  createDialog() {
    this.tasklist = {};
    this.findWiskind();
    this.am_pms = [{ value: '上午', label: '上午' }, { value: '下午', label: '下午' }];
    this.neijings = [{ value: '508', label: '508' }, { value: '610', label: '610' }];
    this.packages = [{ value: '裸包', label: '裸包' }, { value: '油纸', label: '油纸' }, { value: '简包', label: '简包' },
    { value: '精包', label: '精包' }, { value: '原包', label: '原包' }];
    this.cangkus = [];
    this.produceApi.getcangku().then(data => {
      data.forEach(element => {
        this.cangkus.push({
          label: element.name,
          value: element.id
        });
      });
    });
    this.createModal.show();
  }
  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({ label: '请选择盖章单位', value: '' });
      this.customerApi.findwiskind().then((response) => {
        for (let i = 1; i < response.length; i++) {
          if (response[i].id === 3453) {
            response.splice(i, 1);
          }
        }
        response.forEach(element => {
          this.companyIsWiskind.push({
            label: element.name,
            value: element.id
          });
        });
        // this.companyIsWiskind = response;
      });
    }
  }
  create() {
    if (this.tasklist['producemode'] === null || this.tasklist['producemode'] === undefined) {
      this.toast.pop('warning', '请选择加工模式');
      return;
    }
    if (this.tasklist['gangdai'] !== null && this.tasklist['gangdai'] !== undefined && this.tasklist['gangdai'] <= 0) {
      this.toast.pop('warning', '钢带数量不能为零或负数');
      return;
    }
    if (!this.tasklist['cangkuid']) {
      this.toast.pop('warning', '请选择仓库');
      return;
    }
    if (!this.tasklist['packagetype']) {
      this.toast.pop('warning', '请选择包装方式');
      return;
    }
    if (!this.tasklist['neijing']) {
      this.toast.pop('warning', '请选择卷内径');
      return;
    }
    // if (!this.tasklist['fee']) {
    //   this.toast.pop('warning', '请填写加工费');
    //   return;
    // }
    if (!this.tasklist['phone']) {
      this.toast.pop('warning', '请填写联系电话');
      return;
    }
    if (this.tasklist['producemode'] === '2') {
      if (typeof (this.companyOfCode) === 'string' || !this.companyOfCode) {
        this.tasklist['buyerid'] = null;
        this.toast.pop('warning', '请选择买方单位！');
        return;
      } else if (typeof (this.companyOfCode) === 'object') {
        this.tasklist['buyerid'] = this.companyOfCode['code'];
      } else {
        this.tasklist['buyerid'] = null;
      }
      if (this.tasklist['buyerid'] === null) {
        this.toast.pop('warning', '请选择买方单位！');
        return;
      }
      if (!this.tasklist['sellerid']) {
        this.toast.pop('warning', '请选择盖章单位！');
        return;
      }
    }
    if (this.tasklist['sellerid'] === 3786) {
      if (!this.tasklist['orderno']) {
        this.toast.pop('warning', '请填写关联订单号！');
        return;
      }
    }
    if (this.tasklist['isretain'] === null || this.tasklist['isretain'] === undefined) {
      this.toast.pop('warning', '请选择是否保留原标签');
      return;
    }
    if (this.tasklist['mutuo'] === null || this.tasklist['mutuo'] === undefined) {
      this.toast.pop('warning', '请填写木托数量');
      return;
    }
    if (this.tasklist['isxiubian'] === null || this.tasklist['isxiubian'] === undefined) {
      this.toast.pop('warning', '请选择是否修边');
      return;
    }
    this.tasklist['jiaoqi'] = this.datepipe.transform(this.start, 'y-MM-dd') + ' ' + this.am_pm;
    console.log(this.tasklist);
    this.produceApi.createtasklist(this.tasklist).then(data => {
      this.router.navigate(['tasklist', data]);
    });
  }
  selectedcangku(value) {
    this.tasklist['cangkuid'] = value.value;
  }
  hidecreatemodal() {
    this.createModal.hide();
  }
  selectstart() { }
  showbillno() {
    if (this.tasklist['sellerid'] === 3786) {
      this.isHDjiagong = true;
    }
  }
}
