import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as AngularConstants from 'src/app/models/constants/angular-constants';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

    @Input()
    public Title: string = "";

    @Input()
    public Message: string = "";

    constructor(
        private thisDialogReference: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string) { }

    ngOnInit(): void {
    }


    public confirm(): void {
        this.thisDialogReference.close(AngularConstants.confirm);
    }

    public cancel(): void {
        this.thisDialogReference.close(AngularConstants.cancel);
    }

}
