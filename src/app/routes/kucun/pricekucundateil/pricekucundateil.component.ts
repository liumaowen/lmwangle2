import { ToasterService } from 'angular2-toaster/angular2-toaster';
// import { PriceapiService } from './../priceapi.service';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { StorageService } from 'app/dnn/service/storage.service';
@Component({
  selector: 'app-pricekucundateil',
  templateUrl: './pricekucundateil.component.html',
  styleUrls: ['./pricekucundateil.component.scss']
})
export class PricekucundateilComponent implements OnInit {

  // 作为临时的存储对象，存储调价单的主表信息
  pricelogmodel: any = {};
  gridOptions: GridOptions;
  isupdown = '上架'; // 是否是上架下架

  constructor(public settings: SettingsService,
    private toast: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private http: Http,
    public storage: StorageService) {
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
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 60,
      cellRenderer: (params) => {
        if (params.data) {
          return params.data['gn'];
        } else {
          return '合计';
        }
      }
    },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangku', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      {
        cellStyle: { 'display': 'block' }, headerName: '货物规格', headerClass: 'wis-ag-center',
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 60 },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 60,
            valueFormatter: this.settings.valueFormatter3
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '颜色锌花', field: 'color', width: 100 },
          { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', width: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', width: 60 },
        ]
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '线上价格', field: 'olprice', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '线下价格', field: 'price', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '库存', headerClass: 'wis-ag-center',
        children: [
        {
          cellStyle: { 'text-align': 'center' }, headerName: '总重量', field: 'tweight', width: 60,
          valueFormatter: this.settings.valueFormatter3, aggFunc: 'sum',
        },
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '线上库存', headerClass: 'wis-ag-center',
        children: [
          {
            cellStyle: { 'text-align': 'center' }, headerName: '总重量', field: 'oltweight', width: 60,
            valueFormatter: this.settings.valueFormatter3, aggFunc: 'sum',
          },
        ]
      }
    ];

    this.listpricekucundet();
  }
  ngOnInit() {
  }
  /**获取详情 */
  listpricekucundet() {
    this.http.get(`store/api/offonshelve/${this.route.params['value']['id']}`).subscribe(data => {
      const params = data.json();
      this.pricelogmodel = params.order;
      this.isupdown = this.pricelogmodel.isupdown ? '上架' : '下架';
      this.pricelogmodel.cusername = this.pricelogmodel['cuser']['realname'];
      this.pricelogmodel.orgname = this.pricelogmodel['org']['name'];
      this.pricelogmodel.vusername = this.pricelogmodel['vuser']['realname'];
      this.gridOptions.api.setRowData(params.list);
    });
  }

  // 审核
  auditprice() {
    if (confirm('你确定审核吗？')) {
      this.http.get(`store/api/offonshelve/agree/${this.pricelogmodel['id']}`).subscribe(data => {
          this.toast.pop('success', '审核成功');
          this.listpricekucundet();
      });
    }
  }

  // 不同意审核
  notagree() {
    if (confirm('你确定拒审吗？')) {
      this.http.get(`store/api/offonshelve/refuseShelve/${this.pricelogmodel['id']}`).subscribe(data => {
          this.toast.pop('success', '拒审成功');
          this.listpricekucundet();
      });
    }
  }

  // 返回
  back() {
    this.router.navigateByUrl('pricekucundateil');
  }

}
