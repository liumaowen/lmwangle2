import { DatePipe } from '@angular/common';
import { SettingsService } from './../../../core/settings/settings.service';
import { ColDef, GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../report.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-chandimaoli',
  templateUrl: './chandimaoli.component.html',
  styleUrls: ['./chandimaoli.component.scss']
})
export class ChandimaoliComponent implements OnInit {
  // 上传弹窗实例
  @ViewChild('uploaderModel') private uploaderModel: ModalDirective;
  // 查询弹窗实例
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 设置上传的格式
  accept = '.xls, application/xls';
  // 入库单上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 1, extensions: ['xls'] };
  gridOptions: GridOptions;
  exportdatename = '';
  lastyear = '';
  year = '';
  lastmonthstr = '';
  lastmonthMap = {lastmonthstr1: '累计扣息后毛利', lastmonthstr2: '累计销量', lastmonthstr3: '累计结账毛利',
   lastmonthstr4: '累计库存利息', lastmonthstr5: '累计预付利息'};
  query: any = {}; // 查询条件
  private gridApi;
  constructor(
    public settings: SettingsService,
    private reportService: ReportService,
    private toast: ToasterService,
    private datepipe: DatePipe) {
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
      animateRows: true,
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90,
        cellRenderer: (params) => {
          if (params.data) {
            return params.data['gn'];
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售量', field: 'allsaleweigh', width: 90,
        valueGetter: (params) => {
          if (params.data && params.data['allsaleweigh']) {
            return Number(params.data['allsaleweigh']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '结账表账面毛利', field: 'allmaolijine', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['allmaolijine']) {
          return Number(params.data['allmaolijine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '冲减20年底预提返利（不含税）', field: 'alllastyearfanli', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['alllastyearfanli']) {
          return Number(params.data['alllastyearfanli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '毛利（扣除费用、承兑贴息及上年返利）', field: 'allmaoli', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['allmaoli']) {
          return Number(params.data['allmaoli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '21年应返未返返利（不含税）', field: 'allyearfanli', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['allyearfanli']) {
          return Number(params.data['allyearfanli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '毛利合计', field: 'allmaoliheji', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['allmaoliheji']) {
          return Number(params.data['allmaoliheji']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '吨利', field: 'alldunli', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['alldunli']) {
          return Number(params.data['alldunli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计库存占用利息', field: 'allsumkucunlixi', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['allsumkucunlixi']) {
          return Number(params.data['allsumkucunlixi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计预付账款利息', field: 'allsumyufulixi', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['allsumyufulixi']) {
          return Number(params.data['allsumyufulixi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '扣息后毛利', field: 'allkouximaoli', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['allkouximaoli']) {
          return Number(params.data['allkouximaoli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '扣息后吨利', field: 'allkouxidunli', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['allkouxidunli']) {
          return Number(params.data['allkouxidunli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '2020年同期', field: 'tongqi', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['tongqi']) {
          return Number(params.data['tongqi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '2020年度', field: 'niandu', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['niandu']) {
          return Number(params.data['niandu']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月销量', field: 'msaleweight', width: 90,
      valueGetter: (params) => {
        if (params.data && params.data['msaleweight']) {
          return Number(params.data['msaleweight']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月结账毛利', field: 'mmaolijine', width: 110,
      valueGetter: (params) => {
        if (params.data && params.data['mmaolijine']) {
          return Number(params.data['mmaolijine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月未返返利', field: 'myearfanli', width: 110,
      valueGetter: (params) => {
        if (params.data && params.data['myearfanli']) {
          return Number(params.data['myearfanli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月库存利息', field: 'msumkucunlixi', width: 110,
      valueGetter: (params) => {
        if (params.data && params.data['msumkucunlixi']) {
          return Number(params.data['msumkucunlixi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月预付利息', field: 'msumyufulixi', width: 110,
      valueGetter: (params) => {
        if (params.data && params.data['msumyufulixi']) {
          return Number(params.data['msumyufulixi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月扣息后毛利', field: 'mkouximaoli', width: 110,
      valueGetter: (params) => {
        if (params.data && params.data['mkouximaoli']) {
          return Number(params.data['mkouximaoli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月扣息后吨利', field: 'mkouxidunmaoli', width: 110,
      valueGetter: (params) => {
        if (params.data && params.data['mkouxidunmaoli']) {
          return Number(params.data['mkouxidunmaoli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计扣息后毛利', field: 'ydkouximaoli', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['ydkouximaoli']) {
          return Number(params.data['ydkouximaoli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2, colId: 'lastmonthstr1' },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计销量', field: 'ydsaleweight', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['ydsaleweight']) {
          return Number(params.data['ydsaleweight']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3, colId: 'lastmonthstr2' },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计吨库存利息', field: 'dunkucunlixi', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['dunkucunlixi']) {
          return Number(params.data['dunkucunlixi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计吨预付利息', field: 'dunyufulixi', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['dunyufulixi']) {
          return Number(params.data['dunyufulixi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计结账毛利', field: 'ydmaolijine', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['ydmaolijine']) {
          return Number(params.data['ydmaolijine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2, colId: 'lastmonthstr3' },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月冲减20年底预提返利（不含税）', field: 'ydlastyearfanli', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['ydlastyearfanli']) {
          return Number(params.data['ydlastyearfanli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计库存利息', field: 'ydsumkucunlixi', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['ydsumkucunlixi']) {
          return Number(params.data['ydsumkucunlixi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2, colId: 'lastmonthstr4' },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计预付利息', field: 'ydsumyufulixi', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['ydsumyufulixi']) {
          return Number(params.data['ydsumyufulixi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2, colId: 'lastmonthstr5' },
      { cellStyle: { 'text-align': 'center' }, headerName: '上月底2021未返', field: 'ydyearfanli', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['ydyearfanli']) {
          return Number(params.data['ydyearfanli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月单吨结账毛利', field: 'dandunmaoli', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['dandunmaoli']) {
          return Number(params.data['dandunmaoli']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月库存吨利息', field: 'dangyuekucunlixi', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['dangyuekucunlixi']) {
          return Number(params.data['dangyuekucunlixi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月预付吨利息', field: 'dangyueyufulixi', width: 120,
      valueGetter: (params) => {
        if (params.data && params.data['dangyueyufulixi']) {
          return Number(params.data['dangyueyufulixi']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
    ];
  }

  ngOnInit() {
    setTimeout(() => {
      this.refresh();
    }, 0);
  }

  // 获取网格中的数据
  refresh() {
    // 从服务器获取数据赋值给网格
    this.reportService.getchandimaoli(this.query).then((data) => {
      this.getdate();
      this.gridOptions.api.setRowData(data);
    });
  }

  export() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: this.exportdatename + '产地账面毛利对比表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  getdate() {
    let now = new Date();
    if (this.query['month']) {
      now = new Date(this.query['month']);
    }
    const fullyear = now.getFullYear();
    const month = now.getMonth();
    this.exportdatename = fullyear + '年' + (month + 1) + '月';
    this.year = (fullyear.toString()).substring(fullyear.toString().length - 2);
    this.lastyear = Number(this.year) - 1 + '';
    this.lastmonthstr = '1-' + month + '月';
    this.gridOptions.columnDefs.forEach((colde: ColDef) => {
      for (const key in this.lastmonthMap) {
        if (Object.prototype.hasOwnProperty.call(this.lastmonthMap, key)) {
          if (colde.colId === key) {
            const ele = this.lastmonthMap[key];
            colde.headerName = this.lastmonthstr + ele;
          }
        }
      }
    });
    this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
  }
  onGridReady(params) {
    this.gridApi = params.api;
  }
  // 入库单上传弹窗
  showUploader() {
    this.uploaderModel.show();
  }
  // 关闭上传弹窗
  uploaderhideDialog() {
    this.uploaderModel.hide();
  }
  // 上传成功执行的回调方法
  uploads($event) {
    console.log($event);
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.reportService.uploadniandutongqi(addData).then(data => {
        this.toast.pop('success', '上传成功！');
        this.refresh();
        this.uploaderhideDialog();
      });
    }
  }
  selectmonth(value) {
    this.query['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  openquery() {
    this.query = {};
    this.classicModal.show();
  }
  coles() {
    this.classicModal.hide();
  }
  select() {
    this.getdate();
    this.refresh();
    this.coles();
  }
}
