import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-userproject',
  templateUrl: './userproject.component.html',
  styleUrls: ['./userproject.component.scss']
})
export class UserprojectComponent implements OnInit {

  @ViewChild('createModal') private createModal: ModalDirective;

  @ViewChild('classicModal') private classicModal: ModalDirective;

  model = {};

  start;

  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  querys = { pagenum: 1, pagesize: 10 };

  userid = this.route.parent.params['value']['id'];

  constructor(private route: ActivatedRoute,
    private toast: ToasterService,
    private datePipe: DatePipe,
    private userApi: UserapiService) {
    this.querydata();
  }

  ngOnInit() {
  }

  // 查询时序表数据
  querydata() {
    this.userApi.listProjectByUserid(this.route.parent.params['value']['id']).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = data.json();
    });
  }

  // 分页点击查询数据
  pageChanged(event) {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.querydata();
  }

  // 启动添加对话框
  createDialog() {
    this.showcreateModal();
  }

  // 重置条件
  selectNull() {
    this.querys = { pagenum: 1, pagesize: 10 };
    this.model = {};
  }

  // 添加工程
  addProject() {
    if (!this.model['projectName']) {
      this.toast.pop('warning', '请填写工程名');
      return;
    }
    if (!this.start) {
      this.toast.pop('warning', '请选择建设日期');
      return;
    } else {
      this.model['date'] = this.datePipe.transform(this.start, 'y-MM-dd');
    }
    if (!this.model['address']) {
      this.toast.pop('warning', '请填写建设地点');
      return;
    }
    if (!this.model['chandi']) {
      this.toast.pop('warning', '请填写产地');
      return;
    }
    if (!this.model['type']) {
      this.toast.pop('warning', '请填写面漆种类');
      return;
    }
    if (!this.model['count']) {
      this.toast.pop('warning', '请填写订货数量');
      return;
    }
    if (confirm('确定要添加?')) {
      this.userApi.createProject(this.model).then((model) => {
        this.querydata();
        this.hidecreateModal();
      });
    }
  }

  // 启动查询对话框
  queryDialog() {
    this.showclassicModal();
  }

  // 查询
  query() {
    this.querys['pagenum'] = 1;
    this.querydata();
    this.hideclassicModal();
  }

  // 删除
  delProject(projectid) {
    if (confirm('你确定删除吗？')) {
      this.userApi.delProject(parseInt(projectid)).then(data => {
        this.toast.pop('success', '删除成功');
        this.querys['pagenum'] = 1;
        this.querydata();
      });
    }
  }

  showcreateModal() {
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
