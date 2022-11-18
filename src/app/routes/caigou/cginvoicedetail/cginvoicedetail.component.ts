import { CginvoiceingComponent } from './../cginvoiceing/cginvoiceing.component';
import { StorageService } from './../../../dnn/service/storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
const sweetalert = require('sweetalert');
@Component({
  selector: 'app-cginvoicedetail',
  templateUrl: './cginvoicedetail.component.html',
  styleUrls: ['./cginvoicedetail.component.scss']
})
export class CginvoicedetailComponent implements OnInit {

  @ViewChild('weightModal') weightModal: ModalDirective;
  @ViewChild('jineModal') jineModal: ModalDirective;
  @ViewChild('invoicenoModal') invoicenoModal: ModalDirective;
  @ViewChild('beizhuModal') beizhuModal: ModalDirective;
  @ViewChild('invoiceDateModal') invoiceDateModal: ModalDirective;
  gridOptions: GridOptions;
  invoicedatemax: Date = new Date();
  invoicedate: Date = new Date();
  cginvoice: Object = { supplier: '' };
  flag: Object = { tijiao: false, shenhe: false, qishen: false };
  modifyweight: Object = { kaipiaoweight: null, detid: '' };
  modifyjine: Object = { kaipiaojine: null, detid: '' };
  det = { jine: '', bjine: '', tax: '', id: ''};
  detid: any;
  msg = { msg: ''};
  cginvoiceModalRef: BsModalRef;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  constructor(private caigouApi: CaigouService, public settings: SettingsService, private actroute: ActivatedRoute,private datepipe: DatePipe,
    private toast: ToasterService, private storage: StorageService, private router: Router,
    private bsModalService: BsModalService) {
    this.gridOptions = {
      rowSelection: 'multiple',
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      getNodeChildDetails: (params) => {
        if (params.group) {
          return {
            group: true,
            expanded: null != params.group,
            children: params.participants,
            field: 'group',
            key: params.group
          };
        } else {
          return null;
        }
      },
      groupSelectsChildren: true // 分组可全选
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', cellRenderer: 'group', minWidth: 90, checkboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'billgn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 80,
        onCellClicked: (params) => {
          if (params.data.type === '采购入库' && this.cginvoice['status'] === 0) {
            this.modifyweight['detid'] = params.data.id;
            this.modifyweight['kaipiaoweight'] = params.data.weight;
            console.log(params);
            this.weightModal.show();
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单位', field: 'unit', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '税率', field: 'rate', minWidth: 80 },
      { cellStyle: { 'text-align': 'right' }, headerName: '含税单价', field: 'price', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '含税金额', field: 'jine', minWidth: 100,
        onCellClicked: (params) => {
          if (params.data.type === '采购退款' && this.cginvoice['status'] === 0) {
            this.modifyjine['detid'] = params.data.id;
            this.modifyjine['kaipiaojine'] = params.data.jine;
            console.log(params);
            this.jineModal.show();
          }
        }
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '不含税金额', field: 'bjine', minWidth: 100 },
      { cellStyle: { 'text-align': 'right' }, headerName: '税额', field: 'tax', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据编号', field: 'rukuno', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 80,
        cellRenderer: (params) => {
          if (params.data.id && this.cginvoice['status'] === 0) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        }, onCellClicked: (params) => {
          if (params.data.id && this.cginvoice['status'] === 0) {
            sweetalert({
              title: '你确定要删除吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.caigouApi.delinvoicedet(params.data.id).then(data => {
                this.toast.pop('success', '删除成功！');
                this.querydata();
              });
              sweetalert.close();
            });
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 60, enableRowGroup: true,
        cellRenderer: (params) => {
          if (params.data.id) {
            return '<a target="_blank">修改</a>';
          } else {
            return '';
          }
        }, 
        onCellClicked: (params) => {
            if (params.data.id) {
                this.open(params.data.id);
            }
        }
      },
    ];
    this.querydata();
  }

  ngOnInit() {
  }
  querydata() {
    this.getMyRole();
    this.caigouApi.cginvoice(this.actroute.params['value']['id']).then(data => {
      console.log('asda', data);
      if (data.salebill.status === 0 && this.storage.getObject('cuser').id === data.salebill.cuserid) {
        this.flag['tijiao'] = true;
        this.flag['shenhe'] = false;
        this.flag['qishen'] = false;
      } else if (data.salebill.status === 1) {
        this.flag['tijiao'] = false;
        this.flag['shenhe'] = true;
        this.flag['qishen'] = false;
      } else if (data.salebill.status === 2) {
        this.flag['tijiao'] = false;
        this.flag['shenhe'] = false;
        this.flag['qishen'] = true;
      }
      this.cginvoice = data.salebill;
      this.gridOptions.api.setRowData(data.list);
    });
  }
  submitcg() {
    if (confirm('确认要提交审核吗？')) {
      this.caigouApi.submitcginvoice(this.actroute.params['value']['id']).then(data => {
        this.toast.pop('success', '提交成功');
        this.querydata();
      });
    }
  }
  verify() {
    if (confirm('确认要审核吗？')) {
      this.caigouApi.verifycginvoice(this.actroute.params['value']['id']).then(data => {
        this.toast.pop('success', '审核成功！');
        this.querydata();
      });
    }
  }
  weightclose() {
    this.weightModal.hide();
  }
  confirmweight() {
    if (!this.modifyweight['kaipiaoweight'] || this.modifyweight['kaipiaoweight'] === '0') {
      this.toast.pop('error', '开票量不能为空或不能为零或不能为负！', '');
      return;
    }
    this.caigouApi.modifyfpweight(this.modifyweight).then(data => {
      this.toast.pop('success', '开票量修改成功！');
      this.querydata();
      this.weightclose();
    });
  }
  jineclose() {
    this.jineModal.hide();
  }
  confirmjine() {
    if (!this.modifyjine['kaipiaojine'] || this.modifyjine['kaipiaojine'] === '0' || this.modifyweight['kaipiaojine'] < 0) {
      this.toast.pop('error', '开票金额不能为空或不能为零或不能为负！', '');
      return;
    }
    this.caigouApi.modifyfpjine(this.modifyjine).then(data => {
      this.toast.pop('success', '开票金额修改成功！');
      this.querydata();
      this.jineclose();
    });
  }
  back() {
    if (confirm('确认要回退吗？')) {
      this.caigouApi.backinvoice(this.actroute.params['value']['id']).then(data => {
        this.toast.pop('success', '回退成功');
        this.querydata();
      });
    }
  }
  refuse() {
    if (confirm('确认要弃审吗？')) {
      this.caigouApi.qisheninvoice(this.actroute.params['value']['id']).then(data => {
        this.toast.pop('success', '弃审成功');
        this.querydata();
      });
    }
  }
  deleteinvoice() {
    this.caigouApi.deleteinvoice(this.actroute.params['value']['id']).then(data => {
      this.toast.pop('success', '删除成功');
      this.router.navigate(['cginvoice/det']);
    });
  }
  opendet() {
    this.bsModalService.config.class = 'modal-all';
    this.cginvoiceModalRef = this.bsModalService.show(CginvoiceingComponent);
    this.cginvoiceModalRef.content.parentthis = this;
  }
  
  coles() {
    this.classicModal.hide();
    this.det = { jine: '', bjine: '', tax: '', id: ''};
  }

  open(id) {
    this.classicModal.show();
    this.detid = id;
    console.log(this.detid = id);
  }
  // 计算不含税金额和税额
  caljine() {
    if (this.det['jine']) {
      this.det['bjine'] = (parseFloat(this.det['jine']) / parseFloat(String('1.13'))).toFixed(2);
      this.det['tax'] = (parseFloat(this.det['jine']) - parseFloat(this.det['bjine'])).toFixed(2);
    }
  }
  // 计算税额
  caltax(){
    if(this.det['jine'] == null || this.det['jine'] == ''){
      this.toast.pop('error', '请填写含税金额！！！', '');
    }else{
      this.det['tax'] = (parseFloat(this.det['jine']) - parseFloat(this.det['bjine'])).toFixed(2);
    }
    
  }
  // 充值det
  resetdet(){
    this.det['jine'] = '';
    this.det['bjine'] = '';
    this.det['tax'] = '';
    console.log(this.det);
  }

  // 修改明细金额
  update(){
    // if(this.det['jine'] == null || this.det['jine'] == ''){
    //   this.toast.pop('error', '请填写含税金额！！！', '');
    // }
    // else if(this.det['bjine'] == null || this.det['bjine'] == ''){
    //   this.toast.pop('error', '请填写不含税金额！！！', '');
    // }
    if(this.det['tax'] == null || this.det['tax'] == ''){
      this.toast.pop('error', '请填写税额！！！', '');
    }else{
      this.det['id'] = this.detid;
      this.caigouApi.updatedet(this.det).then(data => {
        this.toast.pop('success', '修改成功');
        this.querydata();
        this.coles();
      });
    }
    
  }
  //批量删除明细
  invoicedetids: any = [];
  deleteinvoiceDet(){
    this.invoicedetids = new Array();
    const invoicedetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < invoicedetlist.length; i++) {
      if (invoicedetlist[i].selected && invoicedetlist[i].data && invoicedetlist[i]['field'] !== 'group') {
        this.invoicedetids.push(invoicedetlist[i].data.id);
      }
    }
    if (!this.invoicedetids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.caigouApi.deleteinvoicedet(this.invoicedetids).then(data => {
        this.toast.pop('success', '删除成功！');
        this.querydata();
      });
    }
  }
  invoice: Object = { text: '', id: '' };
  openinvoiceno() {
    this.invoice = { text: '', id: '' };
    this.invoice['id'] = this.actroute.params['value']['id'];
    this.invoicenoModal.show();
  }
  modifyinvoiceno(){
    if (this.invoice['text'] === null) {
      this.toast.pop('error', '请填写发票号码！', '');
      return;
    }
    this.caigouApi.modifyInvoiceNo(this.invoice).then(data => {
      this.toast.pop('success', '发票号码修改成功');
      this.querydata();
    });
    this.invoicenoclose();
  }
  invoicenoclose(){
    this.invoicenoModal.hide();
  }
  beizhu: Object = { text: '', id: '' };
  openbeizhu(){
    this.beizhu = { text: '', id: '' };
    this.beizhu['id'] = this.actroute.params['value']['id'];
    this.beizhuModal.show();
  }
  modifybeizhu(){
    if (this.beizhu['text'] === null) {
      this.toast.pop('error', '请填写备注！', '');
      return;
    }
    this.caigouApi.modifyInvoiceBeizhu(this.beizhu).then(data => {
      this.toast.pop('success', '备注修改成功');
      this.querydata();
    });
    this.beizhuclose();
  }
  beizhuclose(){
    this.beizhuModal.hide();
  }

  caiwu = false;
  getMyRole() {
    let myrole = JSON.parse(localStorage.getItem('myrole'));
    for (let i = 0; i < myrole.length; i++) {
      if (myrole[i] === 5 || myrole[i] === 35) {
        this.caiwu = true;
      }
    }
  }

  datejson: Object = { invoicedate: '', id: '' };
  invoicedateclose(){
    this.invoiceDateModal.hide();
  }

  openinvoicedate() {
    this.datejson = { invoicedate: '', id: '' };
    this.datejson['id'] = this.actroute.params['value']['id'];
    this.invoiceDateModal.show();
  }

  selectinvoicedate(){}
  modifyinvoicedate(){
    if (this.invoicedate === null) {
      this.toast.pop('error', '请选择发票日期！', '');
      return;
    }else{
      this.datejson['invoicedate'] = this.datepipe.transform(this.invoicedate, 'y-MM-dd');
    }
    this.caigouApi.modifyInvoicedate(this.datejson).then(data => {
      this.toast.pop('success', '发票日期修改成功');
      this.querydata();
    });
    this.invoicedateclose();
  }
}
