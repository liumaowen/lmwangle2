import { ModalDirective } from 'ngx-bootstrap/modal';
import { XiaoshouapiService } from './../xiaoshouapi.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ToasterService} from "angular2-toaster";

@Component({
  selector: 'app-ldtihuodetail',
  templateUrl: './ldtihuodetail.component.html',
  styleUrls: ['./ldtihuodetail.component.scss']
})
export class LdtihuodetailComponent implements OnInit {
//提货单id
  ldtihuoid:number;
  // 弹窗查询条件
  search = {};
  // 临调详情
  lindiao = {buyer:{},arrearspeople:{}};
  // 临调明细
  gridOptions: GridOptions;
  // 费用明细
  feegridOptions: GridOptions;
  constructor(public settings: SettingsService, private xiaoshouApi: XiaoshouapiService,private routes:ActivatedRoute, private toast:ToasterService, ) {
    //设置临调明细表
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowSelection: "multiple",
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };

    this.feegridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };

    this.feegridOptions.onGridReady = this.gridOptions.onGridReady = this.settings.onGridReady;
    this.feegridOptions.groupSuppressAutoColumn = this.gridOptions.groupSuppressAutoColumn = true;

    // 设置明细表表格数据
    this.gridOptions.columnDefs = [
      {cellStyle: {"text-align": "center"}, headerName: '选择',width: 56, checkboxSelection:true},
      {cellStyle: {"text-align": "center"}, headerName: '买方单位', field: 'buyer.name', width: 100},
      {cellStyle: {"text-align": "center"}, headerName: '品名', field: 'goodscode.gn', width: 90},
      {cellStyle: {"text-align": "center"}, headerName: '规格', field: 'goodscode.guige', width: 260},
      {cellStyle: {"text-align": "center"}, headerName: '仓库名称', field: 'tihuo.cangku.name', width: 100},
      {cellStyle: {"text-align": "center"}, headerName: '单价', field: 'pertprice', width: 90},
      {cellStyle: {"text-align": "center"}, headerName: '重量', field: 'weight', width: 100,editable : true,
       onCellValueChanged:params=>{
        let search={saleweight:params.newValue};
        this.xiaoshouApi.modifyWeight(params.data.id,search).then(data=>{
          this.toast.pop('success','重量修改成功！')
          this.getdetail();
        })
      }, cellRenderer:params=>{
        if(!params.data.isldmodify){
          params.data.editable=false;
        }
        return params.data.weight;
      }},
      {cellStyle: {"text-align": "center"}, headerName: '资源号', field: 'grno', width: 120},
      {cellStyle: {"text-align": "center"}, headerName: '配送方式', field: 'order.type | type', width: 100,
        cellRenderer:function(params){if(params.data.orderdet.order.type == 0){return "自提"}else{return "代运";}}},
      {cellStyle: {"text-align": "center"}, headerName: '货物状态', field: 'goodsstatus', width: 100,
        cellRenderer:function(params){
          if(null != params.data.status && 'true' == params.data.status.toString()){
            return "实提";
          }else if(null != params.data.status && 'false' == params.data.status.toString()){
            return "退回";
          }else{
            return "";
          }
        }},
      {cellStyle: {"text-align": "center"}, headerName: '实提人', field: 'shitiman.realname', width: 90},
      {cellStyle: {"text-align": "center"}, headerName: '是否退货', field: 'isxstuihuo', width: 90,
        cellRenderer:function(params){if(params.data.isxstuihuo){return "是"}else{return "否";}}},
      {cellStyle: {"text-align": "center"}, headerName: '是否补差', field: 'isxsbucha', width: 90,
        cellRenderer:function(params){if(params.data.isxsbucha){return "是"}else{return "否";}}},
      {cellStyle: {"text-align": "center"}, headerName: '仓储号', field: 'storageno', width: 90},
      {cellStyle: {"text-align": "center"}, headerName: '创建时间', field: 'tihuo.cdate', width: 100},
      {cellStyle: {"text-align": "center"}, headerName: '明细id', field: 'id', width: 100}
    ];

    // 设置费用明细的表格数据
    this.feegridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'id', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存数量', field: 'number', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存数量', field: 'number', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存数量', field: 'number', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存数量', field: 'number', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存总量', field: 'num', minWidth: 90 }
    ]
  }

  ngOnInit() {
    this.routes.params.subscribe(data=>{this.ldtihuoid= data['id'];});
    this.getdetail();
  }
  //获取主表和明细
  getdetail(){
    this.xiaoshouApi.getldtihuo(this.ldtihuoid).then(data=>{
      console.log('/////***********/////',data);
      this.lindiao=data.tihuo;
      this.gridOptions.api.setRowData(data.list);
    })
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  // 查询弹窗
  showDialog() {
    this.classicModal.show();
  }
  // 关闭查询弹窗
  hideDialog() {
    this.classicModal.hide();
  }
  // 查询条件
  query() {
    console.log(this.search)
  }
  // 重选按钮
  selectNull() {
    this.search = {};
  }
  //修改提货人
  modifytihuoren(){

  }
  //全选
  selectall(){
    this.gridOptions.api.selectAll();
  }
  //付款
  @ViewChild('tihuopaydialog') private tihuopaydialog: ModalDirective;
  paytihuoDialog(){

  }
  //欠款支付
  arrearspay(){

  }
  //退货
  returngoods(){

  }
  //实提
  finishtihuo(){

  }
  //撤销实提
  cancelShiti(){

  }
  //撤销提单
  chexiaotihuo(){

  }
  //添加费用
  addFeeDialog(){

  }
}
