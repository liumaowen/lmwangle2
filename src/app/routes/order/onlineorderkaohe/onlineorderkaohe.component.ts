import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ReportService } from './../../report/report.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-onlineorderkaohe',
  templateUrl: './onlineorderkaohe.component.html',
  styleUrls: ['./onlineorderkaohe.component.scss']
})
export class OnlineorderkaoheComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];

  companys = {};

  cuser = {};

  vuser = {};
  cangku: any[] = [];
  orgs: any = [];
  gns: any = [];
  gcs: any[] = [];
  chandis: any = [];
  showGuige = false;
  attrs: any[];
  // 开始时间
  start = new Date(); // 设定页面开始时间默认值
  end = new Date();
  filters = {};
  disabled = true;
  requestparams = {
    gn: '', cangkuid: '', chandi: '', orgid: '', salemanid: '', start: this.datepipe.transform(this.start, 'y-MM-dd'),
    end: this.datepipe.transform(this.end, 'y-MM-dd'), customerid: ''
  };

  maxDate = new Date();
  gridOptions: GridOptions;
  constructor(public settings: SettingsService,
    private reportApi: ReportService,
    private classifyApi: ClassifyApiService,
    private orgApi: OrgApiService,
    private datepipe: DatePipe) {


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
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', width: 100,
      cellRenderer: (params) => {
        if (params.data) {
          return params.data.customername;
        } else {
          return '合计';
        }
      }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户性质', field: 'usernature', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单日期', field: 'cdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'orbillno', width: 100,
        cellRenderer: (params) => {
          if (params.data) {
            return '<a target="_blank" href="#/order/' + params.data.orderid + '">' + params.data.orbillno + '</a>';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单类型', field: 'producestatus', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单状态', field: 'status', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提单号', field: 'thbillno', width: 100,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data.tihuoid) {
              return '<a target="_blank" href="#/tihuo/' + params.data.tihuoid + '">' + params.data.thbillno + '</a>';
            } else {
              return '';
            }
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量（单卷）', field: 'weight', width: 100,
        aggFunc: 'sum', valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '销售单价', field: 'xstprice', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售金额', field: 'xstjine', width: 100,
        aggFunc: 'sum', valueGetter: (params) => {
          if (params.data && params.data['xstjine']) {
            return Number(params.data['xstjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售补差单价', field: 'bcprice', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售补差金额', field: 'bcjine', width: 100,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data && params.data['bcjine']) {
          return Number(params.data['bcjine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2
      },
      {
         cellStyle: { 'text-align': 'center' }, headerName: '销售定价', field: 'xsdprice', width: 100,
         valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '考核定价', field: 'khprice', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '考核金额', field: 'khjine', width: 100,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data && params.data['khjine']) {
          return Number(params.data['khjine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠单价', field: 'couponvalue', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠金额', field: 'couponjine', width: 100,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data && params.data['couponjine']) {
          return Number(params.data['couponjine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠券种', field: 'coupondesc', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单吨毛利', field: 'tmaoli', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '考核毛利', field: 'khmaoli', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提货期限', field: 'thdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '超期提货天数', field: 'cqdays', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'shitidate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 100,
      valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 100
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'ckname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'realname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方', field: 'sellername', width: 100 }

    ];

    this.listDetail();
  }

  ngOnInit() {
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
      fileName: '线上订单考核明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  listDetail() {
    this.reportApi.getonlineorderdet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }

  openQueryDialog() {
    if (this.orgs.length < 1) {
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
    if (this.cangku.length < 1) {
      this.cangku = [{ value: '', label: '全部' }];
      this.classifyApi.cangkulist().then((response) => {
        response.forEach(element => {
          this.cangku.push({
            value: element.id,
            label: element.name
          });
        });
      });
    }
    this.selectNull();
    this.show();
  }
  /**获取品名和产地 */
  getGnAndChandi() {
    this.classifyApi.getGnAndChandi().then((data) => {
      this.gns = [{ value: '', label: '全部' }];
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        });
      });
    });
  }
  // tslint:disable-next-line:member-ordering
  @ViewChild('classicModal') private classicModal: ModalDirective;
  show() {
    this.classicModal.show();
  }

  coles() {
    this.classicModal.hide();
  }

  // 常量作为字段名
  // tslint:disable-next-line:member-ordering
  // fieldArr = [
  //   'chandi', //  产地
  //   'color', // 颜色
  //   'width', // 宽度
  //   'houdu', // 厚度
  //   'duceng', // 镀层
  //   'caizhi', // 材质
  //   'ppro' // 后处理
  // ];
  // 赛选过滤方法
  // filter() {
  //   this.fieldArr.forEach(fieldElement => {
  //     // 除自己以外其他字段
  //     let otherFieldArr = this.fieldArr.filter(element => element !== fieldElement);
  //     let queryOptions = [{ value: '', label: '全部' }];
  //     otherFieldArr.forEach(otherFieldElement => {
  //       this.data.forEach(dataElement => {
  //         if (otherFieldArr.every(otherField => {
  //           return this.requestparams[otherField] === '' || dataElement[otherField] === this.requestparams[otherField];
  //         })) {
  //           const fieldValue = dataElement[fieldElement];
  //           if (fieldValue != null && JSON.stringify(queryOptions).indexOf(JSON.stringify(fieldValue)) === -1) {
  //             queryOptions.push({ value: fieldValue, label: fieldValue });
  //           }
  //         }
  //       });
  //       this.filterConditionObj[fieldElement] = queryOptions;
  //     });
  //   });
  //   console.log(this.filterConditionObj);
  // }
  /**选择品名 */
  selectGnAction(value) {
    this.requestparams.chandi = '';
    this.attrs = [];
    this.showGuige = false;
    this.chandis = [];
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.name,
        label: element.name
      });
    });
    this.disabled = false;
  }
  selectedguige(event, labelid) {
    for (let i = 0; i < this.gcs.length; i++) {
      if (this.gcs[i]['name'] === labelid) {
        this.gcs.splice(i, 1);
      }
    }
    this.gcs.push({ name: labelid, value: event['value'] });
  }
  // selectAction(key) {
  //   this.filter();
  // }
  query() {
    if (typeof (this.companys) === 'string' || !this.companys) {
      this.requestparams['customerid'] = '';
    } else if (typeof (this.companys) === 'object') {
      this.requestparams.customerid = this.companys['code'];
    }
    if (typeof (this.cuser) === 'string' || !this.cuser) {
      this.requestparams['salemanid'] = '';
    } else if (typeof (this.cuser) === 'object') {
      this.requestparams.salemanid = this.cuser['code'];
    }
    this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.listDetail();
    this.coles();
  }

  selectNull() {
    this.requestparams = {
      gn: '', cangkuid: '', chandi: '', orgid: '', salemanid: '', start: this.datepipe.transform(this.start, 'y-MM-dd'),
      end: this.datepipe.transform(this.end, 'y-MM-dd'), customerid: ''
    };
    this.start = new Date();
    this.end = new Date();
    this.cuser = undefined;
    this.companys = undefined;
    this.disabled = true;
    this.chandioptions = [];
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
        this.chandioptions.unshift({ value: '', label: '全部' });
        break;
      }
    }
    this.requestparams['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.requestparams['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }
}
