import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {

    public get_footer_content(): string {
        const date =  new Date().getFullYear();
        return date + " ML Playground UI. All Rights are reserved"
    }
}
