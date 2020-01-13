import { Component } from '@angular/core';
import { wording } from 'src/app/core/wording';

@Component({
  selector: 'app-todo',
  templateUrl: './todo-widget.component.html',
  styleUrls: ['./todo-widget.component.scss']
})
export class TodoWidgetComponent {
  public wording = wording;

  todos = [
    {
      title: 'Christine',
      text: 'Invoice issued: INV04020, please check'
    },
    {
      title: 'Matilda',
      text: '10 days left to recieve the data'
    },
    {
      title: 'Edna',
      text: '1 day past redelivery: please create new list'
    },
    {
      title: 'Martin',
      text: '4 days past actual delivery: please enter or check bunkers on delivery'
    },
    {
      title: 'Ricarda',
      text: 'Advised redelivery today: please enter actual redelivery date',
    },
    {
      title: 'Alexandra',
      text: 'Invoice 3 days past due: INV04024',
    },
  ];

  constructor(
  ) { }

}

