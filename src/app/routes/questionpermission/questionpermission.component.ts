import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { GridOptions } from 'ag-grid';
import { SettingsService } from '../../core/settings/settings.service';
import { QuestionapiService } from '../question/questionapi.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';

@Component({
  selector: 'app-questionpermission',
  templateUrl: './questionpermission.component.html',
  styleUrls: ['./questionpermission.component.scss']
})
export class QuestionPermissionComponent implements OnInit {
  permissionmodel: any = {};
  cuser = {};
  org: Org[];
  isdels = [{ value: '', label: '全部' }, { value: true, label: '是' }, { value: false, label: '否' }];
  requestparams =
    {
      // start: this.datepipe.transform(this.start, 'y-MM-dd'),
      // end: this.datepipe.transform(this.end, 'y-MM-dd')
    };
  @ViewChild('titletypeModal') private titletypeModal: ModalDirective;
  @ViewChild('addtitletypeModal') private addtitletypeModal: ModalDirective;
  parentid = 12241;
  newTreeNode: any = {parentid: this.parentid};
  titletypeData: any = [];
  gridOptions: GridOptions;
  constructor(public settings: SettingsService, private datepipe: DatePipe,
    private orgApi: OrgApiService, private questionApi: QuestionapiService, private classifyApi: ClassifyApiService,
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
      rowSelection: 'multiple',
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
    }
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, colId: 'group', headerName: '选择', field: 'group'
        , menuTabs: ['filterMenuTab'],
        width: 60, checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '题干类型', field: 'titletype', width: 180 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否机构', field: 'isorg', width: 100,
        valueGetter: (params) => {
          if (params.data) {
            return params.data.isorg ? '是' : '否';
          } else {
            return null;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '授权人', field: 'permissions', width: 200 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 200,
        valueGetter: (params) => {
          if (params.data) {
            return this.datepipe.transform(params.data['cdate'], 'y-MM-dd HH:mm');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否停用', field: 'isdel', width: 100,
        valueGetter: (params) => {
          if (params.data) {
            return params.data.isdel ? '是' : '否';
          } else {
            return null;
          }
        }
      },


    ];

  }

  ngOnInit() {
    this.listDetail();
    this.getTitletypes();
    this.getOrg();
  }

  // 获取题干类型
  getTitletypes() {
    this.questionApi.getTitletypes().then(data => {
      if (data) {
        this.titletypes = data;
      }
    });
  }

  //获取的机构
  getOrg() {
    this.org = null;
    this.questionApi.getOrgtypes().then(data => {
      if (data) {
        this.org = [];
        this.orgs = data;
      }
    })
  }

  // 列表赋值
  listDetail() {
    this.questionApi.getpermission(this.permissionmodel).then((response) => {
      this.gridOptions.api.setRowData(response);//网格赋值
    });
  }
  @ViewChild('queryModal') private queryModal: ModalDirective;
  queryDialog() {
    this.queryModal.show();
  }

  @ViewChild('createModal') private createModal: ModalDirective;
  titletypes = [];
  orgs = [];
  createDialog() {
    this.selectNull();
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }

  hidequeryModal() {

  }

  selectNull() {
    this.cuser = null;
    this.permissionmodel = {
      titletype: null,
      orgs: null
    }

  }

  createPermission() {
    if (this.cuser != null) {
      this.permissionmodel['permissions'] = this.cuser['code']
    } else {
      this.permissionmodel['permissions'] = this.permissionmodel['org']

      this.permissionmodel['permissions'] = Array.from(this.permissionmodel['org']).sort().join(',');
    }
    this.permissionmodel['cdate'] = new Date();
    this.permissionmodel['isdel'] = 0;


    this.questionApi.createpermission(this.permissionmodel).then(data => {
      this.listDetail();
      this.hidecreateModal();
    })
  }

  selectPermission() {
    //查询逻辑
    this.questionApi.getpermission(this.permissionmodel).then(data => {
      this.gridOptions.api.setRowData(data);
      this.queryModal.hide();
    });
  }

  // 停用或启用权限
  shidel: boolean;
  isdel() {
    const permissionSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的明细。
    for (let i = 0; i < permissionSelected.length; i++) {
      if (permissionSelected[i].data && permissionSelected[i].selected) {
        const updatedel = permissionSelected[i].data['isdel'] ? false : true;
        this.shidel = updatedel;
        permissionSelected[i].data['isdel'] = updatedel;
        this.questionApi.updatepermission(permissionSelected[i].data).then(data => {
          this.listDetail();
        });
        console.log(permissionSelected[i].data);
      }
    }
    if (permissionSelected.length < 1) {
      this.toast.pop('warning', '请选择需要停用的明细！！！');
      return;
    }
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
  showtitletypeModal() {
    this.titletypeModal.show();
    this.classifyApi.getChildrenTree({pid: this.parentid}).then(data => {
      this.titletypeData = data;
    });
  }
  hidetitletypeModal() {
    this.titletypeModal.hide();
  }
  edittitle(item) {
    this.classifyApi.get(item.id).then(clas => {
      const model = JSON.parse(JSON.stringify(clas));
      if (item.isdel) {
        if (confirm('您确定要启用吗？')) {
          model.isdel = false;
        }
      } else {
        if (confirm('您确定要停用吗？')) {
          model.isdel = true;
        }
      }
      this.classifyApi.update(model['id'], model).then((model1) => {
        this.classifyApi.getChildrenTree({pid: this.parentid}).then(data1 => {
          this.titletypeData = data1;
        });
      });
    });
  }
  showaddtitle() {
    this.addtitletypeModal.show();
    this.newTreeNode = {parentid: this.parentid};
  }
  hideaddtitle() {
    this.addtitletypeModal.hide();
  }
  addNode() {
    this.classifyApi.addNode(this.newTreeNode).then(data => {
      this.hideaddtitle();
      this.classifyApi.getChildrenTree({pid: this.parentid}).then(data1 => {
        this.titletypeData = data1;
      });
    });
  }
}

export class Org {
  label: string;
  value: string;
}

