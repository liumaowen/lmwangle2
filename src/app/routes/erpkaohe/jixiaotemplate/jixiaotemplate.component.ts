import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { StorageService } from 'app/dnn/service/storage.service';
import { min } from 'lodash';
import { ModalDirective } from 'ngx-bootstrap';
import { ErpkaoheService } from '../erpkaohe.service';

@Component({
  selector: 'app-jixiaotemplate',
  templateUrl: './jixiaotemplate.component.html',
  styleUrls: ['./jixiaotemplate.component.scss']
})
export class JixiaotemplateComponent implements OnInit {
  monthDate: any;
  querymonth = null;
  search: any = {};
  isshow: Boolean = false;
  gridOptions: GridOptions;
  @ViewChild('lirundialog') private lirundialog: ModalDirective;
  // 上传弹窗实例
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  // 数量绩效上传信息及格式
  uploadParam: any = { module: 'assessment', count: 1, sizemax: 1, extensions: ['xls', 'xlsx'] };
  // 设置上传的格式
  // '.xls, application/xls';
  accept = null;
  updatestart = null;
  constructor(public settings: SettingsService, private erpkaoheapi: ErpkaoheService, private storage: StorageService,
    private datepipe: DatePipe, private toast: ToasterService) {
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
      enableFilter: true,
      getContextMenuItems: this.settings.getContextMenuItems,
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '月份', headerClass: 'wis-ag-center', minWidth: 80, field: 'month' },
      { cellStyle: { 'text-align': 'center' }, headerName: '中心', headerClass: 'wis-ag-center', minWidth: 80, field: 'center' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构', headerClass: 'wis-ag-center', field: 'orgname', minWidth: 80,
        cellRenderer: function (params) {
          if (params.data) {
            return params.data.orgname;
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '岗位', headerClass: 'wis-ag-center', minWidth: 80, field: 'post' },
      { cellStyle: { 'text-align': 'center' }, headerName: '姓名', headerClass: 'wis-ag-center', minWidth: 80, field: 'name' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '五分评价', headerClass: 'wis-ag-center', field: 'jixiaoE',
        enableRowGroup: true, minWidth: 80, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '实发绩效', headerClass: 'wis-ag-center', field: 'shifajixiao',
        enableRowGroup: true, minWidth: 80, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '绩效工资', headerClass: 'wis-ag-center', field: 'jixiaosalary',
        enableRowGroup: true, minWidth: 80, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: 'A（数量绩效）', headerClass: 'wis-ag-center', field: 'jixiaoA',
        enableRowGroup: true, minWidth: 80, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '完成量-ERP', headerClass: 'wis-ag-center', field: 'finishcount',
        enableRowGroup: true, minWidth: 80, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: 'B(非业务绩效)', headerClass: 'wis-ag-center', field: 'jixiaoB',
        enableRowGroup: true, minWidth: 80, aggFunc: 'sum'
      },
      {
        cellClass: 'text-center', headerName: '利润考核', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-center', headerName: '当月利润合计', field: 'curryuelirunheji',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '当月利润考核 ', field: 'curryuelirunkaohe',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '毛利调整 ', field: 'maolitiaozheng',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: 'ERP无票费用 ', field: 'nopiaofee',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '调拨费 ', field: 'allotfee',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '销售运杂费 ', field: 'tuiguangfee',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '欠款利息1% ', field: 'qiankuanlixi',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '延期提货利息1% ', field: 'yanqilixi',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '超额定金返息1% ', field: 'dingjinfanxi',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '定金未足额收取利息1% ', field: 'dingjinshouxi',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '承兑贴息 ', field: 'chengduitiexi',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '考核利润合计 ', field: 'kaohelirunheji',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: 'C(利润绩效)', field: 'jixiaoC',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          }
        ]
      },

      {
        cellClass: 'text-center', headerName: '激励汇总', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-center', headerName: 'D（激励）', field: 'jixiaoD',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },

          {
            cellClass: 'text-center', headerName: '发票逾期 ', field: 'fapiaoyuqi',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '销量激励', field: 'salejili',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '项目销量目标完成激励', field: 'salejilifinish',
            minWidth: 120, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '材料终端客户激励', field: 'cailiaojili',
            minWidth: 100, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '特殊产品激励', field: 'specialjili',
            minWidth: 100, editable: false, valueFormatter: this.settings.valueFormatter2, enableRowGroup: true,
            aggFunc: 'sum'
          }
        ]
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: 'E(特殊)', headerClass: 'wis-ag-center', field: 'especial',
        enableRowGroup: true, minWidth: 80, aggFunc: 'sum'
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '推荐人才奖励', headerClass: 'wis-ag-center', field: 'tuijianjili',
      //   enableRowGroup: true, minWidth: 80, aggFunc: 'sum'
      // },
      // {
      //   cellClass: 'text-center', headerName: '烨辉激励 ', field: 'yehuijili',
      //   minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
      //   aggFunc: 'sum'
      // },
      // { cellStyle: { 'text-align': 'center' }, headerName: '出差餐费补贴', headerClass: 'wis-ag-center', minWidth: 80, field: 'canfeebutie' },
      // {
      //   cellClass: 'text-center', headerName: '淀川盛馀激励', field: 'dianchuanjili',
      //   minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
      //   aggFunc: 'sum'
      // }
    ];
  }

  ngOnInit() {
    const current = this.storage.getObject('cuser');
    if (current.admin || current.realname === '李娜') {
      this.isshow = true;
    }
  }

  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.erpkaoheapi.listjixiaotemplate(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }

  show() {
    this.lirundialog.show();
    this.search = {};
    this.querymonth = null;
    this.search['month'] = this.datepipe.transform(new Date(), 'y-MM');
  }
  close() {
    this.lirundialog.hide();
  }
  /**选择月份*/
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  select() {
    if (!this.search['month']) { this.toast.pop('warning', '请选择月份！'); return; }
    console.log(this.search);
    this.listDetail();
    this.close();
  }
  /**选择月份*/
  selectmonth1(value) {
    this.updatestart = this.datepipe.transform(value, 'y-MM-dd');
  }
  // 上传成功执行的回调方法
  uploads($event) {
    console.log($event);
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.erpkaoheapi.uploadjixiaotemplate(this.updatestart, addData).then(data => {
        this.search['month'] = this.updatestart;
        this.listDetail();
        this.toast.pop('success', '上传成功！');
      });
    }
    this.hideDialog();
  }

  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }
  showupload() {
    this.uploaderModel.show();
    this.updatestart = this.datepipe.transform(new Date(), 'y-MM') + '-01';
    this.monthDate = new Date();
  }
}
