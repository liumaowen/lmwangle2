import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { BpriceapiService } from './../bpriceapi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bprice',
  templateUrl: './bprice.component.html',
  styleUrls: ['./bprice.component.scss']
})
export class BpriceComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;

  model = {};

  // 调价获取的参数
  params = {};

  // 根据gnid查找品名下的产地
  chandis = [];

  gns = [{ value: '', label: '请选择品名' },
  { value: 3, label: '彩涂' },
  { value: 4, label: '镀锌' },
  { value: 5, label: '镀铝锌' }];

  gridOptions: GridOptions;

  constructor(public settings: SettingsService,
    private toast: ToasterService,
    private router: Router,
    private classifyAPi: ClassifyApiService,
    private bpriceApi: BpriceapiService) {
    this.gridOptions = {
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      suppressRowClickSelection: false,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 50, suppressMenu: true, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库地区', field: 'area', width: 120 },
      {
        headerName: '基础规格', cellStyle: { 'text-align': 'center' },
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houduname', width: 120 },
          { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'widthname', width: 120 },
          { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'ducengname', width: 120 },
          { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhiname', width: 120 }
        ]
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '价格', field: 'price', width: 110 }
    ];

    this.listDetail();
  }

  requestparams = {};

  // 获取网格中的数据
  listDetail() {
    this.bpriceApi.listBprice(this.requestparams).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }

  // 调价，首先判断是否是确实选中了，然后再进行调整价格
  changePrice() {
    const templog = {};
    const ids = new Array();
    const bprice = this.gridOptions.api.getSelectedRows();
    if (bprice.length > 0) {
      if (confirm('你确定要将选择的基价调整吗？')) {
        for (let i = 0; i < bprice.length; i++) {
          ids.push(bprice[i].id);
        }
        templog['bpricelogid'] = 0;
        templog['bpriceids'] = ids;
        templog['isv'] = true;
        // $state.go('app.bpricelogdet', { bpricelogid: 0, params: templog });
        this.router.navigate(['bpricelogdet', 0], { queryParams: { params: JSON.stringify(templog) } });
      }
    } else {
      this.toast.pop('warning', '请选择要调整的基价');
    }
  }

  // 添加基价
  addDialog() {
    this.showclassicModal();
  }


  getChandi(gnid) {
    this.classifyAPi.listBypid({ pid: gnid }).then((data) => {
      const chandilist = [{ label: '请选择产地', value: '' }];
      data.forEach(element => {
        chandilist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.chandis = chandilist;
    });
  }

  // 提交基价

  submitBprice() {
    if (!this.model['gnid']) {
      this.toast.pop('warning', '请选择品名');
      return '';
    }
    if (!this.model['chandiid']) {
      this.toast.pop('warning', '请选择产地');
      return '';
    }
    if (!this.model['comments']) {
      this.toast.pop('warning', '请选择备注');
      return '';
    }
    if (!this.model['price']) {
      this.toast.pop('warning', '请选择价格');
      return '';
    }
    if (confirm('你确定创建吗？')) {
      this.hideclassicModal();
      this.bpriceApi.create(this.model).then(() => {
        this.toast.pop('success', '基价添加成功');
        // Notify.alert("基价添加成功", { status: 'success' });
        this.listDetail();
      });
    }
  }

  // 取消选择
  uncheckAll() {
    this.gridOptions.api.deselectAll();
  };

  ngOnInit() {
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
