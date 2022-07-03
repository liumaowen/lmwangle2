import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { SettingsService } from 'app/core/settings/settings.service';
import { ToasterService } from 'angular2-toaster';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { MatchcarService } from '../matchcar.service';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-matchcar',
  templateUrl: './matchcar.component.html',
  styleUrls: ['./matchcar.component.scss']
})
export class MatchcarComponent implements OnInit {
  ckitems: any;
  requestparams: any = { start: '', end: '', cangkuid: '', grno: '' };
  @ViewChild('searchdialog') private searchdialog: ModalDirective;
  gridOptions: GridOptions;
  start = new Date();
  end = new Date();
  constructor(public settings: SettingsService, private toast: ToasterService, private userapi: UserapiService,
    private modalService: BsModalService, private matchcarApi: MatchcarService, private router: Router, private datepipe: DatePipe) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      rowSelection: 'multiple',
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
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/matchcar/detail/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }, checkboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyername', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实发数量', field: 'shifacount', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否付吊费', field: 'isdiaofee', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提货凭证', field: 'pingzheng', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提货地址', field: 'tihuoaddr', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '送货地址', field: 'destination', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '省', field: 'provincename', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '市', field: 'cityname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '县', field: 'countyname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货联系人', field: 'xhlianxiren', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货电话', field: 'xhlianxirenphone', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '入库抬头', field: 'rukutaitou', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运输类型', field: 'transtype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷状态', field: 'juanstatus', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运费单价', field: 'feeprice', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否确认', field: 'isagree', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
      valueFormatter: this.settings.valueFormatter3
    },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80
    },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', minWidth: 100 }
    ];
  }
  ngOnInit() {
    this.listdetail();
  }
  //查询
  showsearchdialog() {
    this.ckitems = [{ value: '', label: '全部' }];
    this.userapi.cangkulist().then(data => {
      data.forEach(element => {
        this.ckitems.push(
          {
            value: element['id'],
            label: element['name']
          }
        );
      });
    });
    this.searchdialog.show();
  }
  hidesearchdialog() {
    this.searchdialog.hide();
  }
  listdetail() {
    if (this.end) {
      this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.start) {
      this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    console.log(this.requestparams);
    this.matchcarApi.listDetail(this.requestparams).then(data => {
      this.gridOptions.api.setRowData(data);
      this.hidesearchdialog();
    });
  }
}
