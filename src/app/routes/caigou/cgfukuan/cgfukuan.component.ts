import { SettingsService } from './../../../core/settings/settings.service';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { CaigouService } from '../caigou.service';
import { GridOptions } from 'ag-grid/main';
import { CaigoudetimpComponent } from 'app/dnn/shared/caigoudetimp/caigoudetimp.component';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { SelectComponent } from 'ng2-select';
import { Cgorgtypes } from 'app/shared/const';

@Component({
  selector: 'app-cgfukuan',
  templateUrl: './cgfukuan.component.html',
  styleUrls: ['./cgfukuan.component.scss']
})
export class CgfukuanComponent implements OnInit {
  paycustomerdisabled = false; // 付款公司不可点
  @ViewChild('selectModal') private selectModal: ModalDirective;
  @ViewChild('addModal') private addModal: ModalDirective;
  @ViewChild('defaultGroup1') public nselect1: SelectComponent;
  @ViewChild('defaultGroup2') public nselect2: SelectComponent;
  @ViewChild('defaultGroup3') public nselect3: SelectComponent;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  gridOptions: GridOptions;
  feeImpbsModalRef: BsModalRef;
  fukuanid: any;
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: null;
  // 结束时间
  end: null;
  // 开始时间最大时间
  istartmax: Date = new Date();
  // 结束时间最大时间
  iendmax: Date = new Date();
  // 开始时间
  istart: null;
  // 结束时间
  iend: null;
  gangchangs: any[];
  search: object = {
    start: '', end: '', istart: '', iend: '', paycustomerid: '', shoucustomerid: '', sorgid: '',
    cuserid: '', vuserid: '', kind: '', type: '', status: ''
  };
  orgtypes: any = Cgorgtypes;
  statusdet: any;
  types: any[];
  kinds: any[];
  banks: Array<any>;
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
    chandi: '',
    gn: '',
    orgid: '',
    sorgid: ''
  };
  // pageChanged(event: any): void {
  //   this.search['pagenum'] = event.page;
  //   this.search['pagesize'] = event.itemsPerPage;
  //   this.search['status'] = '';
  //   this.querydata();
  // };
  constructor(private toast: ToasterService, private datepipe: DatePipe,
    private customerApi: CustomerapiService, private caigouApi: CaigouService,
    private router: Router, public settings: SettingsService,
    private bsModalService: BsModalService) {
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
            return '<a target="_blank" href="#/cgfukuan/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'status', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款类型', field: 'kind', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '结算方式', field: 'jiesuantype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款公司', field: 'shoucustomer', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款公司', field: 'paycustomer', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款机构', field: 'orgname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收货机构', field: 'sorgname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同性质', field: 'kind2', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购类型', field: 'type', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '付款金额', field: 'jine', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款人', field: 'payuser', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款时间', field: 'paydate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cuser', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vuser', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '复核人', field: 'fuheuser', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款银行', field: 'paybank', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款账户', field: 'banknum', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否外贸', field: 'isft', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 120 }
    ];
    this.querydata();
  }

  ngOnInit() {
  }
  open() {
    this.selectNull();
    this.statusdet = [{ id: '0', text: '制单中' }, { id: '1', text: '待审核' }, { id: '2', text: '待付款' }, { id: '3', text: '已付款' }];
    this.types = [{ id: '1', text: '现金' }, { id: '2', text: '电汇' }, { id: '3', text: '承兑' }, { id: '4', text: '转账' }];
    this.kinds = [{ id: '1', text: '定金' }, { id: '2', text: '货款' }, { id: '3', text: '费用' }];
    this.selectModal.show();
  }
  selectstart() {

  }
  selectNull() {
    // this.search = {
    //   pagenum: 1, pagesize: 10, status: '', paycustomerid: '', shoucustomerid: '', billno: '',
    //   orgid: '', cuserid: '', vuserid: ''
    // };
    this.search = {
      start: '', end: '', istart: '', iend: '', paycustomerid: '', shoucustomerid: '', sorgid: '',
      cuserid: '', vuserid: '', kind: '', type: '', status: ''
    };
  }
  querydata() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end) {
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.istart) {
      this.search['istart'] = this.datepipe.transform(this.istart, 'y-MM-dd');
    }
    if (this.iend) {
      this.search['iend'] = this.datepipe.transform(this.iend, 'y-MM-dd');
    }
    console.log(this.search);
    this.caigouApi.cgfukuanlist(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      // 获取到总条目
      // this.totalItems = data.headers.get('total');
      // 获取到当前数据
      // this.singleData = data.json();
      // console.log('ddd', this.singleData);
    });
  }
  selectestatus(value) {
    this.search['status'] = value.id;
  }
  selecteskind(value) {
    this.search['kind'] = value.id;
  }
  selectestype(value) {
    this.search['type'] = value.id;
  }
  query() {
    console.log('fff', this.search);
    if (this.search['shoucustomerid'] instanceof Object) {
      this.search['shoucustomerid'] = this.search['shoucustomerid'].code;
    }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    if (this.search['vuserid'] instanceof Object) {
      this.search['vuserid'] = this.search['vuserid'].code;
    }
    this.querydata();
    this.coles();
  }
  paycustomer(value) {
    this.search['paycustomerid'] = value;
  }
  coles() {
    this.selectModal.hide();
  }
  addopen() {
    this.model = {
      paycustomerid: null, jine: null, shoucustomerid: null, bankid: null, account: null, beizhu: '', type: null,
      kind: null, isft: false, sorgid: '', isqihuo: true, chandi:null,gn:null
    };
    this.types = [{ id: '1', text: '现金' }, { id: '2', text: '电汇' }, { id: '3', text: '承兑' }, { id: '4', text: '转账' }];
    this.kinds = [{ id: '1', text: '定金' }, { id: '2', text: '货款' }, { id: '3', text: '费用' }];
    // this.caigouApi.getchandi().then(data => {
    //   this.gangchangs = data;
    // });
    // this.paycustomerdisabled = true;
    // this.model['paycustomerid'] = 3864; // 默认山东万事达涂镀应用艺术有限公司
    this.findWiskind();
    this.nselect2.active = [];
    this.nselect3.active = [];
    this.addModal.show();
  }
  addcoles() {
    this.addModal.hide();
  }
  // 获取银行
  getbank(value) {
    this.model['paycustomerid'] = value;
    this.banks = [{ value: '', label: '全部' }];
    this.caigouApi.findbycustomerid(value).then(data => {
      data.forEach(bank => {
        this.banks.push({
          value: bank['id'],
          label: bank['bank']
        });
      });
    });
  }
  // 获取账号
  getaccount(event) {
    this.caigouApi.findaccount(event.value).then(data => {
      this.model['account'] = data['fukuanaccount'];
    });
  }
  selectegangchang(e) {
    this.model['chandiid'] = e.id;
    this.model['chandi'] = e.text;
  }
  addfukuan() {
    if (!this.model['chandi']) {
      this.toast.pop('error', '请选择产地', '');
      return;
    }
    if (!this.model['gn']) {
      this.toast.pop('error', '请选择品名', '');
      return;
    }
    if (this.model['paycustomerid'] === null) {
      this.toast.pop('error', '请选择付款公司', '');
      return;
    }
    if (this.model['sorgid'] === '') {
      this.toast.pop('error', '请选择收货机构！', '');
      return;
    }
    if (this.model['orgid'] === '') {
      this.toast.pop('error', '请选择付款机构！', '');
      return;
    }
    if (!this.model['jine']) {
      this.toast.pop('error', '金额不能为空！', '');
      return;
    }
    if (this.model['type'] === '') {
      this.toast.pop('error', '请选择结算方式！', '');
      return;
    }
    if (this.model['kind'] === '') {
      this.toast.pop('error', '请选择付款类型！', '');
      return;
    }
    if (this.model['shoucustomerid'] instanceof Object) {
      this.model['shoucustomerid'] = this.model['shoucustomerid'].code;
    } else {
      this.model['shoucustomerid'] = null;
    }
    if (this.model['shoucustomerid'] === null) {
      this.toast.pop('error', '请选择收款公司', '');
      return;
    }
    this.caigouApi.createfk(this.model).then(data => {
      this.router.navigate(['cgfukuan', data['id']]);
    });
    this.addModal.hide();
  }
  delfukuan(id) {
    if (confirm('确认要删除吗？')) {
      this.caigouApi.deletecgfk(id).then(data => {
        this.toast.pop('success', '删除成功！', '');
      });
    }
  }
  selectetype(value) {
    this.model['type'] = value.id;
  }
  selectekind(value) {
    this.model['kind'] = value.id;
  }
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '采购付款明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  // 采购付款单优化 增加引入采购订单明细进行采购付款单的创建功能

  showcaigoudetDialog() {
    this.bsModalService.config.class = 'modal-all';
    this.feeImpbsModalRef = this.bsModalService.show(CaigoudetimpComponent);
    this.feeImpbsModalRef.content.parentThis = this;
  }

  // 查询采购单位
  companyIsWiskind = []
  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({ label: '请选择卖方单位', value: '' });
      this.customerApi.findwiskind().then((response) => {
        for (let i = 1; i < response.length; i++) {
          if (response[i].id === 3453) {
            response.splice(i, 1);
          }
        }
        response.forEach(element => {
          if (element.id === 3786 ||
            element.id === 3864 ||
            element.id === 21619
          ) {
            this.companyIsWiskind.push({
              label: element.name,
              value: element.id
            });
          }
        });
        console.log(this.companyIsWiskind);
      })
    }
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi') {
        this.chandioptions = element['options'];
        break;
      }
    }
    this.model['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.model['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }

}
