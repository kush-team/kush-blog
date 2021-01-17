import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { StorageService } from '../storage.service';
import { Session } from '../models/session';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public submitted: boolean;
  public error: {code: number, message: string} = {code: 0, message: ''};

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private storageService: StorageService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      emailAddress: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public login(): void {
    this.submitted = true;
    this.error = null;

    if (this.loginForm.valid){
      this.authenticationService.login(this.loginForm.value.emailAddress, this.loginForm.value.password).subscribe(
        data => this.correctLogin(data.data.Login),
        error => this.error = JSON.parse(error._body)
      );
    }
  }


  private correctLogin(data: any): void {
    this.storageService.setCurrentSession(new Session(data.token, new User(data.user.id, data.user.fullName, data.user.emailAddress)));
  }

}
