import {QihuoService} from '../../qihuo/qihuo.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {DatePipe, DecimalPipe} from '@angular/common';
import {Router} from '@angular/router';
import {GridOptions} from 'ag-grid/main';
import {SettingsService} from '../../../core/settings/settings.service';
import {ClassifyApiService} from '../../../dnn/service/classifyapi.service';
import {ToasterService} from 'angular2-toaster/angular2-toaster';
import {Cgorgtypes} from 'app/shared/const';
import {StorageService} from 'app/dnn/service/storage.service';
import {XmdCaigouService} from './xmdcaigou.service';
import {XmdGoodscodeService} from '../goodscode/xmdgoodscode.service';
import {XmdcustomerService} from '../customer/xmdcustomer.service';
import {XmdQihuoService} from '../qihuo/xmdqihuo.service';

@Component({
  selector: 'app-xmdcaigou',
  templateUrl: './xmdcaigou.component.html',
  styleUrls: ['./xmdcaigou.component.scss'],
  providers: [DatePipe, DecimalPipe]
})

export class XmdCaigouComponent implements OnInit {
  caigouSelected = new Array<any>();
  caigou: object = {
    sellerid: '',
    jiaohuoaddr: '',
    beizhu: '',
    type: '',
    kind: '',
    caigoutype: '',
    month: '',
    gn: '',
    chandi: '',
    orgid: ''
  };
  dantypes = [{label: '甲单', value: '0'}, {label: '乙单', value: '1'}, {label: '丙单', value: '2'}];
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  queryandcreate = 0; // 0-创建，1-查询
  // 开始时间最大时间
  startmax: Date = new Date();
  current = this.storage.getObject('cuser');

  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date();

  // 结束时间
  end: Date = new Date();
  gridOptions: GridOptions;
  search: object = {
    start: '', end: '', billno: '', orgid: '', cuserid: '', salemanid: '', sellerid: '',
    kehuid: '', gn: '', classifys: {}, chandiid: '', grno: ''
  };

  gns: any[];
  // 产地
  chandis: any[];
  gangchangs: any[];
  cs: any[];
  showGuige: boolean;
  isChandi: boolean;
  types: any;
  seller :any =[]; 
  kinds = [{label: '期货', value: '1'}, {label: '现货', value: '2'}];
  caigoutypes = [{label: '工程单', value: '1'}, {label: '库存销售', value: '2'}
    , {label: '现货', value: '5'}, {label: '期货', value: '6'}];
  attrs: any;
  jiaohuoaddrs: any[];
  uploadtype: number;
  orgtypes: any = Cgorgtypes;

