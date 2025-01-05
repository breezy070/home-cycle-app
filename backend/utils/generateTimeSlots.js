export const generateTimeSlots = () => {
    const slots = [];
    let start = new Date();
    start.setHours(8, 0, 0); // 8:00 AM
    const end = new Date();
    end.setHours(17, 0, 0); // 5:00 PM
  
    while (start < end) {
      slots.push({
        time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        isBooked: false,
      });
      start.setMinutes(start.getMinutes() + 30); // Increment by 30 mins
    }
    return slots;
  };
  