import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ErpkaoheService } from './../erpkaohe.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { ToasterService } from 'angular2-toaster';


@Component({
  selector: 'app-yanqitihuo',
  templateUrl: './yanqitihuo.component.html',
  styleUrls: ['./yanqitihuo.component.scss']
})
export class YanqitihuoComponent implements OnInit {
  search: any = {};
  buyer = [];
  orgs = [];
  saleman;
  maxDate = new Date();
  gridOptions: GridOptions;
  @ViewChild('yanqidialog') private yanqidialog: ModalDirective;
  @ViewChild('cancelFundinterestModal') private cancelFundinterestModal: ModalDirective;

  constructor(public settings: SettingsService, private erpkaoheapi: ErpkaoheService, private datepipe: DatePipe,
    private toast: ToasterService,
    private orgApi: OrgApiService,) {
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
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: () => '合计' },
      { cellStyle: { "text-align": "left" }, headerName: '选择', minWidth: 30, checkboxSelection: true, suppressMenu: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提货单号', field: 'tihuobillno', width: 90,
        cellRenderer: (params) => {
          if (params.data && params.data.tihuoid) {
            return '<a target="_blank" href="#/tihuo/' + params.data.tihuoid + '">' + params.data.tihuobillno + '</a>';
          } else {
            return null;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售提单日期', field: 'tihuocdate', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '期货订单号码', field: 'qihuobillno', width: 90,
        cellRenderer: (params) => {
          if (params.data && params.data.billid) {
            return '<a target="_blank" href="#/qihuo/' + params.data.billid + '">' + params.data.qihuobillno + '</a>';
          } else {
            return null;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否基料', field: 'isproorder', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属机构', field: 'orgname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户性质', field: 'kehutype', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 120 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'price', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '超期货款', field: 'jine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '超期货款定金', field: 'dingjin', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['dingjin']) {
            return Number(params.data['dingjin']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '合同配款', field: 'allocation', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['allocation']) {
            return Number(params.data['allocation']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际定金比例', field: 'shifurate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构库龄', field: 'orgkuling', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '内部交货期', field: 'innerqixian', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起息日', field: 'startdate', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月利率', field: 'monthrate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '计息天数', field: 'days', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '免息天数', field: 'canceldays', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '免息开始时间', field: 'cancelstart', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '免息结束时间', field: 'cancelend', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '资金占用利息', field: 'zijinlixi', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['zijinlixi']) {
            return Number(params.data['zijinlixi']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '免息金额', field: 'canceljine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['canceljine']) {
            return Number(params.data['canceljine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'saleman', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售合同月份', field: 'salemonth', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '免息原因', field: 'cancelbeizhu', width: 90 }
    ];
  }

  ngOnInit() { }

  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.erpkaoheapi.find(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });

  }

  getOrgs() {
    // 付款机构
    this.orgApi.listAll(0).then((response) => {
      let orglists = [{ label: '全部', value: '' }];
      response.forEach(element => {
        orglists.push({
          label: element.name,
          value: element.id
        });
      });
      this.orgs = orglists;
    });
  }

  show() {
    this.getOrgs();
    this.selectNull();
    this.yanqidialog.show();
  }
  close() {
    this.yanqidialog.hide();
  }
  select() {
    this.search['start'] ? this.search['start'] = this.datepipe.transform(this.search['start'], 'y-MM-dd') : '';
    this.search['end'] ? this.search['end'] = this.datepipe.transform(this.search['end'], 'y-MM-dd') : '';
    if (typeof (this.buyer) === 'object') {
      this.search.buyerid = this.buyer['code'];
    } else {
      this.search.buyerid = '';
    }
    if (typeof (this.saleman) === 'object') {
      this.search.salemanid = this.saleman['code'];
    } else {
      this.search.salemanid = '';
    }
    this.listDetail();
    this.close();
  }
  selectNull() {
    this.buyer = undefined;
    this.saleman = undefined;
    this.search['start'] = '';
    this.search['end'] = '';
    this.search = { buyerid: '', salemanid: '', orgid: '', qihuobillno: '', beizhu: '' };
  }

  // 打开免息申请弹窗
  showCancelFundinterestModal() {
    this.selectNull();
    this.cancelFundinterestModal.show();
  }
  // 关闭免息申请弹窗
  closeCancelFundinterestModal() {
    this.cancelFundinterestModal.hide();
  }

  // 免息申请
  cancelFundinterest() {
    let orderdetids = new Array();
    let selectedFundinterest = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (var i = 0; i < selectedFundinterest.length; i++) {
      if (selectedFundinterest[i].selected && selectedFundinterest[i].data) {
        orderdetids.push(selectedFundinterest[i].data['orderdetid']);
      }
    }
    if (orderdetids.length === 0) {
      this.toast.pop('warning', '请选择要免息的钢卷！！！');
      return;
    }
    if (!this.search['start']) {
      this.toast.pop('warning', '请选择免息的开始时间！！！');
      return;
    }
    if (!this.search['end']) {
      this.toast.pop('warning', '请选择免息的结束时间！！！');
      return;
    }
    if (!this.search['beizhu']) {
      this.toast.pop('warning', '请填写备注！！！');
      return;
    }
    this.search['start'] ? this.search['start'] = this.datepipe.transform(this.search['start'], 'y-MM-dd') : '';
    this.search['end'] ? this.search['end'] = this.datepipe.transform(this.search['end'], 'y-MM-dd') : '';
    this.search['orderdetids'] = orderdetids;
    // 从服务器获取数据赋值给网格
    this.erpkaoheapi.cancelFundInterest(this.search).then((data) => {
      this.closeCancelFundinterestModal();
    });
  }

}
