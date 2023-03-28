import {DatePipe, DecimalPipe} from '@angular/common';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CustomerapiService} from '../../../customer/customerapi.service';
import {ToasterService} from 'angular2-toaster';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from '../../../../core/settings/settings.service';
import {GridOptions} from 'ag-grid/main';
import {ModalDirective, BsModalService} from 'ngx-bootstrap/modal';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatchcarService} from 'app/routes/matchcar/matchcar.service';
import {AddressparseService} from 'app/dnn/service/address_parse';
import {ClassifyApiService} from 'app/dnn/service/classifyapi.service';
import {RoleapiService} from 'app/routes/role/roleapi.service';
import {QihuoService} from 'app/routes/qihuo/qihuo.service';
import {XmdorderService} from '../../order/xmdorder.service';
import {XmdtihuoService} from '../xmdtihuo.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-xmdoffline',
  templateUrl: './xmdoffline.component.html',
  styleUrls: ['./xmdoffline.component.scss']
})
export class XmdOfflineComponent implements OnInit {
  offlineForm: FormGroup;
  isshowdingjintype = true;
  isqihuo = true;
  total = {count: 0, tweight: 0, tlength: 0, tmoney: 0};
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 释放货物弹窗
  @ViewChild('releaseDialog') private releaseDialog: ModalDirective;
  wuliuyuan;
  tasklist: Object = {};
  mindate: Date = new Date();
  start: Date = new Date();
  types: any = [{value: '', label: '请选择打包带材料'}, {value: '1', label: '钢带'}, {value: '2', label: '其他'}];
  companyIsWiskind = [];
  // 创建弹窗
  params = {};
  // 获取运输公司
  transportCompany;
  isshow = true;
  array;
  ists;
  // 入库单上传信息及格式
  uploadParam: any = {module: 'offlinecarnumber', count: 1, sizemax: 1, extensions: ['xls']};
  // 设置上传的格式
  accept = '.xls, application/xls';
  // 判断是否线上线下
  flag = {};
  matchcar = {transtype: null, destination: null, beizhu: null, istuisong: false};
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
  // 物流竞价弹窗对象
  reason = ''; // 释放原因
  shifangmap = {keshifangdingjin: '0', dingjinshengyu: '0', keshifangallocation: '0', qiankuanjine: '0'};

