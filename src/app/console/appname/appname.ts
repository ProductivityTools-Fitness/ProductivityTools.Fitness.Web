import { Component, OnInit } from '@angular/core';
import { ConsoleService } from '../console.service';

@Component({
  selector: 'app-appname',
  imports: [],
  templateUrl: './appname.html',
  styleUrl: './appname.css',
})
export class Appname implements OnInit {
  constructor(private consoleService: ConsoleService) {
  }

  serverName: string | undefined;

  ngOnInit() {
    this.consoleService.getServerName().subscribe((serverName) => {
      console.log("serverName: " + serverName);
      this.serverName = serverName;
    });
  }
}
