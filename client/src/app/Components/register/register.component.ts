import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/Services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancleRegister = new EventEmitter();
  model: any = {};
  registerForm: FormGroup;
  maxDate: Date;
  validationError: string[] = [];

  constructor(private accountService: AccountService, private toastr: ToastrService,
    private formBilder: FormBuilder, private router: Router) { }


  ngOnInit(): void {
    this.intitializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }


  intitializeForm() {
    this.registerForm = this.formBilder.group({
      username: ['', Validators.required],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required,
         Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValue('password')]]
    });

    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity()
    });
  }

  // this function to see if the password match the confirm password
  matchValue(matchTo: string): ValidatorFn {
    return(control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true}
    }
  }

  // the reson this func dosnot show the user information in the console
  // B/C we don't return the user from the service
  register() {
    this.accountService.register(this.registerForm.value).subscribe(
      response => {
        this.router.navigateByUrl('/members');
      }, error => {
        this.validationError = error;
      })
  }

  cancle() {
    this.cancleRegister.emit(false);
  }

}
