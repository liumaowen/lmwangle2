import { UserapiService } from './../../service/userapi.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wisk-usersearch',
  templateUrl: './wiskusersearch.component.html',
  styleUrls: ['./wiskusersearch.component.scss']
})
export class WiskusersearchComponent implements OnInit {

  userValue;

  @Output() userChange = new EventEmitter();

  @Input() disabled;

  @Input() placeholder = '输入业务员名称';

  @Input()

  get user(){
    if (this.userValue) {
      return this.userValue;
    } else {
      return '';
    }
  }
  set user(val){
    this.userValue = val;
    this.userChange.emit(this.userValue);
  }

  constructor(private userapi:UserapiService) { }

  ngOnInit() {
  }

  results;

  search($event){
    this.userapi.usersearch2($event['query']).then(data=>{
      this.results = [];
      data.json().forEach(element => {
        this.results.push({
          name: element.realname,
          code: element.id
        })
      });
    })
  }

}
