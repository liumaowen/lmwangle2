import { GridOptions } from 'ag-grid/main';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'app/core/settings/settings.service';
import { ErpkaoheService } from '../../erpkaohe.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fundinterestsumdet',
  templateUrl: './fundinterestsumdet.component.html',
  styleUrls: ['./fundinterestsumdet.component.scss']
})
export class FundinterestsumdetComponent implements OnInit {
  gridOptions: GridOptions;
  fundinterestsum = {buyer: {}, seller: {}, cuser: {}};
  constructor(public settings: SettingsService, private erpkaoheapi: ErpkaoheService,
     private actroute: ActivatedRoute) {
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
      enableFilter: true
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: () => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提货单号', field: 'tihuobillno', width: 90,
        cellRenderer: (params) => {
          if (params.data && params.data.tihuoid) {
            return '<a target="_blank" href="#/tihuo/' + params.data.tihuoid + '">' + params.data.tihuobillno + '</a>';
          } else {
            return null;
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '期货订单号码', field: 'qihuobillno', width: 90,
        cellRenderer: (params) => {
          if (params.data && params.data.orderid) {
            return '<a target="_blank" href="#/qihuo/' + params.data.orderid + '">' + params.data.qihuobillno + '</a>';
          } else {
            return null;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属机构', field: 'orgname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '实付利息', field: 'shifujine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['shifujine']) {
            return Number(params.data['shifujine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      }
    ];
  }

  ngOnInit() {
    this.getdetail();
  }
  // 获取数据
  getdetail() {
    // 从服务器获取数据赋值给网格
    this.erpkaoheapi.fundinterestsumdetail(this.actroute.params['value']['id']).then((data) => {
      this.fundinterestsum = data['fundinterestsum'];
      this.gridOptions.api.setRowData(data['list']);
    });

  }
}
