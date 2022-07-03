import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { CaigouService } from '../caigou.service';

@Component({
  selector: 'app-weidaofanlihuizong',
  templateUrl: './weidaofanlihuizong.component.html',
  styleUrls: ['./weidaofanlihuizong.component.scss']
})
export class WeidaofanlihuizongComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 上传弹窗实例
  @ViewChild('uploaderModel') private uploaderModel: ModalDirective;
  // 设置上传的格式
  accept = '.xls, application/xls';
  // 入库单上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 1, extensions: ['xls'] };
  gridOptions: GridOptions;
  search: object = { month: '' };
  constructor(public settings: SettingsService, private caigouApi: CaigouService, private router: Router,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe, private toast: ToasterService) {
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
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'huizongmonth', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data) {
            const da = new Date(params.data['huizongmonth']);
            return da.getFullYear() + '-' + (da.getMonth() + 1);
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '今年未补贴金额', field: 'curryearwbjine', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['curryearwbjine']) {
            return Number(params.data['curryearwbjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '钢厂未扣承兑贴息', field: 'weikouchengdui', minWidth: 120,
        editable: true, aggFunc: 'sum',
        cellRenderer: (params) => {
          console.log('params', params);
          if (params.value === null || params.value === undefined) {
            return null;
          } else {
            return params.value;
          }
        },
        onCellValueChanged: (params) => {
          console.log('value', params.newValue);
          this.caigouApi.modifyweidaofanli(params.data.id, { weikouchengduitiexi: params.newValue }).then(data => {
            this.toast.pop('success', '修改成功！');
            this.getDetail();
          });
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '合计未到返利', field: 'hejiweidaofanli', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['hejiweidaofanli']) {
            return Number(params.data['hejiweidaofanli']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '库存返利', field: 'kucunfanli', minWidth: 120,
        editable: true, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucunfanli']) {
            return Number(params.data['kucunfanli']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2,
        onCellValueChanged: (params) => {
          console.log('value', params.newValue);
          this.caigouApi.modifyweidaofanli(params.data.id, { kucunfanli: params.newValue }).then(data => {
            this.toast.pop('success', '修改成功！');
            this.getDetail();
          });
        },
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '毛利润', field: 'maolirun', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['maolirun']) {
            return Number(params.data['maolirun']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '净利润', field: 'jinglirun', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jinglirun']) {
            return Number(params.data['jinglirun']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },

      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'status', minWidth: 90,
        valueGetter: (params) => {
          if (params.data) {
            if (params.data.status === 1) {
              return '展示状态';
            } else if (params.data.status === 2) {
              return '已提交';
            } else if (params.data.status === 3) {
              return '已审核';
            }
          }
        }
      }
    ];
  }

  ngOnInit() {
    const date = new Date();
    this.search['month'] = this.datepipe.transform(new Date(date.getFullYear(), date.getMonth(), 1), 'y-MM-dd');
    this.getDetail();
  }
  getDetail() {
    this.caigouApi.getweidaofanlihuizongdet(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  openquery() {
    this.selectNull();
    this.classicModal.show();
  }
  selectegangchang(value) {
    this.search['chandiid'] = value.id;
  }
  selectNull() {
    this.search = { month: '' };
  }
  close() {
    this.classicModal.hide();
  }
  query() {
    if (!this.search['month']) {
      this.toast.pop('error', '请选择月份！', '');
      return;
    }
    this.getDetail();
    this.classicModal.hide();
  }
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  tijiao() {
    if (confirm('你确定要提交吗？')) {
      this.caigouApi.submitWeidaofanli().then(data => {
        this.toast.pop('success', '提交成功！');
        this.getDetail();
        this.uploaderhideDialog();
      });
    }
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
      this.caigouApi.uploadkucunfanli(addData).then(data => {
        this.toast.pop('success', '上传成功！');
        this.getDetail();
        this.uploaderhideDialog();
      });
    }
  }

}
