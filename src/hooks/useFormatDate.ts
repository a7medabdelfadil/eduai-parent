/**
 * Formats a date string into readable components
 * @param dateString - ISO date string or Date object
 * @returns Formatted date object
 */
export const formatDate = (dateString: string | Date): {
  dayNumber: number;
  monthName: string;
  year: number;
  time: string;
} => {
  // Ensure we're working with a Date object
  const date = dateString instanceof Date 
    ? dateString 
    : new Date(dateString);

  // Get day number
  const dayNumber = date.getDate();

  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[date.getMonth()] || 'Unknown';

  // Get year
  const year = date.getFullYear();

  // Format time with AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // handle midnight (0 hours)
  
  const time = `${hours}:${minutes} ${ampm}`;

  return {
    dayNumber,
    monthName,
    year,
    time
  };
};

// Optional: Shorthand formatting function
export const formatDateString = (dateString: string | Date) => {
  const { dayNumber, monthName, year, time } = formatDate(dateString);
  return `${dayNumber} ${monthName}, ${year} at ${time}`;
};