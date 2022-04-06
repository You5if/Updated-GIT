import {Component, Inject, Injectable, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'app-warning-box',
  templateUrl: './warning-box.component.html',
  styleUrls: ['./warning-box.component.scss']
})
export class WarningBoxComponent implements OnInit {

  boxTitle!: string;
  errorMessage!: string;
constructor(
  private dialogRef: MatDialogRef<WarningBoxComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
) { }

ngOnInit() {
  this.dialogRef.disableClose = true;
}

public closeDialog() {
  this.dialogRef.close();
}

}
