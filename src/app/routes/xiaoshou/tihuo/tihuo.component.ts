import { XiaoshouapiService } from './../xiaoshouapi.service';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-tihuo',
  templateUrl: './tihuo.component.html',
  styleUrls: ['./tihuo.component.scss']
})
export class TihuoComponent implements OnInit {
  params: { siji: any; sijiid: any; sijitel: any; chehao: any; transcompanyid: any; yunprice: any; ist: any; id: any; };

  // 获取表格信息
  singleData;

  // 运输类型
  types = [{ label: '请选择运输类型', value: '' }, { label: '自提', value: 0 }, { label: '代运', value: 1 }];

  buyer;

  suser;

  // 提单状态
  // tslint:disable-next-line:max-line-length
  status = [{ label: '请选择订单状态', value: '' }, { label: '已安排发货', value: 1 }, { label: '待付款', value: 2 }, { label: '货物已出库', value: 3 }, { label: '已作废', value: 4 }];

  // 查询条件
  querys = { pagenum: 1, isonline: '0', pagesize: 10 };

  constructor(private toast: ToasterService, private tihuoApi: XiaoshouapiService) {
    this.querydata();
  }

  ngOnInit() {
  }

  //分页点击查询
  pageChanged(event: any): void {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.querydata();
  };

  totalItems;

  public currentPage: number = 1;
  querydata() {
    this.tihuoApi.query(this.querys).then((data) => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    })
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('classicModal') private classicModal: ModalDirective;

  // 打开查询弹窗
  openDialog() {
    this.classicModal.show();
  }

  // 关闭查询弹窗
  closeDialog() {
    this.classicModal.hide();
  }

  // 查询按钮
  select() {
    if (this.suser) {
      this.querys['cuserid'] = this.suser['code'];
    }
    if (this.buyer) {
      this.querys['buyerid'] = this.buyer['code'];
    }
    console.log(this.querys);
    this.querydata();
    this.closeDialog();
  }

  // 重选按钮
  selectNull() {
    this.querys = { pagenum: 1, isonline: '0', pagesize: 10 };
    this.buyer = {};
    this.suser = {};
  }

  // 修改提货人
  modifytihuoren(model) {
    console.log(model);
    if (model.tihuotype != 0) {
      this.toast.pop('warning', '非普通提货单不允许修改提货人');
      return '';
    }
    // 弹出修改提货人信息的编辑框
    // tslint:disable-next-line:max-line-length
    this.params = { siji: model.siji, sijiid: model.sijiid, sijitel: model.sijitel, chehao: model.chehao, transcompanyid: model.transcompanyid, yunprice: model.yunprice, ist: model.ist, id: model.id };// 得到要修改的司机信息
    if (model.status == 1) {
    } else {
      this.toast.pop('warning', '只允许修改状态为‘已安排发货’的提货人信息');
    }
  };


  canceltihuo(model) {
    if (model.status != 3 && model.status != 4) {// 如果status==3的时候代表提货单已经完成则不能作废了,作废了的提单不能再次作废
      sweetalert({
        title: '你确定要将该提单取消吗?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#23b7e5',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnConfirm: false
      }, () => {
        this.tihuoApi.canceltihuo({ id: model.id }).then(() => {
          this.toast.pop('success', '提货单成功取消'); // 弹出提示信息
          this.querydata(); // 刷新列表页面
        });
        sweetalert.close();
      });
    } else {
      this.toast.pop('warning', '提货单不能取消了'); // 弹出提示信息
    }
  }
}
