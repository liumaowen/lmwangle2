import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NoticeapiService } from 'app/routes/notice/noticeapi.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-noticedetail',
  templateUrl: './noticedetail.component.html',
  styleUrls: ['./noticedetail.component.scss']
})
export class NoticedetailComponent implements OnInit {
  start = new Date();
  end: Date;
  maxDate = new Date();
  model:any = {};

  id = this.route.params['value']['id'];

  constructor(private route: ActivatedRoute,
    private noticeApi: NoticeapiService,
    private router: Router,
    private toast: ToasterService,
    private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.getdetail();
  }
  getdetail() {
    this.noticeApi.get(this.id).then(data => {
      this.model = data.json();
      if (this.model['start']) {
        this.start = new Date(this.model['start']);
      }
      if (this.model['end']) {
        this.end = new Date(this.model['end']);
      }
    });
  }
  // 更新
  modifyModel() {
    if (!this.model['title']) {
      this.toast.pop('warning', '公告标题不能为空！');
      return;
    }
    if (!this.model['content']) {
      this.toast.pop('warning', '公告内容不能为空！');
      return;
    }
    if ((this.end.getTime() - this.start.getTime()) < 0) {
      this.toast.pop('warning', '结束时间不能小于开始时间！');
      return;
    }
    if ((this.end.getTime() - this.start.getTime()) === 0) {
      this.toast.pop('warning', '结束时间不能等于开始时间！');
      return;
    }
    this.model['start'] = this.datePipe.transform(this.start, 'yyyy-MM-dd HH:mm') + ':00';
    this.model['end'] = this.datePipe.transform(this.end, 'yyyy-MM-dd HH:mm') + ':00';
    if (confirm('你确定修改吗？')) {
      this.noticeApi.update(this.id, this.model).then((data) => {
        this.getdetail();
        this.toast.pop('success', '更新成功！');
      }, err => {this.getdetail(); });
    }
  }

  // 删除
  del() {
    if (confirm('你确定删除吗？')) {
      this.noticeApi.del(this.id).then((response) => {
        this.toast.pop('success', '删除成功');
        this.router.navigateByUrl('notice');
      });
    }
  }
}
