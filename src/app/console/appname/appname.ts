import { Component } from '@angular/core';
import { ConsoleService } from '../console.service';

@Component({
  selector: 'app-appname',
  imports: [],
  templateUrl: './appname.html',
  styleUrl: './appname.css',
})
export class Appname {
  constructor(private consoleService: ConsoleService) {
  }

  serverName: string | undefined;
  
  onngOnInit() {
    this.consoleService.getServerName().subscribe((serverName) => {
      this.serverName = serverName;
    });
  }
}
