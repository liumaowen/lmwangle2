import { DeptpriceapiService } from './../../deptprice/deptpriceapi.service';
import { GetdayPipe } from './../../../dnn/shared/pipe/getday.pipe';
import { OrderstatusPipe } from './../../../dnn/shared/pipe/orderstatus.pipe';
import { DecimalPipe, DatePipe } from '@angular/common';
import { element } from 'protractor';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserapiService } from './../../../dnn/service/userapi.service';
// import { KucunqueryComponent } from './../kucunquery/kucunquery.component';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { KucunService } from './../kucun.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-kucun',
  templateUrl: './kucun.component.html',
  styleUrls: ['./kucun.component.scss']
})
export class KucunComponent implements OnInit {

  //汇总消息，求和
  msg;

  bsmodalref: BsModalRef;

  gridOptions: GridOptions;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  constructor(public settings: SettingsService, private kucunapi: KucunService, private bsmodalService: BsModalService, private userapi: UserapiService, private toast: ToasterService, private router: Router, private numberpipe: DecimalPipe, private orderstatus: OrderstatusPipe, private datepipe: DatePipe, private getday: GetdayPipe, private deptpriceApi: DeptpriceapiService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: "multiple",
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
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;


    //设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true , valueGetter: (params) => '合计'},
      { cellStyle: { "text-align": "left" }, headerName: '选择', minWidth: 30, checkboxSelection: true, suppressMenu: true },
      {
        cellStyle: { "text-align": "center" }, headerName: '品名', field: 'gn', minWidth: 43, 
        cellRenderer: (params) => {
          if (params.data) {
            return "<a>" + params.data['gn'] + "</a>";
          }else {
            return '合计';
          }
        }, onCellClicked: (params) => {
          let search = {};
          if (params.node.data) {
            search['gcid'] = params.node.data.gcid;
            search['cangkuid'] = params.node.data.cangkuid;
            search['orgid'] = params.node.data.orgid;
            this.kucunapi.summaryDetail(search).then(data => {
              console.log(data);
              this.kcmxgridOptions.api.setRowData(data);
              this.openhz();
            })
          }
        }
      },
      { cellStyle: { "text-align": "center" }, headerName: '产地', field: 'chandi', minWidth: 80 },
      { cellStyle: { "text-align": "center" }, headerName: '仓库', field: 'cangkuname', minWidth: 60 },
      { cellStyle: { "text-align": "center" }, headerName: '宽度', field: 'width', minWidth: 57},
      { cellStyle: { "text-align": "center" }, headerName: '厚度', field: 'houdu', minWidth: 57 ,
      valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色锌花', field: 'color', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '价格', field: 'price', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '件数', field: 'tcount', minWidth: 90 , aggFunc: 'sum'},
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'tweight', minWidth: 57, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tweight']) {
            return Number(params.data['tweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '米数', field: 'tlength', minWidth: 57 , aggFunc: 'sum'}
    ];


    //库存汇总明细表初始化
    this.kcmxgridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
    };

    this.kcmxgridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.kcmxgridOptions.groupSuppressAutoColumn = true;

    //设置aggird表格列
    this.kcmxgridOptions.columnDefs = [

      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢厂资源号', field: 'grno', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '批次号', field: 'nrno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢卷号', field: 'kunbaohao', minWidth: 57 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'right' }, headerName: '米数', field: 'lengths', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库龄（ERP）', field: 'kuling', minWidth: 80,
        valueGetter: parmas => this.getday.transform(parmas.data['kuling']) },
      { cellStyle: { 'text-align': 'center' }, headerName: '入库库龄', field: 'cdate', minWidth: 90,
        valueGetter: parmas => this.getday.transform(parmas.data['kuling']) },
      { cellStyle: { 'text-align': 'center' }, headerName: '入库时间', field: 'cdate', minWidth: 90,
        valueGetter: parmas => this.datepipe.transform(parmas.data['cdate'], 'y-MM-dd') },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'billno', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单状态', field: 'orderstatus', minWidth: 60,
        valueGetter: parmas => this.orderstatus.transform(parmas.data['orderstatus']) },
      { cellStyle: { 'text-align': 'center' }, headerName: '下单时间', field: 'orderdate', minWidth: 57,
        valueGetter: parmas => this.datepipe.transform(parmas.data['orderdate'], 'y-MM-dd') },
      { cellStyle: { 'text-align': 'center' }, headerName: '锁货人/客户', field: 'lockuserorcompany', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锁货结束时间', field: 'enddate', minWidth: 90,
        valueGetter: parmas => this.datepipe.transform(parmas.data['enddate'], 'y-MM-dd HH:mm:ss') }
    ];
  }

  ngOnInit() {
    this.listDetail();
  }

  listDetail() {
    this.kucunapi.listSearch(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      this.msg = '';
      let total = { count: 0, weight: 0, length: 0 };
      data.forEach(element => {
        total['count'] = total['count'] + element['tcount'];
        total['weight'] = total['weight'] + element['tweight'];
        total['length'] = total['length'] + element['tlength'];
      });
      this.msg = this.msg + '共' + total['count'] + '件，';
      this.msg = this.msg + '共' + this.numberpipe.transform(total['weight'], '1.3-3') + '吨，';
      this.msg = this.msg + '共' + total['length'] + '米';
    })
  }

  //查询对象
  search = { gn: '', cangkuid: '', orgid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '', ppro: '' };

  //打开查询窗口
  openQueryDialog() {
    // this.bsmodalref = this.bsmodalService.show(KucunqueryComponent);
    this.bsmodalref.content.queryparent = this;
    this.bsmodalref.content.list = this.listDetail();
  }

  //打开查询弹窗
  openclassicmodal() {
    if (!this.items) {
      this.items = [{ value: '', label: '全部' }];
      this.userapi.searchjigou(0).then(data => {
        data.forEach(element => {
          this.items.push({
            value: element['id'],
            label: element['name']
          });
        });
      });
    }
    if (!this.pmitems) {
      this.pmitems = [{ value: '', label: '全部' }];
      this.userapi.getarea().then(data => {
        data['gn'].forEach(element => {
          this.pmitems.push({
            value: element['name'],
            label: element['name']
          });
        });
      });
    }
    if (!this.ckitems) {
      this.ckitems = [{ value: '', label: '全部' }];
      this.userapi.cangkulist().then(data => {
        data.forEach(element => {
          this.ckitems.push({
            value: element['id'],
            label: element['name']
          });
        });
      });
    }
    this.selectNull();
    this.classicModal.show();
  }

  //默认禁止选择
  disabled = true;

  //查询出来所有的分类
  data = new Array<any>();

  //品名选中改变
  selectGnAction(key) {
    if (!this.search[key]) return;
    else {
      let gnid = this.search['gnid'];
    }
    this.kucunapi.getConditions({ gn: this.search['gn'] }).then(data => {
      this.data = data;
      this.filter();
    });
    this.disabled = false;
  }

  //常量作为字段名
  fieldArr = [
    'chandi',//产地
    'color',//颜色
    'width', //宽度
    'houdu',//厚度 
    'duceng', //镀层
    'caizhi', //材质
    'ppro'//后处理
  ];

  //定义过滤之后的集合
  filterConditionObj = {}; //{chandi:[],width:[]}

  // 赛选过滤方法
  filter() {
    for (let index = 0; index < this.fieldArr.length; index++) {
      const fieldElement = this.fieldArr[index];
      // 除自己以外其他字段
      const otherFieldArr = this.fieldArr.filter(element => element !== fieldElement);
      const queryOptions = [{ value: '', label: '全部' }];
      otherFieldArr.forEach(otherFieldElement => {
        this.data.forEach(dataElement => {
          if (otherFieldArr.every(otherField => {
            return this.search[otherField] === '' || dataElement[otherField] === this.search[otherField];
          })) {
            const fieldValue = dataElement[fieldElement];
            if (fieldValue != null && JSON.stringify(queryOptions).indexOf(JSON.stringify(fieldValue)) == -1) {
              queryOptions.push({ value: fieldValue, label: fieldValue });
            }
          }
        });
        this.filterConditionObj[fieldElement] = queryOptions;
      });
    }
  }

  // 全选
  checkAlls() {
    this.gridOptions.api.selectAll();
  }
  // 取消选择
  uncheckAll() {
    this.gridOptions.api.deselectAll();
  };

  //子类型选择
  selectAction(key, value) {
    this.filter();
  }

  //重置查询条件
  selectNull() {
    this.search = { gn: '', cangkuid: '', orgid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '', ppro: '' };
    this.disabled = true;
    this.attrs = [];
  }

  //查询
  select() {
    this.listDetail();
    this.closeclassicmodal();
  }

  //查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;

  //机构
  items;

  //品名
  pmitems;

  //仓库
  ckitems;

  //产地
  cditems;

  //颜色
  coloritems;

  //宽度
  widthitems;

  //厚度
  hditems;

  //镀层
  dcitems;

  //材质
  czitems;

  //后处理
  hclitems;

  //关闭查询弹窗
  closeclassicmodal() {
    this.classicModal.hide();
  }

  //调价
  adjust() {
    let ids = new Array();
    let kucuns = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (var i = 0; i < kucuns.length; i++) {
      if (kucuns[i].selected && kucuns[i].data) {
        let params = new Object();
        params['cangkuid'] = kucuns[i].data.cangkuid;
        params['gcid'] = kucuns[i].data.gcid;
        params['orgid'] = kucuns[i].data.orgid;
        params['origindeptprice'] = kucuns[i].data.price;
        ids.push(params);
      }
    }
    if (ids.length === 0) {
      this.toast.pop('warning', '请选择要调整的数据');
      return '';
    }
    console.log(ids);

    this.deptpriceApi.listSummery({ json: ids }).then((data) => {
      // $state.go('app.deptpricedet', { params: data });
      // console.log('JSON.stringify(data)', JSON.stringify(data));
      this.router.navigate(['deptpricedet', JSON.stringify(data)]);
    });
    // console.log(ids);
  }

  //获取弹窗对象
  @ViewChild('staticModal') private staticModal: ModalDirective;

  //打开库存汇总明细
  openhz() {
    this.staticModal.show();
  }

  //关闭库存汇总明细
  closehz() {
    this.staticModal.hide();
  }

  //库存汇总明细表
  kcmxgridOptions: GridOptions;

  //全选
  checkAll() {
    this.kcmxgridOptions.api.selectAll();
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.search['gn'] = item.itemname;
    this.disabled = false;
    for (let i = 0; i < attrs.length; i++) {
      const element = attrs[i];
      this.search[element.value] = '';
      element['options'].unshift({ value: '', label: '全部' });
    }
    this.attrs = attrs;
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      if (element['defaultval'] && element['options'].length) {
        this.search[element['value']] = element['defaultval'];
      }
    }
  }
}
