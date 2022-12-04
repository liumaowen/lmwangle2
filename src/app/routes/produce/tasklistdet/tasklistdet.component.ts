import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OrgApiService } from '../../../dnn/service/orgapi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProduceapiService } from '../produceapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { SettingsService } from '../../../core/settings/settings.service';
import { ColDef, GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-tasklistdet',
  templateUrl: './tasklistdet.component.html',
  styleUrls: ['./tasklistdet.component.scss']
})
export class TasklistdetComponent implements OnInit {
  cangku: { label: string; value: string; }[];
  start = new Date();
  end = new Date();
  maxDate = new Date();
  gns: any[] = [];
  types = [];
  isvs = [];
  producemodes=[];
  cuser = {};
  tasklistdet = { cuser: {} };
  orgs = [];
  current = this.storage.getObject('cuser');
  requestparams = {
    type: '', cuserid: '', start: this.datepipe.transform(this.start, 'y-MM-dd'),
    end: '', status: '',billno: '',chandi:'' , gn:'',producemode:'',cangkuid:'',
    cuser:null
  };

  @ViewChild('classicModal') private classicModal: ModalDirective;

  gridOptions: GridOptions;
  
  constructor(public settings: SettingsService, private toast: ToasterService,private classifyApi: ClassifyApiService,
    private produceApi: ProduceapiService, private orgApi: OrgApiService, private datepipe: DatePipe, private router: Router,private storage: StorageService) {
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
      suppressRowClickSelection: true,
    };

    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '任务单号', field: 'billno', width: 100,
        cellRenderer: (params) => {

          if (params.data) {
            console.log(params.data);
            return '<a target="_blank" href="#/tasklist/' + params.data.tasklistid + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'buyername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工仓库', field: 'cangkuname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工类型', field: 'type', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否验收', field: 'isys', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'realname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同单号', field: 'salebillno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '物料编码', field: 'gcid', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 110 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 90
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '基料重量', field: 'weight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '分条规格', field: 'slitguige', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '横切规格', field: 'guige', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '横切数量', field: 'hengqieaccount', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工费', field: 'fee', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '打包要求', field: 'yaoqiu', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否引用', field: 'isuse', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工单位', field: 'customername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工交期', field: 'jiaoqi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否审核', field: 'isv', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核日期', field: 'vdate', width: 90 },

    ];
    
  }
  ngOnInit() {
  }
  selectNull() {
    this.start = new Date();
    this.end = new Date();
    this.requestparams = {
      start: this.datepipe.transform(this.start, 'y-MM-dd'),
      end: this.datepipe.transform(this.end, 'y-MM-dd'), 
      billno: '',
      type: '', 
      status: '', 
      chandi:'',
      gn:'',
      producemode:'',
      cangkuid:'',
      cuserid: '' ,
      cuser:''
    };
  }
  openQuery() {
    this.selectNull();
    this.types = [{ value: '', label: '全部' },{ value: 1, label: '纵剪' },{ value: 2, label: '横切' },{ value: 3, label: '纵剪+横切' }];
    this.isvs = [{ value: '', label: '全部' }, { value: true, label: '已审核' }, { value: false, label: '未审核' }];
    this.producemodes = [{ value: '', label: '全部' },{ value: 1, label: 'OEM' }, { value: 2, label: '普通' }, { value: 3, label: '维实品牌' }];
    // 查找仓库
    this.cangku = [{ label: '全部', value: '' }];
    this.classifyApi.cangkulist().then((response) => {
        response.forEach(element => {
          this.cangku.push({
            label: element.name,
            value: element.id
        });
      });
    });
    if (this.orgs.length < 1) {
      this.orgs = [{ value: '', label: '全部' }];
      this.orgApi.listAll(0).then((response) => {
        console.log(response);
        response.forEach(element => {
          this.orgs.push({
            label: element.name,
            value: element.id
          });
        });
      });
    }
    this.showClassicModal();
  }
  
  query() {
    this.requestparams['cuserid']= this.cuser['code'];
    this.requestparams['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    this.requestparams['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    this.produceApi.tasklistdet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); 
    });
    this.colse();
  }
  showClassicModal() {
    this.classicModal.show();
  }
  colse() {
    this.classicModal.hide();
  }

}
