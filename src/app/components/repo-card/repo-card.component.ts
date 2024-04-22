import { Component, Input } from '@angular/core';

@Component({
  selector: 'repo-card',
  templateUrl: './repo-card.component.html',
  styleUrls: ['./repo-card.component.scss'],
})
export class RepoCardComponent {
  // @Input() repoInfo: any = {
  //   name: 'teste',
  //   description: 'Comedouro automático para pets',
  //   html_url: 'https://github.com/giovannychaves/comedouro-automatico-pets',
  //   private: false,
  //   language: 'C++',
  //   stargazers_count: 0,
  // };

  @Input() repoInfo!: any;
}
