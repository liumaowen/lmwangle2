import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../report.service';
import { DatePipe } from '@angular/common';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { ToasterService } from 'angular2-toaster';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';

@Component({
  selector: 'app-wuliupush',
  templateUrl: './wuliupush.component.html',
  styleUrls: ['./wuliupush.component.scss']
})
export class WuliupushComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('addrdialog') private addrdialog: ModalDirective;
  model: any = {};
  gridOptions: GridOptions;
  start = new Date();
  end: Date;
  ckitems = [];
  isshowcreate = true;
  requestparams = {start: this.datepipe.transform(this.start, 'y-MM-dd'),
  end: '', cangkuid: '', grno: ''};
  params = {};
  results = [];
  endaddr: any;
  constructor(public settings: SettingsService,
    private reportService: ReportService,
    private datepipe: DatePipe, private userapi: UserapiService,
    private toast: ToasterService,
    private matchcarApi: MatchcarService) {
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
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100,
      cellRenderer: (params) => {
        if (params && params.data && null != params.data.billno) {
          if (params.data.billno.substring(0, 2) === 'AL') {
            return '<a target="_blank" href="#/allot/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else if (params.data.billno.substring(0, 2) === 'MC') {
            return '<a target="_blank" href="#/matchcar/detail/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
        } else {
          return '合计';
        }
      }, checkboxSelection: (params) => params && params.data, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true},
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', minWidth: 100 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '是否付吊费', field: 'isdiaofee', minWidth: 90 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '提货凭证', field: 'pingzheng', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提货地址', field: 'tihuoaddr', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '送货地址', field: 'songaddr', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货联系人', field: 'xhlianxiren', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货电话', field: 'xhlianxirenphone', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运输类型', field: 'transtype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 90, aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data && params.data['weight']) {
          return Number(params.data['weight']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运费单价', field: 'feeprice', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
      valueFormatter: this.settings.valueFormatter3
    },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80
    },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '物流号', field: 'zhongjiaobillno', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运单号', field: 'transportno', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '车号', field: 'carnum', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '司机信息', field: 'driverinfo', minWidth: 120 },
    ];
  }

  ngOnInit() {
    this.ckitems = [{ value: '', label: '全部' }];
    this.userapi.cangkulist().then(data => {
      data.forEach(element => {
        this.ckitems.push(
          {
            value: element['id'],
            label: element['name']
          }
        );
      });
    });
  }

  listDetail() {
    if (this.end) {
      this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.start) {
      this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    this.reportService.getwuliupush(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  openQueryDialog() {
    this.showclassicModal();
    this.selectNull();
  }

  selectNull() {
    this.requestparams = {start: this.datepipe.transform(this.start, 'y-MM-dd'),
    end: '', cangkuid: '', grno: ''};
  }

  // 查询
  query() {
    this.listDetail();
    this.hideclassicModal();
  }
  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  // 打开创建或修改订单的弹窗
  addAddrDialog(no) {
    if (no === 2) {
      this.isshowcreate = false;
    } else if (no === 1) {
      this.isshowcreate = true;
    }
    const matchcardets = [];
    let xhlianxiren = '', xhlianxirenphone = '';
    const cangkuids = new Set(), xhlianxirenxinxi = new Set();
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        matchcardets.push(orderdetids[i].data);
        cangkuids.add(orderdetids[i].data.cangkuid);
      }
    }
    if (matchcardets.length <= 0) {
      this.toast.pop('warning', '请选择货物明细!');
      return;
    }
    if (cangkuids.size > 1) {
      this.toast.pop('warning', '请选择仓库相同的明细!');
      return;
    }
    const matchcardetids = new Array();
    for (let i = 0; i < matchcardets.length; i++) {
      if (!xhlianxiren && matchcardets[i]['xhlianxiren']) {
        xhlianxiren = matchcardets[i]['xhlianxiren'];
      }
      if (!xhlianxirenphone && matchcardets[i]['xhlianxirenphone']) {
        xhlianxirenphone = matchcardets[i]['xhlianxirenphone'];
      }
      xhlianxirenxinxi.add(matchcardets[i]['xhlianxiren'] + '#' + matchcardets[i]['xhlianxirenphone']);
      matchcardetids.push({detid: matchcardets[i].detid, billtype: matchcardets[i].billtype, billid: matchcardets[i].billid});
    }
    if (xhlianxirenxinxi.size > 1) {
      this.toast.pop('warning', '请选择卸货联系人信息相同的明细!');
      return;
    }
    this.params['det'] = matchcardetids;
    this.params['cangkuid'] = Array.from(cangkuids)[0];
    this.params['xhlianxiren'] = xhlianxiren;
    this.params['xhlianxirenphone'] = xhlianxirenphone;
    this.addrdialog.show();
  }
  addrdialogclose() {
    this.addrdialog.hide();
  }
  searchplace(e) {
    this.matchcarApi.getSuggestionPlace(e.query).then(data => {
      console.log(data);
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.title + '\r\n' + element.address,
          code: element
        });
      });
    });
  }
  // 推送物流平台创建订单
  createwuliuorder() {
    if (!this.params['senddate']) {
      this.toast.pop('warning', '请填写发货时间！');
      return;
    }
    if (!this.params['reachdate']) {
      this.toast.pop('warning', '请填写交货时间！');
      return;
    }
    if (!this.endaddr['code']) {
      this.toast.pop('warning', '请填写交货地址！');
      return;
    }
    this.params['senddate'] = this.datepipe.transform(this.params['senddate'], 'y-MM-dd');
    this.params['reachdate'] = this.datepipe.transform(this.params['reachdate'], 'y-MM-dd');
    this.params['endaddr'] = this.endaddr['code'];
    if (confirm('你确定要创建物流订单吗？')) {
      this.matchcarApi.createmoreRPCwuliuorder(this.params).then(data => {
        if (data['message']) {
          this.toast.pop('warning', data['message']);
        } else {
          this.toast.pop('success', '创建成功');
          this.listDetail();
        }
        this.addrdialogclose();
      });
    }
  }
  // 修改物流平台订单
  updatewuliuorder() {
    if (!this.params['senddate']) {
      this.toast.pop('warning', '请填写发货时间！');
      return;
    }
    if (!this.params['reachdate']) {
      this.toast.pop('warning', '请填写交货时间！');
      return;
    }
    if (!this.endaddr['code']) {
      this.toast.pop('warning', '请填写交货地址！');
      return;
    }
    this.params['senddate'] = this.datepipe.transform(this.params['senddate'], 'y-MM-dd');
    this.params['reachdate'] = this.datepipe.transform(this.params['reachdate'], 'y-MM-dd');
    this.params['endaddr'] = this.endaddr['code'];
    console.log(this.params);
    if (confirm('你确定要更新物流订单吗？')) {
      this.matchcarApi.moreupdateRPCwuliuorder(this.params).then(data => {
        if (data['message']) {
          this.toast.pop('warning', data['message']);
        } else {
          this.toast.pop('success', '更新成功！');
          this.listDetail();
        }
        this.addrdialogclose();
      });
    }
  }
  // 作废/撤销订单
  cancelRPCWuliuOrder() {
    const matchcardets = [];
    let count = 0;
    let zhongjiaobillno = null;
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        matchcardets.push(orderdetids[i].data);
        if (!zhongjiaobillno && orderdetids[i].data['zhongjiaobillno']) {
          zhongjiaobillno = orderdetids[i].data['zhongjiaobillno'];
          count++;
        }
        if (zhongjiaobillno !== orderdetids[i].data['zhongjiaobillno']) {
          count++;
        }
      }
    }
    if (matchcardets.length <= 0) {
      this.toast.pop('warning', '请选择要撤销的货物!');
      return;
    }
    const matchcardetids = new Array();
    for (let i = 0; i < matchcardets.length; i++) {
      matchcardetids.push({detid: matchcardets[i].detid, billtype: matchcardets[i].billtype, billid: matchcardets[i].billid});
    }
    this.params['det'] = matchcardetids;
    if (confirm('你确定要撤销' + (count > 1 ? '    多个    ' : '') + '物流订单吗？')) {
      this.matchcarApi.morecancelRPCwuliuorder(this.params).then(data => {
        if (data['message']) {
          this.toast.pop('warning', data['message']);
        } else {
          this.toast.pop('success', '撤销成功！');
          this.listDetail();
        }
      });
    }
  }
  // 订单完结
  endRPCWuliuOrder() {
    const matchcardets = [];
    let count = 0;
    let zhongjiaobillno = null;
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        matchcardets.push(orderdetids[i].data);
        if (!zhongjiaobillno && orderdetids[i].data['zhongjiaobillno']) {
          zhongjiaobillno = orderdetids[i].data['zhongjiaobillno'];
          count++;
        }
        if (zhongjiaobillno !== orderdetids[i].data['zhongjiaobillno']) {
          count++;
        }
      }
    }
    if (matchcardets.length <= 0) {
      this.toast.pop('warning', '请选择物流订单完结的货物!');
      return;
    }
    const matchcardetids = new Array();
    for (let i = 0; i < matchcardets.length; i++) {
      matchcardetids.push(matchcardets[i].id); // 将orderdetid放到数组中去
    }
    this.params['ids'] = matchcardetids;
    if (confirm('你确定要完结' + (count > 1 ? '    多个    ' : '') + '物流订单吗？')) {
      this.matchcarApi.endRPCwuliuorder(this.params).then(data => {
        this.toast.pop('success', '完结成功！');
      });
    }
  }
  // 同步运单数据
  syncRPCWuliuOrder() {
    const matchcardets = [];
    let count = 0;
    let zhongjiaobillno = null;
    const orderdetids = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < orderdetids.length; i++) {
      if (orderdetids[i].selected && orderdetids[i]['field'] !== 'group') {
        matchcardets.push(orderdetids[i].data);
        if (!zhongjiaobillno && orderdetids[i].data['zhongjiaobillno']) {
          zhongjiaobillno = orderdetids[i].data['zhongjiaobillno'];
          count++;
        }
        if (zhongjiaobillno !== orderdetids[i].data['zhongjiaobillno']) {
          count++;
        }
      }
    }
    if (matchcardets.length <= 0) {
      this.toast.pop('warning', '请选择物流订单同步的货物!');
      return;
    }
    const matchcardetids = new Array();
    for (let i = 0; i < matchcardets.length; i++) {
      matchcardetids.push({detid: matchcardets[i].detid, billtype: matchcardets[i].billtype, billid: matchcardets[i].billid});
    }
    this.params['det'] = matchcardetids;
    if (confirm('你确定要同步' + (count > 1 ? '    多个    ' : '') + '物流订单吗？')) {
      this.matchcarApi.moresyncRPCwuliuorder(this.params).then(data => {
        this.toast.pop('success', '同步成功！');
        this.listDetail();
      });
    }
  }
}
