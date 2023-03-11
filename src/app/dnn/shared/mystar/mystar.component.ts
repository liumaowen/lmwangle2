import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mystar',
  templateUrl: './mystar.component.html',
  styleUrls: ['./mystar.component.scss']
})
export class MystarComponent implements OnInit {
  _starsRating = 1;
  public stars: boolean[];
  @Input() readonly = false;
  @Input() width = 35;
  get starsRating(): number {
    return this._starsRating;
  }
  @Input() set starsRating(value: number){
    this._starsRating = value;
    this.rating();
  }
  @Output()
  starsRatingChange: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.rating();
  }

  public rating(): void {
    this.stars = [];
    for (let i = 0; i < 5; i++) {
      this.stars.push(i < this.starsRating);
    }
  }
  onClick(i) {
    if (!this.readonly) {
      this.starsRating = i + 1;
      this.rating();
      console.log(this.starsRating);
      this.starsRatingChange.emit(this.starsRating);
    }
  }

}
