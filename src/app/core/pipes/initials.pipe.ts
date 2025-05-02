import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {

  transform(str1: string | undefined, str2?: string): string {

    let initials = '';

    if(str1 && str2) {
      initials = str1.substr(0, 1) + str2.substr(0, 1);
    } else if(str1) {
      if(str1.includes(' ')) {
        //name has spaces
        let str1_parts = str1.split(' ');
        initials = str1_parts[0].substr(0, 1) + str1_parts[1].substr(0, 1);
      } else{
        //name has no spaces, take first two characters
        initials = str1.substr(0, 2);
      }
    }

    return initials.toUpperCase();

  }

}
