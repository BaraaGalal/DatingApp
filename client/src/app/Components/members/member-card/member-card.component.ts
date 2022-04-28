import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/Models/member';
import { MemberService } from 'src/app/Services/member.service';
import { ToastrService } from 'ngx-toastr';
import { PresenceService } from './../../../Services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() member: Member;
  constructor(private memberService: MemberService, private tosastr: ToastrService, public presence: PresenceService) { }

  ngOnInit(): void {
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.tosastr.success('You have Liked' + member.knownAs);
    })
  }

}
