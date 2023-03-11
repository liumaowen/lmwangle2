import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from 'app/core/settings/settings.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { TiaohuobiddingService } from 'app/routes/tiaohuobidding/tiaohuobidding.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';

@Component({
  selector: 'app-importtiaohuobid',
  templateUrl: './importtiaohuobid.component.html',
  styleUrls: ['./importtiaohuobid.component.scss']
})
export class ImporttiaohuobidComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  parentThis: any;
  gridOptions: GridOptions;
  // start = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值
  start : Date;
  end: Date;
  maxDate = new Date();
  requestparams: any = {
    // start: this.datePipe.transform(this.start, 'y-MM-dd'),
    start : '',
    end: '', supplierid: '', salemanid: '', orgid: '', isdel: false, statusStr: 7, isimport : true
  };
  saleman: any = {};
  orgs = [];
  constructor(public bsModalRef: BsModalRef,
    public settings: SettingsService,
    private toast: ToasterService,
    private tiaohuobiddingApi: TiaohuobiddingService,
    private router: Router,
    private datePipe: DatePipe,
    private orgApi: OrgApiService) {
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
      {
        cellStyle: { 'text-align': 'center' }, colId: 'group', headerName: '选择', field: 'group'
        ,
        minWidth: 60, checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源外务', field: 'waiwuname', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '请购单号', field: 'purchaserequestno', minWidth: 100,
        menuTabs: ['filterMenuTab'], cellRenderer: function (params) {
          if (params.data) {
            if (params.data['biddingorderid']) {
              return '<a>' + params.data.purchaserequestno + '</a>';
            } else {
              return params.data.purchaserequestno;
            }
          }
        }, onCellClicked: (data) => {
          if (data.data['biddingorderid']) {
            this.gozhongxuandan(data.data['biddingorderid']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'price', minWidth: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'suppliername', headerName: '供应商', field: 'suppliername',
        minWidth: 100
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57,
        valueFormatter: this.settings.valueFormatter
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订货量', field: 'tweight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '中选量', field: 'weight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价时间', field: 'baojiadate', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 80 }
    ];
    this.getorgs();
  }

  ngOnInit() {
    setTimeout(() => {
      this.gettiaohuobidlist();
    }, 0);
  }
  /**获取调货竞价明细 */
  gettiaohuobidlist() {
    this.tiaohuobiddingApi.find(this.requestparams).then(data => {
      this.gridOptions.api.setRowData(data);
      if (!data.length) {
        this.toast.pop('info', '没有查询到竞价明细！');
      }
    });
  }
  /**获取机构 */
  getorgs() {
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
  /**确定 */
  confirm() {
    const params = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的调货竞价明细
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        params.push(orderdetSelected[i].data['biddingsupplierid']);
      }
    }
    if (params.length < 1) {
      this.toast.pop('warning', '请选择调货竞价明细！！！');
      return;
    }
    const obj = {biddingsupplierids: params, orderid: this.parentThis.qihuomodel.id};
    this.tiaohuobiddingApi.importTiaohuoBidding(obj).then(data => {
      this.bsModalRef.hide();
      this.parentThis.getqihuomodel();
      this.parentThis.findqihuodet();
    });
  }
    /**跳转scc中选单 */
    gozhongxuandan(id) {
      const token = localStorage.getItem('token');
      if (!token) {
        if (environment.ismenhu) {
          window.open(`${environment.mainappUrl}`, '_self');
          return;
        }
        this.router.navigateByUrl('/passport/login');
        return;
      }
      const url = `${environment.sccUrl}`;
      if (url) {
        const esystem = window.open(`${url}#/buy/bidding-management/${id}`);
        const setToken = () => {
          esystem.postMessage({ type: 'wsdtoken', data: token }, url);
        };
        const timer = setInterval(setToken, 100);
        const timeOutr = setTimeout(() => {
          if (timer) {
            clearInterval(timer);
          }
        }, 5000);
        window.addEventListener('message', (e: any) => {
          if (e.data === 'wsdloginsuccess') {
            window.removeEventListener('message', setToken, true);
            clearTimeout(timeOutr);
            clearInterval(timer);
          }
        }, true);
      }
    }
  openQueryDialog() {
    this.showclassicModal();
    this.selectNull();
  }
  /**查询弹窗 */
  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  // 查询
  query() {
    if (this.start) {
      this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.requestparams.end = '';
      }
      if (typeof (this.saleman) === 'string' || !this.saleman) {
        this.requestparams['salemanid'] = '';
      } else if (typeof (this.saleman) === 'object') {
        this.requestparams.salemanid = this.saleman['id'];
      }
      if (this.requestparams['supplierid'] instanceof Object) {
        this.requestparams['supplierid'] = this.requestparams['supplierid'].code;
      } else {
        this.requestparams['supplierid'] = '';
      }
      this.gettiaohuobidlist();
      this.hideclassicModal();
    } else {
      this.toast.pop('warning', '开始时间必填！');
    }
  }
  selectNull() {
    this.requestparams = {
      start: this.datePipe.transform(this.start, 'y-MM-dd'),
      end: '', supplierid: '', salemanid: '', orgid: '', isdel: false, statusStr: 7
    };
    this.end = undefined;
    // this.start = new Date();
    this.start = undefined;
    this.saleman = null;
  }
}
