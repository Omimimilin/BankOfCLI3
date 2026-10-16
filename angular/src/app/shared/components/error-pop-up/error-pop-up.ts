import { Component, inject } from '@angular/core';
import { Card } from '../card/card';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matErrorRound } from '@ng-icons/material-symbols/round';

@Component({
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, Card, NgIcon],
  viewProviders: [provideIcons({ matErrorRound })],
  selector: 'app-error-pop-up',
  styleUrl: './error-pop-up.css',
  templateUrl: './error-pop-up.html',
})
export class ErrorPopUp {
  protected readonly data = inject<{ error: string }>(MAT_DIALOG_DATA);
}
