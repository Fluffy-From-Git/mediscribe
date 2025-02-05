"use client";
import { forwardRef } from "react";
import { subDays, format } from "date-fns";
import { useDateStore } from "@/lib/store";

const WeekNavigator = forwardRef<HTMLDivElement>(
  function WeekNavigator(_, ref) {
    const { date: selectedDate, setDate: setSelectedDate } = useDateStore();

    if (!selectedDate) return null;

    const days = Array.from({ length: 7 }, (_, i) =>
      subDays(selectedDate, 3 - i),
    );

    return (
      <div
        ref={ref}
        className="sticky top-0 z-10 grid flex-none grid-cols-7 bg-white text-xs text-gray-500 shadow-sm ring-1 ring-black/5 md:hidden"
      >
        {days.map((day, index) => {
          const isSelected =
            format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center pb-1.5 pt-3 ${
                isSelected
                  ? "rounded-full font-bold text-violet-600"
                  : "text-gray-900"
              }`}
            >
              <span>{format(day, "E").charAt(0)}</span>
              <span className="mt-3 flex size-8 items-center justify-center rounded-full text-base">
                {format(day, "d")}
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);

export default WeekNavigator;
