import { ICellRendererAngularComp } from 'ag-grid-angular/main';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { ModalDirective } from 'ngx-bootstrap';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dingjindet',
  templateUrl: './dingjindet.component.html',
  styleUrls: ['./dingjindet.component.scss']
})
export class DingjindetComponent implements OnInit {
  dingjingridOptions: GridOptions;//定金
  constructor(public settings: SettingsService, private qihuoapi: QihuoService, private toast: ToasterService, private router: Router) {
    this.dingjingridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.dingjingridOptions.onGridReady = this.settings.onGridReady;
    this.dingjingridOptions.groupSuppressAutoColumn = true;
    this.dingjingridOptions.columnDefs = [
      {
        cellStyle: { "text-align": "center" }, headerName: '订单编号', field: 'billno', minWidth: 60, enableRowGroup: true,
        cellRenderer: (params) => {
          return '<a target="_blank" href="#/qihuo/' + params.data.id + '">' + params.data.billno + '</a>';
        }
        // onCellClicked: (params) => {
        //   this.router.navigate(['qihuo',params.data.id]);
        // } 
      },
      { cellStyle: { "text-align": "center" }, headerName: '买方公司', field: 'buyername', minWidth: 60, enableRowGroup: true },
      { cellStyle: { "text-align": "center" }, headerName: '卖方公司', field: 'sellername', minWidth: 60, enableRowGroup: true },
      { cellStyle: { "text-align": "right" }, headerName: '定金金额', field: 'shifudingjin', minWidth: 60, enableRowGroup: true },
      { cellStyle: { "text-align": "right" }, headerName: '配款金额', field: 'allocation', minWidth: 60, enableRowGroup: true }

    ];
  }

  ngOnInit() {
  }
  findDingjindet() {
    this.qihuoapi.listdingjin(this.search).then(data => {
      this.dingjingridOptions.api.setRowData(data);
    })

  }
  //物料编码中规格属性的修改
  search = { customerid: null, wcustomerid: null };
  @ViewChild('querydingjin') private querydingjin: ModalDirective;
  showdialog() {
    this.querydingjin.show();
  }
  closedialog() {
    this.querydingjin.hide();
  }
  buyer: any;
  query() {
    if (this.buyer) {
      this.search['customerid'] = this.buyer['code'];
    } else {
      this.toast.pop("warning", "请选择客户公司");
      return;
    }
    if (!this.search['wcustomerid']) {
      this.toast.pop('warning', '请选择卖方公司！')
    }
    this.findDingjindet();
    this.closedialog();
  }
  innercompany(event) {
    this.search['wcustomerid'] = event;
  }




}
