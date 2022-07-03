import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from './../../../core/settings/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { MatchcarService } from '../matchcar.service';
import { GridOptions } from 'ag-grid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-matchcardetail',
  templateUrl: './matchcardetail.component.html',
  styleUrls: ['./matchcardetail.component.scss']
})
export class MatchcardetailComponent implements OnInit {
  matchcarid = this.route.params['value']['id'];
  isshowdingjintype = true;
  isqihuo = true;
  matchcar: any = {
    billno: '', buyername: '', shifaweight: '', shifacount: '', isdiaofee: '',
    pingzheng: '', tjine: '', cdate: '', destination: '', tihuoaddr: '', rukutaitou: '',
    sellername: '', org: { name: '' }, name: '', version: '', beizhu: ''
  };
  feemodel: any = {
    type: null, tweight: null, price: null, jine: null,
    innerprice: null, innerjine: null, feecustomerid: null, feecustomername: null
  };
  companyOfProduce: any;
  detids: any;
  matchcardetids: any = [];
  matchcarfeeid: any;
  isroleNum = true;
  gridOptions: GridOptions;//钢卷明细
  feeOptions: GridOptions;//通知明细列表
  wuliuinfo: any = { carno: null, sijiname: null, sijiid: null, sijitel: null, beizhu: null };
  suminfo: any = { tweightsum: 0, count: 0 };
  offlineForm: FormGroup;
  params = {};
  matcahcarfeeids = [];
  @ViewChild('addfeedialog') private addfeedialog: ModalDirective;
  @ViewChild('noticedialog') private noticedialog: ModalDirective;
  @ViewChild('tihuodialog') private tihuodialog: ModalDirective;
  @ViewChild('addrdialog') private addrdialog: ModalDirective;
  // 上传弹窗实例
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  // 入库单上传信息及格式
  uploadParam: any = { module: 'matchcarnumber', count: 1, sizemax: 1, extensions: ['xls'] };
  // 设置上传的格式
  accept = '.xls, application/xls';
  addr: any;
  isshowcreate: Boolean = true;
  endaddr: any;
  results: any;
  feetype = [{ label: '请选择', value: '' }, { label: '汽运费', value: 1 }, { label: '铁运费', value: 2 }, { label: '船运费', value: 3 }];
  pccname: any; // 省市县名称
  weight = { detid: null };
  @ViewChild('weightmodify') private weightmodify: ModalDirective;
  constructor(public settings: SettingsService, private matchcarApi: MatchcarService, private route: ActivatedRoute,
    private fb: FormBuilder, private toast: ToasterService, private datepipe: DatePipe, private router: Router) {
    this.offlineForm = fb.group({
      'chehao': [null, Validators.pattern('^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$')],
      'siji': [null, Validators.pattern('^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$')],
      'sijitel': [null, Validators.pattern('1[3|5|7|8|9|][0-9]{9}')],
      'sijiid': [],
      'islasttihuo': [],
      'dingjintype': [],
      'beizhu': [],
      'chukufeetype2': [],
    });

    this.feeOptions = {
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      enableFilter: true,
      getContextMenuItems: this.settings.getContextMenuItems,
    };
    this.feeOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', width: 70, cellRenderer: 'group', checkboxSelection: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'type', width: 90,
        cellRenderer: (params) => {
          if (params.data.type === 1) {
            return '汽运费';
          } else if (params.data.type === 2) {
            return '铁运费';
          } else if (params.data.type === 3) {
            return '船运费';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '总重量', field: 'tweight', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '系统单价', field: 'price', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '系统金额', field: 'jine', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实付单价', field: 'innerprice', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实付金额', field: 'innerjine', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际费用单位', field: 'feecustomername', width: 180 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feecustomername', width: 120, cellRenderer: () => {
          return '运营中心';
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', width: 100,
        cellRenderer: (params) => {
          if (params.data.id) {
            return '<a target="_blank">删除</a>';
          }
        },
        onCellClicked: (params) => {
          if (params.data.id) {
            if (!this.matchcar['saleisv']) {
              this.toast.pop('warning', '未审核不允许操作！');
              return;
            }
            this.matchcarApi.delMatchcarfee(params.data.id).then(data => {
              this.toast.pop('success', '操作成功！');
              this.getmatchcarfee();
            });
          }
        }
      }
    ];
    this.gridOptions = {
      rowSelection: 'multiple',
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableFilter: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      onSelectionChanged: (event) => {
        const rowCount = event.api.getSelectedNodes();
        this.suminfo.tweightsum = 0;
        this.suminfo.count = 0;
        rowCount.forEach(ele => {
          if (!ele['data']['group']) {
            this.suminfo.count++;
            this.suminfo.tweightsum = this.suminfo.tweightsum + Number(ele['data']['weight']);
          }

        });
        this.suminfo.tweightsum = this.suminfo.tweightsum.toFixed(3);
        //this.suminfo.count = rowCount.length;
        // console.log(this.suminfo.tweightsum);
        // console.log(this.suminfo.count);
      },
      getNodeChildDetails: (params) => {
        if (params.group) {
          return { group: true, children: params.participants, field: 'group', key: params.group };
        } else {
          return null;
        }
      },
      groupSelectsChildren: true // 分组可全选
    };
    // 设置明细表表格数据
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', cellRenderer: 'group',
        width: 90, checkboxSelection: true, headerCheckboxSelection: true,
      },
      // { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 260 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', width: 80,
        onCellClicked: (params) => {
          this.openweightmodifydialog(params.data.id);
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'cangkuname', width: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/cangku/' + params.data.cangkuid + '">' + params.data.cangkuname + '</a>';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'pertprice', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '定价', field: 'price', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '车号', field: 'carnumber', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '司机信息', field: 'driverinfo', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷状态', field: 'status', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'billno', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '物流号', field: 'zhongjiaobillno', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运单号', field: 'transportno', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运费单价', field: 'feeprice', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运费金额', field: 'feejine', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否确认', field: 'isagree', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', width: 100,
        cellRenderer: (params) => {
          if (params.data.id) {
            return '<a target="_blank">删除</a>';
          }
        },
        onCellClicked: (params) => {
          if (params.data.id) {
            if (!this.matchcar['saleisv']) {
              this.toast.pop('warning', '未审核不允许操作！');
              return;
            }
            this.matchcarApi.delDetail(params.data.id).then(data => {
              this.toast.pop('success', '操作成功！');
              this.getdetail();
              this.getMyRole();
            });
          }
        }
      }
    ];
  }

  //页面初始化的方法
  ngOnInit() {
    this.getdetail();
    this.getMyRole();//初始化页面的时候获取用户角色
  }

  //获取用户角色，如果登陆的用户是业务员，设置为不可见
  getMyRole() {
    const myrole = localStorage.getItem('myrole');
    const curuser = localStorage.getItem('cuser');
    const myroleArray = myrole.substring(1, myrole.length - 1).split(',');
    for (let i = 0; i < myroleArray.length; i++) {
      if (myroleArray[i] === '10' && curuser['id'] !== 572) {
        this.isroleNum = false;
      }
    }
    this.getmatchcarfee();
  }


  //获取约车单详情
  getdetail() {
    this.matchcarApi.getDetail(this.matchcarid).then(data => {
      console.log(data);
      this.matchcar = data['matchcar'];
      if (this.matchcar['provincename']) {
        this.pccname = this.matchcar['provincename'];
      }
      if (this.matchcar['cityname']) {
        this.pccname += this.matchcar['cityname'];
      }
      if (this.matchcar['countyname']) {
        this.pccname += this.matchcar['countyname'];
      }
      this.gridOptions.api.setRowData(data['list']);
    });
  }
  //获取约车费用报价
  getmatchcarfee() {
    if (this.isroleNum) {
      this.matchcarApi.getMatchcarfee(this.matchcarid).then(data => {
        console.log(data);
        this.feeOptions.api.setRowData(data);
      });
    }

  }
  //删除主表
  deleteM() {
    if (confirm('你确定要删除吗？')) {
      this.matchcarApi.deleteM(this.matchcarid).then(data => {
        this.toast.pop('success', '操作成功！');
        //跳转
      });
    }
  }
  /**
   * 批量删除约车单明细
   * @returns
   */
  deletedet() {
    this.matchcardetids = new Array();
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        this.matchcardetids.push(orderdetids[i].data.id);
      }
    }
    if (!this.matchcardetids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.matchcarApi.multipledeletedet(this.matchcardetids).then(data => {
        this.toast.pop('success', '操作成功！');
        this.getdetail();
        this.getMyRole();
      });
    }
  }
  // 车号模板下载
  downloadtemplate() {
    this.matchcarApi.downloadtemplate().then(data => {
      this.toast.pop('success', '下载成功！');
      //跳转
    });
  }

  // 入库单上传弹窗
  matchcarnumberUploader() {
    this.uploaderModel.show();
  }

  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }
  // 上传成功执行的回调方法
  uploads($event) {
    console.log($event);
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.matchcarApi.matchcarnumber(addData).then(data => {
        this.toast.pop('success', '上传成功！');
        this.ngOnInit();
      });
    }
    this.hideDialog();
  }


  //约车费用添加
  showaddfeedialog() {
    this.feemodel = {
      type: null, tweight: null, price: null, jine: null,
      innerprice: null, innerjine: null, feecustomerid: null, feecustomername: null
    };
    //let  = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细。
    this.detids = new Array();
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    let weight = '0';
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        weight = weight['add'](orderdetids[i].data.weight);
        this.detids.push(orderdetids[i].data.id);
      }
    }
    if (this.detids.length === 0) {
      this.toast.pop('warning', '请选择明细之后再进行费用的添加！');
      return;
    }
    this.feemodel['tweight'] = weight;
    this.addfeedialog.show();
  }
  hideaddfeedialog() {
    this.addfeedialog.hide();
  }
  //创建费用
  createFee() {
    if (!this.companyOfProduce['code']) {
      this.toast.pop('warning', '请选择费用单位！');
      return '';
    }
    if (!this.feemodel['type']) {
      this.toast.pop('warning', '请选择费用类型！');
      return '';
    }
    this.feemodel['feecustomerid'] = this.companyOfProduce['code'];
    this.feemodel['ids'] = this.detids;
    this.feemodel['matchcarid'] = this.matchcarid;
    this.matchcarApi.createfee(this.feemodel).then(data => {
      this.toast.pop('success', '操作成功！');
      this.getmatchcarfee();
      this.hideaddfeedialog();
    });
  }

  getinnerjine() {
    if (!this.feemodel['tweight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    if (!this.feemodel['innerprice']) {
      this.toast.pop('warning', '请填写单价');
      return '';
    }
    this.feemodel['innerjine'] = Math.round(this.feemodel['tweight'].mul(this.feemodel['innerprice']) * 100) / 100;
  }
  // 通过金额获取单价
  getinnerprice() {
    if (!this.feemodel['tweight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    if (!this.feemodel['innerjine']) {
      this.toast.pop('warning', '请填写金额');
      return '';
    }
    this.feemodel['innerprice'] = Math.round(this.feemodel['innerjine'].div(this.feemodel['tweight']) * 100) / 100;
  }
  getjine() {
    if (!this.feemodel['tweight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    if (!this.feemodel['price']) {
      this.toast.pop('warning', '请填写单价');
      return '';
    }
    this.feemodel['jine'] = Math.round(this.feemodel['tweight'].mul(this.feemodel['price']) * 100) / 100;
  }
  // 通过金额获取单价
  getprice() {
    if (!this.feemodel['tweight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    if (!this.feemodel['jine']) {
      this.toast.pop('warning', '请填写金额');
      return '';
    }
    this.feemodel['price'] = Math.round(this.feemodel['jine'].div(this.feemodel['tweight']) * 100) / 100;
  }
  //通知物流信息给销售内勤
  shownoticedialog() {
    this.wuliuinfo = { carno: null, sijiname: null, sijiid: null, sijitel: null, beizhu: null };
    this.noticedialog.show();
  }
  hidenoticedialog() {
    this.noticedialog.hide();
  }
  noticeinfo() {
    this.wuliuinfo['matchcarid'] = this.matchcarid;
    console.log(this.wuliuinfo);
    this.matchcarApi.noticewuliuinfo(this.wuliuinfo).then(data => {
      this.toast.pop('success', '通知成功');
      this.hidenoticedialog();
    });
  }
  chukufeetype2;
  //提货单创建
  showtihuodialog() {
    // 获得所有选中的待提货物如果没有选中则不允许添加提货人
    this.params['dingjinshifangtype'] = '0';
    const matchcardets = [];
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        matchcardets.push(orderdetids[i].data);
      }
    }
    // 首先判断是否是选择的同一个仓库下的货物进行运费添加
    if (matchcardets.length > 0) {
      // 定义一个数组存放订单明细表的id。
      const matchcardetids = new Array();
      for (let i = 0; i < matchcardets.length; i++) {
        if (matchcardets[i].billno.substring(0, 2) !== 'QH') {
          this.isqihuo = false;
          this.isshowdingjintype = false;
        } else {
          this.isqihuo = true;
          this.isshowdingjintype = true;
        }
        this.params['isonline'] = matchcardets[i].isonline;
        matchcardetids.push(matchcardets[i].id); // 将orderdetid放到数组中去
      }
      this.params['ids'] = matchcardetids;
    } else {
      this.toast.pop('warning', '请选择提货的货物!');
      return;
    }
    this.params['chukufeetype2'] = matchcardets[0]['chukufeetype'];
    this.tihuodialog.show();
  }
  hidetihuodialog() {
    this.tihuodialog.hide();
  }
  showdingjintype(value1) {
    if (value1 === 0) {
      this.isshowdingjintype = true;
    } else {
      this.isshowdingjintype = false;
    }
  }
  submittihuo() {
    if (this.params['islasttihuo'] === '1') {
      this.params['dingjinshifangtype'] = null;
      this.params['islasttihuo'] = true;
    } else {
      this.params['islasttihuo'] = false;
    }
    console.log(this.params);
    this.matchcarApi.createtihuo(this.params).then(data => {
      this.toast.pop('success', '提货单创建成功!');
      this.getdetail();
      this.hidetihuodialog();
      this.router.navigate(['/tihuo', data['tihuo']['id']]);
    });
  }
  //让业务员审批报的运费价格
  verifymatchcarfee() {
    this.matcahcarfeeids = [];
    const feeids = this.feeOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < feeids.length; i++) {
      if (feeids[i].selected) {
        this.matcahcarfeeids.push(feeids[i].data.id);
      }
    }
    if (!this.matcahcarfeeids.length) {
      this.toast.pop('warning', '请选择要提交审核的费用');
      return;
    }
    this.matchcarApi.noticeMatchcarfee({ matcahcarfeeids: this.matcahcarfeeids, matchcarid: this.matchcarid }).then(data => {
      this.toast.pop('success', '通知成功，请等待审批！');
    });
  }
  // 临调提货单重量修改
  openweightmodifydialog(detid) {
    this.weight['detid'] = detid;
    this.weightmodify.show();
  }
  closeweightmodifydialog() {
    this.weightmodify.hide();
  }
  modifyldweight() {
    const model = { weight: this.weight['weight'] };
    this.matchcarApi.modifyWeight(this.weight['detid'], model).then(data => {
      this.closeweightmodifydialog();
      this.toast.pop('success', '修改成功');
      this.getdetail();
    });
  }
  noticewlfindcar() {
    if (confirm('请确定已修改约车吨位，要通知物流找车吗？')) {
      this.matchcarApi.noticewlfindcar(this.matchcar['id']).then(data => {
        this.toast.pop('success', '通知成功');
      });
    }
  }
  // ########################################## 物流平台接口对接 ##########################################
  addAddrDialog(no) {
    if (no === 2) {
      this.isshowcreate = false;
    } else if (no === 1) {
      this.isshowcreate = true;
    }
    const matchcardets = [];
    let cangkuid;
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        matchcardets.push(orderdetids[i].data);
        cangkuid = orderdetids[i].data.cangkuid;
      }
    }
    if (matchcardets.length <= 0) {
      this.toast.pop('warning', '请选择物流订单创建的货物!');
      return;
    }
    const matchcardetids = new Array();
    for (let i = 0; i < matchcardets.length; i++) {
      matchcardetids.push(matchcardets[i].id); // 将orderdetid放到数组中去
    }
    this.params['ids'] = matchcardetids;
    this.params['matchcarid'] = this.matchcarid;
    this.params['cangkuid'] = cangkuid;
    this.addrdialog.show();
  }
  addrdialogclose() {
    this.addrdialog.hide();
  }
  searchplace(e) {
    console.log(e.query);
    this.matchcarApi.getSuggestionPlace(e.query).then(data => {
      console.log(data);
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.title + '\r\n' + element.address,
          code: element
        });
      });
    });
  }
  createwuliuorder() {
    if (!this.params['senddate']) {
      this.toast.pop('warning', '请填写发货时间！');
      return;
    }
    if (!this.params['reachdate']) {
      this.toast.pop('warning', '请填写交货时间！');
      return;
    }
    // if (!this.addr['code']) {
    //   this.toast.pop('warning', '请填写发货地址！');
    //   return;
    // }
    if (!this.endaddr['code']) {
      this.toast.pop('warning', '请填写交货地址！');
      return;
    }
    this.params['senddate'] = this.datepipe.transform(this.params['senddate'], 'y-MM-dd');
    this.params['reachdate'] = this.datepipe.transform(this.params['reachdate'], 'y-MM-dd');
    // this.params['startaddr'] = this.addr['code'];
    this.params['endaddr'] = this.endaddr['code'];
    console.log(this.params);
    if (confirm('你确定要创建物流订单吗？')) {
      this.matchcarApi.createRPCwuliuorder(this.params).then(data => {
        if (data['message']) {
          this.toast.pop('warning', data['message']);
        } else {
          this.toast.pop('success', '创建成功');
        }
        this.addrdialogclose();
      });
    }
  }

  updatewuliuorder() {
    if (!this.params['senddate']) {
      this.toast.pop('warning', '请填写发货时间！');
      return;
    }
    if (!this.params['reachdate']) {
      this.toast.pop('warning', '请填写交货时间！');
      return;
    }
    // if (!this.addr['code']) {
    //   this.toast.pop('warning', '请填写发货地址！');
    //   return;
    // }
    if (!this.endaddr['code']) {
      this.toast.pop('warning', '请填写交货地址！');
      return;
    }
    this.params['senddate'] = this.datepipe.transform(this.params['senddate'], 'y-MM-dd');
    this.params['reachdate'] = this.datepipe.transform(this.params['reachdate'], 'y-MM-dd');
    // this.params['startaddr'] = this.addr['code'];
    this.params['endaddr'] = this.endaddr['code'];
    console.log(this.params);
    if (confirm('你确定要更新物流订单吗？')) {
      this.matchcarApi.updateRPCwuliuorder(this.params).then(data => {
        if (data['message']) {
          this.toast.pop('warning', data['message']);
        } else {
          this.toast.pop('success', '更新成功！');
        }
        this.addrdialogclose();
      });
    }
  }

  cancelRPCWuliuOrder() {
    const matchcardets = [];
    let count = 0;
    let zhongjiaobillno = null;
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        matchcardets.push(orderdetids[i].data);
        if (!zhongjiaobillno && orderdetids[i].data['zhongjiaobillno']) {
          zhongjiaobillno = orderdetids[i].data['zhongjiaobillno'];
          count++;
        }
        if (zhongjiaobillno !== orderdetids[i].data['zhongjiaobillno']) {
          count++;
        }
      }
    }
    if (matchcardets.length <= 0) {
      this.toast.pop('warning', '请选择物流订单撤销的货物!');
      return;
    }
    const matchcardetids = new Array();
    for (let i = 0; i < matchcardets.length; i++) {
      matchcardetids.push(matchcardets[i].id); // 将orderdetid放到数组中去
    }
    this.params['ids'] = matchcardetids;
    if (confirm('你确定要撤销' + (count > 1 ? '    多个    ' : '') + '物流订单吗？')) {
      this.matchcarApi.cancelRPCwuliuorder(this.params).then(data => {
        if (data['message']) {
          this.toast.pop('warning', data['message']);
        } else {
          this.toast.pop('success', '撤销成功！');
        }
      });
    }
  }

  endRPCWuliuOrder() {
    const matchcardets = [];
    let count = 0;
    let zhongjiaobillno = null;
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        matchcardets.push(orderdetids[i].data);
        if (!zhongjiaobillno && orderdetids[i].data['zhongjiaobillno']) {
          zhongjiaobillno = orderdetids[i].data['zhongjiaobillno'];
          count++;
        }
        if (zhongjiaobillno !== orderdetids[i].data['zhongjiaobillno']) {
          count++;
        }
      }
    }
    if (matchcardets.length <= 0) {
      this.toast.pop('warning', '请选择物流订单完结的货物!');
      return;
    }
    const matchcardetids = new Array();
    for (let i = 0; i < matchcardets.length; i++) {
      matchcardetids.push(matchcardets[i].id); // 将orderdetid放到数组中去
    }
    this.params['ids'] = matchcardetids;
    if (confirm('你确定要完结' + (count > 1 ? '    多个    ' : '') + '物流订单吗？')) {
      this.matchcarApi.endRPCwuliuorder(this.params).then(data => {
        this.toast.pop('success', '完结成功！');
      });
    }
  }
  // 同步运单数据
  syncRPCWuliuOrder() {
    const matchcardets = [];
    let count = 0;
    let zhongjiaobillno = null;
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        matchcardets.push(orderdetids[i].data);
        if (!zhongjiaobillno && orderdetids[i].data['zhongjiaobillno']) {
          zhongjiaobillno = orderdetids[i].data['zhongjiaobillno'];
          count++;
        }
        if (zhongjiaobillno !== orderdetids[i].data['zhongjiaobillno']) {
          count++;
        }
      }
    }
    if (matchcardets.length <= 0) {
      this.toast.pop('warning', '请选择物流订单同步的货物!');
      return;
    }
    const matchcardetids = new Array();
    for (let i = 0; i < matchcardets.length; i++) {
      matchcardetids.push(matchcardets[i].id); // 将orderdetid放到数组中去
    }
    this.params['ids'] = matchcardetids;
    this.params['matchcarid'] = this.matchcar['id'];
    if (confirm('你确定要同步' + (count > 1 ? '    多个    ' : '') + '物流订单吗？')) {
      this.matchcarApi.syncRPCwuliuorder(this.params).then(data => {
        this.toast.pop('success', '同步成功！');
      });
    }
  }

}
