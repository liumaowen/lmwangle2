import { Component, OnInit } from '@angular/core';

import { UserapiService } from '../../../dnn/service/userapi.service';
import { StorageService } from '../../../dnn/service/storage.service';

const sweetalert = require('sweetalert');

@Component({
    selector: 'app-user-agent',
    templateUrl: './user-agent.component.html',
    styleUrls: ['./user-agent.component.scss']
})
export class UserAgentComponent implements OnInit {

    val: any;

    results: any[];

    selectUser: string = "代理";

    selectUse: object;

    commonAgentNames: object[] = [];

    constructor(private storage: StorageService, private userApi: UserapiService) {

        let current = this.storage.getObject("cuser");
        if (!current) {
            this.userApi.userInfo2().then(data => {
                let user = data;
                this.storage.setObject('cuser', user);
                current = user;
                this.commonAgentNames = this.storage.getObject("permanent_commonAgentNames" + current.aid);
            }, err => {
                console.log(err)
            });
        } else {
            if (!(current.aadmin || current.agent)) {
                return;
            }
            this.commonAgentNames = this.storage.getObject("permanent_commonAgentNames" + current.aid);
        }
        console.log('commonAgentNames', this.commonAgentNames);
    }

    ngOnInit() {
    }

    public search(value: any): void {
        let parms = { search: value.query };
        this.userApi.findAgent(parms).then(date => {
            this.results = [];
            date.json().forEach(element => {
                this.results.push({
                    name: element.realname,
                    code: element.id
                })
            });


        }, err => {
            console.log(err);

        });
    }

    select(val) {
        this.selectUser = "我要代理" + val.name;
        this.selectUse = val;
    }


    agentuser() {
        if (this.selectUse) {
            sweetalert({
                title: '你确定要代理吗？',
                text: '你即将代理' + this.selectUse['name'] + '办理业务！',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#23b7e5',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: false
            }, () => {
                let cuserid = { cuserid: this.selectUse["code"] }
                let current = this.storage.getObject("cuser");
                this.saveCommonAgentNames(this.selectUse, current.aid)
                this.reqAuser(cuserid);
            });
        } else {
            sweetalert('请填写代理人');
        }
    }

    reqAuser(cuserid) {
        this.userApi.agentUser(cuserid).then(date => {
            let data = date.json();
            this.storage.reomveOther();
            this.storage.set("token", data.token);
            // this.router.navigate(["home"]);
            location.reload();
        }, err => {
            console.log(err);

        })
    }

    //保存代理人信息
    saveCommonAgentNames(suser, uid) {
        let user = {};
        user['id'] = suser['code'];
        user['realname'] = suser['name'];
        this.commonAgentNames = this.storage.getObject("permanent_commonAgentNames" + uid);
        if (!this.commonAgentNames) {
            this.commonAgentNames = [];
            this.commonAgentNames.push(user);
        } else {
            let aName = false;
            for (let i = 0; i < this.commonAgentNames.length; i++) {
                if (this.commonAgentNames[i]["id"] == user['id']) {
                    aName = true;
                }
            }
            if (!aName) {
                this.commonAgentNames.push(user);
                // {"id":3565,"realname":"张珂琦"}{"name":"张立","code":514}
            }
        }
        this.storage.setObject("permanent_commonAgentNames" + uid, this.commonAgentNames);
    }

    everyAgentuser(e) {

        sweetalert({
            title: '你确定要代理吗？',
            text: '你即将代理' + e.realname + '办理业务！',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#23b7e5',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnConfirm: false
        }, () => {
            let cuserid = { cuserid: e.id }
            this.reqAuser(cuserid);
        });

    }

    //清除常用代理人
    clearAgentuser() {
        let current = this.storage.getObject("cuser");
        sweetalert({
            title: '你确定要清除全部代理人吗？',
            // text: '你即将代理'+ this.selectUse['name'] +'办理业务！',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#23b7e5',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnConfirm: false
        }, () => {
            this.storage.remove("permanent_commonAgentNames" + current.aid);
            this.commonAgentNames = this.storage.getObject("permanent_commonAgentNames" + current.aid);
            sweetalert.close();
        });
    }

}
