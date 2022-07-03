import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { StorageService } from './../../../dnn/service/storage.service';
import { DeptpriceapiService } from './../deptpriceapi.service';
import { ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deptpricedet',
  templateUrl: './deptpricedet.component.html',
  styleUrls: ['./deptpricedet.component.scss']
})
export class DeptpricedetComponent implements OnInit {

  isv = false;

  flag = {};

  deptpricemodel = {};

  data;

  gridOptions: GridOptions;

  priceList = new Array();

  constructor(public settings: SettingsService,
    private route: ActivatedRoute,
    private deptpriceApi: DeptpriceapiService,
    private toast: ToasterService,
    private router: Router,
    private storage: StorageService) {

    this.deptpricemodel = { cuser: {}, vuser: {} };

    this.gridOptions = {
      rowSelection: 'single',
      rowDeselection: true,
      suppressRowClickSelection: false,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      onCellValueChanged: (params) => { // 编辑后触发的事件，此处是编辑差价的触发事件。
        let price = {}; // 价格编辑，并且对编辑后的数据进行处理显示
        price['deptprice'] = params.data.adjustprice;
        price['origindeptprice'] = params.data.origindeptprice;
        price['cangkuid'] = params.data.cangkuid;
        price['gcid'] = params.data.gcid;
        for (let i = 0; i < this.priceList.length; i++) {
          if (this.priceList[i].cangkuid == params.data.cangkuid && this.priceList[i].gcid == params.data.gcid) {
            this.priceList.splice(i, 1); // 删除重复的
          }
        }
        this.priceList.push(price);
      },
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      },
    }

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'deptname', width: 90 },
      { cellStyle: { 'text-align': 'right' }, headerName: '原定价', field: 'origindeptprice', width: 90 ,
      valueFormatter: this.settings.valueFormatter2},
      {
        cellStyle: { 'text-align': 'right' }, suppressMenu: true, headerName: '<font color="red">机构价格</font>', field: 'adjustprice', width: 90,
        editable: true,
        cellRenderer: (params) => {
          if (/^[0-9]*$/.test(this.route.params['value']['id'])) {
            params.colDef.editable = false;
          }
          if (params.value === null || params.value === undefined) {
            return null;
          } else if (isNaN(params.value)) {
            return 'NaN';
          } else {
            return params.value;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'comments', width: 100 }]

    setTimeout(() => {
      this.listData();
    }, 500);

  }

  ngOnInit() {
  }

  listData() {
    console.log(this.route.params['value']['id']);

    if (/^[0-9]*$/.test(this.route.params['value']['id'])) {
      this.deptpriceApi.get(this.route.params['value']['id']).then((response) => {
        this.deptpricemodel = response['deptprice'];
        this.gridOptions.api.setRowData(response['list']);
      });
    } else {
      let params = JSON.parse(this.route.params['value']['id']);
      this.flag['subbmitbutton'] = true;
      this.data = params ? params : null;
      console.log(this.data);
      this.gridOptions.api.setRowData(this.data);
      this.deptpricemodel = { isv: false, isdel: false, cuser: this.storage.getObject('cuser'), cdate: new Date(), vuser: {} };
    }
  }

  // 修改完成之后进行提交
  save() {
    if (this.priceList.length > 0) {
      if (confirm('你将要调整‘' + this.priceList.length + '’个价格，确定调价吗？')) {
        let paramsData = { json: this.priceList };
        this.deptpriceApi.create(paramsData).then(data => {
          this.toast.pop('success', '调价成功');
          this.router.navigateByUrl('deptprice');
        })
      }
    } else {
      this.toast.pop('warning', '请你调整价格后提交');
      // Notify.alert("请你调整价格后提交", { status: 'warning' });
    }
  };

}
