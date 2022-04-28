import { Component, OnInit } from '@angular/core';
import { Member } from '../../../Models/member';
import { MemberService } from './../../../Services/member.service';
import { Pagination } from 'src/app/Models/Pagination';
import { userParams } from '../../../Models/userParams';
import { AccountService } from 'src/app/Services/account.service';
import { take } from 'rxjs/operators';
import { User } from 'src/app/Models/user';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: userParams;
  user: User;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]

  constructor(private memberService: MemberService) {
   this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers()
  }


  loadMembers() {
    this.memberService.settUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
        this.members = response.result;
        this.pagination = response.pagination;
      })
  }

  resetFilters() {
    this.userParams = this.memberService.resutUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.settUserParams(this.userParams);
    this.loadMembers();
  }
}
