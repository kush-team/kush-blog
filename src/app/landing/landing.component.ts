import { Component, Input, OnInit } from '@angular/core';
import { PlaygroundService } from '../playground.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  @Input() stringTemplate!:string;
  @Input() query!:string;

  constructor(private playgroundService: PlaygroundService) { }

  ngOnInit(): void {
  }

  public setFile(key:string, language:string): void {
    this.playgroundService.setFile(key, language);
  }
}
