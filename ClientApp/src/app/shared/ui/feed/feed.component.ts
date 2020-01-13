
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ItemData {
  gender: string;
  name: Name;
  email: string;
  status: string;
}

interface Name {
  title: string;
  first: string;
  last: string;
}


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})

export class FeedComponent implements OnInit {

  @ViewChild('input', { static: true }) input: ElementRef;
  originalFeeds: BehaviorSubject<ItemData[]> = new BehaviorSubject<ItemData[]>([]);
  feeds: BehaviorSubject<ItemData[]> = new BehaviorSubject<ItemData[]>([]);
  statuses = ['error', 'warning', 'success'];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.originalFeeds.subscribe((data) => {
      this.filter();
    });
    this.fetchPage();
  }

  public fetchPage(): void {
    this.http.get<{ results: ItemData[] }>(
      `https://randomuser.me/api/?results=100&inc=name,gender,email,nat&noinfo`
    ).subscribe(data =>
      this.originalFeeds.next(
        data.results
          .map(result => ({
            ...result, status: this.statuses[this.random()]
          }))
      ));
  }

  filter() {
    const textValue = this.input.nativeElement.value;
    if (textValue) {
      return this.feeds.next(this.originalFeeds
        .value
        .filter(feed => (feed.name.last)
          .toString()
          .toLowerCase()
          .indexOf(
            textValue
              .toString()
              .toLowerCase()
          ) > -1));
    }

    return this.feeds.next(this.originalFeeds.value);
  }

  random() {
    return Math.floor(Math.random() * (2 - 0 + 1) + 0);
  }
}
