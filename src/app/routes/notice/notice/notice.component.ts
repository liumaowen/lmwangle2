import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NoticeapiService } from 'app/routes/notice/noticeapi.service';
import { DatePipe } from '@angular/common';
const sweetalert = require('sweetalert');

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {
  start = new Date();
  end: Date;
  maxDate = new Date();
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;

  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  // 查询数据
  querys: object = { pagenum: 1, pagesize: 30 };


  constructor(private noticeApi: NoticeapiService, private toast: ToasterService, private datePipe: DatePipe) {
    this.querydata();
  }

  ngOnInit() {
  }

  // 分页点击查询数据
  pageChanged(event) {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.querydata();
  }

  // 查询时序表数据
  querydata() {
    this.noticeApi.query(this.querys).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = data.json();
    });
  }

  // 添加
  model = {};

  createDialog() {
    this.selectNull();
    this.showcreateModal();
  }

  addNotice() {
    if (!this.model['title']) {
      this.toast.pop('warning', '公告标题不能为空！');
      return;
    }
    if (!this.model['content']) {
      this.toast.pop('warning', '公告内容不能为空！');
      return;
    }
    if (!this.start) {
      this.toast.pop('warning', '开始时间不能为空！');
      return;
    }
    if (!this.end) {
      this.toast.pop('warning', '结束时间不能为空！');
      return;
    }
    this.model['start'] = this.datePipe.transform(this.start, 'yyyy-MM-dd HH:mm') + ':00';
    this.model['end'] = this.datePipe.transform(this.end, 'yyyy-MM-dd HH:mm') + ':00';
    if (new Date(this.model['start']).getTime() === new Date(this.model['end']).getTime()) {
      this.toast.pop('warning', '结束时间不能等于开始时间！');
      return;
    }
    this.model['isopen'] = true;
    if (confirm('你确定要添加吗？')) {
      this.noticeApi.create(this.model).then((response) => {
        this.hidecreateModal();
        this.toast.pop('success', '添加成功');
        this.querys['pagenum'] = 1;
        this.querydata();
      });
    }
  }

  // 重置条件
  selectNull() {
    delete this.querys['title'];
    // this.querys = { pagenum: 1, pagesize: 10 };
    this.model = {};
    this.start = new Date();
    this.end = null;
  }

  // 打开新页面
  openurl(url) {
    console.log(url);
    window.open(url);
  }

  // 查询页面
  queryDialog() {
    this.selectNull();
    this.showclassicModal();
  }

  query() {
    this.querys['pagenum'] = 1;
    this.querydata();
    this.hideclassicModal();
  }


  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  showcreateModal() {
    this.createModal.config.ignoreBackdropClick = true;
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }
  /**一键关闭 */
  close(model) {
    const modelparams = JSON.parse(JSON.stringify(model));
    sweetalert({
      title: '你确定要关闭公告吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      modelparams['isopen'] = false;
      this.noticeApi.update(modelparams['id'], modelparams).then((data) => {
        this.querydata();
        this.toast.pop('success', '关闭成功');
      });
      sweetalert.close();
    });
  }
}
