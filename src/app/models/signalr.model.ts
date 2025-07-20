export interface SignalRNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  userId?: string;
  data?: any;
}

export interface SignalRUserUpdate {
  userId: string;
  name: string;
  email: string;
  action: 'created' | 'updated' | 'deleted';
  timestamp: Date;
}

export interface SignalRProjectUpdate {
  projectId: string;
  name: string;
  status: string;
  action: 'created' | 'updated' | 'deleted';
  timestamp: Date;
}

export interface SignalRConnectionInfo {
  connectionId: string;
  userId: string;
  connectedAt: Date;
  groups: string[];
}
