import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { QihuochangeService } from 'app/routes/qihuochange/qihuochange.service';
@Component({
  selector: 'app-qihuodetailimp',
  templateUrl: './qihuodetailimp.component.html',
  styleUrls: ['./qihuodetailimp.component.scss']
})
export class QihuodetailimpComponent implements OnInit {
  parentthis;
  qihuodetgridOptions: GridOptions;
  constructor(public settings: SettingsService,
    public bsModalRef: BsModalRef,
    private qihuoApi: QihuoService,
    private qihuochangeApi: QihuochangeService,
    private toast: ToasterService) {
    this.qihuodetgridOptions = {
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      suppressRowClickSelection: false,
      enableColResize: true,
      enableSorting: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      onCellClicked: (params) => { params.node.setSelected(true, true); }
    };
    this.qihuodetgridOptions.columnDefs = [
      { headerName: 'id', field: 'id', width: 50, checkboxSelection: true },
      {
        cellStyle: { 'display': 'block' }, headerName: '规格', headerClass: 'wis-ag-center',
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'goodscode.chandi', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'goodscode.houdu', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'goodscode.width', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'goodscode.duceng', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '颜色|锌花', field: 'goodscode.color', minWidth: 95 },
          { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'goodscode.caizhi', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'goodscode.ppro', minWidth: 80 },
          { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'goodscode.painttype', minWidth: 90 },
          { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'goodscode.beiqi', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '漆膜厚度', field: 'goodscode.qimo', minWidth: 90 },
          { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'goodscode.tuceng', minWidth: 90 },
          { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'goodscode.neijing', minWidth: 80 },
          { cellStyle: { 'text-align': 'center' }, headerName: '是否喷码', field: 'goodscode.penma', minWidth: 90 },
          { cellStyle: { 'text-align': 'center' }, headerName: '单卷重', field: 'oneweight', minWidth: 80 },
          { cellStyle: { 'text-align': 'center' }, headerName: '是否修边', field: 'goodscode.xiubian', minWidth: 90 },
          { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'goodscode.packagetype', minWidth: 90 }
        ]
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '订货量', field: 'weight', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '已采购', field: 'yicaigouweight', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '已入库', field: 'yirukuweight', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '已提货', field: 'yitihuoweight', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '已验收', field: 'yijiagongweight', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '下单备注', field: 'beizhu', minWidth: 60 }
    ];
    setTimeout(() => {
      this.getdata();
    }, 500);
  }

  ngOnInit() {
  }
  getdata() {
    this.qihuoApi.findQihuodet(this.parentthis['model']['orderid']).then(data => {
      this.qihuodetgridOptions.api.setRowData(data);
    });
  }
  checkAll() {
    this.qihuodetgridOptions.api.selectAll();
  }
  importqihuodetail() {
    const ids = new Array();
    const qihuodet = this.qihuodetgridOptions.api.getModel()['rowsToDisplay'];
    console.log(qihuodet);
    for (let i = 0; i < qihuodet.length; i++) {
      if (qihuodet[i].selected) {
        ids.push(qihuodet[i].data.id);
      }
    }
    console.log(ids);
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择要引入的期货销售明细！');
      return '';
    }
    console.log(this.parentthis);
    this.qihuochangeApi.createqihuochangedet({ qihuodetids: ids, qihuochangeid: this.parentthis['model']['id'] }).then((data) => {
      this.parentthis.impqihuodet();
    });
  }

}
