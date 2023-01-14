import { DatePipe, DecimalPipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { XiaoshouapiService } from './../xiaoshouapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { WuliuorderimportComponent } from './wuliuorderimport/wuliuorderimport.component';
import { OrderapiService } from './../../order/orderapi.service';
import { RoleapiService } from 'app/routes/role/roleapi.service';
import { ProduceapiService } from 'app/routes/produce/produceapi.service';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss']
})
export class OfflineComponent implements OnInit {
  offlineForm: FormGroup;
  isshowdingjintype = true;
  isqihuo = true;
  isqihuo2 = true;
  total = { count: 0, tweight: 0, tlength: 0, tmoney: 0 };
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('matchcarModal') private matchcarModal: ModalDirective;
  @ViewChild('addrdialog') private addrdialog: ModalDirective;
  // 上传弹窗实例
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  // 创建加工任务单弹窗
  @ViewChild('produceTaskDialog') private produceTaskDialog: ModalDirective;
  // 释放货物弹窗
  @ViewChild('releaseDialog') private releaseDialog: ModalDirective;
  wuliuyuan;
  neijings = [];
  packages = [];
  tasklist: Object = {};
  mindate: Date = new Date();
  start: Date = new Date();
  am_pms = [];
  am_pm = '上午';
  types: any = [{ value: '', label: '请选择打包带材料' }, { value: '1', label: '钢带' }, { value: '2', label: '其他' }];
  moulds : any = [{ value: '', label: '请选择结算模板'}, { value: '1', label: '先开票后付款' }, { value: '2', label: '先付款后开票' }]
  companyIsWiskind = [];
  // 创建弹窗
  params = {};
  // 获取运输公司
  transportCompany;
  isshow = true;
  array;
  ists;
  // 运输地址集合
  destList = [];
  // 入库单上传信息及格式
  uploadParam: any = { module: 'offlinecarnumber', count: 1, sizemax: 1, extensions: ['xls'] };
  // 设置上传的格式
  accept = '.xls, application/xls';
  // 判断是否线上线下
  flag = {};
  isshowmatchcar = this.route.data['value']['offline'];
  matchcar = { transtype: null, destination: null, beizhu: null, istuisong: false };
  search = {};
  buyerid: any;
  addr: any;
  destination: any;
  provinces: any[] = [];
  citys: any[] = [];
  countys: any[] = [];
  gridOptions: GridOptions;
  matchcarForm: FormGroup;
  isbaojiadisabled = false; // 物流竞价过的不得点击
  transtypes = [{ value: '1', label: '汽运' }, { value: '2', label: '铁运' }, { value: '3', label: '船运' }];
  // 物流竞价弹窗对象
  wlbsModalRef: BsModalRef;
  reason = ''; // 释放原因
  shifangmap = { keshifangdingjin: '0', dingjinshengyu: '0', keshifangallocation: '0', qiankuanjine: '0' };
  constructor(public settings: SettingsService, private tihuoApi: XiaoshouapiService,
    private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private toast: ToasterService, private customerApi: CustomerapiService,
    private matchcarAPi: MatchcarService, private numberpipe: DecimalPipe,
    private bsModalService: BsModalService, private datepipe: DatePipe,private qihuoapi: QihuoService,
    private addressparseService: AddressparseService, private classifyApi: ClassifyApiService,
    private orderApi: OrderapiService, private roleapi: RoleapiService,private produceApi: ProduceapiService
  ) {
    this.roleapi.getroleusers().then((data) => {
      const wuliuyuanlist = [{ label: '请选择物流员', value: '' }];
      data.forEach(element => {
        wuliuyuanlist.push({
          label: element.user.realname,
          value: element.user.id
        });
      });
      this.wuliuyuan = wuliuyuanlist;
    });

    this.offlineForm = fb.group({
      /**2018.01.11 转货权开发 cpf DEL start
      'tihuotype': [],
      */
      'chehao': [null, Validators.pattern('^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$')],
      'siji': [null, Validators.pattern('^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$')],
      'sijitel': [null, Validators.pattern('1[3|4|5|6|7|8|9|][0-9]{9}')],
      'sijiid': [],
      'islasttihuo': [],
      'dingjintype': [],
      'beizhu': [],
      'enddest': [],
      'provinceid': [],
      'cityid': [],
      'countyid': [],
      'wuliuyuan': [],
      'chukufeetype2': [],
      'istopeikuan':[],
      'chaodingjin':[],
      'topeikuanjine':[],

    });
    this.matchcarForm = fb.group({
      'xhlianxirenphone': [null, Validators.pattern('1[3|4|5|6|7|8|9|][0-9]{9}')],
      'provinceid': [],
      'cityid': [],
      'countyid': [],
      'destination': [],
      'transtype': [],
      'xhlianxiren': [],
      'pingzheng': [],
      'rukutaitou': [],
      'isdiaofee': [],
      'istuisong': [],
      'isneedsale': [],
      'beizhu': []
    });

    this.gridOptions = {
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
      onRowSelected: (params) => {
        if (params.node['selected']) {
          if (params.data) {
            this.total.count += 1;
            this.total.tweight = this.total.tweight['add'](params.node.data.weight);
            this.total.tlength = this.total.tlength['add'](params.node.data.length);
            const linemoney = params.node.data.pertprice['mul'](params.node.data.weight);
            this.total.tmoney = this.total.tmoney['add'](linemoney['fmoney'](2,false));
          }
        } else {
          if (params.data) {
            this.total.count = this.total.count - 1;
            this.total.tweight = this.total.tweight['sub'](params.node.data.weight);
            this.total.tlength = this.total.tlength['sub'](params.node.data.length);
            const linemoney = params.node.data.pertprice['mul'](params.node.data.weight);
            this.total.tmoney = this.total.tmoney['sub'](linemoney['fmoney'](2,false));
          }
        }
        if (!this.flag['isonline']) {
          this.getkeshifang();
        }
      },
      enableFilter: true
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 60, pinned: 'left',
        checkboxSelection: (params) => params.data, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '订单编号', field: 'billno', minWidth: 100,
        cellRenderer: function (params) {
          if (params.data) {
            if (params.data.billno.substring(0, 2) === 'QH') {
              return '<a target="_blank" href="#/qihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (params.data.billno.substring(0, 2) === 'BO') {
              return '<a target="_blank" href="#/businessorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else {
              return '<a target="_blank" href="#/order/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
          } else {
            return '合计';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '客户单位', field: 'customer.name', minWidth: 100,
        cellRenderer: function (params) {
          if (params.data) {
            return '<a target="_blank" href="#/xiaoshouwanglaireport/' + params.data.customer.id + '">' +
              params.data.customer.name + '</a>';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'cangkuname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 260 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '销售单价', field: 'pertprice', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工方式', field: 'producetype', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '车号', field: 'carnumber', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '司机信息', field: 'driverinfo', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'cuser.org.name', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '下单时间', field: 'cdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库龄', field: 'qihuokuling', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储号', field: 'storageno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '交货状态', field: 'isfinish', minWidth: 80,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data.isfinish === true) {
              return '已完成';
            } else if (params.data.isfinish === false) {
              return '未完成';
            } else {
              return '';
            }
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '付款方式', field: 'isorderpay', minWidth: 80,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data.isorderpay) {
              return '订单付款';
            } else {
              return '提单付款';
            }
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'cuser.realname', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '出库费结算', field: 'chukufeetype', minWidth: 110,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data.chukufeetype === 0) {
              return '现结';
            } else if (params.data.chukufeetype === 1) {
              return '月结';
            } else if (params.data.chukufeetype === 2) {
              return '免付';
            } else {
              return '';
            }
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '出库费单价', field: 'perchukuprice', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '配送方式', field: 'type', minWidth: 60,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data.type === 0) {
              return '自提';
            } else if (params.data.type === 1) {
              return '代运';
              /**2018.01.11 转货权开发 cpf ADD start */
            } else if (params.data.type === 2) {
              return '转货';
              /**2018.01.11 转货权开发 end */
            } else {
              return '';
            }
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '定价', field: 'price', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否全款', field: 'isquankuan', minWidth: 60,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data.isquankuan) {
              return '全款';
            } else {
              return '非全款';
            }
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'seller.name', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购单位', field: 'caigoubuyername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收货地址', field: 'addressdetail', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '联系人', field: 'contactman', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '联系电话', field: 'contactway', minWidth: 100 }];

    this.listDetail();
  }

  ngOnInit() {
    setTimeout(() => {
      this.addressparseService.getData();
    }, 1000);
  }

  // 获取表格数据
  listDetail() {
    this.total = { count: 0, tweight: 0, tlength: 0, tmoney: 0 };
    if (this.route.data['value']['offline']) {
      this.tihuoApi.offlinetihuolist().then((tihuolist) => {
        this.gridOptions.api.setRowData(tihuolist);
      });
    } else {
      this.flag = { isonline: true };
      this.tihuoApi.querytihuolist({ type: 1 }).then((tihuolist) => {
        this.gridOptions.api.setRowData(tihuolist);
      });
    }
  }
  /**
   * 获取可释放定金配款
   */
  getkeshifang() {
    const orderdets = new Array();
    const orderidset = new Set();
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        orderdets.push(orderdetSelected[i].data.orderdetid);
        orderidset.add(orderdetSelected[i].data.billid);
      }
    }
    if (orderidset.size === 1) {
      this.tihuoApi.getkeshifang({ detids: orderdets }).then((data) => {
        this.shifangmap = {
          keshifangdingjin: data['keshifangdingjin'], dingjinshengyu: data['dingjinshengyu'],
          keshifangallocation: data['keshifangallocation'], qiankuanjine: data['qiankuanjine']
        };
      });
    } else {
      this.shifangmap = { keshifangdingjin: '0', dingjinshengyu: '0', keshifangallocation: '0', qiankuanjine: '0' };
    }
  }
  wuliuyuanType = []
  chukufeetype2;
  orderdetid;
  // 打开创建弹窗
  showDialog() {
    let isfujian = true;
    const orderdets = new Array();
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    // 获得所有选中的待提货物如果没有选中则不允许添加提货人
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        orderdets.push(orderdetSelected[i].data);
      }
    }
    // 首先判断是否是选择的同一个仓库下的货物进行运费添加
    if (orderdets.length > 0) {
      this.orderdetid = orderdets[0].billid
      // 定义一个数组存放订单明细表的id。
      let orderdetids = new Array();
      let cangkuid = null;
      let cangkucount = 0;
      let type = null;
      let typecount = 0;
      let sellerid = null;
      let sellcount = 0;
      let chukufeetype = null;
      let chukufeetypecount = 0;
      this.qihuoapi.findfujians2(orderdets).then(data => {
        if(!data['isfujian']){
          isfujian = false;
        }
        for (let i = 0; i < orderdets.length; i++) {
          if (this.route.data['value']['offline'] && orderdets[i].type === 1) {
            this.toast.pop('warning', '创建提货单时，请选择自提的货物。');
            return;
          }
          if (orderdets[i].cangkuname.indexOf('在途') !== -1) {
            this.toast.pop('warning', '创建提货单时，请选择非在途的货物！');
            return;
          }
          if (orderdets[i].billno.substring(0, 2) !== 'QH') {
            this.isqihuo = false;
            this.isshowdingjintype = false;
          } else {
            this.isqihuo = true;
            this.isshowdingjintype = true;
          }
          if (sellerid !== orderdets[i].sellerid) {
            sellcount++; sellerid = orderdets[i].sellerid;
          }
          if (type !== orderdets[i].type) {
            typecount++; type = orderdets[i].type;
          }
          if (cangkuid !== orderdets[i].cangkuid) { // 判断仓库是否相同
            cangkucount++; cangkuid = orderdets[i].cangkuid;
          }
          if (chukufeetype !== orderdets[i].chukufeetype) {
            chukufeetypecount++; chukufeetype = orderdets[i].chukufeetype;
          }
          orderdetids.push(orderdets[i].orderdetid); // 将orderdetid放到数组中去
        }
        if (sellcount > 1) {
          this.toast.pop('warning', '创建提单时，请选择相同的卖方单位');
          // Notify.alert('创建提单时，请选择相同的卖方单位', { status: 'warning' });
          return;
        }
        if (typecount > 1) {
          this.toast.pop('warning', '创建提单时，请选择相同的配送方式');
          return;
        }
        // if (chukufeetypecount > 1) {
        //   this.toast.pop('warning', '创建提单时，请选择相同的出库费结算方式');
        //   return;
        // }
        // tslint:disable-next-line:max-line-length
        /**2018.01.12 转货权开发 cpf MOD start */
        this.params = {
          siji: '', sijitel: '', sijiid: '', chehao: '', transcompanyid: null, yunprice: null,
          ist: null, type: type, tihuotype: '0', cangkuid: '', islasttihuo: '0', dingjinshifangtype: '1',istopeikuan:'0'//, chukufeetype2: null
        };
        // this.isshow = true;
        if (type === 2) {
          this.isshow = false;
          this.params['tihuotype'] = '1';
        } else {
          this.isshow = true;
          this.params['tihuotype'] = '0';
        }
        if (type === 0) {
          this.isshow = false;
        }
        /**2018.01.12 转货权开发 end */
        this.array = orderdetids;
        if (cangkucount === 1) { // 判断是不是只有一个仓库
          this.customerApi.findwl().then((data) => {
            this.transportCompany = data; // 获取运输公司
          });
          this.params['cangkuid'] = cangkuid;
          // 声明一个运输费用的类型
          this.ists = [{ ist: true, name: '总价' }, { ist: false, name: '单价' }];
  
  
          this.getProvince();
          this.wuliuyuanType = [{ label: '请选择物流员', value: '' }, { label: '赵雪懿', value: '赵雪懿' },
          { label: '蔡沙沙', value: '蔡沙沙' }, { label: '刘俊苗', value: '刘俊苗' },
          { label: '唐文文', value: '唐文文' }, { label: '邓馨', value: '邓馨' }, { label: '马慧芳', value: '马慧芳' }];
          this.orderApi.getchukufee({ detids: this.array }).then((response) => {
            this.params['enddest'] = response['mudidi'];
          });
          if(!isfujian){
            if(confirm('为便于后期正常开票，请及时上传双方盖章合同')){
              this.classicModal.show();
            }
          }else{
            this.classicModal.show();
          }
        } else {
          this.toast.pop('warning', '创建提单时，请选择相同的仓库');
        }
      })
    } else {
      this.toast.pop('warning', '请选择提货的货物!');
    }
    this.params['chukufeetype2'] = orderdets[0]['chukufeetype'];
    //console.log(this.params['chukufeetype2'] === 0);
  }
  showdingjintype(value1) {
    if (value1 === 0) {
      this.isshowdingjintype = true;
    } else {
      this.isshowdingjintype = false;
    }
  }
  ordinery(type) {
    if (type === 0) {
      this.isshow = true;
    }
  }

  transfer(type) {
    if (type === 1) {
      this.isshow = false;
    }
  }
  iskehugaizhang :any = [];
  // 创建提单
  submittihuo() {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (this.params['tihuotype'] === 1) {
      if (!reg.test(this.params['sijiid'])) {
        this.toast.pop('warning', '身份证填写不规范');
        return '';
      }
    }
    if (this.params['chehao'] === '') {
      this.toast.pop('warning', '请先填写车号再创建提单！');
      return '';
    }
    this.params['orderdetids'] = this.array;// 将将要提货的货物加入提货单参数中\
    console.log(this.params);
    if(this.params['istopeikuan'] === '1'){
      this.qihuoapi.dingjinTixing(this.params).then((response) => {// 创建提货单
        if(response['istixing']){
          if(confirm('注意：本次超额定金转配款后，现有定金小于10万元，非最后一次提货将无法等比例释放')){
            this.aaa();
          }
        }else{
          this.aaa();
        }
      });
    }else{
      this.aaa();
    }
    
    
  }
  aaa(){
    if (this.route.data['value']['offline']) {
      this.params['isonline'] = false;
    } else {
      this.params['isonline'] = true;
    }
    if (this.params['islasttihuo'] === '1') {
      this.params['dingjinshifangtype'] = null;
      this.params['islasttihuo'] = true;
    } else {
      this.params['islasttihuo'] = false;
    }
    this.tihuoApi.iskehugaizhang(this.params).then(data => {
      this.iskehugaizhang=data['iskehugaizhang'];
      if(this.iskehugaizhang){
         this.tihuoApi.createtihuo(this.params).then((response) => {// 创建提货单
            this.hideDialog(); // 关闭弹出框
            this.toast.pop('success', '提货单创建成功');
            this.router.navigate(['/tihuo', response['tihuo']['id']]);
          }); 
      }else{ 
        sweetalert({
          title: '此合同变更后尚未上传双方盖章合同',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#23b7e5',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnConfirm: false
        }, () => {
          this.tihuoApi.createtihuo(this.params).then((response) => {// 创建提货单
            this.hideDialog(); // 关闭弹出框
            this.toast.pop('success', '提货单创建成功');
            this.router.navigate(['/tihuo', response['tihuo']['id']]);
          });
          sweetalert.close();
        });
      } 
    });
    
  }

  // 关闭创建弹窗
  hideDialog() {
    this.classicModal.hide();
  }

  // 释放货物---未付款的货物
  emancipation() {
    this.params = {};
    // 获得所有选中的待提货物如果没有选中则不允许添加提货人 
    const orderdets = this.gridOptions.api.getSelectedRows(); // 首先判断是否是选择的同一个仓库下的货物进行运费添加
    if (orderdets.length > 0) {
      const billidset = new Set();
      const orderdetids = new Array(); // 定义一个数组存放订单明细表的id
      for (let i = 0; i < orderdets.length; i++) {
        if (orderdets[i].cangkuname.indexOf('在途') !== -1) {
          this.toast.pop('warning', '请选择非在途的货物释放！');
          return;
        }
        orderdetids.push(orderdets[i].orderdetid); // 将orderdetid放到数组中去
        billidset.add(orderdets[i].billid);
      }
      if (Array.from(billidset).length > 1) {
        this.toast.pop('warning', '只能释放同一个合同的钢卷');
        return;
      }
      this.params['orderdetids'] = orderdetids;
      this.showReleaseDialog();
    } else {
      this.toast.pop('warning', '请选择要释放的货物');
    }
  }
  hideReleaseDialog() {
    this.releaseDialog.hide();
  }
  showReleaseDialog() {
    this.reason = '';
    this.releaseDialog.show();
  }
  createRelease() {
    if (this.reason === '' || !this.reason) {
      this.toast.pop('warning', '请填写释放原因！');
      return;
    }
    if (confirm('你确定释放货物吗？')) {
      this.params['reason'] = this.reason;
      this.tihuoApi.emancipation(this.params).then(() => {
        this.toast.pop('success', '货物释放发起审批');
        this.listDetail(); // 刷新列表页面
        this.hideReleaseDialog();
      });
    }
  }
  // 约车单创建
  showMatchcar() {
    // 获得所有选中的待提货物如果没有选中则不允许添加提货人
    const orderdets = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    // 获得所有选中的待提货物如果没有选中则不允许添加提货人
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        orderdets.push(orderdetSelected[i].data);
      }
    }
    // 首先判断是否是选择的同一个仓库下的货物进行运费添加
    if (orderdets.length > 0) {
      // 定义一个数组存放订单明细表的id。
      let orderdetids = new Array();
      let enddests = [];
      const qihuodetidsset = new Set();
      const transtypeset = new Set();
      let endaddr = null;
      let transtype = null;
      let provinceid = null;
      let cityid = null;
      let countyid = null;
      let cangkuid = null;
      let cangkucount = 0;
      let sellerid = null;
      let buyerid = null;
      let sellcount = 0;
      let buyercount = 0;
      let chukufeetype = null;
      let chukufeetypecount = 0;
      for (let i = 0; i < orderdets.length; i++) {
        if (orderdets[i].type === 0) {
          this.toast.pop('warning', '创建约车单时，请选择代运的货物。');
          return;
        }
        if (orderdets[i].cangkuname.indexOf('在途') !== -1) {
          this.toast.pop('warning', '创建约车单时，请选择非在途的货物！');
          return;
        }
        if (sellerid !== orderdets[i].sellerid) {
          sellcount++; sellerid = orderdets[i].sellerid;
        }
        if (buyerid !== orderdets[i].buyerid) {
          this.buyerid = orderdets[i].buyerid;
          buyercount++; buyerid = orderdets[i].buyerid;
        }
        if (cangkuid !== orderdets[i].cangkuid) { // 判断仓库是否相同
          cangkucount++; cangkuid = orderdets[i].cangkuid;
        }
        if (chukufeetype !== orderdets[i].chukufeetype) {
          chukufeetypecount++; chukufeetype = orderdets[i].chukufeetype;
        }
        orderdetids.push(orderdets[i].orderdetid); // 将orderdetid放到数组中去
        if (orderdets[i].qihuodetid) {
          qihuodetidsset.add(orderdets[i].qihuodetid);
        }
      }
      let ind = null;
      const isenddest = orderdets.some((item, index) => {
        ind = index;
        return item['enddest'];
      });
      if (isenddest) {
        endaddr = orderdets[ind]['enddest'];
        transtype = orderdets[ind]['transporttype'];
        provinceid = orderdets[ind]['provinceid'];
        countyid = orderdets[ind]['countyid'];
        cityid = orderdets[ind]['cityid'];
      }
      if (sellcount > 1) {
        this.toast.pop('warning', '创建提单时，请选择相同的卖方单位');
        return;
      }
      if (buyercount > 1) {
        this.toast.pop('warning', '创建提单时，请选择相同的客户单位');
        return;
      }
      // if (chukufeetypecount > 1) {
      //   this.toast.pop('warning', '创建提单时，请选择相同的出库费结算方式');
      //   return;
      // }
      this.array = orderdetids;
      if (cangkucount === 1) { // 判断是不是只有一个仓库
        this.customerApi.findwl().then((data) => {
          this.transportCompany = data; // 获取运输公司
        });
        this.matchcar = { transtype: null, destination: null, beizhu: null, istuisong: false };
        this.matchcar['cangkuid'] = cangkuid;
        this.matchcar['orderdetids'] = orderdetids;
        const params = { qihuodetids: Array.from(qihuodetidsset), orderdetids: orderdetids };
        this.bsModalService.config.class = 'modal-all';
        this.wlbsModalRef = this.bsModalService.show(WuliuorderimportComponent);
        this.wlbsModalRef.content.search = params;
        this.wlbsModalRef.content.parentthis = this;
        this.selectNull();
      } else {
        this.toast.pop('warning', '创建提单时，请选择相同的仓库');
      }
    } else {
      this.toast.pop('warning', '请选择提货的货物!');
    }

  }
  closeMatchcar() {
    this.matchcarModal.hide();

  }
  creatematchcar() {
    if (!this.matchcar['transtype']) {
      this.toast.pop('warning', '请选择运输方式!');
      return;
    }
    if (!this.matchcar['destination']) {
      this.toast.pop('warning', '请选择具体卸货地址!');
      return;
    }
    if (this.provinces.length) {
      if (!this.matchcar['provinceid']) {
        this.toast.pop('warning', '请把省填写完成!');
        return;
      }
    }
    if (this.citys.length) {
      if (!this.matchcar['cityid']) {
        this.toast.pop('warning', '请把市填写完成!');
        return;
      }
    }
    if (this.countys.length) {
      if (!this.matchcar['countyid']) {
        this.toast.pop('warning', '请把县填写完成!');
        return;
      }
    }
    if (!this.matchcar['xhlianxiren']) {
      this.toast.pop('warning', '请填写卸货联系人!');
      return;
    }
    if (!this.matchcar['xhlianxirenphone']) {
      this.toast.pop('warning', '请填写卸货电话!');
      return;
    }
    if (!this.matchcar['rukutaitou']) {
      this.toast.pop('warning', '请填写入库抬头!');
      return;
    }
    if (!this.matchcar['pingzheng']) {
      this.toast.pop('warning', '请填写提货凭证!');
      return;
    }
    // 省市县id转为number
    if (this.matchcar['provinceid']) {
      this.matchcar['provinceid'] = Number(this.matchcar['provinceid']);
    }
    if (this.matchcar['cityid']) {
      this.matchcar['cityid'] = Number(this.matchcar['cityid']);
    }
    if (this.matchcar['countyid']) {
      this.matchcar['countyid'] = Number(this.matchcar['countyid']);
    }
    this.matchcarAPi.createMatchcar(this.matchcar).then(data => {
      this.closeMatchcar(); // 关闭弹出框
      this.toast.pop('success', '约车单创建成功！');
      this.router.navigate(['/matchcar/detail/', data['id']]);
    });
  }

  addAddrDialog() {
    this.addrdialog.show();
  }

  addrdialogclose() {
    this.addrdialog.hide();
  }

  selectNull() {
    this.matchcar['transtype'] = '';
    this.matchcar['destination'] = '';
    this.matchcar['rukutaitou'] = '';
    this.matchcar['pingzheng'] = '';
    this.matchcar['isdiaofee'] = '';
    this.matchcar['istuisong'] = false;
    this.matchcar['beizhu'] = '';
    this.matchcar['isneedsale'] = false;
    this.isbaojiadisabled = false;
  }

  addAddr() {
    this.destList.push({ label: this.addr, value: this.addr });
    this.matchcar['destination'] = this.addr;
    this.addrdialogclose();
    if (this.matchcar['destination']) {
      this.selecteddes(this.matchcar['destination']);
    }
  }

  getDestList() {
    return new Promise((resolve: (data) => void) => {
      this.matchcarAPi.getdestList(this.buyerid).then(data => {
        resolve(data);
      });
    });
  }
  // 入库单上传弹窗
  carnumberUploader() {
    this.uploaderModel.show();
  }

  // 关闭上传弹窗
  uploaderhideDialog() {
    this.uploaderModel.hide();
  }

  // 上传成功执行的回调方法
  uploads($event) {
    console.log($event);
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.tihuoApi.offlinecarnumberupload(addData).then(data => {
        this.toast.pop('success', '上传成功！');
        this.listDetail();
        this.uploaderhideDialog();
      });
    }
  }
  // 车号模板下载
  downloadtemplate() {
    this.tihuoApi.offlinedownloadtemplate().then(data => {
      window.open(data['url']);
    });
  }

  getProvince() {
    this.provinces = [];
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys = [];
      this.countys = [];
    });
  }
  /**
   * 根据详细地址自动识别省市县
   */
  selecteddes(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      console.log(addressObj);
      if (addressObj['name']) {
        this.matchcar['xhlianxiren'] = addressObj['name'];
      }
      if (addressObj['phone']) {
        this.matchcar['xhlianxirenphone'] = addressObj['phone'];
      }
      this.citys = []; this.countys = [];
      this.matchcar['provinceid'] = '';
      this.matchcar['cityid'] = '';
      this.matchcar['countyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.matchcar['provinceid'] = addressObj['provinceValue'];
          this.getpcc(this.matchcar['provinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.matchcar['cityid'] = addressObj['cityValue'];
                this.getpcc(this.matchcar['cityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      this.matchcar['countyid'] = addressObj['countyValue'];
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }

  /**
 * 根据详细地址自动识别省市县
 */
  selecteddes1(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      console.log(addressObj);
      if (addressObj['name']) {
        this.matchcar['xhlianxiren'] = addressObj['name'];
      }
      if (addressObj['phone']) {
        this.matchcar['xhlianxirenphone'] = addressObj['phone'];
      }
      this.citys = []; this.countys = [];
      this.params['provinceid'] = '';
      this.params['cityid'] = '';
      this.params['countyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.params['provinceid'] = addressObj['provinceValue'];
          this.getpcc(this.params['provinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.params['cityid'] = addressObj['cityValue'];
                this.getpcc(this.params['cityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      this.params['countyid'] = addressObj['countyValue'];
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }

  getpcc(pid, pccname: any[]) {
    return new Promise((resolve: (data) => void) => {
      this.classifyApi.getChildrenTree({ pid: pid }).then((data) => {
        data.forEach(element => {
          pccname.push({
            label: element.label,
            value: element.id + ''
          });
        });
        resolve(pccname);
      });
    });
  }

  getcity() {
    this.citys = [];
    delete this.params['cityid'];
    delete this.params['countyid'];
    this.classifyApi.getChildrenTree({ pid: this.params['provinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }


  getcounty() {
    this.countys = [];
    delete this.params['countyid'];
    this.classifyApi.getChildrenTree({ pid: this.params['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  // 创建加工任务单
  showProduceTaskDialog() {
    const orderdets = new Array();
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    // 获得所有选中的待提货物如果没有选中则不允许添加提货人
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        orderdets.push(orderdetSelected[i].data);
      }
    }
    // 首先判断是否是选择的同一个仓库下的货物进行运费添加
    if (orderdets.length <= 0) {
      this.toast.pop('warning', '请选择需要做加工任务单的货物。');
      return;
    }
    // 定义一个数组存放订单明细表的id。
    const orderdetids = new Array();
    let cangkuid = null;
    let cangkucount = 0;
    let type = null;
    let typecount = 0;
    let sellerid = null;
    let sellcount = 0;
    let orderid = null;
    let ordercount = 0;
    for (let i = 0; i < orderdets.length; i++) {
      if (orderdets[i].cangkuname.indexOf('在途') !== -1) {
        this.toast.pop('warning', '创建加工任务单时，请选择非在途的货物！');
        return;
      }
      if (orderid !== orderdets[i].billid) {
        ordercount++; orderid = orderdets[i].billid;
      }
      if (sellerid !== orderdets[i].sellerid) {
        sellcount++; sellerid = orderdets[i].sellerid;
      }
      if (type !== orderdets[i].type) {
        typecount++; type = orderdets[i].type;
      }
      if (cangkuid !== orderdets[i].cangkuid) { // 判断仓库是否相同
        cangkucount++; cangkuid = orderdets[i].cangkuid;
      }
      orderdetids.push(orderdets[i].orderdetid); // 将orderdetid放到数组中去
    }
    if (sellcount > 1) {
      this.toast.pop('warning', '创建加工任务单时，请选择相同的卖方单位');
      return;
    }
    if (typecount > 1) {
      this.toast.pop('warning', '创建加工任务单时，请选择相同的配送方式');
      return;
    }
    if (ordercount > 1) {
      this.toast.pop('warning', '创建加工任务单时，请选择相同的订单');
      return;
    }
    if (cangkucount > 1) {
      this.toast.pop('warning', '创建加工任务单时，请选择相同的仓库');
      return;
    }
    //判断是否为临时仓库
    this.produceApi.judgelinshicangku(cangkuid).then((data) => {
      if (data['flag']) {
        this.tasklist['islinshicangku'] = true;
      }else{
        this.tasklist['islinshicangku'] = false;
      }
    });
    this.array = [];
    this.array = orderdetids;
    this.tasklist = { detids: this.array };
    this.findWiskind();
    this.am_pms = [{ value: '上午', label: '上午' }, { value: '下午', label: '下午' }];
    this.neijings = [{ value: '508', label: '508' }, { value: '610', label: '610' }];
    this.packages = [{ value: '裸包', label: '裸包' }, { value: '油纸', label: '油纸' }, { value: '简包', label: '简包' },
    { value: '精包', label: '精包' }, { value: '原包', label: '原包' }];
    this.produceTaskDialog.show();
  }
  hideProduceTaskDialog() {
    this.produceTaskDialog.hide();
  }
  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({ label: '请选择盖章单位', value: '' });
      this.customerApi.findwiskind().then((response) => {
        for (let i = 1; i < response.length; i++) {
          if (response[i].id === 3453) {
            response.splice(i, 1);
          }
        }
        response.forEach(element => {
          this.companyIsWiskind.push({
            label: element.name,
            value: element.id
          });
        });
        console.log(this.companyIsWiskind);
        // this.companyIsWiskind = response;
      });
    }
  }
  createTaskInOffline() {
    this.tasklist['jiaoqi'] = this.datepipe.transform(this.start, 'y-MM-dd') + ' ' + this.am_pm;
    console.log(this.tasklist);
    if (this.tasklist['gangdai'] !== null && this.tasklist['gangdai'] !== undefined && this.tasklist['gangdai'] <= 0) {
      this.toast.pop('warning', '钢带数量不能为零或负数');
      return;
    }
    if (!this.tasklist['packagetype']) {
      this.toast.pop('warning', '请选择包装方式');
      return;
    }
    if (!this.tasklist['neijing']) {
      this.toast.pop('warning', '请选择卷内径');
      return;
    }
    // if (!this.tasklist['fee']) {
    //   this.toast.pop('warning', '请填写加工费');
    //   return;
    // }
    if (!this.tasklist['phone']) {
      this.toast.pop('warning', '请填写联系电话');
      return;
    }
    if (!this.tasklist['sellerid']) {
      this.toast.pop('warning', '请选择盖章单位！');
      return;
    }
    if (this.tasklist['isretain'] === null || this.tasklist['isretain'] === undefined) {
      this.toast.pop('warning', '请选择是否保留原标签');
      return;
    }
    if (this.tasklist['mutuo'] === null || this.tasklist['mutuo'] === undefined) {
      this.toast.pop('warning', '请填写木托数量');
      return;
    }
    if (this.tasklist['isxiubian'] === null || this.tasklist['isxiubian'] === undefined) {
      this.toast.pop('warning', '请选择是否修边');
      return;
    }
    if (this.tasklist['islinshicangku'] && !this.tasklist['jiesuanmould']) {
      this.toast.pop('warning', '请选择结算方式');
      return;
    }
    console.log(this.tasklist);
    if (confirm('你确定进行加工任务单创建吗？')) {
      this.tihuoApi.putOrderdetToProorderdet(this.tasklist).then(data => {
        this.toast.pop('success', '创建成功！');
        this.listDetail();
        this.hideProduceTaskDialog();
        this.router.navigate(['tasklist', data]);
      });
    }
  }
  //chaodingjin;
  chaoedingjin(){
    this.qihuoapi.chaoedingjin(this.orderdetid).then(data => {
      this.params['chaodingjin'] = data.chaodingjin;
    })
  }
}
