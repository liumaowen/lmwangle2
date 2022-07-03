import { StorageService } from './../../../dnn/service/storage.service';
import { ErpkaoheService } from './../erpkaohe.service';
import { SettingsService } from 'app/core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feejixiao',
  templateUrl: './feejixiao.component.html',
  styleUrls: ['./feejixiao.component.scss']
})
export class FeejixiaoComponent implements OnInit {
  search: any = { salemanid: null };
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private erpkaoheapi: ErpkaoheService, private storage: StorageService) {
    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '机构 ', field: 'orgname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'yuefen', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用绩效', field: 'jixiaofee', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售运杂费', field: 'yunzafee', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '延期提货利息', field: 'yanqitihuo', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '定金反息', field: 'dingjinfanxi', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '无票费用', field: 'wupiaofee', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '公关报销费用', field: 'gongguanbaoxiao', width: 120, editable: true,
        onCellValueChanged: (params) => {
          console.log(params);
          let param = null;
          param = { key: 'gongguanfee', value: params.newValue, feejixiaoid: params.data.id };
          this.updatefeejixiao(param);
          this.gridOptions.api.refreshCells(params);
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '承兑贴息', field: 'chengduitiexi', width: 100, editable: true,
        onCellValueChanged: (params) => {
          let param = null;
          param = { key: 'chengdui', value: params.newValue, feejixiaoid: params.data.id };
          this.updatefeejixiao(param);
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '欠款利息-未超期', field: 'weichaoqi', width: 110, editable: true,
        onCellValueChanged: (params) => {
          let param = null;
          param = { key: 'weichaoqi', value: params.newValue, feejixiaoid: params.data.id };
          this.updatefeejixiao(param);
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '欠款利息-超期', field: 'chaoqi', width: 100, editable: true,
        onCellValueChanged: (params) => {
          let param = null;
          param = { key: 'chaoqi', value: params.newValue, feejixiaoid: params.data.id };
          this.updatefeejixiao(param);
        }
      }
    ];
    this.listDetail();
  }

  ngOnInit() { }

  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    let user_ = this.storage.getObject('cuser');
    this.erpkaoheapi.jixiaofee(this.search).then((data) => {
      console.log(this.storage.getObject('cuser'));
      if (user_.id === 650 || user_.id === 657 || user_.id === 656) {
        data.forEach(element => {
          element.jixiaofee = null;
          element.yunzafee = null;
          element.wupiaofee = null;
          element.yanqitihuo = null;
          element.dingjinfanxi = null;
          if (user_.id === 650) {
            element.gongguanbaoxiao = null;
            element.chengduitiexi = null;
          } else if (user_.id === 657) {
            element.chengduitiexi = null;
            element.chaoqi = null;
            element.weichaoqi = null;
          } else if (user_.id === 656) {
            element.gongguanbaoxiao = null;
            element.chaoqi = null;
            element.weichaoqi = null;
          }
        });
      }
      this.gridOptions.api.setRowData(data);
    });
  }
  updatefeejixiao(param) {
    this.erpkaoheapi.updatefeejixiao(param).then(data => {
      this.listDetail();
    })
  }


}
