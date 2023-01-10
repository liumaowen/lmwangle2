import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderapiService } from './../../order/orderapi.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportorderComponent } from '../importorder/importorder.component';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
const sweetalert = require('sweetalert');
@Component({
  selector: 'app-advanceinvoicedetail',
  templateUrl: './advanceinvoicedetail.component.html',
  styleUrls: ['./advanceinvoicedetail.component.scss']
})
export class AdvanceinvoicedetailComponent implements OnInit {
  @ViewChild('modifyModal') private modifyModal: ModalDirective;
  @ViewChild('addrModal') private addrModal: ModalDirective;
  //上传合同
  @ViewChild('orderModal') private orderModal: ModalDirective;
  @ViewChild('fujianModal') private fujianModal: ModalDirective;
  @ViewChild('picdialog') private picdialog: ModalDirective;
  orderurls: any = [];
  // 引入合同弹窗对象
  kcbsModalRef: BsModalRef;
  // 获取订单
  salebill: any = {};
  // 发票信息, {no:发票号码, date:开票日期}
  invoice = {};

  flag = {};

  express = {};

  expresses = [];

  params: any = {};

  pid;

  gnlist;

  start;

  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');

  gridOptions: GridOptions;
  editbill: any = {};
  addrs: any = [];
  addr = {};
  provinces = [];
  citys = [];
  countys = [];
  minDate = new Date();
  finishdate: Date;
  invoicedate: Date;
  issspztext: any;
  constructor(public settings: SettingsService,
    private storage: StorageService,
    private orderApi: OrderapiService,
    private classifyApi: ClassifyApiService,
    private toast: ToasterService,
    private router: Router,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private qihuoapi: QihuoService,
    private bsModal: BsModalService) {

    this.salebill = { buyer: {}, seller: {}, cuser: {}, vuser: {}, checkuser: {} };

    this.gridOptions = {
      rowSelection: 'multiple', // 多选单选控制
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
      enableFilter: true,
      // rowSelection: 'multiple',
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: () => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', cellRenderer: 'group', minWidth: 90, checkboxSelection: true,headerCheckboxSelection: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售合同号', field: 'orderbillno', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data) {
            if (null != params.data.orderbillno && params.data.orderbillno.substring(0, 2) === 'QH') {// 期货
              return '<a target="_blank" href="#/qihuo/' + params.data.orderid + '">' + params.data.orderbillno + '</a>';
            }
            if (null != params.data.orderbillno && params.data.orderbillno.substring(0, 2) === 'BO') {// 现货
              return '<a target="_blank" href="#/businessorder/' + params.data.orderid + '">' + params.data.orderbillno + '</a>';
            }
            return params.data.orderbillno;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '开票品名', field: 'invoicegn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 130 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '含税单价', field: 'price', minWidth: 100,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '含税金额', field: 'jine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['issspz']) {
            this.issspztext = '撤销申请单后请删除已经生成的凭证';
          }
          if (params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '其他单位', field: 'unitname', minWidth: 110,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '其他单位重量', field: 'unitweight', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['unitweight']) {
            return Number(params.data['unitweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '其他单位含税单价', field: 'unitprice', minWidth: 110,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '其他单位含税金额', field: 'unitjine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['unitweight']) {
            return Number(params.data['unitweight'] * params.data['unitprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'taxrate', width: 80,
        cellRenderer: data => {
          if (this.salebill['status'] === 1 && data.data) {
            return '<a target="_blank">修改</a>';
          } else {
            return '';
          }
        }, onCellClicked: (data) => {
          if (this.salebill['status'] === 1 && data.data) {
            this.modify(data.data);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'taxrate', width: 80,
        cellRenderer: data => {
          if (this.salebill['status'] === 1 && data.data) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        }, onCellClicked: (data) => {
          if (this.salebill['status'] === 1 && data.data) {
            this.deletedet(data.data);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'taxrate', width: 80,
        cellRenderer: data => {
          if (this.salebill['status'] === 3 && data.data && !data.data.iscancel) {
            return '<a target="_blank">修改合同</a>';
          } else {
            return '';
          }
        }, onCellClicked: (data) => {
          if (this.salebill['status'] === 3 && data.data && !data.data.iscancel) {
            this.cancelDet(data.data.id);
          }
        }
      }

    ];
  }

  gnid;
  ngOnInit() {
    this.getDetail();
    this.getMyRole();
  }
  // 为明细表数据赋值
  getDetail() {
    this.orderApi.getoneadvance(this.route.params['value']['id']).then((response) => {
      this.salebill = response['advanceInvoice'];
      this.salebill['orgname'] = this.salebill['org']['name'];
      this.orderurls = response['orderurls'];
      this.gridOptions.api.setRowData(response['advanceInvoiceDetList']);
    });
  }

  // 弹出对话框
  addexpress(status) {
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

  // 提交
  submit() {
    if (confirm('你确认发票已经邮寄，提交快递信息吗？')) {
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

  // 修改明细
  modify(data) {
    this.params = {};
    this.params = JSON.parse(JSON.stringify(data));
    this.classifyApi.getsalebill({ pid: this.params['goodscode']['gn'] }).then((gns) => {
      this.gnlist = [{ label: '请选择开票品名', value: '' }];
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
    if (!this.params['invoicegn']) {
      this.toast.pop('warning', '请选择开票品名后再提交！');
      return;
    }
    if (!this.params['price']) {
      this.toast.pop('warning', '请输入含税单价后再提交！');
      return;
    }
    if (!this.params['weight']) {
      this.toast.pop('warning', '请输入重量后再提交！');
      return;
    }
    const submitobj = {
      detid: this.params.id, invoicegn: this.params['invoicegn'],
      weight: this.params['weight'], price: this.params['price'],
      jine : this.params['jine'],
      unitweight: this.params['unitweight']
    };
    if (confirm('你确定修改该明细吗？')) {
      this.orderApi.modifyadvancedet(submitobj).then((data) => {
        this.getDetail();
        this.toast.pop('success', '修改成功！');
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
        this.salebill = data;
        this.toast.pop('success', '发票已弃审，请重新审核！');
      });
    }
  }

  // 打开编辑发票号码窗口
  openInvoiceNoDialog() {
    this.resetInvoice();
    this.showinvoiceModal();
  }

  // 保存发票号码
  saveInvoiceNo() {
    const reg = new RegExp(/^\d{8}([，,]\d{8})*$/);
    if (this.invoice['no'] && reg.test(this.invoice['no']) && this.start) {
      this.invoice['id'] = this.salebill['id'];
      this.invoice['no'] = this.invoice['no'].replace('，', ',');
      this.invoice['date'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.orderApi.setInvoiceNo(this.invoice).then(() => {
        this.getDetail();
        this.hideinvoiceModal();
        this.toast.pop('success', '发票号码保存成功！');
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
      if (!response['flag']) {
        this.toast.pop('warning', response['msg']);
      } else {
        window.open(response['msg']);
      }
    });
  }
  tijiao() {
    if (this.salebill['status'] !== 1) {
      this.toast.pop('warning', '只有制单中才能提交！');
      return;
    }
    this.orderApi.submitreviewadvance(this.route.params['value']['id']).then((response) => {
      this.toast.pop('success', '提交成功！');
      this.getDetail();
    });
  }
  /**引入合同弹窗 */
  importordermodal() {
    if (this.salebill['status'] !== 1) {
      this.toast.pop('warning', '只有制单中才能引入！');
      return;
    }
    this.bsModal.config.class = 'modal-all';
    this.kcbsModalRef = this.bsModal.show(ImportorderComponent);
    // 引入合同明细
    this.kcbsModalRef.content.importtype = 1;
    this.kcbsModalRef.content.componentparent = this;
  }
  hideimportmodal() {
    this.kcbsModalRef.hide();
    this.getDetail();
  }
  /**删除开票单 */
  delete() {
    if (this.salebill['status'] !== 1) {
      this.toast.pop('warning', '只有制单中才能删除！');
      return;
    }
    sweetalert({
      title: '你确定删除开票单吗？',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.orderApi.deletebill(this.route.params['value']['id']).then((response) => {
        sweetalert.close();
        this.toast.pop('success', '删除成功！');
        this.router.navigate(['advanceinvoice']);
      });
    });
  }
  /**撤销开票单 */
  cancel() {
    if (this.salebill['status'] !== 3) {
      this.toast.pop('warning', '只有已审核才能撤销！');
      return;
    }
    sweetalert({
      title: '你确定撤销吗？',
      text: this.issspztext,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.orderApi.cancelbill(this.route.params['value']['id']).then((response) => {
        sweetalert.close();
        this.toast.pop('success', '撤销成功！');
        this.getDetail();
      });
    });
  }
  /**修改主表 */
  edit() {
    if (this.salebill['status'] === 2) {
      this.toast.pop('warning', '审核中的单据无法修改！');
      return;
    }
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
    this.editbill = {};
    this.findAddr(this.salebill['buyerid']);
    this.editbill = JSON.parse(JSON.stringify(this.salebill));
    this.invoicedate = this.editbill['invoicedate'] ? new Date(this.editbill['invoicedate']) : new Date();
    console.log(this.invoicedate);
    this.modifyModal.show();
  }
  submitmod() {
    if (!this.editbill['express']) {
      this.toast.pop('warning', '请选择快递公司！');
      return;
    }
    if (!this.editbill['maddressid'] && this.editbill['express'] !== '自领发票') {
      this.toast.pop('warning', '请选择邮寄地址！');
      return;
    }
    if (!this.editbill['reason']) {
      this.toast.pop('warning', '请填写开票原因！');
      return;
    }
    if (confirm('你确定修改主表信息吗？')) {
      this.editbill['finishdate'] = this.datepipe.transform(this.finishdate, 'y-MM-dd');
      this.editbill['invoicedate'] = this.datepipe.transform(this.invoicedate, 'y-MM-dd');
      this.orderApi.modifyadvance(this.editbill).then((data) => {
        this.getDetail();
        this.hidemodifyModal();
        this.toast.pop('success', '修改成功！');
      });
    }
  }
  hidemodifyModal() {
    this.modifyModal.hide();
  }
  // 获取选择公司的送货地址
  findAddr(customerid) {
    if (customerid) {
      const search = { buyerid: customerid, ismailaddr: true };
      const arry = [{ label: '取消', value: '' }];
      this.orderApi.listAddresses(search).then((data) => {
        for (let i = 0; i < data.length; i++) {
          const address = {
            value: data[i].id, label: data[i].province + data[i].city + data[i].county
              + data[i].detail
          };
          arry.push(address);
        }
        this.addrs = arry;
      });
    }
  }
  // 弹出添加地址的对话框
  addAddrDialog() {
    if (!this.editbill['buyerid']) {
      this.toast.pop('warning', '请先选择买方公司！！！');
      return;
    }
    this.addr = {};
    this.provinces = [];
    this.citys = [];
    this.countys = [];
    this.showaddrModal();
    this.getProvince();
  }
  showaddrModal() {
    this.addrModal.show();
  }
  hideaddrModal() {
    this.addrModal.hide();
  }
  getProvince() {
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys = [];
      this.countys = [];
    });
  }
  getcity() {
    this.citys = [];
    this.classifyApi.getChildrenTree({ pid: this.addr['provinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }
  getcounty() {
    this.countys = [];
    this.classifyApi.getChildrenTree({ pid: this.addr['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  // 开始往数据库中添加内容
  addAddr() {
    if (!this.addr['provinceid']) {
      this.toast.pop('warning', '请选择省份！');
      return;
    }
    if (!this.addr['cityid']) {
      this.toast.pop('warning', '请选择城市！');
      return;
    }
    if (!this.addr['countyid']) {
      this.toast.pop('warning', '请选择县区！');
      return;
    }
    if (!this.addr['detail']) {
      this.toast.pop('warning', '请填写详细地址！');
      return;
    }
    if (!this.addr['lianxiren']) {
      this.toast.pop('warning', '请填写联系人！');
      return;
    }
    if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.addr['phone'])) {
      this.toast.pop('warning', '请填写正确联系电话！');
      return;
    }
    this.addr['customerid'] = this.params['buyerid'];
    this.addr['ismailaddr'] = true;
    this.orderApi.addAddr(this.addr).then((data) => {
      this.hideaddrModal();
      this.findAddr(this.params['buyerid']);
    });
  }
  /**删除明细 */
  deletedet(data) {
    sweetalert({
      title: '你确定删除明细吗？',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.orderApi.deletedet(data['id']).then((data1) => {
        sweetalert.close();
        this.getDetail();
        this.toast.pop('success', '删除成功！');
      });
    });
  }

  //上传合同
  uploadParam = {
    module: 'advanceinvoice', count: 5, sizemax: 10, ismulti:true,
    extensions: ['tiff', 'pdf', 'jpeg', 'jpg', 'png', 'bmp', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp', 'avif']
  };

  //设置上传文件类型
  accept = '.jpeg, image/jpeg, application/pdf, image/tiff, image/jpg, image/png, .bmp, .tif, .gif, .pcx, .tga, .exif, .fpx, .svg, .psd, .cdr, .pcd, .dxf, .ufo, .eps, .ai, .raw, .WMF, .webp, .avif';

  //点击上传执行的回调函数
  uploads($event) {
    let addData = {
      extensions: this.uploadParam.extensions,
      id: this.salebill['id']
    };
    if (Array.isArray($event)) {
      addData['url'] = $event;
    } else {
      addData['url'] = [$event.url];
    }
    if ($event.length !== 0) {
      this.orderApi.uploadOrder(addData).then(data => {
        this.getDetail();
      });
    }
    this.closeUploadOrder();
  }

  //关闭上传弹窗
  closeUploadOrder() {
    this.orderModal.hide();
  }

  //打开上传弹窗
  showUploadOrder() {
    if (this.salebill['status'] !== 1) {
      this.toast.pop('warning', '只有制单中的申请单才可以上传双方盖章合同！！！');
      return;
    }
    this.orderModal.show();
  }

  /**明细作废弹窗 */
  cancelDet(detid) {
    if (this.salebill['status'] !== 3) {
      this.toast.pop('warning', '只有审核完成的才能修改！');
      return;
    }
    this.bsModal.config.class = 'modal-all';
    this.kcbsModalRef = this.bsModal.show(ImportorderComponent);
    this.kcbsModalRef.content.componentparent = this;
    // 修改合同明细
    this.kcbsModalRef.content.importtype = 2;
    this.kcbsModalRef.content.advanceInvoiceDetId = detid;
  }

  // 通过单价获取金额
  getjine() {
    if (!this.params['weight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    if (!this.params['price']) {
      this.toast.pop('warning', '请填写单价');
      return '';
    }
    this.params['jine'] = Math.round(this.params['weight'].mul(this.params['price']) * 100) / 100;
  }

  // 通过金额获取单价
  getprice() {
    if (!this.params['weight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    if (!this.params['jine']) {
      this.toast.pop('warning', '请填写金额');
      return '';
    }
    this.params['price'] = Math.round(this.params['jine'].div(this.params['weight']) * 100) / 100;
  }
  //批量删除明细
/*   detids: any = [];
  deletedetList(){
    this.detids = new Array();
    const detlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < detlist.length; i++) {
      if (detlist[i].selected && detlist[i].data && detlist[i].data['id']) {
        this.detids.push(detlist[i].data.id);
      }
    }
    if (!this.detids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.orderApi.deleteDetList(this.detids).then(data => {
        this.toast.pop('success', '删除成功！');
        this.getDetail();
      });
    }
  } */
  /**附件弹窗 */
  showfujianmodal() {
    this.fujianModal.show();
  }
  closefujian() {
    this.fujianModal.hide();
  }
  delfujian(key) {
    if (this.salebill['status'] !== 1) {
      this.toast.pop('warning', '只有制单中才能删除！');
      return;
    }
    const params = {id: this.salebill['id'], key: key};
    this.orderApi.delfujian(params).then(data => {
      this.getDetail();
    });
  }

  @ViewChild('fujianModal2') private fujianModal2: ModalDirective;
  @ViewChild('fujianModal3') private fujianModal3: ModalDirective;

  billnos: any = [];

  showfujianmodal3(){
    this.orderApi.findBillnos(this.salebill['id']).then(data => {
      this.billnos = data['billnos'];
    })
    this.fujianModal2.show();
  }
  closefujian2(){
    this.fujianModal2.hide();
  }
  closefujian3(){
    this.fujianModal3.hide();
  }
  showfujianmodal2(qihuoid) {
    this.getfujians(qihuoid);
    this.fujianModal3.show();
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
  caiwu = false;
  getMyRole() {
    let myrole = JSON.parse(localStorage.getItem('myrole'));
    for (let i = 0; i < myrole.length; i++) {
      if ((myrole[i] === 5 || myrole[i] === 19 || myrole[i] === 37 || myrole[i] === 44 || myrole[i] === 35) && !(myrole[i] === 41 || myrole[i] === 42)) {
        this.caiwu = true;
      }
    }
  }
  //合同上传信息及格式
uploadParam2: any = { module: 'ruku', count: 1, sizemax: 5, extensions: ['doc', 'pdf', 'jpeg', 'png', 'jpg'] };
// 设置上传的格式
accept2 = null;// ".xls, application/xls";
  fpsubmit() {
    this.picdialog.show();
  }
  hidepicDialog() {
    this.picdialog.hide();
  }
  fpreceipt() {
    if (this.salebill['url'] == null) {
      this.toast.pop('warning', '文件不存在！');
    } else {
      window.open(this.salebill['url']);
    }
  }
  // 上传成功执行的回调方法
  pictract($event) {
    console.log($event);
    if ($event.length !== 0) {
        this.uploadfp2($event.url);
    }
    this.hidepicDialog();
  }
  uploadfp2(url) {
    const params = {id: (this.salebill['id']), url: url};
    this.orderApi.uploadfp3(params).then(data => {
    });
  }
}
