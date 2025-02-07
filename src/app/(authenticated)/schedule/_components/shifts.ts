"use server";
import { findUserShiftsByEmail } from "@/resources/user-queries";

export async function getShifts(email: string, date: Date) {
  const calculateStartRow = (time: Date) => {
    const hour = time.getHours();
    const minute = time.getMinutes();
    return 2 + hour * 12 + (minute / 60) * 12;
  };

  const calculateSpan = (start: Date, end: Date) => {
    // 12 spans per hour
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const endHour = end.getHours();
    const endMinute = end.getMinutes();
    return 12 * (endHour - startHour) + (endMinute - startMinute) / 5;
  };
  const shifts = await findUserShiftsByEmail(email);
  // filter shifts to only include shifts that are on the selected date
  const shiftsOnSelectedDate = shifts.filter(
    (shift) =>
      shift.start &&
      shift.end &&
      shift.start.toDateString() === date.toDateString(),
  );

  const shiftsWithRowStart = shiftsOnSelectedDate.map((shift) => ({
    ...shift, // Spread the existing shift properties
    rowStart: shift.start ? Math.floor(calculateStartRow(shift.start)) : null, // Calculate and add rowStart
    span:
      shift.start && shift.end ? calculateSpan(shift.start, shift.end) : null, // Calculate and add span
  }));

  return shiftsWithRowStart;
}
