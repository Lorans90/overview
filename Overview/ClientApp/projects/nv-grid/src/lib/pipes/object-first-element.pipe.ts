import { Pipe, PipeTransform } from '@angular/core';

/**
 * This is typically needed in the context of error handling to access the
 * first error on a field. Generally the order is trivial.
 */
@Pipe({
  name: 'objectFirstElement',
  pure: true
})
export class ObjectFirstElementPipe implements PipeTransform {
  transform(value: any): any {
    return value[Object.keys(value)[0]].message || value[Object.keys(value)[0]];
  }
}
