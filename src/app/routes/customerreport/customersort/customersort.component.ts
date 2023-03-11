import {ToasterService} from 'angular2-toaster/angular2-toaster';
import {GridOptions} from 'ag-grid/main';
import {DatePipe} from '@angular/common';
import {SettingsService} from '../../../core/settings/settings.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {CustomerapiService} from '../../customer/customerapi.service';
import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-customersort',
  templateUrl: './customersort.component.html',
  styleUrls: ['./customersort.component.scss']
})
export class CustomersortComponent implements OnInit {
  month: string;
  supplier: any;
  gridOptions: GridOptions;
  // 查询弹窗实例
  @ViewChild('selectModel') private classicModal: ModalDirective;

  // 选择品名后才能选择产地等信息

  constructor(
    private cutomerApi: CustomerapiService,
    public settings: SettingsService,
    private datepipe: DatePipe,
    private toast: ToasterService,
  ) {
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
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {cellStyle: {'text-align': 'center'}, headerName: '机构', field: 'sorgname', minWidth: 150},
      {cellStyle: {'text-align': 'center'}, headerName: '客户', field: 'buyername', minWidth: 150},
      {
        cellStyle: {'text-align': 'right'}, headerName: '2021年销售重量', field: 'zongweight_21', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['zongweight_21']) {
            return Number(params.data['zongweight_21']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: {'text-align': 'right'}, headerName: '2022年销售重量', field: 'zongweight_22', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['zongweight_22']) {
            return Number(params.data['zongweight_22']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: {'text-align': 'right'}, headerName: '2023年销售重量', field: 'zongweight', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['zongweight']) {
            return Number(params.data['zongweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {cellStyle: {'text-align': 'center'}, headerName: '现业务负责人', field: 'salesman', minWidth: 150},
    ];
  }

  ngOnInit() {
    // this.month = this.datepipe.transform(new Date(), 'yMM');
    // this.getdata();
  }


  // 打开查询弹窗
  openclassicmodal() {
    this.classicModal.show();
  }

  searchkucunfanlidet() {
    if (!this.month) {
      this.toast.pop('warning', '请选择月份！', '');
      return;
    }
    this.getdata();
    this.closeclassicmodal();
  }

  // 关闭查询弹窗
  closeclassicmodal() {
    this.classicModal.hide();
  }

  getdata() {
    this.cutomerApi.getCustomerSortData(this.month).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  // 清空查询对象，重置按钮
  selectNull() {
    this.month = this.datepipe.transform(new Date(), 'yMM');
  }

  // 导出
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      allColumns: false,
      onlySelected: false,
      columnGroups: true,
      skipGroups: true,
      suppressQuotes: false,
      fileName: '各机构前十客户.xls'
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  selectmonth(value) {
    this.month = this.datepipe.transform(value, 'yMM');
  }
}
