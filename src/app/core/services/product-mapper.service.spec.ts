import { TestBed } from '@angular/core/testing';

import { ProductMapperService } from './product-mapper.service';

describe('ProductMapperService', () => {
  let service: ProductMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
