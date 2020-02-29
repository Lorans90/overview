import { Component, OnInit } from '@angular/core';
import { usersGridConfig } from 'src/app/shared/config/users.config';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  gridConfig = usersGridConfig();
  users$: Observable<User[]>;
  constructor(private userService: UserService) { }

  ngOnInit() {
    //   this.users$ = this.userService.getUsers()
    //     .pipe(map(user => {
    //       console.log(user);
    //       return user;
    //     })).subscribe();
  }
}
