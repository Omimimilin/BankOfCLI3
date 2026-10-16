import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-logo',
  styleUrl: './logo.css',
  templateUrl: './logo.html',
})
export class Logo {
  fill = input('white');
  size = input(50);
}
