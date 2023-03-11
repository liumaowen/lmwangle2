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
  selector: 'app-baoxiaofeedethandan',
  templateUrl: './baoxiaofeedethandan.component.html',
  styleUrls: ['./baoxiaofeedethandan.component.scss']
})
export class BaoxiaofeedethandanComponent implements OnInit {

  start = new Date();

  startrefresh = new Date();
  startrefreshstr = '';

  maxDate = new Date();

  end: Date;

  requestparams = {
    start: this.datePipe.transform(this.start, 'y-MM-dd'),
    end: '', customername: '', cusername: '', orgname1: '', subject1: '', subject2: '', subject3: '', subject4: ''
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
        cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'month', width: 70,
        cellRenderer: (params) => {
          if (params.data) {
            return params.data.month;
          } else {
            return '合计';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '公司', field: 'customername', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '支付日期', field: 'vdate', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '部门1', field: 'orgname1', width: 70
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '部门2', field: 'orgname2', width: 70
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '一级科目', field: 'subject1', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '二级科目', field: 'subject2', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '三级科目', field: 'subject3', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '四级科目', field: 'subject4', width: 80
      },
      {
        cellStyle: { 'text-align': 'left' }, headerName: '明细', field: 'beizhudet', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '经手人', field: 'cusername', width: 70
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '审批人', field: 'vusername', width: 70
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '不含税金额', field: 'jine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '内销抵扣税额', field: 'taxjineinner', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['taxjineinner']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '其他抵扣税额', field: 'taxjineother', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['taxjineother']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '含税金额', field: 'xfjine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['xfjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '发票所属', field: 'isinvoice', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '付款方式', field: 'paytype', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '支付银行', field: 'paybank', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '付款账号', field: 'payaccount', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '付款公司', field: 'paycustomer', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'feetype', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单据编号', field: 'billno', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '生成考核凭证', field: 'ispz', width: 110
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '生成涉税凭证', field: 'istaxpz', width: 110
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否需要生成涉税凭证', field: 'isneedtaxpz', width: 110
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '核销借款公司', field: 'hxloancustomer', width: 110
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '核销借款金额', field: 'hxloanjine', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '企业应付金额', field: 'yfjine', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '借款公司税号', field: 'hxloantaxno', width: 110
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', width: 60,
        cellRenderer: data => {
          if (data.data) {
            return '<a target="_blank">修改</a>';
          } else {
            return '';
          }
        }, onCellClicked: (data) => {
          if (data.data) {
            this.showeditModal(data.data);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', width: 60,
        cellRenderer: data => {
          if (data.data) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        }, onCellClicked: (data) => {
          if (data.data) {
            this.delete(data.data.id);
          }
        }
      },
    ];
    this.getcustomers();
    this.getorgs();
  }

  ngOnInit() {
  }

  delete(id) {
    console.log(id);
    this.feeApi.delete(id).then((response) => {
      this.listDetail();
    })
  }

  listDetail() {
    this.feeApi.baoxiaofeedethandan(this.requestparams).then((response) => {
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
      end: '', customername: '', cusername: '', orgname1: '', subject1: '', subject2: '', subject3: '', subject4: ''
    };
    this.end = undefined;
    this.start = new Date();
    this.cuser = null;
  }

  selectNullRefresh() {
    this.startrefresh = new Date();
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
        this.requestparams.cusername = this.cuser['name'];
      }
      this.listDetail();
      this.hideclassicModal();
    } else {
      this.toast.pop('warning', '开始时间必填！');
    }
  }

  queryrefresh() {
    if (this.startrefresh) {
      this.startrefreshstr = this.datePipe.transform(this.startrefresh, 'yyyy-MM-dd');
      this.refreshmaycur(this.startrefreshstr);
    }
  }

  // 导出明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '报销费用明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
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

  // 上传弹窗实例
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  // 上传弹窗实例
  @ViewChild('financeFeetModal') private financeFeetModal: ModalDirective;

  // 每刻报上传信息及格式
  uploadParam: any = { module: 'maycur', count: 1, sizemax: 1, extensions: ['xls'] };

  // 设置上传的格式
  accept = '.xls, application/xls';
  uploadbaoxiaofee() {
    this.uploaderModel.show();
  }
  // 上传成功执行的回调方法
  uploads($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.feeApi.uploadbaoxiaofeedet(addData).then(data => {
        this.query();
        this.toast.pop('success', '上传成功！');
      });
    }
    this.hideDialog();
  }
  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }

  // 每刻报上传信息及格式
  uploadFinanceFeeParam: any = { module: 'financefee', count: 1, sizemax: 1, extensions: ['xls'] };

  // 设置上传的格式
  financefeeaccept = '.xls, application/xls';
  uploadfinancefee() {
    this.financeFeetModal.show();
  }
  // 上传成功执行的回调方法
  financefeeuploads($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.feeApi.uploadfinancefeedet(addData).then(data => {
        this.query();
        this.toast.pop('success', '上传成功！');
      });
    }
    this.hidefinancefeeDialog();
  }
  // 关闭上传弹窗
  hidefinancefeeDialog() {
    this.financeFeetModal.hide();
  }



  /**下载模板 */
  downExcel() {
    this.feeApi.downloadExcel().then(data => {
      window.open(data['url']);
      this.toast.pop('success', '下载成功！');
    });
  }
  /**同步每刻报 */
  refreshmaycur(start) {
    this.feeApi.refreshmaycur(start).then(data => {
      this.requestparams.start = start;
      this.requestparams.end = start;
      this.listDetail();
      this.toast.pop('success', '同步成功！');
    });
    this.hiderefreshmaycurModel();
  }
  // 修改弹窗
  @ViewChild('editModal') private editModal: ModalDirective;
  showeditModal(params) {
    const data = JSON.parse(JSON.stringify(params));
    this.editparams.subject2 = data.subject2;
    this.editparams.subject3 = data.subject3;
    this.editparams.subject4 = data.subject4;
    this.editparams.vusername = data.vusername;
    if (data.isinvoice === '是') {
      this.editparams.isinvoice = true;
    } else {
      this.editparams.isinvoice = false;
    }
    if (data.isneedtaxpz === '是') {
      this.editparams.isneedtaxpz = true;
    } else {
      this.editparams.isneedtaxpz = false;
    }
    this.editparams.id = data.id;
    this.editModal.show();
  }
  hideeditModal() {
    this.editModal.hide();
  }
  save() {
    this.feeApi.editbaoxiao(this.editparams).then(data => {
      this.toast.pop('success', '修改成功！');
      this.hideeditModal();
      this.listDetail();
    });
  }
}
