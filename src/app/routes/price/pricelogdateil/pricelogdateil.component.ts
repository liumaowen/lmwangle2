import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { PriceapiService } from './../priceapi.service';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit } from '@angular/core';
const sweetalert = require('sweetalert');

@Component({
  selector: 'app-pricelogdateil',
  templateUrl: './pricelogdateil.component.html',
  styleUrls: ['./pricelogdateil.component.scss']
})
export class PricelogdateilComponent implements OnInit {

  // 作为临时的存储对象，存储调价单的主表信息
  pricelogmodel = { cuser: {}, vuser: {} };

  // 控制显示提交定价按钮的显示不显示，默认是显示的
  isv = true;

  // 默认可以加备注
  edit = true;

  flag = { verify: false };

  gridOptions: GridOptions;

  // 存储修改后的差价
  priceList = new Array();
  // 是否是资源中心项目/材料机构
  isziyuanzhongxin = false;
  // 默认是显示审核按钮的
  vflag = true;
  isshelves = [{ label: '请选择', value: '' }, { label: '是', value: true }, { label: '否', value: false }];
  constructor(public settings: SettingsService,
    private userApi: UserapiService,
    private pricelogdetApi: PriceapiService,
    private toast: ToasterService,
    private router: Router,
    private route: ActivatedRoute) {

    this.gridOptions = {
      rowSelection: 'single',
      // 排序
      enableSorting: true,
      rowDeselection: true,
      suppressRowClickSelection: false,
      singleClickEdit: true,
      enableColResize: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      // 编辑后触发的事件，此处是编辑差价的触发事件。
      // onCellValueChanged: (params) => {
      //   // 价格编辑，并且对编辑后的数据进行处理显示
      //   const price = {};
      //   // 判断priceid是不是空的如果是空的则使用id否则用priceid
      //   if (params.data.priceid) {
      //     // 因为调价和重新调价所请求数据的来源不同
      //     price['id'] = params.data.priceid;
      //   } else {
      //     price['id'] = params.data.id;
      //   }
      //   price['diff'] = params.data.diffbprice;
      //   for (let i = 0; i < this.priceList.length; i++) {
      //     if (this.priceList[i].id == params.data.id) {
      //       this.priceList.splice(i, 1); // 删除重复的
      //     }
      //   }
      //   console.log(params);
      //   this.priceList.push(price);
      //   if (this.route.queryParams['value']['isdel']) {
      //     params.data.endprice = parseFloat(params.data.dprice.bprice.price)
      //       + parseFloat(params.data.diffbprice);
      //     params.data.range = parseFloat(params.data.endprice)
      //       - parseFloat(params.data.price);
      //   } else {
      //     params.data.endprice = parseFloat(params.data.bprice.price)
      //       + parseFloat(params.data.diffbprice);
      //     params.data.range = parseFloat(params.data.endprice)
      //       - parseFloat(params.data.price);
      //   }
      //   params.api.refreshView();
      // },
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      }
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'dprice.gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'dprice.chandi', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'dprice.cangku', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'dprice.houdu', width: 120,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'dprice.width', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色/锌层', field: 'dprice.color', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'dprice.caizhi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'dprice.duceng', width: 120 },
      {
        cellStyle: { 'text-align': 'right' }, suppressMenu: true, headerName: '<font color="red">线下价差</font>',
        field: 'diff', width: 90, editable: true,
        cellRenderer: (params) => {
          if ('0' !== this.route.queryParams['value']['pricelogid']) {
            params.colDef.editable = false;
          }
          if (params.value === null || params.value === undefined) {
            return null;
          } else if (isNaN(params.value)) {
            return 'NaN';
          } else {
            return params.value;
          }
        }, newValueHandler: (params) => {
          if (!params.newValue) {
            return;
          }
          let price = {};
          for (let i = 0; i < this.priceList.length; i++) {
            if (this.priceList[i].id === params.data.id) {
              price = this.priceList[i];
              this.priceList.splice(i, 1); // 删除重复的
              break;
            }
          }
          if (params.data.priceid) {
            price['id'] = params.data.priceid;
          } else {
            price['id'] = params.data.id;
          }

          price['diff'] = params.newValue;
          this.priceList.push(price);
          if (this.route.queryParams['value']['isdel']) {
            params.data.endprice = parseFloat(params.data.dprice.price) + parseFloat(params.newValue);
            params.data.range = parseFloat(params.data.endprice) - parseFloat(params.data.price);
          } else {
            params.data.endprice = parseFloat(params.data.price) + parseFloat(params.newValue);
            params.data.range = parseFloat(params.data.endprice) - parseFloat(params.data.price);
            if (params.data.olprice) {
              params.data.olendprice = parseFloat(params.data.price) + parseFloat(params.newValue)
                + parseFloat(params.data.oldiff ? params.data.oldiff : '0');
            }
          }
          params.data.diff = params.newValue;
          params.api.redrawRows();
          return true;
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '调价前价格', field: 'price', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '调价后价格', field: 'endprice', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '调价幅度', field: 'range', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '<font color="red">线上价差</font>',
        field: 'oldiff', width: 110, editable: true,
        cellRenderer: (params) => {
          if ('0' !== this.route.queryParams['value']['pricelogid']) {
            params.colDef.editable = false;
          }
          if (params.value === null || params.value === undefined) {
            return null;
          } else if (isNaN(params.value)) {
            return 'NaN';
          } else {
            return params.value;
          }
        }, newValueHandler: (params) => {
          if (!params.newValue) {
            return;
          }
          let price = {};
          for (let i = 0; i < this.priceList.length; i++) {
            if (this.priceList[i].id === params.data.id) {
              price = this.priceList[i];
              this.priceList.splice(i, 1); // 删除重复的
              break;
            }
          }

          if (params.data.priceid) {
            price['id'] = params.data.priceid;
          } else {
            price['id'] = params.data.id;
          }
          price['oldiff'] = params.newValue;
          this.priceList.push(price);
          if (this.route.queryParams['value']['isdel']) {
            params.data.olendprice = parseFloat(params.data.price) + parseFloat(params.newValue);
          } else {
            params.data.olendprice = parseFloat(params.data.price) + parseFloat(params.newValue)
              + parseFloat(params.data.diff ? params.data.diff : '0');
          }
          params.data.oldiff = params.newValue;
          params.api.redrawRows();
          return true;
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '线上原价格', field: 'olprice', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '线上调价后价格', field: 'olendprice', width: 110, editable: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'del', width: 80,
        cellRenderer: (params) => {
          if (!params.data.isv) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => { // 编辑后触发的事件，此处是编辑差价的触发事件。
          this.pricelogdetApi.delpricelogdet(params.data.id).then(() => {
            this.toast.pop('success', '删除成功！');
            this.listpricelogdet();
          });
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'dprice.comments', width: 100 }];

    this.listpricelogdet();
  }
  // // 判断priceid是不是空的如果是空的则使用id否则用priceid
  // if (params.data.priceid) {
  //   // 因为调价和重新调价所请求数据的来源不同
  //   price['id'] = params.data.priceid;
  // } else {
  //   price['id'] = params.data.id;
  // }
  ngOnInit() {
  }

  listpricelogdet() {
    // 首先判断是不是进行调价的显示
    if (this.route.params['value']['id'] === '0') {
      // 创建新的调价记录单
      this.pricelogmodel['isdel'] = false;
      this.pricelogmodel['cdate'] = new Date();
      this.pricelogmodel['isv'] = false;
      this.pricelogmodel['beizhu'] = null;
      this.edit = true; // 默认可以加备注
      this.userApi.userInfo2().then(data => {
        this.pricelogmodel['cuser'] = data;
        if (data['orgid'] === 22427 || data['orgid'] === 22350 || data['orgid'] === 21587) {
          this.isziyuanzhongxin = true;
        } else {
          this.isziyuanzhongxin = false;
        }
      })
      const params = {};
      console.log(this.route.params)
      params['priceid'] = this.route.queryParams['value']['priceids'];

      this.pricelogdetApi.getpriceSelect(params).then((data) => {
        // 获取调价记录单中的明细表中的数据
        for (let i = 0; i < data.length; i++) {
          data[i].dprice = {
            gn: data[i].gn,
            chandi: data[i].chandi,
            cangku: data[i].cangku,
            houdu: data[i].houdu,
            width: data[i].width,
            color: data[i].color,
            caizhi: data[i].caizhi,
            duceng: data[i].duceng
          };
        }
        console.log(data);
        this.gridOptions.api.setRowData(data);
      });
    } else {
      this.pricelogdetApi.getpriceLogAndDet(this.route.params['value']['id']).then((resource) => {
        // 一般的查看和审核记录单明细页面,和重新定价页面
        this.isv = this.route.queryParams['value']['isv'];
        this.userApi.userInfo2().then(data => {
          if (data['orgid'] === 22427 || data['orgid'] === 22350 || data['orgid'] === 21587) {
            this.isziyuanzhongxin = true;
          } else {
            this.isziyuanzhongxin = false;
          }
        });
        this.vflag = true; // 默认是显示审核按钮的
        this.edit = false; // 不可编辑
        if (resource['pricelog'].isv) {
          this.vflag = false;
        }// 判断是否审核，如果审核了那么审核的按钮则不显示，没有审核的则显示审核的按钮
        this.pricelogmodel = resource['pricelog'];
        let jiagevalue = '      ';
        if (this.pricelogmodel['tiaojiadesc']) {
          if (this.pricelogmodel['isdifftiao'] === 1) {
            if (this.pricelogmodel['tiaozhengvalue'] > 0) {
              jiagevalue = '价格上调' + this.pricelogmodel['tiaozhengvalue'];
            } else {
              jiagevalue = '价格下调' + this.pricelogmodel['tiaozhengvalue'];
            }
          } else {
            jiagevalue = '价格调整' + this.pricelogmodel['tiaozhengvalue'];
          }
          this.pricelogmodel['tiaojiadesc'] = this.pricelogmodel['tiaojiadesc'] + jiagevalue;
        }
        const data = resource['list']; // 给主表信息赋值和list赋值
        for (let i = 0; i < data.length; i++) {
          data[i].baseprice = data[i].baseprice;
          data[i].diffbprice = data[i].diff;
          data[i].endprice = data[i].jiage;
          data[i].price = data[i].preprice;
          data[i].range = parseFloat(data[i].endprice) - parseFloat(data[i].price);
          data[i].olendprice = data[i].olprice;
          data[i].olprice = data[i].olpreprice;
        }
        console.log(data);
        this.gridOptions.api.setRowData(data);
      });
    }
  }

  // 修改完成之后进行提交
  save() {
    if (this.priceList.length > 0) {
      if (this.isziyuanzhongxin && (this.pricelogmodel['isshelve']==='' || this.pricelogmodel['isshelve']===undefined || this.pricelogmodel['isshelve']===null)) {
        this.toast.pop('warning', '请选择是否上架后再提交');
        return;
      }
      let msg = '你将要调整‘' + this.priceList.length + '’个价格，确定调价吗？';
      if (this.pricelogmodel['isshelve']) {
        msg = '你将要调整‘' + this.priceList.length + '’个价格，审批后会同时上架，确定调价吗？';
      }
      if (confirm(msg)) {
        const paramsData = {};
        paramsData['pricelog'] = this.pricelogmodel;
        paramsData['pricelogDet'] = this.priceList;
        console.log(this.pricelogmodel);      
        console.log(this.priceList);  
        this.pricelogdetApi.judge(paramsData).then((response) => {
          if(response['islowprice']){
            if(confirm('该调价单中，存在宽度：'+ response['width'] +'厚度：'+response['houdu']+'重量：'+response['weight']+'捆包号：'+response['kunbaohao']+'钢卷，定价'+response['gjdprice']+'元，原内采单价'+response['gjyprice']+'元')){
              this.pricelogdetApi.createpricelog(paramsData).then(data => {
                this.isv = false;
                this.toast.pop('success', '调价成功，请等待领导审核！');
                this.router.navigateByUrl('pricelog');
              })
            }            
          }else{
            this.pricelogdetApi.createpricelog(paramsData).then(data => {
              this.isv = false;
              this.toast.pop('success', '调价成功，请等待领导审核！');
              this.router.navigateByUrl('pricelog');
            })
          }
        });
      }    
    } else {
      this.toast.pop('warning', '请你调整价格后提交');
    }
  }

  // 审核
  auditprice() {
    if (confirm('你确定提交吗？')) {
      this.flag.verify = true;
      this.pricelogdetApi.auditprice({
        pricelogid: this.route.params['value']['id']
      }).then(data => {
        this.toast.pop('success', '审核成功');
        this.flag.verify = true;
      });
    }
  }

  // 不同意审核
  notagree() {
    if (confirm('你确定提交吗？')) {
      this.pricelogdetApi.notagree({
        pricelogid: this.route.params['value']['id']
      }).then(data => {
        this.router.navigateByUrl('pricelog');
        this.toast.pop('success', '提交的审核未能通过');
      });
    }
  }

  // 返回
  back() {
    if (this.route.queryParams['value']['pricelogid'] === 0) {
      // $state.go("app.price");// 调价的时候跳转的价格列表页面
      // 调价的时候跳转的价格列表页面
      this.router.navigateByUrl('price');
    } else {
      // $state.go("app.pricelog");
      // 重新定价和查看审核的时候返回的时候是返回调价单列表页面
      this.router.navigateByUrl('pricelog');
    }
  }

}
