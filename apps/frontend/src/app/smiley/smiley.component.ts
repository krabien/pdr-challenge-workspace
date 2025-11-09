import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-smiley',
  imports: [MatToolbar, MatButton, MatIcon],
  templateUrl: './smiley.component.html',
  styleUrl: './smiley.component.scss',
})
export class SmileyComponent {
  protected readonly history = history;
}
