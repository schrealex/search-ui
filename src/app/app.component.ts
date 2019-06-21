import { Component, OnInit } from '@angular/core';
import { DataService } from './service/data.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public formControl = new FormControl();
  public options: any[] = [];
  public filteredOptions: Observable<string[]>;

  public searchContent: any;

  public faSearch = faSearch;

  constructor(private dataService: DataService) {

  }

  public ngOnInit(): void {
    this.getSearchData();
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.fields.title.toLowerCase().includes(filterValue));
  }

  public getSearchData() {
    this.dataService.getSearchData().subscribe((result: any) => {
      console.log(result);
      this.options = result.hits.map(hit => {
        console.log(hit);
        if (hit.fields.image) {
          hit.fields.image = this.sanitizeImageUrl(hit.fields.image);
        }
        return hit;
      });

      this.filteredOptions = this.formControl.valueChanges
                                 .pipe(
                                   startWith(''),
                                   map(value => this.filter(value))
                                 );
    });
  }

  private sanitizeImageUrl(imageUrl: string): string {
    return imageUrl.replace(/&amp;/g, '&');
  }

  public navigeerNaarProduct(product: any): void {
    window.open(product.url, '_blank');
  }

}
