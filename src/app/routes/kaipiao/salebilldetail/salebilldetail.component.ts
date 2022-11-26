import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { element } from 'protractor';
import { ToasterService } from 'angular2-toaster';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderapiService } from './../../order/orderapi.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';

@Component({
  selector: 'app-salebilldetail',
  templateUrl: './salebilldetail.component.html',
  styleUrls: ['./salebilldetail.component.scss']
})
export class SalebilldetailComponent implements OnInit {
  @ViewChild('modifyModal') private modifyModal: ModalDirective;

  // 获取订单
  salebill = {};
  // 发票信息, {no:发票号码, date:开票日期}
  invoice = {};

  flag = {};

  express = {};

  expresses = [];

  params = {};

  pid;

  gnlist;

  start;

  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');

  gridOptions: GridOptions;

  constructor(public settings: SettingsService,
    private storage: StorageService,
    private orderApi: OrderapiService,
    private classifyApi: ClassifyApiService,
    private toast: ToasterService,
    private router: Router,
    private datepipe: DatePipe,
    private qihuoapi: QihuoService,
    private route: ActivatedRoute) {

    this.salebill = { buyer: {}, seller: {}, cuser: {} };

    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableSorting: true // 排序
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'billgn', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格/型号', field: 'guige', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单位', field: 'unit', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '数量', field: 'tweight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单价(含税)', field: 'perprice', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '金额(含税)', field: 'totalmoney', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '税率', field: 'taxrate', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'taxrate', width: 90,
        cellRenderer: data => {
          if (this.flag['modify'] && this.salebill['status'] && data['data']['id']) {
            return '<a target="_blank">修改</a>';
          }
        }, onCellClicked: (data) => {
          if (this.flag['modify'] && this.salebill['status'] && data['data']['id']) {
            this.modify(data.data);
          }
        }
      }
    ];

    this.getDetail();
  }

  // 为明细表数据赋值
  getDetail() {
    this.getMyRole();
    this.orderApi.getonesale(this.route.params['value']['id']).then((response) => {
      console.log('kaipiao1', response);
      this.salebill = response['salebill'];
      if (this.salebill['cuserid'] === this.current.id) {
        this.flag['modify'] = true;
      }
      if (response['salebill']['status'] !== 1) {
        this.flag['ismod'] = true;
      } else {
        this.flag['ismod'] = false;
      }
      this.gridOptions.api.setRowData(response['detlist']);
    });
  }

  // 弹出对话框
  addexpress(status) {
    console.log(status);
    if (2 !== status) {
      this.classifyApi.listBypid({ pid: 3949 }).then((data) => {
        const lists = [{ label: '请选择快递公司', value: '' }];
        data.forEach(element => {
          lists.push({
            label: element['name'],
            value: element['name']
          });
        });
        this.expresses = lists;
      });
      this.showclassicModal();
    } else {
      this.toast.pop('warning', '发票已寄出不允许重复添加快递信息，如有疑问请联系管理员！');
      // Notify.alert("订单为完成状态不允许修改快递信息，如有疑问请联系管理员！", { status: 'warning' });
    }
  }
  // 修改快递信息
  modexpress(status) {
    this.express = { express: this.salebill['express'], expressno: this.salebill['expressno'] };
    this.classifyApi.listBypid({ pid: 3949 }).then((data) => {
      const lists = [{ label: '请选择快递公司', value: '' }];
      data.forEach(element => {
        lists.push({
          label: element['name'],
          value: element['name']
        });
      });
      this.expresses = lists;
    });
    this.modifyModal.show();
  }
  submitmod() {
    if (confirm('你确定修改快递信息吗？')) {
      console.log(this.express);
      this.orderApi.modifyExpress(this.salebill['id'], this.express).then((data) => {
        this.getDetail();
        this.hidemodifyModal();
        this.toast.pop('success', '快递信息修改提交成功');
      });
    }
  }
  hidemodifyModal() {
    this.modifyModal.hide();
  }
  // 提交
  submit() {
    if (confirm('你确认发票已经邮寄，提交快递信息吗？')) {
      console.log(this.express);
      this.orderApi.submitExpress(this.salebill['id'], this.express).then((data) => {
        this.getDetail();
        this.hideclassicModal();
        this.toast.pop('success', '快递信息已提交，该订单已经完成');
      });
    }
  }

  // 清空按钮
  selectNull() {
    this.express = {};
  }

  // 审核发票
  verify(id, version) {
    if (confirm('你确定审核该发票吗？')) {
      this.orderApi.verify(id, { version: version }).then((data) => {
        this.salebill = data.json();
        this.toast.pop('success', '发票已审核，请通知相关人员邮寄！');
      });
    }
  }

  // 修改发票品名
  modify(data) {
    this.params = {};
    this.params = JSON.parse(JSON.stringify(data));
    let gn = '';
    if (this.params['goodscode']['gn']) {
      gn = this.params['goodscode']['gn'];
    } else {
      gn = this.params['gnid'];
    }
    this.classifyApi.getsalebill({ pid: gn }).then((gns) => {
      this.gnlist = [];
      gns.forEach(element => {
        this.gnlist.push({
          label: element['label'],
          value: element['label']
        });
      });
    });
    this.showbillgnModal();
  }

  submitmodify() {
    if (!this.params['billgn']) {
      this.toast.pop('warning', '请选择开票品名后再提交！');
      return;
    }
    if (confirm('你确定修改该发票吗？')) {
      this.orderApi.submitmodify(this.params['id'], { billgn: this.params['billgn'] }).then((data) => {
        this.getDetail();
        this.toast.pop('success', '发票已修改，请通知财务审核！');
        this.hidebillgnModal();
      });
    }
  }

  // 删除发票
  remove(id) {
    if (confirm('你确定要删除该发票吗？')) {
      this.orderApi.removeone(id).then(() => {
        this.router.navigateByUrl('salebill');
        this.toast.pop('success', '发票已删除，请重新开票！');
      });
    }
  }

  // 弃审发票
  disverify(id) {
    if (confirm('你确定要弃审该发票吗？')) {
      this.orderApi.disverify(id).then((data) => {
        console.log(data);
        this.salebill = data;
        this.toast.pop('success', '发票已弃审，请重新审核！');
      });
    }
  }

  // 打开编辑发票号码窗口
  openInvoiceNoDialog() {
    this.resetInvoice();
    console.log(this.invoice);
    this.showinvoiceModal();
  }

  // 保存发票号码
  saveInvoiceNo() {
    const reg = new RegExp(/^\d{8}([，,]\d{8})*$/);
    const reg1 = new RegExp(/^\d{20}([，,]\d{20})*$/);
    if (this.invoice['no'] && (reg.test(this.invoice['no']) || reg1.test(this.invoice['no'])) && this.start) {
      this.invoice['id'] = this.salebill['id'];
      this.invoice['no'] = this.invoice['no'].replace('，', ',');
      this.invoice['date'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.orderApi.setInvoiceNo(this.invoice).then(() => {
        this.getDetail();
        this.hideinvoiceModal();
        this.toast.pop('success', '发票号码保存成功！');
        // Notify.alert('', { status: 'success' });
      });
    } else {
      this.toast.pop('warning', '请完善信息！');
    }

  }

  // 重置发票号码，恢复至上一次保存过的值
  resetInvoice() {
    if (this.salebill['invoicedate']) {
      this.start = new Date(this.salebill['invoicedate']);
      this.invoice = { no: this.salebill['invoiceno'], date: this.datepipe.transform(this.start, 'y-MM-dd') };
    } else {
      this.start = undefined;
      this.invoice = { no: this.salebill['invoiceno'], date: null };
    }
  }


  ngOnInit() {
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('billgnModal') private billgnModal: ModalDirective;

  showbillgnModal() {
    this.billgnModal.show();
  }

  hidebillgnModal() {
    this.billgnModal.hide();
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('invoiceModal') private invoiceModal: ModalDirective;

  showinvoiceModal() {
    this.invoiceModal.show();
  }

  hideinvoiceModal() {
    this.invoiceModal.hide();
  }
  reload() {
    this.orderApi.reloadsalebill(this.route.params['value']['id']).then((response) => {
      this.toast.pop('warning', response['msg']);
    });
  }
  print() {
    this.orderApi.printsalebill(this.route.params['value']['id']).then((response) => {
      console.log(response);
      if (!response['flag']) {
        this.toast.pop('warning', response['msg']);
      } else {
        window.open(response['msg']);
      }
    });
  }
  caiwu = false;
  getMyRole() {
    let myrole = JSON.parse(localStorage.getItem('myrole'));
    for (let i = 0; i < myrole.length; i++) {
      if ((myrole[i] === 5 || myrole[i] === 19 || myrole[i] === 37 || myrole[i] === 44 || myrole[i] === 35) && !(myrole[i] === 41 || myrole[i] === 42)) {
        this.caiwu = true;
      }
    }
  }
  @ViewChild('fujianModal2') private fujianModal2: ModalDirective;
  @ViewChild('fujianModal') private fujianModal: ModalDirective;

  billnos: any = [];

  showfujianmodal(){
    this.orderApi.findBillnos(this.salebill['id']).then(data => {
      this.billnos = data['billnos'];
    })
    this.fujianModal2.show();
  }
  closefujian2(){
    this.fujianModal2.hide();
  }
  closefujian(){
    this.fujianModal.hide();
  }
  showfujianmodal2(qihuoid) {
    this.getfujians(qihuoid);
    this.fujianModal.show();
  }
  fujians: any = [];
  getfujians(qihuoid){
    this.qihuoapi.findfujians(qihuoid).then(data => {
      this.fujians = data['fujians'];
    })
  }
  chakan(model){
    this.qihuoapi.chakan(model).then((data) => {
      //this.getfujians(model['qihuoid']);
    });
  }
}
