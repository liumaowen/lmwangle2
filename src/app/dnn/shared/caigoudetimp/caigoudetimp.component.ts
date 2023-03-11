import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { CaigouService } from 'app/routes/caigou/caigou.service';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { ReceiveapiService } from 'app/routes/receive/receiveapi.service';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-caigoudetimp',
  templateUrl: './caigoudetimp.component.html',
  styleUrls: ['./caigoudetimp.component.scss']
})
export class CaigoudetimpComponent implements OnInit {

  caigouSelected = new Array<any>();
  caigou: object = { sellerid: '', jiaohuoaddr: '', beizhu: '', type: '', kind: '', caigoutype: '', month: '', chandiid: '', chandi: '' };
  dantypes;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('addModal') private addModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  // 默认禁止选择
  disabled = true;
  // 开始时间最大时间
  startmax: Date = new Date();
  parentThis;
  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date();

  // 结束时间
  end: Date = new Date();
  gridOptions: GridOptions;
  search: object = {
    start: '', end: '', billno: '', orgid: '', cuserid: '', salemanid: '', sellerid: '',
    kehuid: '', gn: '', classifys: {}, chandi: '', grno: ''
  };

  gns: any[];
  // 产地
  chandis: any[];
  gangchangs: any[];
  cs: any[];
  showGuige: boolean;
  isChandi: boolean;
  types: any;
  kinds: any;
  danjutypes: any;
  caigoutypes: any;
  jiaohuoaddrs: any[];
  cgdets: any[];
  tbenjine: any;
  sellerid: any;
  paycustomerid: any;
  thtjine: any;
  model: object = {
    paycustomerid: null,
    jine: null,
    shoucustomerid: null,
    bankid: null,
    account: null,
    beizhu: '',
    type: '',
    kind: '',
    isft: false,
    chandiid: '',
    sorgid: ''
  };
  constructor(public bsModalRef: BsModalRef, public settings: SettingsService, private caigouApi: CaigouService,
    private router: Router, private classifyApi: ClassifyApiService,
    private datepipe: DatePipe, private toast: ToasterService,private receiveApi: ReceiveapiService,
    private qihuoapi: QihuoService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      rowSelection: 'multiple',
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
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/caigou/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }, checkboxSelection: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'sellername', minWidth: 150,
        valueGetter: (params) => {
          if (params.data && params.data['sellername']) {
            return params.data['sellername'];
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同月份', field: 'month', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同性质', field: 'kind', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购类型', field: 'type', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类别', field: 'dantype', minWidth: 90 },
      { cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已付款', field: 'impjine', minWidth: 90,
        valueGetter: (params) => {
          if (params.data && params.data['impjine']) {
            return params.data['impjine'];
          } else {
            return '0';
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '未付款', field: 'weifukuan', minWidth: 90,
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['jine']) - Number(params.data['impjine']);
          } else {
            return '0';
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '<font color="red">本次付款金额</font>', field: 'benjine', minWidth: 90,
        editable: true,
        cellRenderer: (params) => {
          if (params.value === null || params.value === undefined) {
            return '双击填写本次付款金额';
          } else {
            return params.value;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '采购量', field: 'caigouweight', aggFunc: 'sum', minWidth: 80,
        valueGetter: (params) => {
          if (params.data && params.data['caigouweight']) {
            return Number(params.data['caigouweight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '采购单价', field: 'price', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'finish', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '入库量', field: 'rukuweight', aggFunc: 'sum', minWidth: 80,
        valueGetter: (params) => {
          if (params.data && params.data['rukuweight']) {
            return Number(params.data['rukuweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '退货量', field: 'tuihuoweight', aggFunc: 'sum', minWidth: 80,
        valueGetter: (params) => {
          if (params.data && params.data['tuihuoweight']) {
            return Number(params.data['tuihuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否备货', field: 'beihuo', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属机构', field: 'orgname', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否急单', field: 'isurgent', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', minWidth: 100 }
    ];
  }
  selectstart() { }
  selectend() { }

  selectNull() {
    this.search = {
      start: '', end: '', billno: '', cuserid: '', salemanid: '', sellerid: '',
      kehuid: '', gn: '', chandi: '', classifys: {}, grno: ''
    };
    this.start = new Date();
    this.end = new Date();
    this.chandis = [];
    this.attrs = [];
    this.disabled = true;
  }

  query() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    if (this.search['salemanid'] instanceof Object) {
      this.search['salemanid'] = this.search['salemanid'].code;
    }
    if (this.search['sellerid'] instanceof Object) {
      this.search['sellerid'] = this.search['sellerid'].code;
    }
    this.caigouApi.getcaigoudet(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
    this.close();
  }
  close() {
    this.classicModal.hide();
  }
  ngOnInit() {
    this.query();
    this.types = [{ id: '1', text: '现金' }, { id: '2', text: '电汇' }, { id: '3', text: '承兑' }, { id: '4', text: '转账' }];
    this.kinds = [{ id: '1', text: '定金' }, { id: '2', text: '货款' }, { id: '3', text: '费用' }];
    this.danjutypes = [{ id: 'true', text: '期货' }, { id: 'false', text: '调货' }];
  }
  // 打开查询对话框
  openquery() {
    this.dantypes = [{ value: '0', label: '甲单' }, { value: '1', label: '乙单' }, { value: '2', label: '丙单' }];
    this.selectNull();
    this.showGuige = false;
    this.isChandi = false;
    this.gns = [];
    // this.classifyApi.getGnAndChandi().then(data => {
    //   data.forEach(element => {
    //     this.gns.push({
    //       label: element.name,
    //       value: element
    //     });
    //   });
    // });
    this.classicModal.show();
  }
  selectedgn(value) {
    console.log('0002', value);
    this.cs = [];
    if (this.chandis.length > 0) {
      this.chandis = [];
    }
    this.showGuige = false; // 选择品名时
    this.search['gnid'] = value.id;
    this.search['chandiid'] = '';
    // console.log('this.cs', this.cs);
    this.cs = value.attrs;
    // console.log('this.cs', this.cs);
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.isChandi = true;
    // console.log('chandis', this.chandis);
  }
  selectedchandi(value) {
    console.log('c', value);
    this.search['classifys'] = [];
    this.search['chandiid'] = value;
    this.attrs = [];
    this.classifyApi.getAttrs(value).then(data => {
      // console.log('guige', data);
      this.attrs = data;
    });
    this.showGuige = true;
    // console.log('attr', this.attrs);
  }
  selectedguige(value, id) {
    if (this.search['classifys'].length > 0) {
      for (let i = 0; i < this.search['classifys'].length; i++) {
        if (this.search['classifys'][i].name === id) {
          this.search['classifys'].splice(i, 1);
        }
      }
    }
    this.search['classifys'].push({ name: id, value: value });
  }
  shoucustomerid;
  impcaigoudet() {
    this.cgdets = new Array();
    this.tbenjine = 0;
    this.thtjine = 0;
    let orgid = 0;
    let gn = '';
    let chandi = '';
    let caigoutype = null;
    let isqihuo = false;
    const caigoudets = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < caigoudets.length; i++) {
      if (caigoudets[i].selected) {
        if (!caigoudets[i].data.benjine) {
          this.toast.pop('warning', '选中的明细中有未填写支付金额！');
          return;
        }
        // 判断是期货付款还是调货的付款
        if (!caigoutype) {
          caigoutype = caigoudets[i].data.type;
        } else if (caigoudets[i].data.type !== caigoutype) {
          this.toast.pop('warning', '选中的明细中有采购类型不同');
          return;
        }
        if (caigoudets[i].data.type === '工程单') {
          isqihuo = true;
        }
        // 判断是否是同一所属机构
        if (orgid === 0) {
          orgid = caigoudets[i].data.orgid;
        } else if (caigoudets[i].data.orgid !== orgid) {
          this.toast.pop('warning', '选中的明细中有机构不同');
          return;
        }
        // 判断是否是同一产地
        if (!chandi && !gn) {
          chandi = caigoudets[i].data.chandi;
          gn = caigoudets[i].data.gn;
        } else if (caigoudets[i].data.chandiid !== chandi && caigoudets[i].data.gn !== gn) {
          this.toast.pop('warning', '选中的明细中有产地不同');
          return;
        }
        console.log('hello');
        console.log(caigoudets[i].data);
        this.shoucustomerid = caigoudets[i].data.sellerid;
        const caigoudet = { id: null, htjine: null, benjine: null };
        caigoudet['id'] = caigoudets[i].data.caigoudetid;
        caigoudet['chandi'] = caigoudets[i].data.chandi;
        caigoudet['gn'] = caigoudets[i].data.gn;
        caigoudet['benjine'] = caigoudets[i].data.benjine;
        this.cgdets.push(caigoudet);
        this.tbenjine += Number(caigoudet['benjine']);
        this.thtjine += Number(caigoudets[i].data.jine);
        this.sellerid = caigoudets[i].data.sellerid;
        this.paycustomerid = caigoudets[i].data.paycustomerid;
      }
    }
    if (this.cgdets.length === 0) {
      this.toast.pop('warning', '请选择要编辑的付款金额!');
      return;
    }
    // 弹出创建页面
    this.model = {
      paycustomerid: this.paycustomerid, jine: this.tbenjine, shoucustomerid: this.sellerid, bankid: null, account: null, beizhu: '', type: '',
      kind: '', isft: false, sorgid: orgid, isqihuo: isqihuo, cgdets: this.cgdets, thtjine: this.thtjine, gn: gn, chandi: chandi
    };
    this.caigouApi.getchandi().then(data => {
      this.gangchangs = data;
    });
    //this.model['paycustomerid'] = 3864; // 默认山东万事达涂镀应用艺术有限公司
    this.addModal.show();
    console.log(this.model);
  }
  addcoles() {
    this.addModal.hide();
  }
  selecteskind(value) {
    this.model['kind'] = value.id;
  }
  selectestype(value) {
    this.model['type'] = value.id;
  }
  selectisqihuo(value) {
    this.model['isqihuo'] = value.id;
  }
  selectegangchang(e) {
    this.model['chandiid'] = e.id;
    this.model['chandi'] = e.text;
  }
  addfukuan() {
    if (this.model['chandi'] === null) {
      this.toast.pop('warning', '请选择产地', '');
      return;
    }
    if (this.model['sorgid'] === '') {
      this.toast.pop('warning', '请选择收货机构！', '');
      return;
    }
    if (this.model['type'] === '') {
      this.toast.pop('warning', '请选择结算方式！', '');
      return;
    }
    if (this.model['kind'] === '') {
      this.toast.pop('warning', '请选择付款类型！', '');
      return;
    }
    this.caigouApi.impcreatefk(this.model).then(data => {
      if(data){
        this.addModal.hide();
        this.bsModalRef.hide();
        this.parentThis.fukuanid = data['id'];
        this.router.navigate(['cgfukuan', data['id']]);
      }
    });
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.search['gn'] = item.itemname;
    this.search['classifys'] = {};
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
        this.search['classifys'][element['value']] = element['defaultval'];
      }
    }
  }
  banks: Array<any>;
  bankaccounts;
  // 获取银行
  getbank2() {
    console.log(this);
    this.banks = [{ value: '', label: '全部' }];
    this.caigouApi.findbycustomerid(this.shoucustomerid).then(data => {
      data.forEach(bank => {
        this.banks.push({
          value: bank['id'],
          label: bank['bank']
        });
      });
      this.bankaccounts = this.banks;
    });
  }
  getcardno(bankcardid) {
    console.log('getcardno');
    this.receiveApi.getfukuanaccount(bankcardid).then((data) => {
      this.model['shoubanknnum'] = data['fukuanaccount'];
    });
  }
}
