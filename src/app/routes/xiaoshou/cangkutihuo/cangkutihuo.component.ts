import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { ReportService } from 'app/routes/report/report.service';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { DatePipe } from '@angular/common';
import { XiaoshouapiService } from '../xiaoshouapi.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-cangkutihuo',
  templateUrl: './cangkutihuo.component.html',
  styleUrls: ['./cangkutihuo.component.scss']
})
export class CangkutihuoComponent implements OnInit {
  names:any;
  flags:any;
  requestparams = { id: '', start: '', end: '', shitistart: '', shitiend: '', tihuotype: '', status: '',sijiname:'',idcardno:'',carno:'' };
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private cangkutihuoApi: XiaoshouapiService, private customerApi: CustomerapiService, private orgApi: OrgApiService, private classifyApi: ClassifyApiService, private reportApi: ReportService, private toast: ToasterService, private datepipe: DatePipe) {
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

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true , valueGetter: (params) => '合计'},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data) {
            return '<a target="_blank" href="#/cangkutihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
          }else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细ID', field: 'tihuodetid', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '线上', field: 'isonline', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '主表状态', field: 'billstatus', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细状态', field: 'detstatus', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 100 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '司机', field: 'sijiname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '身份证号', field: 'idcardno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '车号', field: 'carno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60,
      valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'lengths', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 150 },

      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'shitidate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员机构', field: 'orgname', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'sorgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', minWidth: 75 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存ID', field: 'kucunid', minWidth: 75,
        cellRenderer: (params) => {
          if (params.data) {
            if (null != params.data.kucunid) {
              return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
            }
          }else {
            return '';
          }
        }
      }
    ];

    this.listDetail();
  }


  ngOnInit() {
  }

  listDetail() {
    this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    if (this.end) this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    if (this.shitistart) this.requestparams.shitistart = this.datepipe.transform(this.shitistart, 'y-MM-dd');
    if (this.shitiend) this.requestparams.shitiend = this.datepipe.transform(this.shitiend, 'y-MM-dd');
    console.log(this.requestparams);
    this.cangkutihuoApi.cangkutihuodet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  };

  openQueryDialog() {
    this.names = [{ label: '全部', value: '' }, { value: 1, label: '已实提' }, { value: 2, label: '未实提' }, { value: 3, label: '已作废' }];
    this.flags = [{ label: '全部', value: '' }, { value: false, label: '线下' }, { value: true, label: '线上' }];
    this.showDialog();
  }

  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;

  // 打开查询弹窗
  showDialog() {
    this.classicModal.show();
  }

  // 关闭查询弹窗
  hideDialog() {
    this.classicModal.hide();
  }

  start: Date = new Date();
  end: Date;
  shitistart: Date;
  shitiend: Date;
  // 查询
  query() {
    if (!this.start) {
      this.toast.pop('warning', '开始时间必须填写！');
      return;
    } else {
      this.listDetail();
      this.hideDialog();
    }
  }
  // 重置
  selectNull() {
    this.start = new Date();
    this.end = null;
    this.shitiend = null;
    this.shitistart = null;
    this.requestparams = { id: '', start: '', end: '', shitistart: '', shitiend: '', tihuotype: '', status: '',sijiname:'',idcardno:'',carno:'' };
  }
 
}
