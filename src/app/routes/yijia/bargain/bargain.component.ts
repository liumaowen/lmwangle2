import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { GridOptions } from 'ag-grid/main';
import { YijiaapiService } from '../yijiaapi.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { KucunService } from 'app/routes/kucun/kucun.service';
const sweetalert = require('sweetalert');

@Component({
  selector: 'app-bargain',
  templateUrl: './bargain.component.html',
  styleUrls: ['./bargain.component.scss']
})
export class BargainComponent implements OnInit {
  // 开始时间
  start = new Date('2022-07-01'); // 设定页面开始时间默认值
  end: any = null;
  maxDate = new Date();
  gns: any = [];
  disabled = true;
  chandis: any[];
  isChandi = false;
  attrs: any[];
  guigelength: number; // 声明一个数量计算器
  gcs: any[] = [];
  // 品名
  pmitems;
  requestparams = {
    gn: '', chandi: '',color:'',
    start: this.datepipe.transform(this.start, 'y-MM-dd'), end: this.datepipe.transform(this.end, 'y-MM-dd')
  };
  queryparams: any = {isdel: false, start: this.datepipe.transform(this.start, 'y-MM-dd'),
   end: this.datepipe.transform(this.end, 'y-MM-dd')}; // 查询
  cuser: any;
  chandioptions: any = [];
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;

