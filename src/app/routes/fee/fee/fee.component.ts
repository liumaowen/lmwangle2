import { element } from 'protractor';
import { CustomerapiService } from './../../customer/customerapi.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { FeeapiService } from './../feeapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss']
})
export class FeeComponent implements OnInit {

  start;

  end;

  endmax = new Date();

  querys = { pagenum: 1, pagesize: 10, start: '', end: '', feecustomerid: '', actualfeecustomerid: '' };

  singleData: any;

  totalItems: any;

  public currentPage: number = 1;

  constructor(private feeApi: FeeapiService, private toast: ToasterService, private datePipe: DatePipe,
    private customerApi: CustomerapiService) {
    this.listDetail();
  }

  ngOnInit() {
  }

  listDetail() {
    this.feeApi.query(this.querys).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    })
  }

  // 分页点击查询
  pageChanged(event: any): void {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.listDetail();
  };

  companyOfCode;
  actualcompanyOfCode;

  model;

  // 重置条件
  selectNull() {
    this.querys = { pagenum: 1, pagesize: 10, start: '', end: '', feecustomerid: '', actualfeecustomerid: '' };
    this.companyOfCode = undefined;
    this.actualcompanyOfCode = undefined;
    this.model = {};
    this.end = undefined;
    this.start = undefined;
  };

  openQueryDialog() {
    this.showqueryModal();
  }

  query() {
    if (this.start) this.querys.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    if (this.end) this.querys.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    console.log(this.companyOfCode);
    console.log(this.actualcompanyOfCode);
    if (this.companyOfCode) {
      this.querys.feecustomerid = this.companyOfCode['code'];
    }
    if (this.actualcompanyOfCode) {
      this.querys.actualfeecustomerid = this.actualcompanyOfCode['code'];
    }
    console.log(this.querys);
    this.hidequeryModal();
    this.listDetail();
    // ngDialog.close();
    // $scope.tableParams.reload();
  };

  // 修改费用对话框
  modifyfee = { payorreceive: '', type: '', feecustomerid: '', actualfeecustomerid: '', paycustomerid: '' };

  sellers = []
  feetype = [];

  modify(id) {
    console.log('sss', id);
    this.customerApi.findwiskind().then((data) => {
      let sellerlist = [{ label: '全部', value: '' }];
      data.forEach(element => {
        sellerlist.push({
          label: element['name'],
          value: element['id'],
        })
      });
      this.sellers = sellerlist;
    });
    this.modifyfee = { payorreceive: '', type: '', feecustomerid: '', actualfeecustomerid: '', paycustomerid: '' };
    this.feetype = [{ label: '请选择费用类型', value: '' },
    { label: '汽运费', value: 1 },
    { label: '铁运费', value: 2 },
    { label: '船运费', value: 3 },
    { label: '出库费', value: 4 },
    { label: '开平费', value: 5 },
    { label: '纵剪费', value: 6 },
    { label: '销售运杂费', value: 7 },
    { label: '包装费', value: 8 },
    { label: '仓储费', value: 9 },
    { label: '保险费', value: 10 },];
    this.modifyfee['id'] = id;
    this.showcreateModal();
  }

  companyOfProduce;
  companyOfProduce2;
  feemodify() {
    if (typeof (this.companyOfProduce) === 'object') {
      this.modifyfee.feecustomerid = this.companyOfProduce['code'];
    } else {
      this.modifyfee.feecustomerid = '';
    }
    if (typeof (this.companyOfProduce2) === 'object') {
      this.modifyfee.actualfeecustomerid = this.companyOfProduce2['code'];
    } else {
      this.modifyfee.actualfeecustomerid = '';
    }
    this.feeApi.modify(this.modifyfee).then((response) => {
      this.toast.pop('success', '修改成功');
      this.listDetail();
      // Notify.alert("修改成功", { status: 'success' });
      // $scope.tableParams.reload();
    });
    // ngDialog.close();
    this.hidecreateModal();
  }

  @ViewChild('queryModal') private queryModal: ModalDirective;

  showqueryModal() {
    this.queryModal.show();
  }

  hidequeryModal() {
    this.queryModal.hide();
  }

  @ViewChild('createModal') private createModal: ModalDirective;

  showcreateModal() {
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }

}
