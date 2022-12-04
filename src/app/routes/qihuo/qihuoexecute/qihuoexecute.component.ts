import { QihuostatusPipe } from './../../../dnn/shared/pipe/qihuostatus.pipe';
import { ToasterService } from 'angular2-toaster';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { SettingsService } from 'app/core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qihuoexecute',
  templateUrl: './qihuoexecute.component.html',
  styleUrls: ['./qihuoexecute.component.scss']
})
export class QihuoexecuteComponent implements OnInit {

  gridOptions: GridOptions;
  search: any = { start: null, end: null, buyerid: '', salemanid: '' };
  qihuodetids = new Array();
  @ViewChild('setfinishdesc') private setfinishdesc: ModalDirective;
  qihuodesc: any = null;
  issetdesc: boolean = false;
  @ViewChild('searchdialog') private searchdialog: ModalDirective;
  // 开始时间
  start = new Date(); // 设定页面开始时间默认值
  end = new Date();
  maxDate = new Date();
  constructor(public settings: SettingsService, private datepipe: DatePipe, private qhuoApi: QihuoService, private toast: ToasterService, private route: ActivatedRoute) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      //rowDeselection: true,
      rowSelection: 'multiple', // 多选单选控制
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 60, suppressMenu: true, checkboxSelection: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '合同编号', field: 'billno', minWidth: 60, cellRenderer: (params) => {
          if (params.data && null != params.data.orderid) {
            return '<a target="_blank" href="#/qihuo/' + params.data.orderid + '">' + params.data.billno + '</a>';
          }
          return '';
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单创建日期', field: 'ordercdate', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 60, enableRowGroup: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '订货量', field: 'dinghuoweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['dinghuoweight']) {
            return Number(params.data['dinghuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售金额', field: 'salejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['salejine']) {
            return Number(params.data['salejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '买方', field: 'buyer', minWidth: 60, enableRowGroup: true,
        cellRenderer: function (params) {
          if (params.data) {
            return '<a target="_blank" href="#/xiaoshouwanglaireport/' + params.data.buyerid + '">' +
              params.data.buyer + '</a>';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单状态', field: 'orderstatus', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '交货状态', field: 'jiaohuostatus', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构名称', field: 'orgname', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '项目名称', field: 'projectname', minWidth: 60
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '所属行业', field: 'categoryname', minWidth: 60
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '地区', field: 'jiaohuoaddr', minWidth: 60
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '客户类型', field: 'kehutype', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'dantype', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方', field: 'seller', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '交货日期', field: 'jiaohuodate', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '运输方式', field: 'yuntype', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '描述说明', field: 'descrbes', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已采购量', field: 'yicaigouweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yicaigouweight']) {
            return Number(params.data['yicaigouweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已入库量', field: 'yirukuweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yirukuweight']) {
            return Number(params.data['yirukuweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已提货量', field: 'yitihuoweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yitihuoweight']) {
            return Number(params.data['yitihuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已验收量', field: 'yiyanshouweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yiyanshouweight']) {
            return Number(params.data['yiyanshouweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '未提货量', field: 'weitihuoweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weitihuoweight']) {
            return Number(params.data['weitihuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '已退货', field: 'tuihuoweight', minWidth: 60, enableRowGroup: true,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data && params.data['tuihuoweight']) {
          return Number(params.data['tuihuoweight']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 
    },
      { cellStyle: { 'text-align': 'center' }, headerName: '已释放', field: 'shifangweight', minWidth: 60, enableRowGroup: true,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data && params.data['shifangweight']) {
          return Number(params.data['shifangweight']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3  
    },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同比例', field: 'htexecuterate', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售价格', field: 'saleprice', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '考核价格', field: 'price', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格性质', field: 'guigexingzhi', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '合同定金', field: 'orderdingjin', minWidth: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '定金金额', field: 'dingjinjine', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '定金比例', field: 'dingjinrate', minWidth: 60, enableRowGroup: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '预估费用明细', field: 'yugufeemiaoshu', minWidth: 100, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用合计', field: 'feetotal', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['feetotal']) {
            return Number(params.data['feetotal']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '预估毛利', field: 'yugumaoli', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yugumaoli']) {
            return Number(params.data['yugumaoli']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cuser', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'auser', minWidth: 60, enableRowGroup: true },
     
  
    ];
    this.route.queryParams.subscribe((res) => {
      const arr = Object.getOwnPropertyNames(res);
      if (arr.length) {
        this.search['start'] = '';
        this.search['end'] = '';
        this.search['buyerid'] = res['buyerid'];
        this.search['salemanid'] = res['salemanid'];
        this.listDetail();
      }
    });
  }

  ngOnInit() {
  }

  //获取数据
  listDetail() {
    this.qhuoApi.qihuoexecute(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  //确认完成弹出框
  finishdialog() {
    this.qihuodetids = [];
    this.qihuodesc = '';
    this.issetdesc = false;
    let rows = this.gridOptions.api.getSelectedRows();
    if (rows.length === 0) {
      this.toast.pop('warning', '请选择要完成的合同！');
      return;
    }
    if (this.gridOptions.api.getFilterModel()) {//如果有筛选就
      const price = this.gridOptions.api.getModel()['rowsToDisplay'];
      price.forEach(element => {
        if (element.selected) {
          this.qihuodetids.push(element.data.qihuodetid);
          const rate = element.data.weitihuoweight / element.data.dinghuoweight;
          if (rate > 0.1 || rate < -0.1) {
            this.issetdesc = true;
          }
        }
      });
    } else { //没有筛选的话就直接获取选中的项,获取合同的id
      rows.forEach(element => {
        this.qihuodetids.push(element.qihuodetid);
        const rate = element.weitihuoweight / element.dinghuoweight;
        if (rate > 0.1 || rate < -0.1) {
          this.issetdesc = true;
        }
      });
    }
    if (this.issetdesc) {
      this.setfinishdesc.show();
    } else {
      if (confirm('你确认要完成订单吗？')) {
        this.finish();
      }
    }

  }
  //确认完成
  finish() {
    if (this.issetdesc && !this.qihuodesc) {
      this.toast.pop('warning', '请填写情况说明！');
      return;
    }
    this.qhuoApi.confirmfinish({ ids: this.qihuodetids, qihuodesc: this.qihuodesc }).then(data => {
      this.toast.pop('success', '操作成功');
      this.closeDialog();
    });

  }
  //关闭对话框
  closeDialog() {
    this.setfinishdesc.hide();
  }
  openquery() {
    this.searchdialog.show();
  }
  closequery() {
    this.searchdialog.hide();
  }
  select() {
    if (!this.start) {
      this.toast.pop('warning', '请填写开始时间');
      return;
    }
    if (!this.end) {
      this.toast.pop('warning', '请填写结束时间');
      return;
    }
    if (this.search['buyerid']) {
      this.search['buyerid'] = this.search['buyerid']['code'];
    }
    if (this.search['salemanid']) {
      this.search['salemanid'] = this.search['salemanid']['code'];
    }
    this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    console.log(this.search);
    this.listDetail();
    this.closequery();
  }
}