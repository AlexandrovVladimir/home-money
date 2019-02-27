import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../shared/models/user.model';
import {UserService} from '../../shared/services/user.service';
import {Message} from '../../shared/models/message.model';
import {AuthService} from '../../shared/services/auth.service';
import {ActivatedRoute, Params, Route, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  message: Message;

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.message = new Message('', 'success');

    this.route.queryParams
      .subscribe((params: Params) => {
        if (params['nowCanLogin']) {
          this.showMessage({
            text: 'Теперь вы можете войти в систему',
            type: 'success'
          });
        }
      });

    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  showMessage(message: Message) {
    this.message = message;

    window.setTimeout(() => {
      this.message.text = '';
    }, 5000);
  }

  onSubmit() {
    this.submitted = true;

    const formData = this.form.value;

    this.userService.getUserByEmail(formData.email)
      .subscribe((user: User[]) => {
        if (user[0]) {
          if ((user[0].password === formData.password) && (user[0].email === formData.email)) {
            window.localStorage.setItem('user', JSON.stringify(user));
            this.authService.login();
            this.showMessage({
              text: 'Вы залогинены',
              type: 'success'
            });
            setTimeout(() => {
              this.router.navigate(['/system', 'bill']);
            }, 1000);
            // this.router.navigate(['/']);
          } else {
            this.showMessage({
              text: 'пароль или email не правильные',
              type: 'danger'
            });
          }
        } else {
          this.showMessage({
            text: 'Такой почты не существует',
            type: 'danger'
          });
        }
      });
  }

}
