import { UserapiService } from '../../service/userapi.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wisk-usernamesearch',
  templateUrl: './wiskusernamesearch.component.html',
  styleUrls: ['./wiskusernamesearch.component.scss']
})
export class WiskusernamesearchComponent implements OnInit {

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
    this.userapi.usersearch3($event['query']).then(data=>{
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
