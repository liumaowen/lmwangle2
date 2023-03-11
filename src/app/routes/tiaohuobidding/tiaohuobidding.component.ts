import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { GridOptions, ColDef } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
const sweetalert = require('sweetalert');
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { SettingsService } from 'app/core/settings/settings.service';
import { TiaohuobiddingService } from './tiaohuobidding.service';
import { BiddingorderimportComponent } from '../fee/wuliubaojiadet/biddingorderimport/biddingorderimport.component';
import { QihuoService } from '../qihuo/qihuo.service';

@Component({
  selector: 'app-tiaohuobidding',
  templateUrl: './tiaohuobidding.component.html',
  styleUrls: ['./tiaohuobidding.component.scss']
})
export class TiaohuobiddingComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('manualModel') private manualModel: ModalDirective;
  @ViewChild('createtiaohuodialog') private createtiaohuodialog: ModalDirective;
  start = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值
  end: Date;
  maxDate = new Date();
  requestparams: any = {
    start: this.datePipe.transform(this.start, 'y-MM-dd'),
    end: '', supplierid: '', salemanid: '', orgid: '', isdel: false
  };
  gridOptions: GridOptions;
  orgs = [];
  saleman: any = {};
  // 中选单列表弹窗对象
  bobsModalRef: BsModalRef;
  count = 0;
  sumweight = '0';

  manualQuote: any = {}; // 手动报价对象
  tiaohuoids: any = [];
  istiaohuobidding = true; // 查询中选单页面判断是否来源于调货竞价
  gns: any[] = [];
  chandis: any[] = [];
  isChandi = false;
  attrs: any[] = [];
  guigelength: number; // 声明一个数量计算器
  showGuige = false;
  tiaohuodetmodel: any = {
    gnid1: '', gnid: '', chandiid: '', colorid: '', widthid: '', houduid: '', ducengid: '', caizhiid: '', weight: '',
    oneweight: null, jiaohuodate: null, jiaohuoaddr: null, houdugongcha: null, widthgongcha: null, weightgongcha: null,
    classifys: null
  };
  gcs: any[] = [];
  manuallist: any = []; // 手动报价列表
  one: Boolean = true;
  two: Boolean = false;
  houdugongchas: any[];
  widthgongchas: any[];
  yongtus: any[];
  oneweights: any[];
  jiaohuoaddrs: any[];
  zhidaoprices: any = [];
  isurgent: any = [];
  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private tiaohuobiddingApi: TiaohuobiddingService,
    private toast: ToasterService,
    private orgApi: OrgApiService,
    private bsModalService: BsModalService,
    private classifyApi: ClassifyApiService,
    private qihuoapi: QihuoService,
    private router: Router) {
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
      rowSelection: 'multiple',
      localeText: this.settings.LOCALETEXT,
      onRowSelected: (params) => {
        if (params.node['selected']) {
          if (params.data) {
            this.count += 1;
            this.sumweight = (Number(this.sumweight) + Number(params.node.data.weight)).toFixed(3);
          }
        } else {
          if (params.data) {
            this.count = this.count - 1;
            this.sumweight = (Number(this.sumweight) - Number(params.node.data.weight)).toFixed(3);
          }
        }
      },
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, colId: 'group', headerName: '选择', field: 'group'
        ,
        minWidth: 60, checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源外务', field: 'waiwuname', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '请购单号', field: 'purchaserequestno', minWidth: 100,
        menuTabs: ['filterMenuTab'], cellRenderer: function (params) {
          if (params.data) {
            if (params.data['biddingorderid']) {
              return '<a>' + params.data.purchaserequestno + '</a>';
            } else {
              return params.data.purchaserequestno;
            }
          }
        }, onCellClicked: (data) => {
          if (data.data['biddingorderid']) {
            this.gozhongxuandan(data.data['biddingorderid']);
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'statusname', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'price', minWidth: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'suppliername', headerName: '供应商', field: 'suppliername',
        minWidth: 100
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订货量', field: 'tweight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '中选量', field: 'weight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价时间', field: 'baojiadate', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 80 }
    ];
    this.getorgs();
  }
  ngOnInit() {
    this.listDetail();
  }

  listDetail() {
    this.tiaohuobiddingApi.find(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
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
  openQueryDialog() {
    this.showclassicModal();
    this.selectNull();
  }

  selectNull() {
    this.requestparams = {
      start: this.datePipe.transform(this.start, 'y-MM-dd'),
      end: '', supplierid: '', salemanid: '', orgid: '', isdel: false
    };
    this.end = undefined;
    this.start = new Date();
    this.saleman = null;
  }

  // 查询
  query() {
    if (this.start) {
      this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.requestparams.end = '';
      }
      if (typeof (this.saleman) === 'string' || !this.saleman) {
        this.requestparams['salemanid'] = '';
      } else if (typeof (this.saleman) === 'object') {
        this.requestparams.salemanid = this.saleman['id'];
      }
      if (this.requestparams['supplierid'] instanceof Object) {
        this.requestparams['supplierid'] = this.requestparams['supplierid'].code;
      } else {
        this.requestparams['supplierid'] = '';
      }
      this.listDetail();
      this.hideclassicModal();
    } else {
      this.toast.pop('warning', '开始时间必填！');
    }
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
      fileName: '调货竞价明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  /**查询弹窗 */
  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  /**填写报价弹窗 */
  showbaojiamodal() {
    const tiaohuoids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        tiaohuoids.push(orderdetSelected[i].data.tiaohuobiddingid);
        if (orderdetSelected[i].data.status !== 4) {
          this.toast.pop('warning', '只有已发送SCC的明细才可以手动报价！！！');
          return;
        }
      }
    }
    if (tiaohuoids.length < 1) {
      this.toast.pop('warning', '请选择调货竞价明细！！！');
      return;
    }
    if (tiaohuoids.length > 1) {
      this.toast.pop('warning', '请选择一条调货竞价明细！！！');
      return;
    }
    this.manualQuote = {};
    this.manualQuote['tiaohuobiddingid'] = tiaohuoids[0];
    this.manuallist = [{}];
    this.manualModel.show();
  }
  /**关闭报价弹窗 */
  closemanualdialog() {
    this.manualModel.hide();
  }
  addmanualQuote() {
    const isall = this.manuallist.some(manual => !manual['weight'] || !manual['price'] || !manual['supplierid']);
    if (isall) {
      this.toast.pop('warning', '请填写完成!');
      return;
    }
    this.manuallist.forEach(ele => {
      if (ele['supplierid'] instanceof Object) {
        ele['supplierid'] = ele['supplierid'].code;
      } else {
        ele['supplierid'] = null;
      }
    });
    this.manualQuote['manuallist'] = this.manuallist;
    this.tiaohuobiddingApi.manualquote(this.manualQuote).then(data => {
      this.toast.pop('success', '报价添加成功');
      this.closemanualdialog();
      this.listDetail();
    });
  }
  // 中选单列表
  showbiddingorder() {
    const wuliuorderdetids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        wuliuorderdetids.push(orderdetSelected[i].data.tiaohuobiddingid);
        if (orderdetSelected[i].data.status !== 4) {
          this.toast.pop('warning', '请选择已发送SCC的明细！！！');
          return;
        }
      }
    }
    if (wuliuorderdetids.length < 1) {
      this.toast.pop('warning', '请选择调货竞价明细！！！');
      return;
    }
    this.tiaohuoids = wuliuorderdetids;
    this.bsModalService.config.class = 'modal-all';
    this.bobsModalRef = this.bsModalService.show(BiddingorderimportComponent);
    this.bobsModalRef.content.parentthis = this;
  }
  /**SCC请购物流竞价服务 */
  SCCgetprice() {
    const tiaohuobidids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        if (orderdetSelected[i].data.status !== 3) {
          this.toast.pop('warning', '请选择待竞价的明细同步到SCC！！！');
          return;
        }
        tiaohuobidids.push(orderdetSelected[i].data.tiaohuobiddingid);
      }
    }
    if (tiaohuobidids.length < 1) {
      this.toast.pop('warning', '请选择需要询价的调货竞价明细！！！');
      return;
    }
    this.tiaohuobiddingApi.pushdatatoscc(tiaohuobidids).then(data => {
      this.toast.pop('success', 'SCC询价成功');
      this.listDetail();
    });
  }
  /**
   * 调货竞价明细作废
   */
  zuofei() {
    const wuliuorderdetids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        wuliuorderdetids.push(orderdetSelected[i].data.tiaohuobiddingid);
      }
    }
    if (wuliuorderdetids.length < 1) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    sweetalert({
      title: '你确定要作废吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.tiaohuobiddingApi.zuofei(wuliuorderdetids).then(data => {
        this.toast.pop('success', '作废成功');
        this.listDetail();
      });
      sweetalert.close();
    });
  }
  /**跳转scc中选单 */
  gozhongxuandan(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      if (environment.ismenhu) {
        window.open(`${environment.mainappUrl}`, '_self');
        return;
      }
      this.router.navigateByUrl('/passport/login');
      return;
    }
    const url = `${environment.sccUrl}`;
    if (url) {
      const esystem = window.open(`${url}#/buy/bidding-management/${id}`);
      const setToken = () => {
        esystem.postMessage({ type: 'wsdtoken', data: token }, url);
      };
      const timer = setInterval(setToken, 100);
      const timeOutr = setTimeout(() => {
        if (timer) {
          clearInterval(timer);
        }
      }, 5000);
      window.addEventListener('message', (e: any) => {
        if (e.data === 'wsdloginsuccess') {
          window.removeEventListener('message', setToken, true);
          clearTimeout(timeOutr);
          clearInterval(timer);
        }
      }, true);
    }
  }
  openCreateDialog() {
    this.createselectNull();
    this.createtiaohuodialog.show();
    this.getGnAndChandi();
    this.zhidaoprices = [{ label: '请选择。。。', value: null }, { value: '0', label: '正常' },
     { value: '1', label: '低于' }, { value: '2', label: '总经理特批' }];
    this.isurgent = [{ label: '请选择。。。', value: null }, { label: '是', value: true }, { label: '否', value: false }];
  }
  tiaohuodialogcoles() {
    this.createtiaohuodialog.hide();
    this.one = true;
    this.two = false;
  }
  nextdialog() {
    if (!this.tiaohuodetmodel['gnid']) {
      this.toast.pop('warning', '品名不允许为空！');
      return;
    }
    if (!this.tiaohuodetmodel['chandiid']) {
      this.toast.pop('warning', '产地不允许为空！');
      return;
    }
    if (this.gcs.length !== this.guigelength) { this.toast.pop('warning', '规格属性不允许为空！'); return; }
    this.one = false;
    this.two = true;
    this.houdugongchas = [];
    this.widthgongchas = [];
    this.yongtus = [];
    this.oneweights = [];
    this.jiaohuoaddrs = [];
    this.qihuoapi.getchandigongcha().then(data => {
      data.forEach(element => {
        if (element['chandiid'] === this.tiaohuodetmodel['chandiid']) {
          // 厚度公差
          element.attr.houdugongcha.forEach(houdu => {
            this.houdugongchas.push({
              value: houdu.value,
              label: houdu.value
            });
          });
          // 宽度公差
          element.attr.widthgongcha.forEach(width => {
            this.widthgongchas.push({
              value: width.value,
              label: width.value
            });
          });
          // 交货地址
          element.attr.jiaohuoaddr.forEach(addr => {
            this.jiaohuoaddrs.push({
              value: addr.value,
              label: addr.value
            });
          });
          // 单卷重
          element.attr.oneweight.forEach(oneweight => {
            this.oneweights.push({
              value: oneweight.value,
              label: oneweight.value
            });
          });
          // 用途
          element.attr.yongtu.forEach(yongtu => {
            this.yongtus.push({
              value: yongtu.value,
              label: yongtu.value
            });
          });
        }
      });
    });
  }
  /**获取品名 */
  getGnAndChandi() {
    this.classifyApi.getGnAndChandi().then((data) => {
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        });
      });
    });
  }
  /**获取产地 */
  selectedgn(value) {
    this.isChandi = true;
    this.attrs = [];
    this.showGuige = false;
    this.chandis = [];
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.tiaohuodetmodel['gnid'] = value.id;
  }
  /**获取其他规格 */
  selectedchandi(value) {
    this.attrs = [];
    this.classifyApi.getAttrs(value).then(data => {
      this.guigelength = data['length'];
      this.attrs = data;
    });
    this.showGuige = true;
  }
  selectedguige(event, labelid) {
    for (let i = 0; i < this.gcs.length; i++) {
      if (this.gcs[i]['name'] === labelid) {
        this.gcs.splice(i, 1);
      }
    }
    // 备注需求 如果是彩涂，且是烨辉彩涂，那么油漆对应颜色重新选择
    if( this.tiaohuodetmodel['chandiid'] == 8){
      if(labelid == "painttypeid"){
        if(this.chandis[2].value = 8){
          this.classifyApi.getAttrs(event['value']).then(data => {
            if(data.length != 0){
              this.attrs = this.attrs.filter(item => item.name != 'colorid');
              //this.attrs.push(data[0]);
              this.attrs.splice(8, 0, data[0]);
              this.guigelength = this.attrs.length;
            }else{
              this.attrs = this.attrs.filter(item => item.name != 'colorid');
              this.guigelength = this.attrs.length;
              
            }
            
          });
          this.showGuige = true;
        }
      }

    }
    this.gcs.push({ name: labelid, value: event['value'] });
  }
  create() {
    if (!this.tiaohuodetmodel['houdugongcha']) { this.toast.pop('warning', '厚度公差不允许为空！'); return; }
    if (!this.tiaohuodetmodel['widthgongcha']) { this.toast.pop('warning', '宽度公差不允许为空！'); return; }
    if (!this.tiaohuodetmodel['weight']) {
      this.toast.pop('warning', '订货量不允许为空！');
      return;
    }
    if (!this.tiaohuodetmodel['oneweight']) { this.toast.pop('warning', '单卷重不允许为空！'); return; }
    if (!this.tiaohuodetmodel['weightgongcha']) { this.toast.pop('warning', '数量公差不允许为空！'); return; }
    if (!this.tiaohuodetmodel['jiaohuodate']) { this.toast.pop('warning', '交货期限不允许为空！'); return; }
    if (!this.tiaohuodetmodel['jiaohuoaddr']) { this.toast.pop('warning', '交货地址不允许为空！'); return; }
    if (!this.tiaohuodetmodel['yongtu']) { this.toast.pop('warning', '用途不允许为空！'); return; }
    if (!this.tiaohuodetmodel['beizhu']) { this.toast.pop('warning', '下单备注不允许为空！'); return; }
    if (!this.tiaohuodetmodel['zhidaojiagedesc']) { this.toast.pop('warning', '指导价格不允许为空！'); return; }
    if (this.tiaohuodetmodel['isurgent'] === undefined) { this.toast.pop('warning', '是否急单不允许为空！'); return; }
    this.tiaohuodetmodel['classifys'] = this.gcs;
    this.tiaohuodetmodel['jiaohuodate'] = this.tiaohuodetmodel['jiaohuodate'] ?
     this.datePipe.transform(this.tiaohuodetmodel['jiaohuodate'], 'y-MM-dd') : '';
    this.tiaohuobiddingApi.create(this.tiaohuodetmodel).then(data => {
      this.tiaohuodialogcoles();
      this.listDetail();
    });
  }
  // 重选
  createselectNull() {
    this.chandis = [];
    this.isChandi = false;
    this.attrs = [];
    this.showGuige = false;
    this.gcs = [];
    this.tiaohuodetmodel = {
      gnid1: '', gnid: '', chandiid: '', colorid: '', widthid: '', houduid: '', ducengid: '', caizhiid: '', weight: '',
      oneweight: null, jiaohuodate: null, jiaohuoaddr: null, houdugongcha: null, widthgongcha: null, weightgongcha: null,
      classifys: null
    };
  }

  submitWaiwuVerify() {
    const tiaohuobiddingids = [];
    const tiaohuobiddingSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < tiaohuobiddingSelected.length; i++) {
      if (tiaohuobiddingSelected[i].data && tiaohuobiddingSelected[i].selected) {
        if (tiaohuobiddingSelected[i].data.status !== 1) {
          this.toast.pop('warning', '请选择制单中的明细提交！！！');
          return;
        }
        tiaohuobiddingids.push(tiaohuobiddingSelected[i].data.tiaohuobiddingid);
      }
    }
    if (tiaohuobiddingids.length < 1) {
      this.toast.pop('warning', '请选择调货竞价明细！！！');
      return;
    }
    this.tiaohuobiddingApi.submitWaiwuVerify(tiaohuobiddingids).then(data => {
      this.listDetail();
    });
  }
  addmanual() {
    this.manuallist.push({});
  }
  deletemanual(i) {
    this.manuallist.splice(i, 1);
  }
}
