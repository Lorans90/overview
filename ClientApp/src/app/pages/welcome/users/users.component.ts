import { Component, OnInit } from '@angular/core';
import { ChangeEvent } from '@lorenzhh/im-grid';
import { Observable, of } from 'rxjs';
import { columns } from 'src/app/shared/config/users.config';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  columns = columns;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.users$ = this.userService.getUsers();
  }

  created(changeEvent: ChangeEvent) {
    console.log(changeEvent);
    const user = changeEvent.row;

    user.id = 0;
    this.userService.addUser(user).subscribe(
      (response) => {
        changeEvent.track.next({
          data: response,
          action: changeEvent.action
        });
      },
      (error) => changeEvent.track.next({
        data: false,
        action: changeEvent.action
      })
    );
  }

  updated(changeEvent: ChangeEvent) {
    this.userService.updateUser(changeEvent.row).subscribe(
      (response) => changeEvent.track.next({
        data: response,
        action: changeEvent.action
      }),
      (error) => changeEvent.track.next({
        data: false,
        action: changeEvent.action
      }));
  }
}
