import { TestBed } from '@angular/core/testing';
import { SignalRService } from './signalr.service';

describe('SignalRService', () => {
  let service: SignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with disconnected state', () => {
    expect(service.isConnected).toBeFalsy();
    expect(service.connectionState).toBe('Disconnected');
  });

  it('should have observable for connection state', () => {
    expect(service.isConnected$).toBeDefined();
    service.isConnected$.subscribe(isConnected => {
      expect(typeof isConnected).toBe('boolean');
    });
  });
});
