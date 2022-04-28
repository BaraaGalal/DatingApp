import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from './../Models/member';
import { MemberService } from './../Services/member.service';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> {

  constructor(private memberService: MemberService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
      // we don't need to subscribe  B/C router resolve is going to care about that
      // and he will take care about unsubscription
    return this.memberService.getMember(route.paramMap.get('username'));
  }
}
