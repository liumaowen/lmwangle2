import { Component, OnInit, ViewChild } from '@angular/core';
// OnChanges, DoCheck, AfterContentInit, AfterContentChecked,AfterViewInit, AfterViewChecked, OnDestroy
import { UserapiService } from './../../../dnn/service/userapi.service';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { SellproService } from '../sellpro.service';
import { SelectComponent } from 'ng2-select';
import { StorageService } from 'app/dnn/service/storage.service';


@Component({
  selector: 'app-sellpro',
  templateUrl: './sellpro.component.html',
  styleUrls: ['./sellpro.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class SellproComponent implements OnInit {
  @ViewChild('chandi') public chandi: SelectComponent;
  @ViewChild('weight') public weight: SelectComponent;
  // OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit,AfterViewChecked, OnDestroy
  search: object = {
    area: '',
    orgid: '',
    cuserid: '',
    msteelmill: '',
    weight: '',
    buildarea: '',
    start: '',
    end: '',
    industry: ''
  };
  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date();

  // 结束时间
  end: Date = new Date();

  // aggird表格原型
  gridOptions: GridOptions;

  // 弹窗
  @ViewChild('classicModal') private classicModel: ModalDirective;
  orgs: any[];
  chandis: any[];
  weights: any[];
  buildareas: any[];
  industrys: any[];
  constructor(public settings: SettingsService, private sellproApi: SellproService,
    private datepipe: DatePipe, private numpipe: DecimalPipe, private storage: StorageService,
    private toasterService: ToasterService, private orgApi: OrgApiService, private classifyApi: ClassifyApiService) {
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
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '项目名称', field: 'name', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '项目规模', field: 'weightrangename', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '主推钢厂', field: 'mainsteelname', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '辅推钢厂', field: 'lesssteelname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品种类', field: 'gnname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '项目状态', field: 'statusname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '省', field: 'provincename', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '市', field: 'cityname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '县', field: 'countyname', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '详细地址', field: 'addrdetail', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data.cuserid === this.current.id) {
            return params.data.addrdetail;
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '联系人', field: 'linkmans', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data.cuserid === this.current.id) {
            return params.data.linkmans;
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '项目概况', field: 'describeproject', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '项目负责人', field: 'cusername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '牌号', field: 'caizhi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '数量（吨）', field: 'weight', minWidth: 100 }
    ];
  }

  // 选择开始时间
  selectstart() {
    // this.endmax = new Date();
  }

  // 选择结束使劲
  selectend() {
    // this.startmax = this.end;
    // this.startmin = new Date(this.end.getTime() - 6 * 24 * 3600000);
  }
  ngOnInit() {
    this.querylist();
  }
  selectNull() {
    this.search = {
      area: '',
      orgid: '',
      cuserid: '',
      mainsteelid: '',
      weightrangeid: '',
      start: '',
      end: ''
    };
    this.chandi.active = [];
    this.weight.active = [];
  }

  showDialog() {
    this.industrys = [];
    this.chandi.active = [];
    this.weight.active = [];
    this.weights = [{ id: null, text: '请选择' }, { id: '8194', text: '0~199' }, { id: '2', text: '200~499' }, { id: '8196', text: '≥500' }];
    this.classifyApi.getChildrenTree(null).then(data => {
      this.chandis = [{
        text: '请选择',
        id: null
      }];
      data.forEach(element => {
        this.chandis.push({
          text: element.label,
          id: element.id
        });
      });
    }, err => {
    });
    this.selectNull();
    this.classicModel.show();
  }
  selectechandi(value) {
    this.search['mainsteelid'] = value.id;
    console.log(this.search);
  }
  selecteweight(value) {
    this.search['weightrangeid'] = value.id;
    console.log(this.search);
  }
  selectebuild(value) {
    this.search['buildarea'] = value.id;
    console.log(this.search);
  }
  // 关闭弹窗
  coles() {
    this.classicModel.hide();
  }
  querylist() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(new Date(this.end.getFullYear(),
        this.end.getMonth(), this.end.getDate() + 1), 'y-MM-dd');
    }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    console.log(this.search);
    this.sellproApi.sellprolist(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      this.classicModel.hide();
    });
  }

}
