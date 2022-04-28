import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AccountService } from '../Services/account.service';
import { take } from 'rxjs/operators';
import { User } from 'src/app/Models/user';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  user: User;

  constructor(private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private accountService: AccountService) {
          this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
             this.user = user;
          })
        }
  ngOnInit(): void {
    // clear view if the user have no role
    if (!this.user?.roles || this.user == null) {
      this.viewContainerRef.clear();
      return;
    }
    if (this.user?.roles.some(r => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else{
      this.viewContainerRef.clear();
    }
  }

}
