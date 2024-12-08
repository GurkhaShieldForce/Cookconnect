// src/utils/validation.ts
export const validation = {
    email: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  
    password: (password: string): boolean => {
      // Minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      return passwordRegex.test(password);
    },
  
    phone: (phone: string): boolean => {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      return phoneRegex.test(phone);
    },
  
    dateInFuture: (date: Date): boolean => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
  
    bookingTime: (time: string): boolean => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    },
  };