  constructor(public settings: SettingsService, private caigouApi: XmdCaigouService, private router: Router,
              private classifyApi: ClassifyApiService, private datepipe: DatePipe, private toast: ToasterService, private qihuoapi: XmdQihuoService,
              private customerApi: XmdcustomerService, public mdmService: XmdGoodscodeService, private storage: StorageService) {
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
      {field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计'},
      {
        cellStyle: {'text-align': 'center'}, headerName: '编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/xmdcaigou/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }, checkboxSelection: true
      },
      {
        cellStyle: {'text-align': 'center'}, headerName: '供应商', field: 'sellername', minWidth: 150,
        valueGetter: (params) => {
          if (params.data && params.data['sellername']) {
            return params.data['sellername'];
          } else {
            return '合计';
          }
        }
      },
      {cellStyle: {'text-align': 'center'}, headerName: '合同月份', field: 'month', minWidth: 90},
      {cellStyle: {'text-align': 'center'}, headerName: '合同性质', field: 'kind', minWidth: 90},
      {cellStyle: {'text-align': 'center'}, headerName: '项目名称', field: 'projectname', minWidth: 90},
      {cellStyle: {'text-align': 'center'}, headerName: '所属行业', field: 'categoryname', minWidth: 90},
      {cellStyle: {'text-align': 'center'}, headerName: '采购公司', field: 'buyername', minWidth: 90},
      {cellStyle: {'text-align': 'center'}, headerName: '采购类型', field: 'type', minWidth: 90},
      {cellStyle: {'text-align': 'center'}, headerName: '单据类别', field: 'dantype', minWidth: 90},
      {cellStyle: {'text-align': 'center'}, headerName: '状态', field: 'finish', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '规格', field: 'guige', minWidth: 200},
      {cellStyle: {'text-align': 'center'}, headerName: '品名', field: 'gn', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '产地', field: 'chandi', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '资源号', field: 'grno', minWidth: 90},
      {
        cellStyle: {'text-align': 'right'}, headerName: '采购量', field: 'caigouweight', aggFunc: 'sum', minWidth: 80,
        valueGetter: (params) => {
          if (params.data && params.data['caigouweight']) {
            return Number(params.data['caigouweight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      {cellStyle: {'text-align': 'right'}, headerName: '采购单价', field: 'price', minWidth: 90},
      {
        cellStyle: {'text-align': 'right'}, headerName: '入库量', field: 'rukuweight', aggFunc: 'sum', minWidth: 80,
        valueGetter: (params) => {
          if (params.data && params.data['rukuweight']) {
            return Number(params.data['rukuweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: {'text-align': 'right'}, headerName: '退货量', field: 'tuihuoweight', aggFunc: 'sum', minWidth: 80,
        valueGetter: (params) => {
          if (params.data && params.data['tuihuoweight']) {
            return Number(params.data['tuihuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {cellStyle: {'text-align': 'center'}, headerName: '是否备货', field: 'beihuo', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '制单人', field: 'cusername', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '业务员', field: 'salemanname', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '所属机构', field: 'orgname', minWidth: 80},
      // { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 150 },
      {
        cellStyle: {'text-align': 'center'}, headerName: '厚度', field: 'houdu', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: {'text-align': 'center'}, headerName: '宽度', field: 'width', minWidth: 80,
      },
      {cellStyle: {'text-align': 'center'}, headerName: '颜色', field: 'color', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '锌层', field: 'duceng', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '背漆', field: 'beiqi', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '材质', field: 'caizhi', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '后处理', field: 'ppro', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '油漆种类', field: 'painttype', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '膜厚', field: 'qimo', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '涂层', field: 'tuceng', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '卷内径', field: 'neijing', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '喷码', field: 'penma', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '包装方式', field: 'packagetype', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '修边', field: 'xiubian', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '是否急单', field: 'isurgent', minWidth: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '审核人', field: 'vusername', minWidth: 70},
      {cellStyle: {'text-align': 'center'}, headerName: '审核时间', field: 'vdate', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '制单时间', field: 'cdate', minWidth: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '结算方式', field: 'jiesuantype', minWidth: 100},
      {
        cellStyle: {'text-align': 'center'}, headerName: '结算价格', field: 'jiesuanprice', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {cellStyle: {'text-align': 'center'}, headerName: '物料编码', field: 'gcid', minWidth: 100},
    ];
  }

  selectstart() {
  }

  selectend() {
  }
  
  // 新建采购单
  showcreate() {
    this.caigou = {
      sellerid: '', jiaohuoaddr: '', beizhu: '',
      type: '', kind: '', caigoutype: '', month: '',
      gn: '', chandi: '', orgid: '', isweishi: false
    };
    this.types = [{id: '0', text: '自提'}, {id: '1', text: '代运'}];
    this.seller = [{ label: '请选择...', value: null },{ label: '山东新美达科技材料有限公司', value: 26516 }];
    this.caigou['dantype'] = 0;
    this.caigouApi.getchandi().then(data => {
      this.gangchangs = data;
    });
    this.findWiskind();
    this.caigoutypes = [{label: '工程单', value: '1'}, {label: '库存销售', value: '2'}
      , {label: '现货', value: '5'}, {label: '期货', value: '6'}];
    this.createModal.show();
  }

  getcaigoutype(event) {
    if (event.value === '1' || event.value === '2') {
      this.caigoutypes = [{label: '工程单', value: '1'}, {label: '库存销售', value: '2'}];
      this.caigou['caigoutype'] = '';
    } else if (event.value === '3') {
      this.caigoutypes = [{label: '现货', value: '5'}, {label: '期货', value: '6'}];
      this.caigou['caigoutype'] = '';
    }
  }

  selectetype(value) {
    this.caigou['type'] = value.id;
  }

  selectekind(value) {
    this.caigou['kind'] = value.id;
  }

  selectecaigoutype(value) {
    this.caigou['caigoutype'] = value.id;
  }

  selectmonth(value) {
    this.caigou['month'] = this.datepipe.transform(value, 'y-MM-dd');
    console.log('asdas', this.datepipe.transform(value, 'y-MM'));
  }

  selectegangchang(value) {
    this.caigou['chandiid'] = value.id;
    this.caigou['chandi'] = value.text;
    this.jiaohuoaddrs = [];
    this.qihuoapi.getchandigongcha().then(data => {
      data.forEach(element => {
        if (element['chandiid'] === this.caigou['chandiid']) {
          console.log('确定产地的', element);
          // 交货地址
          element.attr.jiaohuoaddr.forEach(addr => {
            this.jiaohuoaddrs.push({
              value: addr.value,
              label: addr.value
            });
          });
        }
      }); // dataforeach
    });
  }

  selectNull() {
    this.search = {
      start: '', end: '', billno: '', cuserid: '', salemanid: '', sellerid: '',
      kehuid: '', gn: '', chandiid: '', classifys: {}, grno: ''
    };
    this.start = new Date();
    this.end = new Date();
    this.chandis = [];
    this.attrs = [];
  }

  create() {
    console.log(this.caigou);
    if (!this.caigou['type']) {
      this.toast.pop('error', '请选择运输方式！', '');
      return;
    }
    if (!this.caigou['kind']) {
      this.toast.pop('error', '请选择合同性质！', '');
      return;
    }
    if (!this.caigou['caigoutype']) {
      this.toast.pop('error', '请选择采购类型！', '');
      return;
    }
    if (!this.caigou['month']) {
      this.toast.pop('error', '请选择合同月份！', '');
      return;
    }
    if (!this.caigou['jiaohuoaddr']) {
      this.toast.pop('error', '请填写交货地点！', '');
      return;
    }
    if (!this.caigou['chandi']) {
      this.toast.pop('error', '请填写产地！', '');
      return;
    }
    if (!this.caigou['gn']) {
      this.toast.pop('error', '请填写品名！', '');
      return;
    }
    // if (!this.caigou['buyerid']) {
    //   this.toast.pop('error', '填写采购单位！');
    //   return;
    // }
    if (this.caigou['dantype'] === undefined) {
      this.toast.pop('warning', '请选择单据类别！');
      return '';
    }
    // if (this.caigou['sellerid'] instanceof Object) {
    //   this.caigou['sellerid'] = this.caigou['sellerid'].code;
    // } else {
    //   this.caigou['sellerid'] = null;
    // }
    if (this.caigou['sellerid'] === null) {
      this.toast.pop('error', '请填写供应商！', '');
      return;
    }
    // if (!this.caigou['orgid']) {
    //   this.toast.pop('error', '请填写机构！', '');
    //   return;
    // }
    console.log(this.caigou);
    console.log(123);
    this.caigouApi.create(this.caigou).then(data => {
      // console.log(data);
      this.router.navigate(['xmdcaigou', data.id]);
    });
  }

  query() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    // if (this.search['classifys']) {
    //   this.search['classifys'] = '[' + this.search['classifys'] + ']';
    // }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    if (this.search['salemanid'] instanceof Object) {
      this.search['salemanid'] = this.search['salemanid'].code;
    }
    // if (this.search['sellerid'] instanceof Object) {
    //   this.search['sellerid'] = this.search['sellerid'].code;
    // }
    this.caigouApi.getcaigoudet(this.search).then(data => {
      // this.gridOptions.api.setPinnedTopRowData([data]);
      this.gridOptions.api.setRowData(data);
    });
    this.close();
  }

  close() {
    this.classicModal.hide();
  }

  ngOnInit() {
    this.query();
  }

  // 打开查询对话框
  openquery() {
    this.dantypes = [{value: '0', label: '甲单'}, {value: '1', label: '乙单'}, {value: '2', label: '丙单'}];
    this.selectNull();
    this.showGuige = false;
    this.isChandi = false;
    this.gns = [];
    this.classifyApi.getGnAndChandi().then(data => {
      data.forEach(element => {
        this.gns.push({
          label: element.name,
          value: element
        });
      });
      // console.log('gns11', this.gns);
    });
    this.findWiskind();
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
    this.search['classifys'].push({name: id, value: value});
    // console.log('op', this.search);
  }

  closeq() {
    this.createModal.hide();
  }

  //合同上传信息及格式
  uploadParam: any = {module: 'ruku', count: 1, sizemax: 1, extensions: ['xls', 'pdf']};
  // 设置上传的格式
  accept = null;// ".xls, application/xls";
  finishdet() {
    const caigous = this.gridOptions.api.getModel()['rowsToDisplay'];
    this.caigouSelected = [];
    for (let i = 0; i <= caigous.length - 1; i++) {
      if (caigous[i].selected) {
        if (caigous[i].data.finish === '完成') {
          this.toast.pop('warning', '请不要选择完成的采购明细！');
          return;
        }
        console.log(caigous[i]);
        this.caigouSelected.push(caigous[i].data.caigoudetid);
      }
    }
    if (this.caigouSelected.length <= 0) {
      this.toast.pop('warning', '请选择要完成的采购明细！');
      return;
    }
    if (confirm('你确定将' + (this.caigouSelected.length) + '件采购明细做完成操作吗？')) {
      console.log(this.caigouSelected);
      this.caigouApi.finishDets(this.caigouSelected).then(data => {
        this.toast.pop('success', '操作成功！');
        this.query();
      });
    }
  }

  showmdmgndialog(flag) {
    this.queryandcreate = flag;
    this.mdmgndialog.show();
  }

  //查询采购单位
  companyIsWiskind = [];

  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({label: '请选择卖方单位', value: ''});
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
      });
    }
  }

  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    if (this.queryandcreate === 0) {
      this.chandioptions = [];
      this.caigou['jiaohuoaddr'] = '';
      for (let index = 0; index < attrs.length; index++) {
        const element = attrs[index];
        if (element['value'] === 'chandi') {
          this.chandioptions = element['options'];
          break;
        }
      }
      this.caigou['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.caigou['chandi'] = this.chandioptions[this.chandioptions.length - 1]['value'];
      }
      this.jiaohuoaddrs = [];
      const chandigongchaparam = {gn: this.caigou['gn'], chandi: this.caigou['chandi']};
      this.mdmService.getchandigongcha(chandigongchaparam).then(chandigongchas => {
        for (let index = 0; index < chandigongchas.length; index++) {
          const element = chandigongchas[index];
          if (element.value === 'jiaohuoaddr') {
            this.jiaohuoaddrs = element.options;
            break;
          }
        }
      });
    } else if (this.queryandcreate === 1) {
      this.search['gn'] = item.itemname;
      this.search['classifys'] = {};
      this.attrs = [];
      this.attrs = attrs;
      this.showGuige = true;
      for (let i = 0; i < this.attrs.length; i++) {
        const element = this.attrs[i];
        element['options'].unshift({value: '', label: '全部'});
      }
      for (let i = 0; i < this.attrs.length; i++) {
        const element = this.attrs[i];
        if (element['value'] === 'chandi' && element['options'].length) {
          this.search['classifys']['chandi'] = element['options'][element['options'].length - 1]['value'];
          break;
        }
      }
    }
  }

}
