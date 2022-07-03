import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ReportService } from './../../report/report.service';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { CustomerapiService } from './../../customer/customerapi.service';
import { XiaoshouapiService } from './../xiaoshouapi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tihuodet',
  templateUrl: './tihuodet.component.html',
  styleUrls: ['./tihuodet.component.scss']
})
export class TihuodetComponent implements OnInit {
  flags: ({ label: string; value: string; } | { value: boolean; label: string; })[];
  names: ({ label: string; value: string; } | { value: number; label: string; })[];
  cangku: any[];
  gns: any;
  orgs: any = [];
  transportCompany: any[];
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  requestparams = {
    gnid: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '',
    duceng: '', caizhi: '', ppro: '', cuserid: '', id: '', start: '', end: '',
    shitistart: '', shitiend: '', buyerid: '', tihuotype: '', status: '', orgid: '', kunbaohao: ''
  };
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private tihuoApi: XiaoshouapiService,
    private customerApi: CustomerapiService, private orgApi: OrgApiService,
    private classifyApi: ClassifyApiService, private reportApi: ReportService,
    private toast: ToasterService, private datepipe: DatePipe) {
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
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data) {
            return '<a target="_blank" href="#/tihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细ID', field: 'tihuodetid', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方', field: 'buyername', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '线上', field: 'isonline', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '主表状态', field: 'billstatus', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细状态', field: 'detstatus', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        headerName: '费用', cellStyle: { 'text-align': 'center' },
        children: [
          {
            cellStyle: { 'text-align': 'right' }, headerName: '应付单价', field: 'yffeeprice', minWidth: 100,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '应付金额', field: 'yffeejine', minWidth: 100, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data) {
                return Number(params.data['yffeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '应收单价', field: 'ysfeeprice', minWidth: 100,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '应收金额', field: 'ysfeejine', minWidth: 100, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data) {
                return Number(params.data['ysfeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          }
        ]
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60,
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
      { cellStyle: { 'text-align': 'center' }, headerName: '预估费用明细', field: 'yugufeedetail', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 75 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存ID', field: 'kucunid', minWidth: 75,
        cellRenderer: (params) => {
          if (params.data) {
            if (null != params.data.kucunid) {
              return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
            }
          } else {
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
    if (this.cuser) {
      this.requestparams.cuserid = this.cuser.code;
    }
    if (this.companys) {
      this.requestparams.buyerid = this.companys['code'];
    }
    if (this.saleman) {
      this.requestparams['salemanid'] = this.saleman['code'];
    }
    this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    if (this.end) { this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd'); }
    if (this.shitistart) { this.requestparams.shitistart = this.datepipe.transform(this.shitistart, 'y-MM-dd'); }
    if (this.shitiend) { this.requestparams.shitiend = this.datepipe.transform(this.shitiend, 'y-MM-dd'); }
    this.tihuoApi.tihuodet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  };

  openQueryDialog() {

    this.names = [{ label: '全部', value: '' }, { value: 1, label: '已实提' }, { value: 2, label: '未实提' }, { value: 3, label: '已作废' }];
    this.customerApi.findwl().then(data => {
      this.transportCompany = data;
    });
    this.orgs = [{ label: '全部', value: '' }];
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          label: element.name,
          value: element.id
        });
      });
    });

    // 查找商品
    this.gns = [{ label: '全部', value: '' }];
    // this.classifyApi.getarea().then((resource) => {
    //   resource['gn'].forEach(element => {
    //     this.gns.push({
    //       label: element.name,
    //       value: element.id
    //     });
    //   });
    // });
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
    this.flags = [{ label: '全部', value: '' }, { value: false, label: '线下' }, { value: true, label: '线上' }];
    this.showDialog();
  }

  data = [];

  disabled = true;

  // 品名选中改变
  selectGnAction(key) {
    if (!this.requestparams[key]) return;
    else {
      let gnid = this.requestparams['gnid'];
    }
    this.reportApi.getGoodscodeAttribute({ gnid: this.requestparams['gnid'] }).then(data => {
      this.data = data;
      this.filter();
    });
    this.disabled = false;
  }

  // 常量作为字段名
  fieldArr = [
    'chandi', // 产地
    'color',// 颜色
    'width', // 宽度
    'houdu',// 厚度 
    'duceng', // 镀层
    'caizhi', // 材质
    'ppro'// 后处理
  ];

  // 定义过滤之后的集合
  filterConditionObj = {}; // {chandi:[],width:[]}

  // 赛选过滤方法
  filter() {
    this.fieldArr.forEach(fieldElement => {
      // 除自己以外其他字段
      let otherFieldArr = this.fieldArr.filter(element => element != fieldElement);
      let queryOptions = [{ value: '', label: '全部' }];
      otherFieldArr.forEach(otherFieldElement => {
        this.data.forEach(dataElement => {
          if (otherFieldArr.every(otherField => {
            return this.requestparams[otherField] == '' || dataElement[otherField] == this.requestparams[otherField];
          })) {
            let fieldValue = dataElement[fieldElement];
            if (fieldValue != null && JSON.stringify(queryOptions).indexOf(JSON.stringify(fieldValue)) == -1) {
              queryOptions.push({ value: fieldValue, label: fieldValue });
            }
          }
        });
        this.filterConditionObj[fieldElement] = queryOptions;
      })
    });
  }

  maxDate = new Date();


  // 子类型选择
  selectAction(key) {
    this.filter();
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

  cuser;

  companys;

  saleman;

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
    this.cuser = null;
    this.companys = null;
    this.saleman = null;
    this.requestparams = { gnid: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '', ppro: '', cuserid: '', id: '', start: '', end: '', shitistart: '', shitiend: '', buyerid: '', tihuotype: '', status: '', orgid: '', kunbaohao: '' };
    this.disabled = true;
    this.attrs = [];
  }
  /**下载模板 */
  downExcel() {
    this.tihuoApi.downloadExcel().then(data => {
      window.open(data['url']);
      this.toast.pop('success', '下载成功！');
    });
  }
  // 匹配提货弹窗对象
  @ViewChild('parentModal') private parentModal: ModalDirective;
  pipeiTihuo(){
    this.parentModal.show();
  }
  hideppth(){
    this.parentModal.hide();
  }
// 每刻报上传信息及格式
uploadParam: any = { module: 'pipeitihuo', count: 1, sizemax: 1, extensions: ['xls'] };

// 设置上传的格式
accept = '.xls, application/xls';
// 上传成功执行的回调方法
uploads($event) {
  const addData = [$event.url];
  if ($event.length !== 0) {
    this.tihuoApi.pipeiTihuo(addData).then(data => {
      this.toast.pop('success', '上传成功！');
      this.listDetail();
    });
  }
  this.listDetail();
  this.hideppth();
}
selectgn(params) {
  this.mdmgndialog.hide();
  const item = params['item'];
  const attrs = params['attrs'];
  this.requestparams['gn'] = item.itemname;
  this.disabled = false;
  for (let i = 0; i < attrs.length; i++) {
    const element = attrs[i];
    this.requestparams[element.value] = '';
    element['options'].unshift({ value: '', label: '全部' });
  }
  this.attrs = attrs;
  for (let i = 0; i < this.attrs.length; i++) {
    const element = this.attrs[i];
    if (element['defaultval'] && element['options'].length) {
      this.requestparams[element['value']] = element['defaultval'];
    }
  }
}
}