  constructor(public settings: SettingsService, private tihuoApi: XmdtihuoService,
              private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private toast: ToasterService, private customerApi: CustomerapiService,
              private matchcarAPi: MatchcarService, private numberpipe: DecimalPipe,
              private bsModalService: BsModalService, private datepipe: DatePipe, private qihuoapi: QihuoService,
              private addressparseService: AddressparseService, private classifyApi: ClassifyApiService,
              private orderApi: XmdorderService, private roleapi: RoleapiService
  ) {
    this.roleapi.getroleusers().then((data) => {
      const wuliuyuanlist = [{label: '请选择物流员', value: ''}];
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
      'istopeikuan': [],
      'chaodingjin': [],
      'topeikuanjine': [],

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
            this.total.tmoney = this.total.tmoney['add'](linemoney['fmoney'](2, false));
          }
        } else {
          if (params.data) {
            this.total.count = this.total.count - 1;
            this.total.tweight = this.total.tweight['sub'](params.node.data.weight);
            this.total.tlength = this.total.tlength['sub'](params.node.data.length);
            const linemoney = params.node.data.pertprice['mul'](params.node.data.weight);
            this.total.tmoney = this.total.tmoney['sub'](linemoney['fmoney'](2, false));
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
      {field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计'},
      {
        cellStyle: {'text-align': 'center'}, headerName: '选择', minWidth: 60, pinned: 'left',
        checkboxSelection: (params) => params.data, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      },
      {
        cellStyle: {'text-align': 'center'}, headerName: '订单编号', field: 'billno', minWidth: 100,
        cellRenderer: function (params) {
          if (params.data) {
            if (params.data.billno.substring(0, 2) === 'QH') {
              return '<a target="_blank" href="#/xmdqihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (params.data.billno.substring(0, 2) === 'BO') {
              return '<a target="_blank" href="#/xmdorderdet/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else {
              return '<a target="_blank" href="#/xmdorderdet/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
          } else {
            return '合计';
          }
        }
      },
      {
        cellStyle: {'text-align': 'center'}, headerName: '客户单位', field: 'customer.name', minWidth: 100,
        // cellRenderer: function (params) {
        //   if (params.data) {
        //     return '<a target="_blank" href="#/xiaoshouwanglaireport/' + params.data.customer.id + '">' +
        //       params.data.customer.name + '</a>';
        //   }
        // }
      },
      {cellStyle: {'text-align': 'center'}, headerName: '仓库名称', field: 'cangkuname', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '规格', field: 'guige', minWidth: 260},
      {
        cellStyle: {'text-align': 'right'}, headerName: '重量', field: 'weight', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: {'text-align': 'right'}, headerName: '销售单价', field: 'pertprice', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {cellStyle: {'text-align': 'center'}, headerName: '长度', field: 'length', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '资源号', field: 'grno', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '捆包号', field: 'kunbaohao', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '加工方式', field: 'producetype', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '车号', field: 'carnumber', minWidth: 60},
      {cellStyle: {'text-align': 'center'}, headerName: '司机信息', field: 'driverinfo', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '机构', field: 'cuser.org.name', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '下单时间', field: 'cdate', minWidth: 120},
      {cellStyle: {'text-align': 'center'}, headerName: '库龄', field: 'qihuokuling', minWidth: 60},
      {cellStyle: {'text-align': 'center'}, headerName: '仓储号', field: 'storageno', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '备注', field: 'beizhu', minWidth: 100},
      {
        cellStyle: {'text-align': 'center'}, headerName: '交货状态', field: 'isfinish', minWidth: 80,
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
        cellStyle: {'text-align': 'center'}, headerName: '付款方式', field: 'isorderpay', minWidth: 80,
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
      {cellStyle: {'text-align': 'center'}, headerName: '业务员', field: 'cuser.realname', minWidth: 60},
      {
        cellStyle: {'text-align': 'center'}, headerName: '出库费结算', field: 'chukufeetype', minWidth: 110,
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
        cellStyle: {'text-align': 'right'}, headerName: '出库费单价', field: 'perchukuprice', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: {'text-align': 'center'}, headerName: '配送方式', field: 'type', minWidth: 60,
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
        cellStyle: {'text-align': 'right'}, headerName: '定价', field: 'price', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: {'text-align': 'center'}, headerName: '是否全款', field: 'isquankuan', minWidth: 60,
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
      {cellStyle: {'text-align': 'center'}, headerName: '卖方单位', field: 'seller.name', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '采购单位', field: 'caigoubuyername', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '收货地址', field: 'addressdetail', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '联系人', field: 'contactman', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '联系电话', field: 'contactway', minWidth: 100}];

    this.listDetail();
  }

  ngOnInit() {
    setTimeout(() => {
      this.addressparseService.getData();
    }, 1000);
  }

  // 获取表格数据
  listDetail() {
    this.total = {count: 0, tweight: 0, tlength: 0, tmoney: 0};
    // if (this.route.data['value']['offline']) {
    this.tihuoApi.offlinetihuolist().then((tihuolist) => {
      setTimeout(() => {
        this.gridOptions.api.setRowData(tihuolist);
      }, 500);
    });
    // } else {
    //   this.flag = {isonline: true};
    //   this.tihuoApi.querytihuolist({type: 1}).then((tihuolist) => {
    //     this.gridOptions.api.setRowData(tihuolist);
    //   });
    // }
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
      this.tihuoApi.getkeshifang({detids: orderdets}).then((data) => {
        this.shifangmap = {
          keshifangdingjin: data['keshifangdingjin'], dingjinshengyu: data['dingjinshengyu'],
          keshifangallocation: data['keshifangallocation'], qiankuanjine: data['qiankuanjine']
        };
      });
    } else {
      this.shifangmap = {keshifangdingjin: '0', dingjinshengyu: '0', keshifangallocation: '0', qiankuanjine: '0'};
    }
  }

  wuliuyuanType = [];
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
      this.orderdetid = orderdets[0].billid;
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
        if (!data['isfujian']) {
          isfujian = false;
        }
        for (let i = 0; i < orderdets.length; i++) {
          if (orderdets[i].type === 1) {
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
            sellcount++;
            sellerid = orderdets[i].sellerid;
          }
          if (type !== orderdets[i].type) {
            typecount++;
            type = orderdets[i].type;
          }
          if (cangkuid !== orderdets[i].cangkuid) { // 判断仓库是否相同
            cangkucount++;
            cangkuid = orderdets[i].cangkuid;
          }
          if (chukufeetype !== orderdets[i].chukufeetype) {
            chukufeetypecount++;
            chukufeetype = orderdets[i].chukufeetype;
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
          ist: null, type: type, tihuotype: '0', cangkuid: '', islasttihuo: '0', dingjinshifangtype: '1', istopeikuan: '0'//, chukufeetype2: null
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
          this.ists = [{ist: true, name: '总价'}, {ist: false, name: '单价'}];


          this.getProvince();
          this.wuliuyuanType = [{label: '请选择物流员', value: ''}, {label: '赵雪懿', value: '赵雪懿'},
            {label: '蔡沙沙', value: '蔡沙沙'}, {label: '刘俊苗', value: '刘俊苗'},
            {label: '唐文文', value: '唐文文'}, {label: '邓馨', value: '邓馨'}, {label: '马慧芳', value: '马慧芳'}];
          this.orderApi.getchukufee({detids: this.array}).then((response) => {
            this.params['enddest'] = response['mudidi'];
          });
          if (!isfujian) {
            if (confirm('为便于后期正常开票，请及时上传双方盖章合同')) {
              this.classicModal.show();
            }
          } else {
            this.classicModal.show();
          }
        } else {
          this.toast.pop('warning', '创建提单时，请选择相同的仓库');
        }
      });
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

  transfer(type) {
    if (type === 1) {
      this.isshow = false;
    }
  }

  iskehugaizhang: any = [];

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
    if (this.params['istopeikuan'] === '1') {
      this.qihuoapi.dingjinTixing(this.params).then((response) => {// 创建提货单
        if (response['istixing']) {
          if (confirm('注意：本次超额定金转配款后，现有定金小于10万元，非最后一次提货将无法等比例释放')) {
            this.createTihuo();
          }
        } else {
          this.createTihuo();
        }
      });
    } else {
      this.createTihuo();
    }


  }

  createTihuo() {
    // if (this.route.data['value']['offline']) {
    this.params['isonline'] = false;
    // } else {
    //   this.params['isonline'] = true;
    // }
    if (this.params['islasttihuo'] === '1') {
      this.params['dingjinshifangtype'] = null;
      this.params['islasttihuo'] = true;
    } else {
      this.params['islasttihuo'] = false;
    }
    this.tihuoApi.iskehugaizhang(this.params).then(data => {
      this.iskehugaizhang = data['iskehugaizhang'];
      if (this.iskehugaizhang) {
        this.tihuoApi.createtihuo(this.params).then((response) => {// 创建提货单
          this.hideDialog(); // 关闭弹出框
          this.toast.pop('success', '提货单创建成功');
          this.router.navigate(['/tihuo', response['tihuo']['id']]);
        });
      } else {
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

  getProvince() {
    this.provinces = [];
    this.classifyApi.getChildrenTree({pid: 263}).then((data) => {
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

  getpcc(pid, pccname: any[]) {
    return new Promise((resolve: (data) => void) => {
      this.classifyApi.getChildrenTree({pid: pid}).then((data) => {
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
    this.classifyApi.getChildrenTree({pid: this.params['provinceid']}).then((data) => {
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
    this.classifyApi.getChildrenTree({pid: this.params['cityid']}).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }

  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({label: '请选择盖章单位', value: ''});
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


  //chaodingjin;
  chaoedingjin() {
    this.qihuoapi.chaoedingjin(this.orderdetid).then(data => {
      this.params['chaodingjin'] = data.chaodingjin;
    });
  }
}
