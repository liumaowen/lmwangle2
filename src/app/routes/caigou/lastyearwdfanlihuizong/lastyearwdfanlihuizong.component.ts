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
  selector: 'app-lastyearwdfanlihuizong',
  templateUrl: './lastyearwdfanlihuizong.component.html',
  styleUrls: ['./lastyearwdfanlihuizong.component.scss']
})
export class LastyearwdfanlihuizongComponent implements OnInit {

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
        cellStyle: { 'text-align': 'right' }, headerName: '不含税', field: 'notaxjine', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['notaxjine']) {
            return Number(params.data['notaxjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '分摊系数', field: 'rate', minWidth: 150 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '主管业务成本', field: 'zhuyingchengben', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['zhuyingchengben']) {
            return Number(params.data['zhuyingchengben']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '库存商品', field: 'kucunproduct', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucunproduct']) {
            return Number(params.data['kucunproduct']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '含税返利金额', field: 'taxfanlijine', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['taxfanlijine']) {
            return Number(params.data['taxfanlijine']);
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
    this.caigouApi.getlastyearwdfanlihuizongdet(this.search).then(data => {
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
      this.caigouApi.uploadlastyearfanli(addData).then(data => {
        this.toast.pop('success', '上传成功！');
        this.getDetail();
        this.uploaderhideDialog();
      });
    }
  }
}
