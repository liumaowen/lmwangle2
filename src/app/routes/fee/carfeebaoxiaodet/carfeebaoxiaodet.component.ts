import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { ModalDirective } from 'ngx-bootstrap';
import { FeeapiService } from '../feeapi.service';

@Component({
  selector: 'app-carfeebaoxiaodet',
  templateUrl: './carfeebaoxiaodet.component.html',
  styleUrls: ['./carfeebaoxiaodet.component.scss']
})
export class CarfeebaoxiaodetComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  start = new Date();

  startrefresh = new Date();
  startrefreshstr = '';

  maxDate = new Date();

  end: Date;

  requestparams = {
    start: '',
    end: this.datePipe.transform(this.start, 'y-MM-dd'), billno: ''
  };

  gridOptions: GridOptions;

  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private feeApi: FeeapiService,
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
        cellStyle: { 'text-align': 'center' }, headerName: '消费日期', field: 'buydate', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '审核日期', field: 'vdate', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构名称', field: 'orgname', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '车号', field: 'carno', width: 70
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '加油单价', field: 'price', width: 70,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '加油量', field: 'num', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用金额', field: 'jine', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '里程数', field: 'licheng', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'feetype', width: 80
      },
      {
        cellStyle: { 'text-align': 'left' }, headerName: '经手人', field: 'cusername', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否高管车辆', field: 'isgaoguan', width: 70
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 70
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 70
      },
    ];
  }

  ngOnInit() {
  }



  listDetail() {
    this.feeApi.findcar(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }


  openQueryDialog() {
    // this.selectNull();
    this.showclassicModal();
  }

  selectNull() {
    this.requestparams = {
      start: '',
      end: this.datePipe.transform(this.start, 'y-MM-dd'), billno: ''
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
    } else {
      this.toast.pop('warning', '开始时间必填！');
    }
  }

  showclassicModal() {
    this.classicModal.show();
  }
  hideclassicModal() {
    this.classicModal.hide();
  }

}
