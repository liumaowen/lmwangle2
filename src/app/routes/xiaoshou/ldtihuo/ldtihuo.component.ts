import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { XiaoshouapiService } from './../xiaoshouapi.service';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { WuliuorderimportComponent } from '../offline/wuliuorderimport/wuliuorderimport.component';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';

@Component({
  selector: 'app-ldtihuo',
  templateUrl: './ldtihuo.component.html',
  styleUrls: ['./ldtihuo.component.scss']
})
export class LdtihuoComponent implements OnInit {

  isshowdingjintype = true;
  isqihuo = true;
  // 创建提货表单
  ldtihuoForm: FormGroup;
  isputong: boolean = true;
  // aggird 表格初始化对象
  gridOptions: GridOptions;
  buyerid: any;
  array: any;
  transportCompany: any;
  matchcar: any;
  isld: boolean;
  // 查询对象
  search = { ids: null };
  // 物流竞价弹窗对象
  wlbsModalRef: BsModalRef;
  constructor(public settings: SettingsService, private xiaoshouApi: XiaoshouapiService, private toast: ToasterService,
    private fb: FormBuilder, private customerApi: CustomerapiService, private bsModalService: BsModalService,
    private datepipe: DatePipe, private routes: ActivatedRoute, private router: Router) {

    // 创建提单表单校验
    this.ldtihuoForm = fb.group({
      'chehao': [null, Validators.compose([Validators.required, Validators.pattern('^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$')])],
      // 'kucunid': [null, Validators.compose([Validators.required])],
      /**2018.01.12 转货权开发 cpf DEL start
      'tihuotype': [{ value: true }, Validators.compose([Validators.required])],
       */
      'siji': [null, Validators.compose([Validators.required])],
      'sijiid': [null, Validators.compose([Validators.required])],
      'sijitel': [null, Validators.compose([Validators.required])],
      'fpld': [null, Validators.compose([Validators.required])],
      'beizhu': [null, Validators.compose([])],
      'islasttihuo': [null, []],
      'dingjintype': [null, []],
    });

    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowSelection: 'multiple',
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
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 60, checkboxSelection: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '订单编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data) {
            return params.data.billno;
          } else {
            return '合计';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '下单时间', field: 'cdate', minWidth: 120, valueFormatter: data => {
          return this.datepipe.transform(data.value, 'y-MM-dd HH:mm:s');
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户单位', field: 'buyername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'seller.name', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'cangku', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'cuser.org.name', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 260 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已引重量', field: 'yitihuoweight', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yitihuoweight']) {
            return Number(params.data['yitihuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
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
        cellStyle: { 'text-align': 'right' }, headerName: '可临调重量', field: 'weight', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight'] - params.data['yitihuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '付款方式', field: 'isorderpay', minWidth: 100,
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
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'cuser.realname', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '出库费结算', field: 'chukufeetype', minWidth: 110,
        cellRenderer: function (params) {
          if (params.data) {
            if (params.data.chukufeetype == '0') {
              return '现结';
            } else if (params.data.chukufeetype == '1') {
              return '月结';
            } else if (params.data.chukufeetype == '2') {
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
        cellStyle: { 'text-align': 'center' }, headerName: '配送方式', field: 'type', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data.type == '0') {
              return '自提';
            } else if (params.data.type == '1') {
              return '代运';
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
        cellStyle: { 'text-align': 'right' }, headerName: '销售单价', field: 'saleprice', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '收货地址', field: 'addressdetail', minWidth: 260 },
      { cellStyle: { 'text-align': 'center' }, headerName: '联系人', field: 'contactman', minWidth: 260 },
      { cellStyle: { 'text-align': 'center' }, headerName: '联系电话', field: 'contactway', minWidth: 260 }
    ];

    this.listDetail();
  }

  ngOnInit() {
  }

  // 获取列表信息
  listDetail() {
    this.xiaoshouApi.getlist().then(data => {
      console.log(data);
      this.gridOptions.api.setRowData(data);
    })
  }
  //期货查询
  @ViewChild('queryqihuoDialog') private queryqihuoDialog: ModalDirective;
  query: any = { billno: '', buyerid: '', sellerid: '', orgid: '' };
  buyer: any;
  cuser: any;
  queryDialog() {
    this.queryqihuoDialog.show();
  }
  closeqihuoquery() {
    this.queryqihuoDialog.hide();
  }
  queryqihuo() {
    if (this.buyer && this.buyer['code']) {
      this.query['buyerid'] = this.buyer['code'];
    }
    this.xiaoshouApi.getldqihuolist(this.query).then(data => {
      console.log(data);
      this.gridOptions.api.setRowData(data);
      this.closeqihuoquery();
    });
  }
  innercompany(event) {
    this.query['sellerid'] = event;
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('classicModal') private classicModal: ModalDirective;

  // 打开查询弹窗
  showDialog() {
    let qihuodets = this.gridOptions.api.getSelectedRows();
    // if (qihuodets.length <= 0) {
    //   this.toast.pop('warning', '请选择要提货的货物进行创建提货单!');
    //   return;
    // }
    /**2018.01.12 转货权开发 cpf ADD start */
    if (qihuodets.length > 0) {
      let type = null;
      let typecount = 0;
      for (let i = 0; i < qihuodets.length; i++) {
        if (qihuodets[i].type === 1) {
          this.toast.pop('warning', '请选择自提的明细进行提单的创建！');
          return;
        }
        if (type !== qihuodets[i].type) {
          typecount++; type = qihuodets[i].type;
        }
        if (qihuodets[i].billno.substring(0, 2) !== 'QH') {
          this.isqihuo = false;
          this.isshowdingjintype = false;
        } else {
          this.search['islasttihuo'] = '0';
          this.search['dingjinshifangtype'] = '0';
          this.isqihuo = true;
          this.isshowdingjintype = true;
        }
      }
      if (typecount > 1) {
        this.toast.pop('warning', '创建提单时，请选择相同的配送方式');
        return;
      }
      if (type === 2) {
        this.isputong = false;
        this.search['tihuotype'] = '1';
      } else {
        this.isputong = true;
        this.search['tihuotype'] = '0';
      }
    }
    /**2018.01.12 转货权开发 end */
    this.classicModal.show();
  }
  showdingjintype(value1) {
    if (value1 === 0) {
      this.isshowdingjintype = true;
    } else {
      this.isshowdingjintype = false;
    }
  }
  // 关闭查询弹窗
  hideDialog() {
    this.classicModal.hide();
  }

  // 重选
  selectNull() {
    this.search = { ids: null };
    this.query = { billno: '', buyerid: '', sellerid: '', orgid: '' };
    this.buyer = null;
    this.cuser = null;
  }
  zhuanhuo() {
    this.isputong = false;
    this.ldtihuoForm.get('chehao').disable();
    this.ldtihuoForm.get('siji').disable();
    this.ldtihuoForm.get('sijiid').disable();
    this.ldtihuoForm.get('beizhu').disable();
    this.ldtihuoForm.get('sijitel').disable();
  }
  putong() {
    this.isputong = true;
    this.ldtihuoForm.get('chehao').enable();
    this.ldtihuoForm.get('siji').enable();
    this.ldtihuoForm.get('sijiid').enable();
    this.ldtihuoForm.get('beizhu').enable();
    this.ldtihuoForm.get('sijitel').enable();
  }
  // 创建
  create() {
    this.search.ids = [];
    const qihuodets = this.gridOptions.api.getSelectedRows();
    if (qihuodets.length > 0) {
      for (let i = 0; i < qihuodets.length; i++) {
        console.log('----------=========---------', qihuodets[i]);
        this.search.ids.push(qihuodets[i].id);
      }
    }
    /**2018.01.12 转货权开发 cpf DEL start
    if (!this.search['tihuotype']) {
      this.toast.pop('warning', '请填写提货类型');
    } else  */
    /**2018.01.13 转货权开发 cpf MOD start */
    if (this.search['tihuotype'] === '0') {
      if (!this.search['chehao']) {
        this.toast.pop('warning', '请填写车牌号');
        return;
      } else if (!this.search['siji']) {
        this.toast.pop('warning', '请填写司机');
        return;
      } else if (!this.search['sijiid']) {
        this.toast.pop('warning', '请填写司机身份证');
        return;
      } else if (!this.search['sijitel']) {
        this.toast.pop('warning', '请填写司机电话');
        return;
      } else if (!this.search['beizhu']) {
        this.toast.pop('warning', '请填写备注');
        return;
      }
    }
    if (this.search['islasttihuo'] === '1') {
      this.search['dingjinshifangtype'] = null;
      this.search['islasttihuo'] = true;
    } else {
      this.search['islasttihuo'] = false;
    }
    this.xiaoshouApi.ldtihuo(this.search).then(data => {
      this.toast.pop('success', '创建成功！');
      this.hideDialog();
      this.router.navigate(['/tihuo', data]);
    });
    /**2018.01.13 转货权开发 end */
  }
  //完成临调
  finishld() {
    this.search.ids = [];
    let qihuodets = this.gridOptions.api.getSelectedRows();
    if (qihuodets.length > 0) {
      for (let i = 0; i < qihuodets.length; i++) {
        console.log('----------=========---------', qihuodets[i]);
        this.search.ids.push(qihuodets[i].id);
      }
    }
    if (this.search.ids.length < 1) {
      this.toast.pop('warning', '请选择完成临调的明细！');
      return;
    }
    this.xiaoshouApi.finishld(this.search).then(data => {
      this.toast.pop('success', '修改成功！');
      this.listDetail();
    })
  }
  queryfproduct() {
    this.gridOptions.api.setRowData(null);
    this.xiaoshouApi.listfproducts().then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  //临调约车单创建
  showLdMatchcar() {
    // 获得所有选中的待提货物如果没有选中则不允许添加提货人
    const orderdets = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    // 获得所有选中的待提货物如果没有选中则不允许添加提货人
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        orderdets.push(orderdetSelected[i].data);
      }
    }
    console.log(orderdets);
    // 首先判断是否是选择的同一个仓库下的货物进行运费添加
    if (orderdets.length <= 0) {
      this.toast.pop('warning', '请选择临调约车的明细！！！');
      return;
    }
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
      if (orderdets[i].cangkuname && orderdets[i].cangkuname.indexOf('在途') !== -1) {
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
      orderdetids.push(orderdets[i].id); // 将orderdetid放到数组中去
      if (orderdets[i].id) {
        qihuodetidsset.add(orderdets[i].id);
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
    if (chukufeetypecount > 1) {
      this.toast.pop('warning', '创建提单时，请选择相同的出库费结算方式');
      return;
    }
    this.array = orderdetids;
    if (cangkucount > 1) {
      this.toast.pop('warning', '创建提单时，请选择相同的仓库');
      return;
    }
    this.customerApi.findwl().then((data) => {
      this.transportCompany = data; // 获取运输公司
    });
    this.matchcar = { transtype: null, destination: null, beizhu: null, istuisong: false };
    this.matchcar['cangkuid'] = cangkuid;
    this.matchcar['orderdetids'] = orderdetids;
    const params = { qihuodetids: Array.from(qihuodetidsset) };
    this.isld = true;
    this.bsModalService.config.class = 'modal-all';
    this.wlbsModalRef = this.bsModalService.show(WuliuorderimportComponent);
    this.wlbsModalRef.content.search = params;
    this.wlbsModalRef.content.parentthis = this;
    this.selectNull();
  }


}
