import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DingdingService } from '../dingding.service';
import { DatePipe } from '@angular/common';
import { OrgApiService } from 'app/dnn/service/orgapi.service';


@Component({
  selector: 'app-tudutriplog',
  templateUrl: './tudutriplog.component.html',
  styleUrls: ['./tudutriplog.component.scss']
})
export class TudutriplogComponent implements OnInit {
  // 修改弹窗
  @ViewChild('updateModal') private updateModal: ModalDirective;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('getApplyOrLogModal') private getApplyOrLogModal: ModalDirective;
  gridOptions: GridOptions;
  model: any = {};
  requestparams: any = {};
  commitdate;
  commitdatestart;
  commitdateend: Date;
  tripdatestart;
  tripdateend: Date;
  maxDate = new Date();
  cuser: any;
  orgs: any = [];
  editparams: any = {};
  type: Number;
  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private dingdingService: DingdingService,
    private orgApi: OrgApiService,
    private toast: ToasterService) {
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
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '填报人', field: 'username', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '部门', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '工作/出差日期', field: 'tripdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '发起时间', field: 'commitdate', minWidth: 120, },
      { cellStyle: { 'text-align': 'center' }, headerName: '填交时间有效', field: 'iscommitdatevalid', minWidth: 60, },
      { cellStyle: { 'text-align': 'center' }, headerName: '出差地点', field: 'place', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '出差地点有效', field: 'isplacevalid', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '出差类别', field: 'triptype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '出差类别有效', field: 'istriptypevalid', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单纯往返', field: 'wangfan', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单纯往返有效', field: 'iswangfanvalid', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '工作类型', field: 'worktype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '工作类型有效', field: 'isworktypevalid', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否有效出差', field: 'isvalid', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效出差天数', field: 'validtripdays', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '出差天数', field: 'tripdays', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'status', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '日志类型', field: 'logtype', minWidth: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '修改', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
          return '<a target="_blank">修改</a>';
        }, onCellClicked: (data) => {
          this.updateshowmodal(data.data);
        }
      }
    ];
  }

  ngOnInit() {
  }

  find() {
    this.dingdingService.find(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  // 获取出差日志
  getTripLog() {
    this.requestparams.commitdatestart = this.requestparams.commitdate;
    this.requestparams.commitdatestartend = this.requestparams.commitdate;
    this.dingdingService.getTripLog(this.requestparams).then((response) => {
      if(response) this.find();
    });
  }

  // 获取出差申请
  getTripApply() {
    this.dingdingService.getTripApply(this.requestparams).then((response) => {
      if(response) this.toast.pop('success', '刷新成功！');
    });
  }

  // 更新
  update() {
    if(this.editparams['validtripdays'] < 0 || this.editparams['validtripdays'] > 1){
      this.toast.pop('warning', '有效出差天数填写错误！！！');
      return;
    }
    this.dingdingService.updatelog(this.editparams).then(data => {
      this.toast.pop('success', '修改成功！');
      this.hideupdateModal();
      this.find();
    });
  }

  openQueryDialog() {
    this.selectNull();
    this.getorg();
    this.classicModal.show();
  }

  /**打开修改弹窗 */
  updateshowmodal(params) {
    this.editparams = JSON.parse(JSON.stringify(params));
    if (this.editparams['isvalid'] === '是') {
      this.editparams['isvalid'] = true;
    } else {
      this.editparams['isvalid'] = false;
    }
    this.updateModal.show();
  }
  hideupdateModal() {
    this.updateModal.hide();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  selectNull() {
    this.commitdatestart = undefined;
    this.commitdateend = undefined;
    this.tripdatestart = undefined;
    this.tripdateend = undefined;
    this.commitdate = '';
    this.cuser = null;
    this.orgs = [];
    this.requestparams = [];
  }

  // 查询
  query() {
    if (this.commitdatestart) {
      this.requestparams.commitdatestart = this.datePipe.transform(this.commitdatestart, 'yyyy-MM-dd');
    } else {
      this.requestparams.commitdatestart = '';
    }
    if (this.commitdateend) {
      this.requestparams.commitdateend = this.datePipe.transform(this.commitdateend, 'yyyy-MM-dd');
    } else {
      this.requestparams.commitdateend = '';
    }
    if (this.tripdatestart) {
      this.requestparams.tripdatestart = this.datePipe.transform(this.tripdatestart, 'yyyy-MM-dd');
    } else {
      this.requestparams.tripdatestart = '';
    }
    if (this.tripdateend) {
      this.requestparams.tripdateend = this.datePipe.transform(this.tripdateend, 'yyyy-MM-dd');
    } else {
      this.requestparams.tripdateend = '';
    }
    this.find();
    this.hideclassicModal();
  }

  openGetApplyOrLog(type) {
    this.type = type;
    this.selectNull();
    this.getApplyOrLogModal.show();
  }

  hideGetApplyOrLog() {
    this.getApplyOrLogModal.hide();
  }

  // 刷新出差日志
  getApplyOrLog() {
    if (this.type === 1) {
      if (this.commitdatestart) {
        this.requestparams.start = this.datePipe.transform(this.commitdatestart, 'yyyy-MM-dd');
      } else {
        this.requestparams.start = '';
      }
      if (this.commitdateend) {
        this.requestparams.end = this.datePipe.transform(this.commitdateend, 'yyyy-MM-dd');
      } else {
        this.requestparams.end = '';
      }
      this.getTripApply();
    } else if (this.type === 2) {
      if (this.commitdate) {
        this.requestparams.commitdate = this.datePipe.transform(this.commitdate, 'yyyy-MM-dd');
      } else {
        this.requestparams.commitdate = '';
      }
      this.requestparams.commitdatestart = this.requestparams.commitdate;
      this.requestparams.commitdatestartend = this.requestparams.commitdate;
      this.getTripLog();
    }
    this.hideGetApplyOrLog();
  }

  getorg() {
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          value: element.id,
          label: element.name
        });
      });
    });
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
      fileName: '涂镀出差日志统计表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

}
