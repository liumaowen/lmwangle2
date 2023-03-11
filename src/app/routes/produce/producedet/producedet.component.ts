import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProduceapiService } from './../produceapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { SettingsService } from './../../../core/settings/settings.service';
import { ColDef, GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-producedet',
  templateUrl: './producedet.component.html',
  styleUrls: ['./producedet.component.scss']
})
export class ProducedetComponent implements OnInit {

  start = new Date();

  end = new Date();

  maxDate = new Date();

  // 买方单位
  companys;

  // 加工单位
  companyProduce;

  // 制单人
  cuser;
  @ViewChild('createModal') private createModal: ModalDirective;
  ysdate: Date;
  types = [];
  statuss = [];
  orgs = [];
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 弹出创建对话框
  produce: any = {};
  companyOfSale;

  companyOfProduce;
  requestparams = {
    type: '', cuserid: '', start: this.datepipe.transform(this.start, 'y-MM-dd'),
    end: '', buyerid: '', status: '', orgid: '', jgdwid: '', ysdate: '', billno: ''
  };

  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private toast: ToasterService,
    private produceApi: ProduceapiService, private orgApi: OrgApiService, private datepipe: DatePipe, private router: Router) {
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
      // onCellClicked: (event) => {
      //   this.gridOptions.api.deselectAll();
      // },
      // onCellDoubleClicked: function (event) {
      //   event.node.setSelected(true, true);
      // }
    };
    // this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: (params) => {
          if (params.data) {
            return '<a target="_blank" href="#/produce/' + params.data.produceid + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品类型', field: 'ftype', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品状态', field: 'status', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyername', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 110 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '成品重量', field: 'fweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['fweight']) {
            return Number(params.data['fweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '基料重量', field: 'bweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['bweight']) {
            return Number(params.data['bweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '销售单价', field: 'fpertprice', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '成本单价', field: 'chengben', width: 90,
        cellRenderer: (params) => {
          if (params.data) {
            if (null === params.data['chengben']) {
              return '';
            } else {
              return '<a target="_blank" href="#/producechengben/' + params.data.fid + '">' + params.data.chengben + '</a>';
            }
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '成本金额', field: 'chengbenjine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['chengbenjine']) {
            return params.data['chengbenjine'];
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '销售金额', field: 'fjine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['fjine']) {
            return Number(params.data['fjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否外贸', field: 'isft', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工单位', field: 'jgdw', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cuser', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'auser', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '验收时间', field: 'ysdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '成品id', field: 'fid', width: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: 'kucunid', field: 'kucunid', width: 100,
        cellRenderer: (params) => {
          if (params.data) {
            if (null == params.data.kucunid) {
              return '' + params.data.fid;
            } else {
              return '' + params.data.kucunid;
            }
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcid', field: 'gcid', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
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
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'buyername2', minWidth: 80 , colId: 'buyername2'},
      { cellStyle: { 'text-align': 'center' }, headerName: '销售公司', field: 'sellername', minWidth: 80 , colId: 'sellername'},
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单价', field: 'feeprice', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用金额', field: 'feejine', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否备货', field: 'beihuo', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '指导价格', field: 'zhidaojiagedesc', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '鼓励类', field: 'urge', minWidth: 60 },
    ];
    this.getMyRole();
    // this.listDetail();
  }
  ngOnInit() {
  }
  // 获取表格数据
  listDetail = () => {
    this.produceApi.producedet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  selectNull() {
    this.companys = undefined;
    this.companyProduce = undefined;
    this.cuser = undefined;
    this.start = new Date();
    this.end = new Date();
    this.maxDate = new Date();
    this.ysdate = undefined;
    this.requestparams = {
      type: '', cuserid: '', start: this.datepipe.transform(this.start, 'y-MM-dd'),
      end: this.datepipe.transform(this.end, 'y-MM-dd'), buyerid: '', status: '',
      orgid: '', jgdwid: '', ysdate: '', billno: ''
    };
  }


  openQueryDialog() {
    this.selectNull();
    this.types = [{ value: '', label: '全部' },
    { value: 1, label: '成品' },
    { value: 2, label: '余卷' },
    { value: 3, label: '边料' },
    { value: 4, label: '边丝' }];
    this.statuss = [{ value: '', label: '全部' }, { value: true, label: '已验收' }, { value: false, label: '未验收' }];
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
    // ngDialog.open({
    //   template: 'views/produce/producedet_query.html',
    //   scope: $scope,
    //   className: 'ngdialog-theme-default ngdialog-width-600',
    //   closeByDocument: false,
    //   closeByEscape: false,
    //   showClose: true
    // });
    // this.requestparams.start = $filter('date')($scope.requestparams.start, 'yyyy-MM-dd');
    // this.requestparams.end = $filter('date')($scope.requestparams.end, 'yyyy-MM-dd');
  }

  query() {
    this.requestparams['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    this.requestparams['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    if (this.ysdate) {
      this.requestparams['ysdate'] = this.datepipe.transform(this.ysdate, 'y-MM-dd');
    }
    if (this.companys) {
      if (typeof (this.companys) === 'string') {
        this.requestparams['buyerid'] = '';
        this.toast.pop('warning', '输入无效,请输入选择买方单位！！！');
        return '';
      } else {
        this.requestparams['buyerid'] = this.companys.code;
      }
    } else {
      this.requestparams['buyerid'] = '';
    }
    if (this.companyProduce) {
      if (typeof (this.companyProduce) === 'string') {
        this.requestparams['jgdwid'] = '';
        this.toast.pop('warning', '输入无效,请输入选择加工单位！！！');
        return '';
      } else {
        this.requestparams['jgdwid'] = this.companyProduce.code;
      }
    } else {
      this.requestparams['jgdwid'] = '';
    }
    if (this.cuser) {
      if (typeof (this.cuser) === 'string') {
        this.requestparams['cuserid'] = '';
        this.toast.pop('warning', '输入无效,请输入选择制单人！！！');
        return '';
      } else {
        this.requestparams['cuserid'] = this.cuser.code;
      }
    } else {
      this.requestparams['cuserid'] = '';
    }
    console.log(this.requestparams);
    this.listDetail();
    this.coles();
  }

  showClassicModal() {
    this.classicModal.show();
  }
  coles() {
    this.classicModal.hide();
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
      fileName: '加工单明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }




  createDialog() {
    this.clear();
    this.produce['producetype'] = '1';
    this.showcreatemodal();
    // ngDialog.open({
    //   template: 'views/produce/produce_create.html',
    //   scope: $scope,
    //   className: 'ngdialog-theme-default ngdialog-width-600',
    //   closeByDocument: true,
    //   closeByEscape: true,
    //   showClose: true
    // });
  }

  clear() {
    this.produce = {};
    this.produce['producetype'] = 1;
    this.companyOfSale = undefined;
    this.companyOfProduce = undefined;
  }


  // 创建
  create() {
    if (this.companyOfProduce) {
      if (typeof (this.companyOfProduce) === 'string') {
        this.toast.pop('warning', '输入无效,请输入选择加工单位！！！');
        return '';
      } else {
        this.produce['jgdwid'] = this.companyOfProduce.code;
      }
    } else {
      this.toast.pop('warning', '请选择货物加工公司');
      return '';
    }
    if (typeof (this.produce['orderno']) === 'string') {
      this.produce['orderno'] = this.produce['orderno'].trim();
    }
    if (this.produce['producemode'] === '2') {
      if (!this.produce['orderno']) {
        this.toast.pop('warning', '请输入加工订单号');
        return '';
      }
    }
    // if (this.companyOfSale) {
    //   if (typeof (this.companyOfSale) === 'string') {
    //     this.toast.pop('warning', '输入无效,请输入选择客户单位！！！');
    //     return '';
    //   } else {
    //     this.produce['buyerid'] = this.companyOfSale.code;
    //   }
    // } else {
    //   this.toast.pop('warning', '请选择客户单位');
    //   return '';
    // }
    // this.produce['jgdwid'] = this.companyOfProduce.selected.id;
    // this.produce['buyerid'] = this.companyOfSale.selected.id;
    console.log(this.produce);
    if (confirm('你确定创建吗？')) {
      this.produceApi.create(this.produce).then((data) => {
        // ngDialog.close();
        this.hidecreatemodal();
        this.router.navigate(['produce', data['id']]);
        console.log(data);
        // $state.go('app.produce-view', { id: data.id });
      });
    }
  }

  showcreatemodal() {
    this.createModal.show();
  }
  hidecreatemodal() {
    this.createModal.hide();
  }
  // 基 料成本计算
  calcBmChengben() {
    if (confirm('你要计算基料成本吗？')) {
      this.produceApi.calcBmchengben().then(data => {
        this.toast.pop('success', '计算成功');
      });
    }

  }
  // 获取用户角色，如果登陆的用户不是财务，设置为不可见
  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    this.gridOptions.columnDefs.forEach((colde: ColDef) => {
      // 如果登陆的用户是非财务人员，设置为不可见
      if (!myrole.some(item => item === 5 || item === 35)) {
        if (colde.colId === 'buyername2' || colde.colId === 'sellername') {
          colde.hide = true;
          colde.suppressToolPanel = true;
        }
      }
    });
  }
}
