import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { FeeapiService } from '../feeapi.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';

@Component({
  selector: 'app-shuiedikou',
  templateUrl: './shuiedikou.component.html',
  styleUrls: ['./shuiedikou.component.scss']
})
export class ShuiedikouComponent implements OnInit {

  start = new Date();

  startrefresh = new Date();
  startrefreshstr = '';

  maxDate = new Date();

  end: Date;
  requestparams = {
    start: this.datePipe.transform(this.start, 'y-MM-dd'),
    end: '',buyername:'',totalpriceandtax:'',
    totalpriceamount:'',suppliername:'',xiaofeidate:'',beizhudet:'',
    employeename:'',invoicenumber:'',billno:'',vdate:'',arrivalstation:'',departurestation:''
  };
  editparams = {
    isinvoice: false, subject2: '', subject3: '', subject4: '', id: null, vusername: '', isneedtaxpz: true,
    hxloantaxno: ''
  };
  gridOptions: GridOptions;

  paycustomers = [];
  orgs = [];
  cuser: any = {};
  customers: any = []; // 公司
  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private feeApi: FeeapiService,
    private toast: ToasterService,
    private customerApi: CustomerapiService,
    private orgApi: OrgApiService) {
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
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单据编号', field: 'billno', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '购买方公司名称', field: 'buyername', width: 100
      },//购买方公司
      {
        cellStyle: { 'text-align': 'center' }, headerName: '支付日期', field: 'vdate', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '开票时间', field: 'xiaofeidate', width: 100
      },//发车时间
      {
        cellStyle: { 'text-align': 'center' }, headerName: '发票号', field: 'invoicenumber', width: 100
      },//票号
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'feetype', width: 100
      },
      {
        cellStyle: { 'text-align': 'left' }, headerName: '明细', field: 'beizhudet', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '含税金额', field: 'totalpriceandtax', width: 90, aggFunc: 'sum',
        valueFormatter: this.settings.valueFormatter2
      },//发票上的金额
     
      {
        cellStyle: { 'text-align': 'center' }, headerName: '不含税金额', field: 'totalpriceamount', width: 90, aggFunc: 'sum',
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '内销抵扣税额', field: 'taxjineinner', width: 100, aggFunc: 'sum',
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '其他抵扣税额', field: 'taxjineother', width: 100, aggFunc: 'sum',
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '报销人', field: 'employeename', width: 70
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售方公司名称', field: 'suppliername', width: 100
      },//销售方公司（只有内销的才有）
      {
        cellStyle: { 'text-align': 'center' }, headerName: '出发地', field: 'departurestation', width: 100
      },//票号
      {
        cellStyle: { 'text-align': 'center' }, headerName: '目的地', field: 'arrivalstation', width: 100
      },
    ];
    this.getcustomers();
    this.getorgs();
  }

  ngOnInit() {
    this.listDetail();
  }

  delete(id) {
    console.log(id);
    this.feeApi.delete(id).then((response) => {
      this.listDetail();
    })
  }

  listDetail() {
    this.feeApi.shuiedikoudet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  /**获取公司 */
  getcustomers() {
    this.customers = [{ value: '', label: '全部' }];
    this.customerApi.findwiskind().then((response) => {
      response.forEach(element => {
        this.customers.push({
          value: element.name,
          label: element.name
        });
      });
    });
  }
  /**获取机构 */
  getorgs() {
    this.orgs = [{ value: '', label: '全部' }];
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          value: element.name,
          label: element.name
        });
      });
    });
  }
  openQueryDialog() {
    // this.selectNull();
    this.showclassicModal();
  }

  openRefreshDialog() {
    this.showrefreshmaycurModel();
  }

  selectNull() {
    this.requestparams = {
      start: this.datePipe.transform(this.start, 'y-MM-dd'),
      end: '', buyername:'',totalpriceandtax:'',
      totalpriceamount:'',suppliername:'',xiaofeidate:'',beizhudet:'',
      employeename:'',invoicenumber:'',billno:'',vdate:'',arrivalstation:'',departurestation:''
    };
    this.end = undefined;
    this.start = new Date();
    this.cuser = null;
  }

  selectNullRefresh() {
    this.startrefresh = new Date();
  }



  queryrefresh() {
    if (this.startrefresh) {
      this.startrefreshstr = this.datePipe.transform(this.startrefresh, 'yyyy-MM-dd');
      this.refreshmaycur(this.startrefreshstr);
    }
  }



  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('refreshmaycurModel') private refreshmaycurModel: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }
  showrefreshmaycurModel() {
    this.refreshmaycurModel.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  hiderefreshmaycurModel() {
    this.refreshmaycurModel.hide();
  }







  /**同步每刻报 */
  refreshmaycur(start) {
    this.feeApi.refreshsemaycur(start).then(data => {
      this.requestparams.start = start;
      this.requestparams.end = start;
      this.listDetail();
      this.toast.pop('success', '同步成功！');
    });
    this.hiderefreshmaycurModel();
  }
   // 查询
   query() {
    if (this.start) {
      this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.requestparams.end = '';
      }
      if (typeof (this.cuser) === 'string' || !this.cuser) {
        this.requestparams['cusername'] = '';
      } else if (typeof (this.cuser) === 'object') {
      }
      this.listDetail();
      this.hideclassicModal();
    } else {
      this.toast.pop('warning', '开始时间必填！');
    }
  }
}
