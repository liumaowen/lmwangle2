import { ToasterService } from 'angular2-toaster';
import { ProduceapiService } from './../../../routes/produce/produceapi.service';
import { BsModalRef } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fproductimport',
  templateUrl: './fproductimport.component.html',
  styleUrls: ['./fproductimport.component.scss']
})
export class FproductimportComponent implements OnInit {

  // 接收父页面this对象
  parentthis;

  gridOptions: GridOptions;

  constructor(public settings: SettingsService, public bsModalRef: BsModalRef, private produceApi: ProduceapiService, private toast: ToasterService) {

    this.gridOptions = {
      rowData: null,
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true,
      enableSorting: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      onCellClicked: (params) => { params.node.setSelected(true, true); },
    };


    this.gridOptions.columnDefs = [
      { headerName: 'id', field: 'id', width: 50, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 300 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 90, editable: true,
        onCellValueChanged: (params) => {
          console.log('宽度', params); // 判断这样的规格是否存在
          this.produceApi.judgeGcid({ gcid: params.data.gcid, width: params.data.width }).then((data) => {
            if (!data['flag']) {
              this.toast.pop('warning', '修改的宽度对应的物料编码不存在，请通知财务人员添加！');
              // Notify.alert('修改的宽度对应的物料编码不存在，请通知财务人员添加！', { status: 'warning' });
            }
          });

        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '合同重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '实际重量', field: 'impweight', width: 90, editable: true,
        onCellValueChanged: (params) => {
          console.log('引用重量', params);
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 160, editable: true,
        onCellValueChanged: (params) => {
          console.log('捆包号', params);
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 190, editable: true,
        onCellValueChanged: (params) => {
          console.log('引用重量', params);
        }
      }
    ];

    setTimeout(() => {
      this.listbm();
    }, 500);
  }

  ngOnInit() {
  }

  listbm() {
    this.produceApi.getFplist({ proorderid: this.parentthis.msg.proorderid }).then((response) => {
      console.log('fp', response);
      const rowData = new Array();
      for (let i = 0; i < response.length; i++) {
        const model = {};
        model['id'] = response[i].id;
        model['gn'] = response[i].goodscode.gn;
        model['chandi'] = response[i].goodscode.chandi;
        model['guige'] = response[i].guige;
        model['weight'] = response[i].weight;
        model['width'] = response[i].width;
        model['kunbaohao'] = this.parentthis.msg.kunbaohao;
        model['gcid'] = response[i].gcid;
        rowData.push(model);
      }
      this.gridOptions.api.setRowData(rowData);
    });
  }

  // 引入操作
  importFp() {
    const ids = new Array();
    const fp = this.gridOptions.api.getModel()['rowsToDisplay'];
    console.log(fp);
    for (let i = 0; i < fp.length; i++) {
      if (fp[i].selected) {
        if (!fp[i].data.impweight) { // 判断实际重量是不是有值
          // Notify.alert('实际重量值为空', { status: 'warning' })
          this.toast.pop('warning', '实际重量值为空');
          return '';
        }
        if (fp[i].data.kunbaohao === this.parentthis.msg.kunbaohao) {
          // Notify.alert('请对捆包号进行编辑！', { status: 'warning' })
          this.toast.pop('warning', '请对捆包号进行编辑！');
          return '';
        }
        const model = { id: fp[i].data.id, width: fp[i].data.width, impweight: fp[i].data.impweight, kunbaohao: fp[i].data.kunbaohao, beizhu: fp[i].data.beizhu };
        ids.push(model);
      }
    }
    console.log(ids);
    if (ids.length <= 0) {
      // Notify.alert('请选择要引入的成品！', { status: 'warning' });
      this.toast.pop('warning', '请选择要引入的成品！');
      return '';
    }
    this.produceApi.impFp({ fpdets: ids, basematerialid: this.parentthis.msg.basematerialid }).then((data) => {
      data['baseSub'] = this.parentthis.msg.baseSub;
      // $scope.$emit('impFp', data);//向父页面传递所引入的数据
      this.parentthis.impFp(data);
    });
  }

}
