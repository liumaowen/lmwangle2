import {Component, OnInit, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService, ModalDirective} from 'ngx-bootstrap/modal';
import {GridOptions} from 'ag-grid/main';
import {SettingsService} from '../../../core/settings/settings.service';
import {DatePipe} from '@angular/common';
import {OrgApiService} from '../../../dnn/service/orgapi.service';
import {CustomerapiService} from '../../customer/customerapi.service';
import {ToasterService} from 'angular2-toaster';
import {ShoukuandetComponent} from './shoukuandet/shoukuandet.component';
import {ReceiptService} from './service/receipt.service';
import {StorageService} from '../../../dnn/service/storage.service';

@Component({
  selector: 'app-receiptreport',
  templateUrl: './receiptreport.component.html',
  styleUrls: ['./receiptreport.component.scss']
})
export class ReceiptreportComponent implements OnInit {

  receiptData = {
    customercode: '',
    sellerid: '',
    money: '',
    repaymentdate: '',
    comment: '',
    type: '2',
    beizhu: ''
  };
  start = new Date();
  maxDate = new Date();
  end: Date;
  requestparams = {
    start: this.datepipe.transform(this.start, 'y-MM-dd'),
    end: '',
    buyerid: '',
    sellerid: '',
    orgid: '',
    id: '',
    cuserid: '',
    vuserid: ''
  };
  gridOptions: GridOptions;
  shoukuanbsModalRef: BsModalRef;
  orgs = [];
  sellersResult = [];
  items = [{value: '', label: '全部'}, {value: 1, label: '线上'}, {value: 0, label: '线下'}];
  queryCompanys;
  cuser;
  vuser;
  createCompanys;
  repaymentDate = new Date();

