import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { ReportService } from './../../report/report.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerapiService } from './../../customer/customerapi.service';
import { element } from 'protractor';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { XiaoshouapiService } from 'app/routes/xiaoshou/xiaoshouapi.service';

@Component({
  selector: 'app-xiaoshouwanglaireport',
  templateUrl: './xiaoshouwanglaireport.component.html',
  styleUrls: ['./xiaoshouwanglaireport.component.scss']
})
export class XiaoshouwanglaireportComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  gridOptions: GridOptions;

  start = new Date('2017-01-01');

  end: Date;

  maxDate = new Date();

  companys;
  saleman;
  sellers;

  orgs;
  requestparams = {
    start: this.datepipe.transform(this.start, 'y-MM-dd'),
    end: '', buyerid: '', wcustomerid: '', orgid: '', salemanid: ''
  };

  constructor(public settings: SettingsService, private toast: ToasterService, private datepipe: DatePipe,
    private reportApi: ReportService, private route: ActivatedRoute, private customerApi: CustomerapiService,
    private tihuoApi: XiaoshouapiService, private orgApi: OrgApiService) {

    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      enableRangeSelection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
    }

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'cdate', width: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: (params) => {
          if (null != params.data.billtype) {
            if (params.data.billtype === 'SK') {// 收款单
              return '<a target="_blank" href="#/receive/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (params.data.billtype === 'FK') {// 付款单
              return '<a target="_blank" href="#/payment/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (params.data.billtype === 'OR') {// 线上订单
              return '<a target="_blank" href="#/order/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (params.data.billtype === 'BO') {// 
              return '<a target="_blank" href="#/businessorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (params.data.billtype === 'PO') {// 线下加工订单
              return '<a target="_blank" href="#/proorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (params.data.billtype === 'TH') {// 提货单
              return '<a target="_blank" href="#/tihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (params.data.billtype === 'XT') {// 销售退货
              return '<a target="_blank" href="#/xstuihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (params.data.billtype === 'XB') {// 销售补差
              return '<a target="_blank" href="#/xsbucha/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (params.data.billtype === 'QH') {// 销售补差
              return '<a target="_blank" href="#/qihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (params.data.billtype === 'FI') {// 资金占用利息收取表
              return '<a target="_blank" href="#/erpkaohe/fundinterestsum/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            return params.data.billno;
          } else {
            return params.data.billno;
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '合同号', field: 'orderbillno', width: 100,
        cellRenderer: (params) => {
          if (null != params.data.billtype) {
            if (params.data.billtype === 'TH') {// 提货单
              if (params.data.orderbillno.substring(0, 2) === 'QH') {
                return '<a target="_blank" href="#/qihuo/' + params.data.orderbillid + '">' + params.data.orderbillno + '</a>';
              } else if (params.data.orderbillno.substring(0, 2) === 'OR') {
                return '<a target="_blank" href="#/order/' + params.data.orderbillid + '">' + params.data.orderbillno + '</a>';
              } else if (params.data.orderbillno.substring(0, 2) === 'BO') {
                return '<a target="_blank" href="#/businessorder/' + params.data.orderbillid + '">' + params.data.orderbillno + '</a>';
              }
            }
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '数量', field: 'tcount', width: 60 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'tweight', width: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'pertprice', width: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '摘要', field: 'zhaiyao', width: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '发生额', field: 'fashenge', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '账面余额', field: 'yue', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '可使用余额', field: 'ziyouyue', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户', field: 'customername', width: 220 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方', field: 'wcustomername', width: 220 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 220 }
    ];

    // 页面有参数，是在销售往来余额表跳转过来的
    if (this.route.params['value']['id']) {
      this.requestparams.buyerid = this.route.params['value']['id'];
      this.customerApi.getCustomer(this.route.params['value']['id']).then((response) => {
        const tem = { value: '', label: '' };
        tem.value = response['id'];
        tem.label = response['name'];
        this.companys = tem;
      });
      console.log(this.requestparams.buyerid);
      this.tihuoApi.offlinetihuolist1({ customerid: this.route.params['value']['id'] }).then((tihuolist) => {
        console.log(tihuolist);
        if (tihuolist.length > 0) {
          this.requestparams.wcustomerid = tihuolist[0].sellerid;
        }
        this.listDetail();
      });
    }
  }

  ngOnInit() {
  }

  listDetail() {
    console.log('hello world');
    console.log(this.requestparams.salemanid);
    console.log(this.requestparams.buyerid);
    this.reportApi.xiaoshouwanglaidet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);
    });
  }

  openQueryDialog() {
    this.selectNull();
    this.customerApi.findwiskind().then((data) => {
      const sellerlist = [{ value: '', label: '全部' }];
      data.forEach(element => {
        sellerlist.push({
          label: element.name,
          value: element.id
        });
      });
      this.sellers = sellerlist;
    });
    this.orgApi.listAll(0).then((data) => {
      const orglist = [{ value: '', label: '全部' }];
      data.forEach(element => {
        orglist.push({
          label: element.name,
          value: element.id
        });
      });
      this.orgs = orglist;
    });
    // 2017.04.19 收款重构销售往来明细修改 end
    this.showclassicModal();
  }

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = {
      start: this.datepipe.transform(this.start, 'y-MM-dd'),
      end: '', buyerid: '', wcustomerid: '', orgid: '', salemanid: ''
    };
    this.companys = undefined;
    this.start = new Date('2017-01-01');
    this.end = undefined;
    this.saleman = undefined;
  }

  // 查询
  query() {
    if (this.start) {
      this.requestparams['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end) {
      this.requestparams['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (!this.start) {
      this.toast.pop('warning', '开始时间必填！');
    } else {
      if (typeof (this.companys) === 'object') {
        this.requestparams.buyerid = this.companys['code'];
      } else {
        this.requestparams.buyerid = '';
      }
      if (!this.requestparams.buyerid) {
        this.toast.pop('warning', '公司名称必填！');
        return '';
      }
      if (typeof (this.saleman) === 'object') {
        this.requestparams['salemanid'] = this.saleman['code'];
      } else {
        this.requestparams['salemanid'] = '';
      }
      if (!this.requestparams.wcustomerid) {
        this.toast.pop('warning', '卖方单位必填！');
      } else {
        this.listDetail();
        this.hideclassicModal();
      }
    }
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
      fileName: '销售往来明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }


  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
