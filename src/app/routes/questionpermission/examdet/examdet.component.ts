import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { GridOptions } from 'ag-grid';
import { SettingsService } from '../../../core/settings/settings.service';
import { QuestionapiService } from '../../question/questionapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';

@Component({
  selector: 'app-examdet',
  templateUrl: './examdet.component.html',
  styleUrls: ['./examdet.component.scss']
})
export class ExamdetComponent implements OnInit {
  search: any = {};
  start = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值
  end: Date;
  orgs = [];
  tabviewindex = 0; // 报表选项卡的索引
  @ViewChild('queryModal') private queryModal: ModalDirective;
  gridOptions: GridOptions;
  gridOptions1: GridOptions;
  constructor(public settings: SettingsService,
    private datepipe: DatePipe,
    private questionApi: QuestionapiService,
    private orgApi: OrgApiService,
    private toast: ToasterService) {
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
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '答题人数', field: 'orgusercount', width: 120
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构答题量', field: 'orgexamcount', width: 130
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构正确率', field: 'orgcorrectrate', width: 130
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '答题人员', field: 'username', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '人员答题量', field: 'userexamcount', width: 130
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '人员正确率', field: 'usercorrectrate', width: 130
      }
    ];
    this.gridOptions1 = {
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
    this.gridOptions1.groupSuppressAutoColumn = true;
    this.gridOptions1.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '答题人数', field: 'orgusercount', width: 120
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '答题人员', field: 'username', width: 120
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '题干类型', field: 'titletype', width: 150
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '题干内容', field: 'title', width: 400
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '答题次数', field: 'examcount', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '正确率', field: 'usercorrectrate', width: 100
      }
    ];
    this.getorgs();
  }

  ngOnInit() {
  }
  queryDialog() {
    this.queryModal.show();
  }
  hidequeryModal() {
    this.queryModal.hide();
  }

  selectNull() {
    this.end = undefined;
    this.start = new Date();
    this.search = {};
  }

  // 导出库存明细表
  agExport() {
    let params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '答题权限表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  listDetail() {
    this.questionApi.examdetgroupbyorg(this.search).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  query() {
    if (this.start) {
      this.search.start = this.datepipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.search.end = this.datepipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.search.end = '';
      }
      if(this.tabviewindex === 0) {
        this.questionApi.examdetgroupbyorg(this.search).then((response) => {
          this.hidequeryModal();
          this.gridOptions.api.setRowData(response); // 网格赋值
        });
      } else if (this.tabviewindex === 1) {
        this.questionApi.examdetgroupbyuser(this.search).then((response) => {
          this.hidequeryModal();
          this.gridOptions1.api.setRowData(response); // 网格赋值
        });
      }
    } else {
        this.toast.pop('warning', '开始时间必填！');
    }
  }
  /**获取机构 */
  getorgs() {
    this.orgs = [{ value: '', label: '全部' }];
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          value: element.id,
          label: element.name
        });
      });
    });
  }
  handleChange(event) {
    this.tabviewindex = event.index;
  }
}

