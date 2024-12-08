
export type Service = {
    id: string;
    name: string;
    price: number;
    duration: number;
    category?: {
      id: string;
      name: string;
    };
  };
  
  export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  
  export type Appointment = {
    id: string;
    customer: {
      id: string;
      name: string;
    };
    service: {
      id: string;
      name: string;
    };
    startTime: string;
    status: AppointmentStatus;
  };