  gridOptions: GridOptions;
  constructor(
    public settings: SettingsService,
    private toast: ToasterService,
    private yijiaApi: YijiaapiService,
    private classifyapi: ClassifyApiService,
    private kucunapi: KucunService,
    private datepipe: DatePipe) {

    this.gridOptions = {
      enableFilter: true,
      rowSelection: 'multiple',
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableRangeSelection: true,
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      },
      getContextMenuItems: this.settings.getContextMenuItems,
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 56, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '申请日期', field: 'cdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', minWidth: 80},
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核日期', field: 'vdate', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '价格幅度（A类）', field: 'pricea', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '价格幅度（B类）', field: 'priceb', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '价格幅度（C类）', field: 'pricec', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效开始日期', field: 'start', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效结束日期', field: 'end', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 86 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 86 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 86 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 86 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 86 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'status', minWidth: 86 },
    ];

  }

  ngOnInit() {
    this.listDetail();
  }

  // 网格赋值
  listDetail() {
    this.yijiaApi.bargainlist(this.queryparams).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }


  // 弹出查询对话框
  query() {
    if (typeof (this.cuser) === 'object') {
      this.queryparams['cuserid'] = this.cuser['code'];
    } else {
      this.queryparams['cuserid'] = '';
    }
    this.queryparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.queryparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.listDetail();
    this.close();
  }

  selectNull() {
    this.start = new Date();
    this.end = new Date();
    this.queryparams = {
      isdel: false, start: this.datepipe.transform(this.start, 'y-MM-dd'), end: this.datepipe.transform(this.end, 'y-MM-dd')
    };
  }

  openQueryDialog() {
    this.selectNull();
    this.start = new Date('2022-07-01')
    this.classicModal.show();
    this.getGnAndChandi();
  }

  close() {
    this.classicModal.hide();
  }
  showcreate() {
    this.show();
    this.getGnAndChandi();
    if (!this.pmitems) {
      this.pmitems = [{ value: '', label: '全部' }];
      this.classifyapi.getGnAndChandi().then((data) => {
        data.forEach(element => {
          this.pmitems.push({
            label: element['name'],
            value: element['name']
          });
        });
      });
    }
  }
  /**获取品名 */
  getGnAndChandi() {
    this.chandis = [];
    this.classifyapi.getGnAndChandi().then((data) => {
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        });
      });
    });
  }
  /**打开创建弹窗 */
  show() {
    this.createModal.show();
    this.createselectNull();
  }

  coles() {
    this.createModal.hide();
  }
  /**获取产地 */
  selectedgn(value) {
    this.isChandi = true;
    this.attrs = [];
    this.chandis = [];
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.requestparams['gn'] = value.name;
  }
  selectedchandi(value) {
    this.attrs = [];
    this.classifyapi.getAttrs(value).then(data => {
      this.attrs = [];
      data.forEach(ele => {
        if (ele.name === 'houduid' || ele.name === 'widthid' || ele.name === 'ducengid' ||
        ele.name === 'colorid' || ele.name === 'caizhiid') {
          this.attrs.push(ele);
        }
      });
      this.guigelength = this.attrs['length'];
    });
  }
  selectedguige(event, labelid) {
    for (let i = 0; i < this.gcs.length; i++) {
      if (this.gcs[i]['name'] === labelid) {
        this.gcs.splice(i, 1);
      }
    }
    this.gcs.push({ name: labelid, value: event['value'] });
  }
  // 重选
  createselectNull() {
    this.chandis = [];
    this.isChandi = false;
    this.attrs = [];
    this.gcs = [];
    this.start = new Date();
    this.end = null;
    this.requestparams = {
      gn: '', chandi: '',color:'',
      start: this.datepipe.transform(this.start, 'y-MM-dd'),end: this.datepipe.transform(this.end, 'y-MM-dd')
    };
  }
  /**创建明细 */
  create() {
    if (!this.end) {
      this.toast.pop('warning', '结束时间不允许为空！');
      return;
    }
    if (this.requestparams['pricea'] === undefined || this.requestparams['pricea'] === null) {
      this.toast.pop('warning', '议价金额（A类）不允许为空！');
      return;
    }
    if (this.requestparams['priceb'] === undefined || this.requestparams['priceb'] === null) {
      this.toast.pop('warning', '议价金额（B类）不允许为空！');
      return;
    }
    if (this.requestparams['pricec'] === undefined || this.requestparams['pricec'] === null) {
      this.toast.pop('warning', '议价金额（C类）不允许为空！');
      return;
    }
    if ((!(this.requestparams['pricea'] < this.requestparams['priceb'] &&  this.requestparams['priceb'] < this.requestparams['pricec']))) {
      this.toast.pop('warning', '请遵循优惠原则C≥B≥A！');
      return;
    }
    if(this.requestparams['pricea'] - this.requestparams['pricec'] > 100 || this.requestparams['pricec'] - this.requestparams['pricea'] >100){
      this.toast.pop('warning', 'A类C类差价不得超过100');
      return;
    }
    if (!this.requestparams['gn']) {
      this.toast.pop('warning', '品名不允许为空！');
      return;
    }
    if (!this.requestparams['chandi']) {
      this.toast.pop('warning', '产地不允许为空！');
      return;
    }
    this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.gcs.forEach(ele => {
      this.requestparams[ele.name] = ele.value;
    });
    this.yijiaApi.createbargain(this.requestparams).then(data => {
      this.listDetail();
      this.coles();
    });
  }
  /**选择一条明细提交审核
   * 资源中心总监审（邓超和郭振峰）
   */
  tijiao() {
    const selectids = [];
    const selectlist = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    selectlist.forEach(element => {
      if (element.data && element.selected) {
        selectids.push(element.data.id);
      }
    });
    if (!selectids.length) {
      this.toast.pop('warning', '选择需要提交的明细！');
      return;
    }
    if (selectids.length > 1) {
      this.toast.pop('warning', '只能选择一条明细！');
      return;
    }
    if (confirm('你确定提交审核吗？')) {
      this.yijiaApi.tijiao(selectids[0]).then(data => {
        this.listDetail();
      });
    }
  }
  /**
   * 议价申请明细作废
   */
   zuofei() {
    const bargaindetids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        bargaindetids.push(orderdetSelected[i].data.id);
      }
    }
    if (bargaindetids.length < 1) {
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
      this.yijiaApi.zuofei({ids: bargaindetids}).then(data => {
        this.toast.pop('success', '作废成功');
        this.listDetail();
      });
      sweetalert.close();
    });
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
    this.requestparams['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.requestparams['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }

    // 品名选中改变
  data = new Array<any>();
  selectGnAction(key) {
    if (!this.requestparams[key]) return;
    else {
      const gnid = this.requestparams['gnid'];
    }
    this.kucunapi.getConditions({ gn: this.requestparams['gn'] }).then(data => {
      this.data = data;
      this.filter();
    });
    this.disabled = false;
  }
  // 赛选过滤方法
  fieldArr = [
    'chandi', // 产地
    'color', // 颜色
    // 'width', // 宽度
    // 'houdu', // 厚度
    // 'duceng', // 镀层
    // 'caizhi', // 材质
    // 'ppro'// 后处理
  ];
  // 定义过滤之后的集合
  filterConditionObj = {}; // {chandi:[],width:[]}
  filter() {
    console.log(this.data);
    
    for (let index = 0; index < this.fieldArr.length; index++) {
      const fieldElement = this.fieldArr[index];
      // 除自己以外其他字段
      const otherFieldArr = this.fieldArr.filter(element => element !== fieldElement);
      const queryOptions = [{ value: '', label: '全部' }];
      otherFieldArr.forEach(otherFieldElement => {
        this.data.forEach(dataElement => {
          if (otherFieldArr.every(otherField => {
            return this.requestparams[otherField] === '' || dataElement[otherField] === this.requestparams[otherField];
          })) {
            const fieldValue = dataElement[fieldElement];
            if (fieldValue != null && JSON.stringify(queryOptions).indexOf(JSON.stringify(fieldValue)) === -1) {
              queryOptions.push({ value: fieldValue, label: fieldValue });
            }
          }
        });
        this.filterConditionObj[fieldElement] = queryOptions.sort();
      });
    }
  }
    // 子类型选择
  selectAction(key, value) {
    this.filter();
  }
}
