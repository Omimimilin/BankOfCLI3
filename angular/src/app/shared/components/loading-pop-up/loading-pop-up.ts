import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  imports: [MatDialogContent, MatDialogActions, MatDialogClose],
  selector: 'app-loading-pop-up',
  styleUrl: './loading-pop-up.css',
  templateUrl: './loading-pop-up.html',
})
export class LoadingPopUp {}
