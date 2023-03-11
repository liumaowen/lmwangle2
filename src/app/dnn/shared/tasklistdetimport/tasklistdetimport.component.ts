import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ProduceapiService } from './../../../routes/produce/produceapi.service';
import { BsModalRef } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';

@Component({
  selector: 'app-tasklistdetimport',
  templateUrl: './tasklistdetimport.component.html',
  styleUrls: ['./tasklistdetimport.component.scss']
})
export class TasklistdetimportComponent implements OnInit {
  parentthis;

  bmgridOptions: GridOptions;
  constructor(public settings: SettingsService, public bsModalRef: BsModalRef, private produceApi: ProduceapiService,
    private toast: ToasterService) {
    this.bmgridOptions = {
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

    this.bmgridOptions.columnDefs = [
      { headerName: 'id', field: 'id', width: 50, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单编号', field: 'orderno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '原产地', field: 'originchandi', width: 100 },
    ];
    setTimeout(() => {
      this.listbm();
    }, 500);
  }

  ngOnInit() {
  }
  listbm() {
    console.log(this.parentthis['produce']['producemode']);
    if (this.parentthis['produce']['producemode'] === 1) {
      this.produceApi.getOEMBmlistInProduce().then((response) => {
        this.bmgridOptions.api.setRowData(response);
      });
    } else if (this.parentthis['produce']['producemode'] === 3) {
      this.produceApi.getWeishiBmlistInProduce().then((response) => {
        this.bmgridOptions.api.setRowData(response);
      });
    } else {
      this.produceApi.gettaskBmlist({ orderno: this.parentthis['produce']['orderno'] }).then((response) => {
        const rowData = new Array();
        console.log(response);
        for (let i = 0; i < response.length; i++) {
          const model = {};
          model['id'] = response[i].id;
          model['gn'] = response[i].goodscode.gn;
          model['chandi'] = response[i].goodscode.chandi;
          model['cangkuname'] = response[i].cangku.name;
          model['guige'] = response[i].goodscode.guige;
          model['grno'] = response[i].grno;
          model['kunbaohao'] = response[i].kunbaohao;
          model['weight'] = response[i].weight;
          model['orderno'] = response[i].taskList.orderno;
          model['length'] = response[i].length;
          rowData.push(model);
        }
        this.bmgridOptions.api.setRowData(rowData);
      });
    }

  }
  checkAll() {
    this.bmgridOptions.api.selectAll();
  }
  importBm() {
    const ids = new Array();
    const bm = this.bmgridOptions.api.getModel()['rowsToDisplay'];
    console.log(bm);
    for (let i = 0; i < bm.length; i++) {
      if (bm[i].selected) {
        ids.push(bm[i].data.id);
      }
    }
    console.log(ids);
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择要引入的基料！');
      // Notify.alert('请选择要引入的基料！', { status: 'warning' });
      return '';
    }
    this.produceApi.imptaskBm({ tasklistdetids: ids, produceid: this.parentthis['produce']['id'] }).then((data) => {
      // $scope.$emit('impBm', data);//向父页面传递所引入的数据
      this.parentthis.impBm();
    });
  }

}
