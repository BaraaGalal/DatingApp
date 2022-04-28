import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/Services/account.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastr: ToastrService) {}
  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(user => {
                    // we use the include method
                    //B/C if the user have more thin onr role it became array of roles
        if(user.roles.includes("Admin") || user.roles.includes("Moderator")) {
          return true;
        }
        this.toastr.error("Only For Admin");
      })
    );
  }

}