  constructor(
    public settings: SettingsService,
    private datepipe: DatePipe,
    private orgApi: OrgApiService,
    private customerApi: CustomerapiService,
    private toast: ToasterService,
    private receiptApi: ReceiptService,
    private bsModalService: BsModalService,
    private storage: StorageService
  ) {
    this.gridOptions = {
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
      rowSelection: 'multiple',
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      {cellStyle: {'text-align': 'center'}, headerName: '选择', width: 50, checkboxSelection: true, suppressMenu: true},
      {
        cellStyle: {'text-align': 'center'}, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: function (params) {
          if (params.data) {
            return '<a target="_blank" href="#/receipt/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        },
      },
      {cellStyle: {'text-align': 'center'}, headerName: '类型', field: 'type', width: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '客户名称', field: 'paycustomername', width: 150},
      {
        cellStyle: {'text-align': 'right'}, headerName: '金额', field: 'money', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['money']) {
            return Number(params.data['money']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {cellStyle: {'text-align': 'center'}, headerName: '收款公司', field: 'receivecustomername', width: 150},
      {cellStyle: {'text-align': 'center'}, headerName: '制单人', field: 'cusername', width: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '创建时间', field: 'cdate', width: 150},
      {cellStyle: {'text-align': 'center'}, headerName: '审核人', field: 'vusername', width: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '审核时间', field: 'vdate', width: 150},
      {cellStyle: {'text-align': 'center'}, headerName: '审核状态', field: 'vstatus', width: 150},
      {cellStyle: {'text-align': 'center'}, headerName: '说明', field: 'comment', width: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '备注', field: 'beizhu', width: 100},
    ];
    this.listDetail();
  }

  ngOnInit() {
    this.orgApi.listAll(0).then((response) => {
      let orglist = [{value: '', label: '全部'}];
      response.forEach(element => {
        orglist.push({
          label: element.name,
          value: element.id
        });
      });
      this.orgs = orglist;
    });
    this.customerApi.findwiskind().then((response) => {
      let selllist = [{value: '', label: '全部'}];
      response.forEach(element => {
        selllist.push({
          label: element.name,
          value: element.id
        });
      });
      this.sellersResult = selllist;
    });
  }

  listDetail() {
    console.log('收据明细表查询条件');
    console.log(this.requestparams);
    this.receiptApi.receiptlist(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);
    });
  };

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = {
      start: this.datepipe.transform(this.start, 'y-MM-dd'),
      end: '',
      buyerid: '',
      sellerid: '',
      orgid: '',
      id: '',
      cuserid: '',
      vuserid: ''
    };
    this.queryCompanys = undefined;
    this.cuser = undefined;
    this.vuser = undefined;
  }

  // 查询
  query() {
    if (this.start) {
      this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end) {
      this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (typeof (this.cuser) === 'object') { // 制单人
      this.requestparams['cuserid'] = this.cuser['code'];
    }
    if (typeof (this.vuser) === 'object') { // 审核人
      this.requestparams['vuserid'] = this.vuser['code'];
    }
    if (typeof (this.queryCompanys) === 'object') {//买方单位选中的数据
      this.requestparams.buyerid = this.queryCompanys['code'];
    }
    if (!this.requestparams.start) {
      // Notify.alert("开始时间必填！", 'warning');
      this.toast.pop('warnig', '开始时间必填！');
    } else {
      this.listDetail();
      this.hideQueryModal();
    }

  };

  // 导出明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '收据明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  @ViewChild('queryModal') private queryModal: ModalDirective;

  showQueryModal() {
    this.queryModal.show();
  }

  hideQueryModal() {
    this.queryModal.hide();
  }

  @ViewChild('createModal') private createModal: ModalDirective;

  showCreateModal() {
    this.createModal.show();
  }

  hideCreateModal() {
    this.createModal.hide();
  }

  createReceipt() {
    console.log(this.receiptData);
    console.log(this.createCompanys);
    if (!this.createCompanys || !this.createCompanys['code']) {
      this.toast.pop('warning', '请输入客户名称');
      return '';
    } else {
      this.receiptData['customercode'] = this.createCompanys['code'];
    }
    if (!this.receiptData['sellerid']) {
      this.toast.pop('warning', '请选择收款单位');
      return '';
    }
    if (!this.receiptData['money']) {
      this.toast.pop('warning', '请输入收据金额');
      return '';
    }
    if (!this.repaymentDate) {
      this.toast.pop('warning', '请选择预计还款日');
      return '';
    } else {
      this.receiptData['repaymentdate'] = this.datepipe.transform(this.repaymentDate, 'yyyy-MM-dd');
    }
    if (!this.receiptData['comment']) {
      this.toast.pop('warning', '请输入说明');
      return '';
    }
    if (confirm('你确定开具未到款收据吗？')) {
      this.receiptApi.create(this.receiptData).then(() => {
        this.toast.pop('success', '未到款收据开具完成');
        this.listDetail();
      });
      this.hideCreateModal();
    }
  }

  /**
   * 打开收款单明细
   * @param e 是否到款
   */
  showShoukuandetDialog(e) {
    this.bsModalService.config.class = 'modal-all';
    const params = {isdaokuan: e, receiptid: [], paycustomername: ''};
    let paycustomer: string;
    if (!e) {
      let flag = false;
      let list = this.gridOptions.api.getModel()['rowsToDisplay'];
      list.forEach(element => {
        if (element.selected) {
          console.log(element.data);
          if (paycustomer && paycustomer !== element.data.paycustomername) {
            this.toast.pop('warning', '请选择同一公司的明细进行操作!');
            flag = true;
            return;
          } else {
            paycustomer = element.data.paycustomername;
          }
          if (element.data.type !== '未收款开收据') {
            this.toast.pop('warning', '请选择未到款开收据的明细进行操作!');
            flag = true;
            return;
          }
          params.receiptid.push(element.data.id);
        }
      });
      if (flag) {
        return;
      }
      if (params.receiptid.length === 0) {
        this.toast.pop('warning', '请选择明细后进行操作!');
        return;
      }
      params.paycustomername = paycustomer;
    }
    console.log(params);
    this.storage.remove('receiptparams');
    this.storage.setObject('receiptparams', params);
    this.shoukuanbsModalRef = this.bsModalService.show(ShoukuandetComponent);
    this.shoukuanbsModalRef.content.parentThis = this;
  }

  makePdf() {
    let list = this.gridOptions.api.getModel()['rowsToDisplay'];
    //返回值包含成功标识，失败原因，成功数据
    let data = [];
    list.forEach(element => {
      if (element.selected) {
        this.receiptApi.makePdf(element.data.id).then(data => {
          this.toast.pop('success', data.msg);
        });
        data.push(element.data.id);
      }
    });
    if (data.length === 0) {
      this.toast.pop('warnig', '请选择明细后进行操作');
      return '';
    }
  }

  printPdf() {
    let list = this.gridOptions.api.getModel()['rowsToDisplay'];
    //返回值包含成功标识，失败原因，成功数据
    let data = [];
    list.forEach(element => {
      if (element.selected) {
        data.push(element.data.id);
      }
    });
    if (data.length === 0 || data.length > 1) {
      this.toast.pop('warnig', '请选择一条明细进行打印预览!');
      return '';
    }
    this.receiptApi.printPdf(data[0]).then(data => {
      if (!data.flag) {
        this.toast.pop('warning', data.msg);
      } else {
        window.open(data.msg);
      }
    });
  }
}
