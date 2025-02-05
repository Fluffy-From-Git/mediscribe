"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={1}
      className={cn(
        "hidden w-1/2 max-w-md flex-none border-l border-gray-100 p-3 px-8 py-10 md:block",
        className,
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "rounded-lg bg-white text-sm",
        // make the first cell of the table rounded
        tbody:
          "flex divide-y divide-gray-200 ring-1 ring-gray-200 rounded-lg overflow-hidden flex-col",
        head_row: "mb-2 grid grid-cols-7 text-center text-xs/6 text-gray-500",
        head_cell: "text-muted-foreground font-normal text-[0.8rem]",
        // first row first and last cell rounded
        row: "flex w-full",
        cell: cn(
          // make day outside grey background
          "hover:bg-gray-100  p-0 focus:z-10  [&:has([aria-selected].day-outside)]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-lg [&:has(.day-outside)]:bg-gray-100",
          "border-r border-gray-200",
          "[&:last-child]:border-r-0",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          " hover:bg-gray-100 h-12 w-12 font-normal aria-selected:opacity-100 aria-selected:text-gray-900 width-100 rounded-none",
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "p-0 underline decoration-2 decoration-offset-2 decoration-violet-600 font-semibold",
        day_today: "text-accent-foreground !text-violet-600 font-semibold",
        day_outside: "day-outside bg-gray-50 text-gray-400 bg-gray-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
      formatters={{
        formatWeekdayName: (date) =>
          date.toLocaleDateString("en-US", { weekday: "narrow" }),
      }}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
