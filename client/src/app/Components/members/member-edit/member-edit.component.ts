import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/Models/member';
import { User } from '../../../Models/user';
import { AccountService } from 'src/app/Services/account.service';
import { MemberService } from 'src/app/Services/member.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Photo } from '../../../Models/photo';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event):any {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  member: Member;
  user: User;

  constructor(private accountService: AccountService, private memberService: MemberService,
              private toastr: ToastrService)
              {
                this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
                this.loadMember();

  }

  ngOnInit(): void {
    // this.loadMember();
  }

  loadMember() {
    this.memberService.getMember(this.user.username).subscribe(res => {
      console.log(res.photos);
      this.member = res
      console.log(this.member);
    });

  }

  updateMember() {
    this.memberService.updateMember(this.member).subscribe(() => {
      console.log(this.member);
      this.toastr.success("Updete Success")
      this.editForm.reset(this.member);
    });
  }
}
