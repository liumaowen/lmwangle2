import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'app/core/settings/settings.service';
import { Router } from '@angular/router';
import { FeeapiService } from '../../feeapi.service';

@Component({
  selector: 'app-biddingorderimport',
  templateUrl: './biddingorderimport.component.html',
  styleUrls: ['./biddingorderimport.component.scss']
})
export class BiddingorderimportComponent implements OnInit {
  parentthis: any;
  gridOptions: GridOptions;
  list: any = [];
  constructor(public bsModalRef: BsModalRef,
    public settings: SettingsService,
    private toast: ToasterService,
    private feeapiService: FeeapiService,
    private router: Router,
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
      rowSelection: 'multiple',
      localeText: this.settings.LOCALETEXT
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'left' }, headerName: '选择', field: 'field', minWidth: 60, checkboxSelection: true,
      headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '运输方式', field: 'transporttype', minWidth: 90,
      //   valueGetter: (params) => {
      //     if (params.data.transporttype === 1) {
      //       return '汽运';
      //     } else if (params.data.transporttype === 2) {
      //       return '铁运';
      //     } else if (params.data.transporttype === 3) {
      //       return '船运';
      //     } else {
      //       return '';
      //     }
      //   }
      // },
      { cellStyle: { 'text-align': 'center' }, headerName: '请购物料编码', field: 'materialNumber', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '请购单位', field: 'purchaseUnit', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '请购量', field: 'purchaseQuantity', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商名称', field: 'supplierName', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '中选量', field: 'bidQuantity', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'unitPrice', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款条件', field: 'paymentCondition', minWidth: 100,
        valueGetter: (params) => {
          if (params.data.paymentCondition === 'PREPAYMENT') {
            return '预付款';
          } else if (params.data.paymentCondition === 'POSTPAYMENT') {
            return '后付款';
          } else {
            return '其它';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款方式', field: 'paymentType', minWidth: 100,
      valueGetter: (params) => {
        if (params.data.paymentType === 'TELEGRAPHIC') {
          return '电汇';
        } else if (params.data.paymentType === 'ACCEPTANCE') {
          return '承兑';
        } else {
          return '其它';
        }
      }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '中选时间', field: 'biddingTime', minWidth: 100,
          valueGetter: (params) => {
          if (params.data) {
            return this.datepipe.transform(params.data['biddingTime'], 'y-MM-dd HH:mm');
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票类型', field: 'invoiceType', minWidth: 100,
        valueGetter: params => {
          if (params.data.invoiceType === 'ORDINARY') {
            return '普票';
          } else if (params.data.invoiceType === 'VAT_0') {
            return '增值税普通发票';
          } else if (params.data.invoiceType === 'VAT_1') {
            return '增值税专用发票1%';
          } else if (params.data.invoiceType === 'VAT_3') {
            return '增值税专用发票3%';
          } else if (params.data.invoiceType === 'VAT_9') {
            return '增值税专用发票9%';
          } else if (params.data.invoiceType === 'VAT_11') {
            return '增值税专用发票11%';
          } else if (params.data.invoiceType === 'VAT_13') {
            return '增值税专用发票13%';
          } else if (params.data.invoiceType === 'VAT_16') {
            return '增值税专用发票16%';
          } else {
            return '无票';
          }
        }
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 120,
      //   valueGetter: (params) => {
      //     if (params.data) {
      //       return this.datepipe.transform(params.data['cdate'], 'y-MM-dd HH:mm');
      //     }
      //   }
      // },
      // { cellStyle: { 'text-align': 'center' }, headerName: '报价人', field: 'notifiername', minWidth: 90}
    ];
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.parentthis.iswuliuorder) { // 物流竞价汇总表
        this.getwuliulist();
      } else if (this.parentthis.istiaohuobidding) { // 调货竞价汇总表
        this.gettiaohuobidlist();
      }
    }, 0);
  }
  /**获取物流竞价明细 */
  getwuliulist() {
    this.feeapiService.querybiddingorder(this.parentthis.wuliuorderdetids).then(data => {
      this.gridOptions.api.setRowData(data);
      this.list = data;
      if (!data.length) {
        this.toast.pop('info', '没有查询到中选单！');
      }
    });
  }
  /**获取调货竞价明细 */
  gettiaohuobidlist() {
    this.feeapiService.getbiddingorders(this.parentthis.tiaohuoids).then(data => {
      this.gridOptions.api.setRowData(data);
      this.list = data;
      if (!data.length) {
        this.toast.pop('info', '没有查询到中选单！');
      }
    });
  }
  /**确定 */
  confirm() {
    const params = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的中选单明细
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        params.push(orderdetSelected[i].data);
      }
    }
    if (params.length < 1) {
      this.toast.pop('warning', '请选择中选单明细！！！');
      return;
    }
    if (this.parentthis.iswuliuorder) { // 物流竞价汇总表
      this.feeapiService.confirmbiddingorder(params).then(data => {
        this.bsModalRef.hide();
        this.parentthis.listDetail();
      });
    } else if (this.parentthis.istiaohuobidding) { // 调货竞价汇总表
      this.feeapiService.updatebiddingorders(params).then(data => {
        this.bsModalRef.hide();
        this.parentthis.listDetail();
      });
    }
  }
}
