import { Component, OnInit, ViewChild } from '@angular/core';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions, ColDef } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { SellproService } from '../sellpro.service';
import { SelectComponent } from 'ng2-select';
import { StorageService } from 'app/dnn/service/storage.service';


@Component({
  selector: 'app-projectreport',
  templateUrl: './projectreport.component.html',
  styleUrls: ['./projectreport.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class ProjectreportComponent implements OnInit {
  private gridApi;
  @ViewChild('chandi') public chandi: SelectComponent;
  @ViewChild('weight') public weight: SelectComponent;
  @ViewChild('status') public status: SelectComponent;
  search: object = {
    area: '',
    orgid: '',
    cuserid: '',
    msteelmill: '',
    weight: '',
    buildarea: '',
    start: '',
    end: '',
    industry: '',
    statusid: '',
    plogstart: '',
    plogend: ''
  };
  months = '';
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date();

  // 结束时间
  end: Date = new Date();
  // 日志开始时间
  plogstart: Date = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);

  // 日志结束时间
  plogend: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

  // aggird表格原型
  gridOptions: GridOptions;

  // 弹窗
  @ViewChild('classicModal') private classicModel: ModalDirective;
  @ViewChild('forwardModal') private forwardModal: ModalDirective;
  @ViewChild('overModal') private overModal: ModalDirective;
  orgs: any[];
  chandis: any[];
  weights: any[];
  buildareas: any[];
  industrys: any[];
  statuses: any[] = [];
  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');
  forwardparams = {projectids:[],newuserid:null,reason:'',issalemancomfig:false}; // 项目转交参数
  overparams = {projectids:[],overreason:'',issalemancomfig:false}; // 项目终止参数
  newuser;
  total = { count: 0};
  constructor(public settings: SettingsService, private sellproApi: SellproService,
    private datepipe: DatePipe, private storage: StorageService,
    private classifyApi: ClassifyApiService,private toast: ToasterService,) {
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
      rowSelection: 'multiple',
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      localeText: this.settings.LOCALETEXT,
      onRowSelected: (params) => {
        let allselected = this.gridOptions.api.getModel()['rowsToDisplay'];
        const selected = [];
        for (var i = 0; i < allselected.length; i++) {
          if (allselected[i].isSelected() && allselected[i].data['id']) {
            selected.push(allselected[i].data['id']);
          }
        }
        this.total.count = selected.length;
      },
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 60, pinned: 'left',
        checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '项目名称', field: 'name', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否实地拜访', field: 'isfieldvisit', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否终端项目', field: 'zhongduan', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '项目来源', field: 'projectsourcename', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '拜访方式', field: 'visitmethodname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '到访/拜访地点', field: 'visitaddr', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '接待方式', field: 'receptionname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '接待人', field: 'tusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '签单时间', field: 'sdate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '终止时间', field: 'odate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '负责人', field: 'cusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业主', field: 'owner', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户单位', field: 'customer', minWidth: 80 },
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
      { cellStyle: { 'text-align': 'center' }, headerName: '项目概况', field: 'describeproject', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '行业属性', field: 'industryattrname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '项目规模', field: 'weightrangename', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'statusname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '主推钢厂', field: 'mainsteelname', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '辅推钢厂', field: 'lesssteelname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '主推产品', field: 'gnname', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '联系人', field: 'linkmanname', minWidth: 154,
        cellRenderer: (params) => {
          if (params.data.cuserid === this.current.id) {
            return params.data.linkmanname;
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'billno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否备案', field: 'isbeian', minWidth: 100 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '审核意见', field: 'comment', minWidth: 100 },
    //   { cellStyle: { 'text-align': 'center' }, colId: 'plogcount', headerName: '日志更新条数', field: 'plogcount', minWidth: 100 },
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
    this.getstatus();
  }
  selectNull() {
    this.search = {
      area: '',
      orgid: '',
      cuserid: '',
      mainsteelid: '',
      weightrangeid: '',
      start: '',
      end: '',
      statusid: '',
      plogstart: '',
      plogend: ''
    };
  }
  /**获取状态 */
  getstatus() {
    this.statuses = [{
      label: '请选择状态',
      value: ''
    }];
    this.classifyApi.liststage('crm4_status').then(data1 => {
      data1.forEach(element => {
        this.statuses.push({
          label: element.name,
          value: element.id
        });
      });
    });
  }
  showDialog() {
    this.industrys = [];
    this.weights = [{ value: '', label: '请选择规模' }, { value: '8194', label: '0~199' }, { value: '2', label: '200~499' },
    { value: '8196', label: '≥500' }];
    this.classifyApi.getChildrenTree(null).then(data => {
      this.chandis = [{
        label: '请选择主推钢厂',
        value: ''
      }];
      data.forEach(element => {
        this.chandis.push({
          label: element.label,
          value: element.id
        });
      });
    }, err => {
    });
    this.selectNull();
    this.classicModel.show();
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
    if (this.plogstart) {
      this.months = this.getmonth(this.plogstart, this.plogend);
      console.log(this.months);
      this.gridOptions.columnDefs.forEach((colde: ColDef) => {
        if (colde.colId === 'plogcount') {
          colde.headerName = this.months + '日志更新条数';
        }
      });
      this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
      this.search['plogstart'] = this.datepipe.transform(this.plogstart, 'y-MM-dd');
      this.search['plogend'] = this.datepipe.transform(new Date(this.plogend.getFullYear(),
        this.plogend.getMonth(), this.plogend.getDate() + 1), 'y-MM-dd');
    }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    this.sellproApi.projectlist(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      this.gridOptions.columnApi.autoSizeAllColumns();
      this.classicModel.hide();
    });
  }
  getmonth(start: Date, end: Date) {
    const months = [];
    let startmonth = start.getMonth() + 1;
    const endmonth = end.getMonth() + 1;
    console.log(start.getMonth());
    console.log(end.getMonth());
    while (startmonth <= endmonth) {
      months.push(startmonth);
      startmonth++;
    }
    return months.length ? months.join(',') + '月' : '';
  }
  onGridReady(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }
  // 选择项目明细转交
  showforwardDialog() {
    this.forwardparams.projectids = [];
    let selected = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].isSelected() && selected[i].data['id']) {
        this.forwardparams.projectids.push(selected[i].data.id);
      }
    };
    if (!this.forwardparams.projectids.length) {
      this.toast.pop('error', '请选择项目明细！');
      return;
    }
    this.forwardModal.show();
  }
  forwardselectNull() {
    this.newuser = null;
    this.forwardparams.newuserid = null;
    this.forwardparams.reason = '';
  }
  forwardcoles() {
    this.forwardModal.hide();
  }
  // 确认转交
  forwardconfim() {
    if (this.newuser instanceof Object) {
      this.forwardparams['newuserid'] = this.newuser.code;
    }
    if (!this.forwardparams.reason) {
      this.toast.pop('error', '请填写转交原因！');
      return;
    }
    if (!this.forwardparams.newuserid) {
      this.toast.pop('error', '请选择转交人！');
      return;
    }
    this.sellproApi.batchforwardBPM(this.forwardparams).then(data => {
      this.forwardModal.hide();
      this.newuser = null;
      this.toast.pop('success', '转交申请提交成功！');
    });
  }
  // 选择项目明细终止
  showoverDialog() {
    this.overparams.projectids = [];
    let selected = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].isSelected() && selected[i].data['id']) {
        this.overparams.projectids.push(selected[i].data.id);
      }
    };
    if (!this.overparams.projectids.length) {
      this.toast.pop('error', '请选择项目明细！');
      return;
    }
    this.overModal.show();
  }
  overcoles() {
    this.overModal.hide();
  }
  // 确认终止
  overconfim() {
    if (!this.overparams.overreason) {
      this.toast.pop('error', '请填写转交原因！');
      return;
    }
    this.sellproApi.batchoverBPM(this.overparams).then(data => {
      this.overModal.hide();
      this.toast.pop('success', '终止申请提交成功！');
    });
  }
}
