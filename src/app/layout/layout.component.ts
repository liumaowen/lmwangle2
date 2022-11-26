import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpInterceptorService } from 'app/dnn/service/http-interceptor.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { ExamapiService } from './exam/examapi.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    @ViewChild('examModal') private examModal: ModalDirective;
    @ViewChild('priceAddModal') private priceAddModal: ModalDirective;
    loading = false;
    isshowInput = false;
    question: any = {};
    nextquestion: any = {};
    model: any = {};
    answers: any = [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' },
    { label: 'C', value: 'C' }, { label: 'D', value: 'D' }];
    answer: any = {};
    isnext = false;
    correctAnswer = null;
    beizhu = null;
    gnchandis: any[];
    params: any = { price: null, chandiid: null };
    mygnchandis = [];
    orgid: any;
    // showFestival = false; // 是否显示节日快乐
    // festivals = []; // 阳历节日
    isaddprice = true;
    constructor(
        private toast: ToasterService,
        public examapiService: ExamapiService,
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
    }
    ngOnInit() {
        HttpInterceptorService.getHttpLoading().subscribe(data => {
            this.loading = data;
        });
        /**订阅是否需要答题 */
        HttpInterceptorService.getIsExam().subscribe(data => {
            if (data) {
                // this.getfestival();
                setTimeout(() => {
                    this.showmodal();
                }, 0);
            }
        });
    }
    /**关闭试题弹窗 */
    hideExamModal() {
        this.examModal.hide();
        this.resetBalloon();
        this.priceAddModal.hide();
        // this.showFestival = false;
        // if (this.isaddprice) {
        //     this.storage.examcount = 0;
        // }
    }
    /**重置 */
    reset() {
        this.question = {};
        this.model = {};
        this.nextquestion = {};
        this.answer = {};
        this.isnext = false;
        this.correctAnswer = null;
        this.beizhu = null;
        this.orgid = null;
    }
    /**获取试题数据 */
    getquestion() {
        this.examapiService.getquestion().then(data => {
            console.log(data);
            this.orgid = data.orgid;
            this.question = data;
            this.answers = [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' },
            { label: 'C', value: 'C' }, { label: 'D', value: 'D' }];
            if (this.question['questiontype'] === 2) {
                this.answers = [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }];
            }
            // if (this.orgid === 22350 || this.orgid === 22427) {
            //     this.priceAddModal.config.ignoreBackdropClick = true;
            //     this.priceAddModal.show();
            //     this.createBalloons(100);
            // } else {
            // this.examModal.config.ignoreBackdropClick = true;
            // this.examModal.show();
            // this.createBalloons(100);
            // }
        });
    }
    /**显示试题弹窗 */
    showmodal() {
        this.reset();
        this.getquestion();
        this.examModal.config.ignoreBackdropClick = true;
        this.examModal.show();
        this.createBalloons(100);
        // this.showFestival = true;
    }
    /**保存 */
    save() {
        if (!this.model['answer']) {
            this.toast.pop('warning', '请选择答案');
            return;
        }
        this.model['id'] = this.question.id;
        this.examapiService.save(this.model).then(data => {
            if (data['result']) {
                this.toast.pop('success', '恭喜你答对了！');
                this.hideExamModal();
            } else {
                if (data['answer']) { // 答错了
                    this.isnext = true;
                    this.correctAnswer = data['answer'];
                    this.beizhu = data['beizhu'];
                    this.nextquestion = data['question'];
                } else { // 答对了前一道题
                    this.nextquestion = data['question'];
                    this.next();
                }
            }
        });
    }
    /**多选改变事件 */
    checkboxchange(event) {
        const array = [];
        for (const item in this.answer) {
            if (this.answer[item]) {
                if (Number(item) === 0) {
                    array.push('A');
                }
                if (Number(item) === 1) {
                    array.push('B');
                }
                if (Number(item) === 2) {
                    array.push('C');
                }
                if (Number(item) === 3) {
                    array.push('D');
                }
            }
        }
        this.model.answer = array.join('');
    }
    /**继续答题 */
    next() {
        this.model = {};
        this.answer = {};
        this.question = this.nextquestion;
        this.answers = [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' },
        { label: 'C', value: 'C' }, { label: 'D', value: 'D' }];
        if (this.question['questiontype'] === 2) {
            this.answers = [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }];
        }
        this.correctAnswer = null;
        this.isnext = false;
    }
    /**满屏气球 */
    createBalloons(num) {
        const balloonContainer = this.elementRef.nativeElement.querySelector('.balloon-container');
        this.renderer.setStyle(balloonContainer, 'z-index', 222);
        for (let i = num; i > 0; i--) {
            const balloon = this.renderer.createElement('div');
            this.renderer.addClass(balloon, 'ballitem');
            balloon.style.cssText = this.getRandomStyles();
            this.renderer.appendChild(balloonContainer, balloon);
        }
    }
    random(num) {
        return Math.floor(Math.random() * num);
    }
    getRandomStyles() {
        const r = this.random(255);
        const g = this.random(255);
        const b = this.random(255);
        const mt = this.random(200);
        const ml = this.random(50);
        const dur = this.random(5) + 10;
        return `
        background-color: rgba(${r},${g},${b},0.7);
        color: rgba(${r},${g},${b},0.7);
        box-shadow: inset -7px -3px 10px rgba(${r - 10},${g - 10},${b - 10},0.7);
        margin: ${mt}px 0 0 ${ml}px;
        animation: float ${dur}s ease-in infinite;`;
    }
    /**清空气球 */
    resetBalloon() {
        const balloonContainer = this.elementRef.nativeElement.querySelector('.balloon-container');
        const ballitems = this.elementRef.nativeElement.querySelectorAll('.balloon-container .ballitem');
        ballitems.forEach(element => {
            this.renderer.removeChild(balloonContainer, element);
        });
        this.renderer.setStyle(balloonContainer, 'z-index', -1111111111);
    }
    selectegangchang(e) {
        console.log(e);
        this.params.chandiid = e.id;
        this.params.chandi = e.text;
    }
    /**创建 */
    ceateModel() {
        if (!this.params.chandiid) {
            this.toast.pop('warning', '请选择产地');
            return;
        }
        if (!this.params.price) {
            this.toast.pop('warning', '请输入价格');
            return;
        }
        this.examapiService.saveprice({ mygnchandi: this.mygnchandis }).then(data => {
            this.toast.pop('success', '添加成功！');
        });

    }
    deletegnchandi(id) {
        for (let index = 0; index < this.mygnchandis.length; index++) {
            if (this.mygnchandis[index].chandiid === id) {
                this.mygnchandis.splice(index, 1); // 删除重复的
            }
        }
    }
    addpricetodb() {
        if (!this.params.chandiid) {
            this.toast.pop('warning', '请选择产地');
            return;
        }
        if (!this.params.price) {
            this.toast.pop('warning', '请输入价格');
            return;
        }
        let istwochandi = false;
        this.mygnchandis.forEach(e => {
            if (this.params.chandiid === e.chandiid) {
                istwochandi = true;
            }
        });
        if (istwochandi) {
            this.toast.pop('warning', '不允许添加相同产地价格多次！！！');
            return;
        }
        this.mygnchandis.push({ chandiid: this.params.chandiid, gnchandi: this.params.chandi, price: this.params.price });
        this.isshowInput = !this.isshowInput;
    }
    showInput() {
        this.isshowInput = !this.isshowInput;
    }
}
 /**获取阳历节日 */
    // getfestival() {
    //     const calendar = new Date();
    //     const month = calendar.getMonth();
    //     const date = calendar.getDate();
    //     if ((month === 0) && (date === 1)) {
    //       this.festivals = '元旦快乐'.split('');
    //     } else if ((month === 1) && (date === 14)) {
    //       this.festivals = '情人节快乐'.split('');
    //     } else if ((month === 2) && (date === 13)) {
    //       this.festivals = '植树节快乐'.split('');
    //     } else if ((month === 3) && (date === 1)) {
    //       this.festivals = '愚人节快乐'.split('');
    //     } else if ((month === 4) && (date === 1)) {
    //       this.festivals = '劳动节快乐'.split('');
    //     } else if ((month === 4) && (date === 4)) {
    //       this.festivals = '青年节快乐'.split('');
    //     } else if ((month === 5) && (date === 1)) {
    //         this.festivals = '儿童节快乐'.split('');
    //     } else if ((month === 9) && (date === 1)) {
    //       this.festivals = '国庆节快乐'.split('');
    //     } else if ((month === 11) && (date === 24)) {
    //       this.festivals = '平安夜快乐'.split('');
    //     } else if ((month === 11) && (date === 25)) {
    //       this.festivals = '圣诞节快乐'.split('');
    //     } else {
    //         this.festivals = [];
    //     }
    // }