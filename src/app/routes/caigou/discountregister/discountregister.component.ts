import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { CaigouService } from '../caigou.service';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-discountregister',
  templateUrl: './discountregister.component.html',
  styleUrls: ['./discountregister.component.scss']
})
export class DiscountregisterComponent implements OnInit {
  start: Date = new Date();
  end: Date = new Date();
  search: any = {start: this.datepipe.transform(this.start, 'y-MM-dd'),end: this.datepipe.transform(this.end, 'y-MM-dd')};
  gridOptions: GridOptions;
  @ViewChild('gcinfodialog') private gcinfodialog: ModalDirective;
  @ViewChild('addisfinishDialog') private addisfinishDialog: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  gns: any[];
  chandis: any[];
  caigoutypes: any[];
  isurgent: any[];
  orgs: any[];
  saleman: any;
  params = {};
  model = {};
  constructor(public settings: SettingsService, private caigouApi: CaigouService, private datepipe: DatePipe,
    private orgApi: OrgApiService, private classifyapi: ClassifyApiService, private toast: ToasterService,) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      rowSelection: "multiple",
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      enableFilter: true,
      localeText: this.settings.LOCALETEXT,
      animateRows: true,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { field: 'group1',cellStyle: { "text-align": "left" }, headerName: '选择', minWidth: 60, checkboxSelection: (params)=> params.data, headerCheckboxSelection: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购合同号', field: 'billno', minWidth: 90,
        cellRenderer: (params) => {
          if (params.data) {
            return '<a target="_blank" href="#/caigou/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '规则单号', field: 'fanlirulebillno', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data && params.data['fanlirulebillno']) {
            return '<a target="_blank" href="#/fanlirule/' + params.data.fanliruleid + '">' + params.data.fanlirulebillno + '</a>';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同月份', field: 'month', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购类型', field: 'caigoutype', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购量', field: 'caigouweight', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['caigouweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '合同量', field: 'htweight', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['htweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '入库量', field: 'rukuweight', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['rukuweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
    //   {
    //     cellStyle: { 'text-align': 'center' }, headerName: '在途重量', field: 'zaituweight', minWidth: 90, aggFunc: 'sum',
    //     valueGetter: (params) => {
    //       if (params.data) {
    //         return Number(params.data['zaituweight']);
    //       } else {
    //         return 0;
    //       }
    //     }, valueFormatter: this.settings.valueFormatter3
    //   },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '退货量', field: 'tuihuoweight', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['tuihuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '未产量', field: 'weichanchuweight', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weichanchuweight']) {
            return Number(params.data['weichanchuweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '出货量', field: 'chuhuoweight', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['chuhuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单是否完成', field: 'isfinish', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '返利类型', field: 'youhuitype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'price', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '预估返利金额', field: 'yugufanlijine', minWidth: 120, aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['yugufanlijine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '预估返利节点', field: 'yugufanlijiedian', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '返利状态', field: 'youhuistatus', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '已返利金额', field: 'yfjine', minWidth: 120, aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['yfjine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '未返金额', field: 'wfjine', minWidth: 120, aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['wfjine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实返差额', field: 'sfchae', minWidth: 120, aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['sfchae']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际返利节点', field: 'shijifanlijiedian', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '返利是否完成', field: 'discountisfinishname', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'id', field: 'id', minWidth: 50 },
    ];
    this.getdate();
  }

  getdate() {
    let month:any = new Date().getMonth()+1;
    if (month<10) {
        month = '0'+month;
    }
    this.start = new Date(new Date().getFullYear() + '-' + month + '-01');
    this.end = new Date(new Date().getFullYear() + '-' + month + '-01');
    this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
  }

  ngOnInit() {
  }
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.caigouApi.listDiscountregister(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }
  //返利登记表
  getGnAndChandi() {
    this.classifyapi.getGnAndChandi().then((data) => {
      this.gns = [];
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        });
      });
    });
  }
  selectedgn(value) {
    this.chandis = [];
    console.log(value);
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
  }
  showgcinfodialog() {
    this.search = {start: this.datepipe.transform(this.start, 'y-MM-dd'),end: this.datepipe.transform(this.end, 'y-MM-dd')};
    this.caigoutypes = [{ label: '工程单', value: 1 }, { label: '库存销售', value: 2 }];
    this.isurgent = [{ label: '是', value: 1 }, { label: '否', value: 0 }];
    // this.getGnAndChandi();
    this.orgs = [{ label: '全部', value: '' }];
    // this.orgApi.listAll(0).then((response) => {
    //   response.forEach(element => {
    //     this.orgs.push({
    //       label: element.name,
    //       value: element.id
    //     });
    //   });
    // })
    this.gcinfodialog.show();
  }
  closegcinfodialog() {
    this.gcinfodialog.hide();
  }
  selectmonth(value) {
    this.search['gcmonth'] = this.datepipe.transform(value, 'y-MM-dd');
    console.log('asdas', this.datepipe.transform(value, 'y-MM'));
  }
  searchfanlidet() {
    // if (this.search['gnid']) {
    //   this.search['gnid'] = this.search['gnid']['id'];
    // }
    if (this.saleman) {
      this.search['salemanid'] = this.saleman['code'];
    }
    if (!this.search['end']) {
        this.toast.pop('warning', '请选择结束月份！', '');
        return;
    }
    if (this.start > this.end) {
        this.toast.pop('warning', '开始月份大于结束月份，请重新选择！', '');
        return;
    }
    this.listDetail();
    this.closegcinfodialog();
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
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.search['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }
  
  isfinish() {
    let caigoudetids = new Array();
    let selected = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].selected && selected[i].data && selected[i].data['id']) {
        if(selected[i].data['discountisfinish']) {
            this.toast.pop('warning', 'id：'+selected[i].data['id']+'，返利已经完成，不要重复完成了！！！');
            return;
        }
        caigoudetids.push(selected[i].data['id']);
      }
    }
    if (caigoudetids.length === 0) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    this.model['fanlidetids'] = caigoudetids;
    this.addisfinishDialog.show();
  }
  closefinishDialog() {
    this.addisfinishDialog.hide();
  }
  comfirm(){
    if(this.model['discountisfinish'] === null || this.model['discountisfinish'] === undefined){
      this.toast.pop('warning', '请选择是否完成！！！');
      return;
    }
    this.caigouApi.batchUpdateIsfinish(this.model).then((data) => {
      if(data){
        this.listDetail();
        this.closefinishDialog();
      }
    });
  }
  selectstartmonth(value) {
    this.start = value;
    this.search['start'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectendmonth(value) {
    this.end = value;
    this.search['end'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  autofanlidet() {
    if (window.confirm('需要花费很长的时间，确定要同步吗？')) {
        this.caigouApi.autofanlidet({}).then((data) => {
            this.listDetail();
        });
    }
  }
}
