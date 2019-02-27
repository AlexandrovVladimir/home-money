import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Message} from '../../shared/models/message.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.styl']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;
  message: Message;

  constructor(private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails.bind(this)),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'name': new FormControl(null, [Validators.required]),
      'agree': new FormControl(null, [Validators.requiredTrue]),
    });
  }

  onSubmit() {

    const {email, password, name} = this.form.value;

    const user = new User(email, password, name);

    this.userService.createNewUser(user)
      .subscribe(() => {
        this.router.navigate(['/login'], {
          queryParams: {
            nowCanLogin: true
          }
        });

      });
  }

  forbiddenEmails(control: FormControl): Promise<any> {

    return new Promise((resolve, reject) => {
      this.userService.getUserByEmail(control.value)
        .subscribe((user: User[]) => {
          console.log('user', user);

          if (user.length > 0) {
            /*по правилу асинхронных валидаторов надо передать обьект с ключем и значением*/
            resolve({forbiddenEmail: true});
          } else {

            resolve(null);
          }
        });
    });
  }

}
