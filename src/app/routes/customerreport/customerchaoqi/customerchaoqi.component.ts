import { ReportService } from '../../report/report.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { OrgApiService } from '../../../dnn/service/orgapi.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-customerchaoqi',
  templateUrl: './customerchaoqi.component.html',
  styleUrls: ['./customerchaoqi.component.scss']
})
export class CustomerchaoqiComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;

  gridOptions: GridOptions;

  requestparams = {};

  saleuser;

  start;

  end;

  endmax = new Date();

  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private reportApi: ReportService,
    private orgApi: OrgApiService) {
    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制 single
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      localeText: this.settings.LOCALETEXT,
    };

    this.gridOptions.columnDefs = [
      // { cellStyle: { 'text-align': 'center' }, headerName: '客户ID', field: 'id', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '名称', field: 'NAME', width: 250 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '助记码', field: 'helpcode', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '地址', field: 'address', width: 100 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '开户银行', field: 'kaihubank', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '余额', field: 'yue', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '联系人', field: 'lxrname', width: 100 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '联系电话1', field: 'contactway', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '联系电话2', field: 'tel', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '传真', field: 'fax', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '税号', field: 'taxno', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '收票人', field: 'shoupiaoren', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '收票地址', field: 'shoupiaoaddr', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '邮寄地址', field: 'maddress', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '邮编', field: 'zipcode', width: 150 },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '用户性质', field: 'usernature', width: 150
      // },
      // { cellStyle: { 'text-align': 'center' }, headerName: '客户等级', field: 'grade', width: 100 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '行业类别', field: 'category', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'realname', width: 150 },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '是否停用', field: 'isdel', width: 150,
      //   cellRenderer: (params) => {
      //     return params.data.isdel ? '是' : '否';
      //   }
      // },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '是否下载', field: 'record', width: 150,
      //   cellRenderer: (params) => {
      //     return params.data.record ? '是' : '否';
      //   }
      // },
      // { cellStyle: { 'text-align': 'center' }, headerName: '初始登录时间', field: 'recorddate', width: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否线上', field: 'isonline', width: 150,
        cellRenderer: (params) => {
          return params.data.isonline ? '是' : '否';
        }
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '是否内部用户', field: 'iswiskind', width: 150,
      //   cellRenderer: (params) => {
      //     return params.data.iswiskind ? '是' : '否';
      //   }
      // },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '是否仓储公司', field: 'is_storage', width: 150,
      //   cellRenderer: (params) => {
      //     return params.data.is_storage ? '是' : '否';
      //   }
      // },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '是否物流公司', field: 'iswlcompany', width: 150,
      //   cellRenderer: (params) => {
      //     return params.data.iswlcompany ? '是' : '否';
      //   }
      // },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '是否加工客户', field: 'isproduce', width: 150,
      //   cellRenderer: (params) => {
      //     return params.data.isproduce ? '是' : '否';
      //   }
      // },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '是否供应商', field: 'issupplier', width: 150,
      //   cellRenderer: (params) => {
      //     return params.data.issupplier ? '是' : '否';
      //   }
      // },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '是否费用', field: 'iscost', width: 150,
      //   cellRenderer: (params) => {
      //     return params.data.iscost ? '是' : '否';
      //   }
      // },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '是否删除', field: 'isdel', width: 150,
      //   cellRenderer: (params) => {
      //     return params.data.isdel ? '是' : '否';
      //   }
      // },
      { cellStyle: { 'text-align': 'center' }, headerName: '未购买天数', field: 'daydiff', width: 150 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '近期成交时间', field: 'orderdate', width: 150 }
    ];
  }

  ngOnInit() {
  }

  openQueryDialog() {
    this.selectNull();
    this.showclassicModal();

  }

  // 清空
  selectNull() {
    this.requestparams = {};
    this.saleuser = undefined;
    this.start = undefined;
    this.end = undefined;
  }

  // 查询
  query() {
    if (this.start) {
      this.requestparams['start'] = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    }
    if (this.end) {
      this.requestparams['end'] = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    }
    if (typeof (this.saleuser) === 'object') {
      this.requestparams['salemanid'] = this.saleuser['code'];
    } else {
      this.requestparams['salemanid'] = '';
    }

    this.reportApi.customerchaoqi(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);
      // ngDialog.close();
      this.hideclassicModal();
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
      fileName: '客户信息.csv',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsCsv(params);
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
