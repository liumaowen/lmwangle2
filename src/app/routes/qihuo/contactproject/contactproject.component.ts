import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { QihuoService } from '../qihuo.service';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-contactproject',
  templateUrl: './contactproject.component.html',
  styleUrls: ['./contactproject.component.scss']
})
export class ContactprojectComponent implements OnInit {
  // 接收父页面this对象
  componentparent;
  gridOptions: GridOptions;
  orderid: number;
  constructor(
    public bsModalRef: BsModalRef,
    public settings: SettingsService,
    private qihuoapi: QihuoService,
    private toast: ToasterService
  ) {
    // aggird实例对象
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '项目名称', field: 'name', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '负责人', field: 'cusername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '省', field: 'provincename', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '市', field: 'cityname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '县', field: 'countyname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '详细地址', field: 'addrdetail', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '项目概况', field: 'describeproject', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '项目规模', field: 'weightrangename', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'statusname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '主推钢厂', field: 'mainsteelname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '辅推钢厂', field: 'lesssteelname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '主推产品', field: 'gnname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '联系人', field: 'linkmanname', minWidth: 154 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'billno', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否备案', field: 'isbeian', minWidth: 100 },
    ];
  }

  ngOnInit() {
    setTimeout(() => {
      this.orderid = this.componentparent.qihuomodel.id;
      this.getcontactproject(this.orderid);
    }, 0);
  }
  /**获取关联项目 */
  getcontactproject(orderid) {
    this.qihuoapi.getcontactproject(orderid).then(data => {
      if (data.length) {
        this.gridOptions.api.setRowData(data);
      } else {
        this.toast.pop('warning', '查不到关联项目！');
      }
    });
  }
}
