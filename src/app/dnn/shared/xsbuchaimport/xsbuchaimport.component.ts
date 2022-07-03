import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { XsbuchaapiService } from './../../../routes/xiaoshou/xsbuchaapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-xsbuchaimport',
  templateUrl: './xsbuchaimport.component.html',
  styleUrls: ['./xsbuchaimport.component.scss']
})
export class XsbuchaimportComponent implements OnInit {

  gridOptions: GridOptions;

  parentThis;

  maxDate = new Date();

  time = { start: new Date(), end: new Date() };

  requestparams = {};
  constructor(public bsModalRef: BsModalRef, public settings: SettingsService, private xsbuchaApi: XsbuchaapiService, private dadepipe: DatePipe, private toast: ToasterService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;

    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyername', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'sellername', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 260 },
      { cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'pertprice', width: 90 ,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 100 ,
      valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 120 ,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储号', field: 'storageno', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'shitidate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 90 }
    ];

  }

  ngOnInit() {
  }

  // ngAfterViewChecked() {
  //   if (this.parentThis) {
  //     console.log(123);
  //     this.requestparams = { buyerid: this.parentThis.xsbucha.buyerid, sellerid: this.parentThis.xsbucha.sellerid, billno: '', start: '', end: '', kunbaohao: '' };
  //   }
  //   // console.log("初始化2", this.bsModalRef.content);
  // }
  huoqua = true;
  getDetail() {
    if (this.huoqua) {
      this.requestparams = { buyerid: this.parentThis.xsbucha.buyerid, sellerid: this.parentThis.xsbucha.sellerid, billno: '', start: '', end: '', kunbaohao: '',id: this.parentThis.xsbucha.id}
      this.huoqua = false;
    }
    this.xsbuchaApi.querylist(this.requestparams).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }

  companys;
  query() {
    if (this.huoqua) {
      this.requestparams = { buyerid: this.parentThis.xsbucha.buyerid, sellerid: this.parentThis.xsbucha.sellerid, billno: '', start: '', end: '', kunbaohao: '',id:this.parentThis.xsbucha.id }
      this.huoqua = false;
    }
    // console.log(this.time['end'].getTime() > this.time['start'].getTime());
    if ((this.time['end'].getTime() < this.time['start'].getTime())) {
      this.toast.pop('warning', '结束时间不能小于开始时间，请重新选择');
      return '';
    }

    if (this.companys) {
      this.requestparams['buyerid'] = this.companys.code;
    }
    if (this.time['start']) {
      this.requestparams['start'] = this.dadepipe.transform(this.time['start'], 'y-MM-dd');
    }
    if (this.time['end']) {
      this.requestparams['end'] = this.dadepipe.transform(this.time['end'], 'y-MM-dd');
    }

    // 设定运行查询，再清除页面data变量	
    this.getDetail();
    this.hideDialog();
  }

  selectNull() {
    this.time = { start: new Date(), end: new Date() };
    this.requestparams = { buyerid: this.parentThis.xsbucha.buyerid, sellerid: this.parentThis.xsbucha.sellerid, billno: '', start: '', end: '', kunbaohao: '' };
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showDialog() {
    this.classicModal.show();
  }

  hideDialog() {
    this.classicModal.hide();
  }

  prices;

  tweight;

  tihuodetids;
  import() {
    if (this.huoqua) {
      this.requestparams = { buyerid: this.parentThis.xsbucha.buyerid, sellerid: this.parentThis.xsbucha.sellerid, billno: '', start: '', end: '', kunbaohao: '' }
      this.huoqua = false;
    }
    this.prices = {};
    this.tweight = '0';
    let tihuodetids = new Array();
    let tihuodets = this.gridOptions.api.getModel()['rowsToDisplay'];

    for (let i = 0; i < tihuodets.length; i++) {
      if (tihuodets[i].selected) {
        tihuodetids.push(tihuodets[i].data.tihuodetid);
        this.tweight = this.tweight.add(tihuodets[i].data.weight);
      }
    }
    console.log(tihuodetids);
    if (tihuodetids.length == 0) {
      this.toast.pop('warning', '请选择要引入的货物!');
      return;
    }
    this.tihuodetids = tihuodetids;
    //2017.05.24 修改补差单 cpf MOD start
    //			ngDialog.open({ 
    //		    	template:'views/xsbucha/xsbucha_price.html',
    //		    	scope: $scope,
    //		    	className: 'ngdialog-theme-default ngdialog-width-600',
    //		    	closeByDocument: false,
    //			    closeByEscape: false,
    //			    showClose:true
    //		    });
    this.create();
    //2017.05.24 修改补差单 end
  }

  create() {
    console.log('create', this.prices.tprice);
    //2017.05.24 修改补差单 cpf DEL start
    //    		if(!$scope.prices.tprice) {
    //    			Notify.alert("必须填写补差单价才可引入!",{status:'warning'});
    //				return;
    //    		}
    //2017.05.24 修改补差单 end
    //    		xsbuchaApi.import({id:$scope.$parent.xsbucha.id,tihuodetids:$scope.tihuodetids,price:$scope.prices.tprice,tweight:$scope.tweight}).$promise.then(function(data) {
    this.xsbuchaApi.import(this.parentThis.xsbucha.id, { id: this.parentThis.xsbucha.id, tihuodetids: this.tihuodetids, tweight: this.tweight }).then((data) => {
      // $scope.$emit('xsbuchaimport', data);
      this.parentThis.xsbuchaimport();
    });
  }

}
