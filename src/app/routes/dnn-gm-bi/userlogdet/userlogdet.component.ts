import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GmbiService } from '../gmbi.service';

@Component({
  selector: 'app-userlogdet',
  templateUrl: './userlogdet.component.html',
  styleUrls: ['./userlogdet.component.scss']
})
export class UserlogdetComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  start = new Date();
  end: Date;
  maxDate = new Date();
  requestparams = {
    start: this.datePipe.transform(this.start, 'y-MM-dd'),
    end: ''
  };
  gridOptions: GridOptions;
  // 引入弹窗模型
  bsModalRef: BsModalRef;
  /** 牟霏id */
  readonly mufeiid = 593;
  /** 王锋id */
  readonly wangfengid = 592;
  /** 杨晓春id */
  readonly yangxiaochunid = 511;
  /** 王洪英id */
  readonly wanghongyingid = 3573;
  viewdate = '';
  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private toast: ToasterService,
    private gmbiService: GmbiService) {
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
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类别', field: 'method', minWidth: 80,
        cellRenderer: (params) => {
          if (params.data) {
            return params.data.method;
          } else {
            return '合计';
          }
        }
      },
    ];
    this.getcolumnDefs();
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
  }
  ngOnInit() {
  }
  /**动态获取列 */
  getcolumnDefs() {
    this.gmbiService.getroleusers().then(data => {
      data.forEach(element => {
        if (element.userid !== this.mufeiid && element.userid !== this.wangfengid && element.userid !== this.yangxiaochunid
           && element.userid !== this.wanghongyingid) {
          const column = { cellStyle: { 'text-align': 'center' }, headerName: element.user['realname'],
          field: element.user['name'], minWidth: 80, aggFunc: 'sum' };
          this.gridOptions.columnDefs.push(column);
        }
      });
        this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
        this.gridOptions.onGridReady = this.settings.onGridReady;
    });
  }
  listDetail() {
    this.gmbiService.getuserlogdet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  openQueryDialog() {
    this.showclassicModal();
    this.selectNull();
  }
  selectNull() {
    this.requestparams = {
      start: this.datePipe.transform(this.start, 'y-MM-dd'),
      end: ''
    };
    this.end = undefined;
    this.start = new Date();
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
      this.listDetail();
      this.hideclassicModal();
      if (!this.requestparams.end) {
        this.viewdate = this.requestparams.start + '~至今';
      } else {
        this.viewdate = this.requestparams.start + '~' + this.requestparams.end;
      }
    } else {
      this.toast.pop('warning', '开始时间必填！');
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
      fileName: '单据操作日志.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  /**查询弹窗 */
  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
}
