import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private toastService: ToastrService,
    private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: user => {
        const reirect = this.accountService.redirectUrl ? this.accountService.redirectUrl : '/store';
        this.router.navigateByUrl(reirect);
        this.accountService.redirectUrl = null; // clearing the redirect URL post navigation
        this.toastService.success('Login successful');
      },
      error: error => {
        this.toastService.error(error.error, 'Login failed');
      }
    });
  }
}
