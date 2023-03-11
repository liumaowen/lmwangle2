import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {GridOptions} from 'ag-grid/main';
import {DatePipe} from '@angular/common';
import {ToasterService} from 'angular2-toaster';
import {SettingsService} from '../../../../core/settings/settings.service';
import {OrgApiService} from '../../../../dnn/service/orgapi.service';
import {CustomerapiService} from '../../../customer/customerapi.service';
import {BsModalRef} from 'ngx-bootstrap';
import {StorageService} from '../../../../dnn/service/storage.service';
import {ReceiptService} from '../service/receipt.service';

@Component({
  selector: 'app-shoukuandet',
  templateUrl: './shoukuandet.component.html',
  styleUrls: ['./shoukuandet.component.scss']
})
export class ShoukuandetComponent implements OnInit {

  buttonname: string;

  receiptData = {
    customercode: '',
    sellerid: '',
    money: '',
    repaymentdate: '',
    comment: '',
    // 已到款开收据
    type: '1',
    beizhu: '',
    shoukuanids: []
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
    vuserid: '',
    receiptstatus: ''
  };

  gridOptions: GridOptions;
  isdaokuan: boolean;
  receiptids = [];
  orgs = [];
  sellersResult = [];
  items1 = [{value: '', label: '全部'}, {value: 1, label: '线上'}, {value: 0, label: '线下'}];
  items2 = [{value: '', label: '全部'}, {value: 0, label: '未开收据'}, {value: 1, label: '金额未全开收据'}];
  companys;
  cuser;
  vuser;
  paycustomername;

  constructor(
    public settings: SettingsService,
    private datepipe: DatePipe,
    private orgApi: OrgApiService,
    private customerApi: CustomerapiService,
    private toast: ToasterService,
    public bsModalRef: BsModalRef,
    private storage: StorageService,
    private receiptApi: ReceiptService
  ) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      suppressRowClickSelection: true,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      enableFilter: true,
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      {cellStyle: {'text-align': 'center'}, headerName: '选择', width: 50, checkboxSelection: true, suppressMenu: true},
      {
        cellStyle: {'text-align': 'center'}, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: function (params) {
          if (params.data) {
            return '<a target="_blank" href="#/receive/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        },
      },
      {cellStyle: {'text-align': 'center'}, headerName: '状态', field: 'shoukuanstatus', width: 70},
      {cellStyle: {'text-align': 'center'}, headerName: '收款时间', field: 'actualdate', width: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '收款机构', field: 'orgname', width: 90},
      {cellStyle: {'text-align': 'center'}, headerName: '业务员', field: 'salemanname', width: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '业务员机构', field: 'salemanorgname', width: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '客户名称', field: 'paycustomer', width: 160},
      {cellStyle: {'text-align': 'center'}, headerName: '收款银行', field: 'shoukuanbankname', width: 120},
      {
        cellStyle: {'text-align': 'right'}, headerName: '金额', field: 'jine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {cellStyle: {'text-align': 'center'}, headerName: '审核人', field: 'vusername', width: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '审核时间', field: 'vdate', width: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '收款公司', field: 'receivecustomer', width: 160},
      {cellStyle: {'text-align': 'center'}, headerName: '收款账号', field: 'shoukuanaccount', width: 120},
      {cellStyle: {'text-align': 'center'}, headerName: '收款类型', field: 'shoukuantype', width: 90},
      {cellStyle: {'text-align': 'center'}, headerName: '制单人', field: 'cusername', width: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '备注', field: 'beizhu', width: 90}
    ];
  }

  ngOnInit() {
    const params = this.storage.getObject('receiptparams');
    console.log(params);
    this.isdaokuan = params['isdaokuan'];
    if (this.isdaokuan) {
      this.buttonname = '开具收据';
    } else {
      this.buttonname = '还单';
      this.receiptids = params['receiptid'];
      this.paycustomername = params['paycustomername'];
      console.log(this.receiptids);
    }
    this.storage.remove('receiptparams');
  }

  listDetail() {
    console.log(this.requestparams);
    this.receiptApi.shoukuandet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);
    });
  };

  openQueryDialog() {
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
    this.showclassicModal();
  }

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
      vuserid: '',
      receiptstatus: ''
    };
    this.companys = undefined;
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
    if (typeof (this.companys) === 'object') {//买方单位选中的数据
      this.requestparams.buyerid = this.companys['code'];
    }
    if (!this.requestparams.start) {
      // Notify.alert("开始时间必填！", 'warning');
      this.toast.pop('warnig', '开始时间必填！');
    } else {
      this.listDetail();
      this.hideclassicModal();
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
      fileName: '收款明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  /**
   * 开具收据或者还单
   */
  createOrRepayment() {
    if (this.isdaokuan) {
      this.createReceipt();
    } else {
      this.repayment();
    }
  }

  /**
   * 已到款开收据
   * @private
   */
  private createReceipt() {
    const result = this.getSelectedRows();
    if (!result.flag) {
      this.toast.pop('warnig', result.message);
      return;
    }
    console.log(result.data);
    this.receiptData.shoukuanids = result.data;
    this.receiptApi.create(this.receiptData).then((response) => {
      console.log(response);
    });
  }

  /**
   * 还单
   * @private
   */
  private repayment() {
    const result = this.getSelectedRows();
    console.log(result);
    console.log(this.receiptids);
    let repaymentParams = {receiptids: this.receiptids, shoukuanids: result.data};
    this.receiptApi.repayment(repaymentParams).then((response) => {
      console.log(response);
      if (response['flag']) {
        this.toast.pop('success', '还单成功！');
      } else {
        this.toast.pop('warnig', response['msg']);
      }
    });
  }

  private getSelectedRows() {
    let paycustomer: string;
    let list = this.gridOptions.api.getModel()['rowsToDisplay'];
    //返回值包含成功标识，失败原因，成功数据
    let result = {flag: true, message: '', data: []};
    list.forEach(element => {
      if (element.selected) {
        console.log(element.data.paycustomer);
        // 如果公司名与上一次不一致，返回错误信息
        if (paycustomer && paycustomer !== element.data.paycustomer) {
          result.flag = false;
          result.message = '请选择同一公司的明细进行操作!';
          return result;
        }
        result.data.push(element.data.billid);
      }
    });
    if (result.data.length === 0) {
      result.flag = false;
      result.message = '请选择明细后进行操作!';
    }
    return result;
  }

}
