import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../Services/account.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastr: ToastrService){}

  canActivate(): Observable<boolean | UrlTree>  {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if(user) return true;
        this.toastr.error('something went wrong')
      })
      // map(user => {
      //   if(user) {
      //     // console.log(user);
      //     return true;
      //   }
      // },
      // // not work !!!!!!!!!!
      //  err => {
      //   console.log(err);
      //   this.toastr.error(err.error);
      // })
    )
  }

}
