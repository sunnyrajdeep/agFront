import { TestBed, inject } from '@angular/core/testing';

import { NodeserviceService } from './nodeservice.service';

describe('NodeserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NodeserviceService]
    });
  });

  it('should be created', inject([NodeserviceService], (service: NodeserviceService) => {
    expect(service).toBeTruthy();
  }));
});
