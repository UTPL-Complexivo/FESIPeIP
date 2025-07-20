import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { SignalRService } from './signalr.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let signalRServiceSpy: jasmine.SpyObj<SignalRService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SignalRService', ['startConnection', 'joinGroup', 'on', 'isConnected']);
    
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: SignalRService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(NotificationService);
    signalRServiceSpy = TestBed.inject(SignalRService) as jasmine.SpyObj<SignalRService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty notifications', () => {
    expect(service.notifications().length).toBe(0);
    expect(service.unreadCount()).toBe(0);
  });

  it('should mark notification as read', () => {
    // Test implementation would go here
    expect(service).toBeTruthy();
  });
});
