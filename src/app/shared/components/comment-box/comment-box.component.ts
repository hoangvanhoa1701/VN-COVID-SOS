import { Component, OnInit, Input } from '@angular/core';
import { IComment } from 'src/typings';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent implements OnInit {
  @Input() comment?: IComment;

  constructor() {}

  ngOnInit(): void {}
}
