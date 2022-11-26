import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FeedbackService } from '../feedback.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})

export class FeedbackComponent implements OnInit {
    @ViewChild('classifyModal') private classifyModal: ModalDirective;
    totalItems: any;
    singleData;
    public currentPage = 1;
    feedback= {};

    search = { pagenum: 1, pagesize: 10 };
    constructor(private feedbackApi: FeedbackService, private toast: ToasterService) {
        this.query();
    }
    ngOnInit() {
    }
    query() {
        this.feedbackApi.getlist(this.search).then(data => {
            // 获取到总条目
            this.totalItems = data.headers.get('total');
            // 获取到当前数据
            this.singleData = data.json();
        });
    }
    showDialog() {
        this.classifyModal.show();
    }
    // 分页点击查询
    pageChanged(event: any): void {
        console.log(event);
        this.search['pagenum'] = event.page;
        this.search['pagesize'] = event.itemsPerPage;
        this.query();
    }
    reply(item) {
        console.log(item);
        if (!this.feedback['reply']) {
            this.toast.pop('warning', '请填写回复内容！');
            return;
        }
        this.feedback['id'] = item.id;
        this.feedbackApi.reply(this.feedback).then(data => {
            this.toast.pop('success', '回复成功');
            this.query();
        });
    }
    change(event) {
        console.log(event.target.value);
        this.feedback['reply'] = event.target.value;
    }
}
