"use client";

import { Calendar } from "@/components/ui/calendar";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import WeekNavigator from "../_components/weekNavigator";
import { useDateStore } from "@/lib/store";
import { SelectSingleEventHandler } from "react-day-picker";
import { useSession } from "next-auth/react";
import { getShifts } from "./_components/shifts";

const calculateStartRow = (time: Date) => {
  const hour = time.getHours();
  const minute = time.getMinutes();
  return Math.floor(2 + hour * 12 + minute / 5);
};

const calculateSpan = (start: Date, end: Date) => {
  const diffMs = end.getTime() - start.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  return Math.floor(diffMinutes / 5);
};

export function getDateShift(shifts, date: Date) {
  if (!shifts) {
    return null;
  }
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const shiftsOnSelectedDate = shifts
    .filter((shift) => {
      return (
        shift.start &&
        shift.end &&
        shift.end >= startOfDay &&
        shift.start <= endOfDay
      );
    })
    .map((shift) => {
      const clampedStart = shift.start < startOfDay ? startOfDay : shift.start;
      const clampedEnd = shift.end > endOfDay ? endOfDay : shift.end;

      return {
        ...shift,
        rowStart: calculateStartRow(clampedStart),
        span: calculateSpan(clampedStart, clampedEnd),
      };
    });

  return shiftsOnSelectedDate;
}

export default function Example() {
  const container = useRef<HTMLDivElement | null>(null);
  const containerNav = useRef<HTMLDivElement | null>(null);
  const containerOffset = useRef<HTMLDivElement | null>(null);
  const { date, setDate } = useDateStore();
  const { data: session } = useSession();
  const [shifts, setShifts] = useState<
    | {
        clientName: string | null;
        start: Date;
        end: Date;
        address: string;
      }[]
    | null
  >(null);

  const [currShifts, setCurrShifts] = useState<
    | {
        clientName: string | null;
        start: Date;
        end: Date;
        address: string;
        rowStart: number | null;
        span: number | null;
      }[]
    | null
  >(null);

  useEffect(() => {
    const fetchShifts = async () => {
      if (!session?.user?.email) return;
      const shifts = await getShifts(session.user.email);
      setShifts(shifts);
    };
    fetchShifts();
  }, [session]);

  useEffect(() => {
    if (!session?.user?.email) return;
    const currShifts = getDateShift(shifts, date);
    setCurrShifts(currShifts);
  }, [session, date, shifts]);

  useEffect(() => {
    // Set the container scroll position based on the current time.
    if (!container.current || !containerNav.current || !containerOffset.current)
      return;
    const currentMinute = new Date().getHours() * 60;
    container.current.scrollTop =
      ((container.current.scrollHeight -
        containerNav.current.offsetHeight -
        containerOffset.current.offsetHeight) *
        currentMinute) /
      1440;
  }, []);

  return (
    <div className="flex h-full max-h-dvh flex-col">
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-base font-semibold text-gray-900">
            <time className="sm:hidden">
              {date?.toLocaleDateString(undefined, {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </time>
            <time className="hidden sm:inline">
              {date?.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {date?.toLocaleDateString(undefined, { weekday: "long" })}
          </p>
        </div>
        <div className="flex items-center">
          <div className="shadow-xs relative flex items-center rounded-md bg-white md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous day</span>
              <ChevronLeftIcon className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next day</span>
              <ChevronRightIcon className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <MenuButton
                type="button"
                className="shadow-xs flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Day view
                <ChevronDownIcon
                  className="-mr-1 size-5 text-gray-400"
                  aria-hidden="true"
                />
              </MenuButton>

              <MenuItems
                transition
                className="focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden block px-4 py-2 text-sm text-gray-700"
                    >
                      Day view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden block px-4 py-2 text-sm text-gray-700"
                    >
                      Week view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden block px-4 py-2 text-sm text-gray-700"
                    >
                      Month view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden block px-4 py-2 text-sm text-gray-700"
                    >
                      Year view
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="shadow-xs ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add event
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="size-5" aria-hidden="true" />
            </MenuButton>

            <MenuItems
              transition
              className="focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden block px-4 py-2 text-sm text-gray-700"
                  >
                    Create event
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden block px-4 py-2 text-sm text-gray-700"
                  >
                    Go to today
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden block px-4 py-2 text-sm text-gray-700"
                  >
                    Day view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden block px-4 py-2 text-sm text-gray-700"
                  >
                    Week view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden block px-4 py-2 text-sm text-gray-700"
                  >
                    Month view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden block px-4 py-2 text-sm text-gray-700"
                  >
                    Year view
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>
      <div className="isolate flex flex-auto overflow-hidden bg-white">
        <div
          ref={container}
          className="flex h-[calc(100vh-10rem)] flex-auto flex-col overflow-auto"
        >
          <WeekNavigator ref={containerNav} />
          <div className="flex w-full flex-auto">
            <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    12AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    1AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    2AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    3AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    4AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    5AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    6AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    7AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    8AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    9AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    10AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    11AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    12PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    1PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    2PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    3PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    4PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    5PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    6PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    7PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    8PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    9PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    10PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                    11PM
                  </div>
                </div>
                <div />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                style={{
                  gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
                }}
              >
                {currShifts?.map((shift, index) => {
                  return (
                    <li
                      key={index} // Or use a unique ID from your shift data
                      className="relative mt-px flex"
                      style={{
                        gridRow: `${shift?.rowStart} / span ${shift?.span}`,
                      }}
                    >
                      <a
                        href="#" // Add link if needed
                        className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs/5 hover:bg-blue-100"
                      >
                        <p className="order-2 font-semibold text-blue-700">
                          {shift.clientName}
                        </p>
                        <p className="order-1 text-blue-500 group-hover:text-blue-700">
                          {shift.address}
                        </p>
                        <p className="text-blue-500 group-hover:text-blue-700">
                          {/* in 24 hour time e.g 0600 - 1200 */}
                          <time dateTime={shift.start.toISOString()}>
                            {shift.start.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {shift.end.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </p>
                      </a>
                    </li>
                  );
                })}
                {/* <li
                  className="relative mt-px flex"
                  style={{ gridRow: "74 / span 12" }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs/5 hover:bg-blue-100"
                  >
                    <p className="order-1 font-semibold text-blue-700">
                      Breakfast
                    </p>
                    <p className="text-blue-500 group-hover:text-blue-700">
                      <time dateTime="2022-01-22T06:00">6:00 AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative mt-px flex"
                  style={{ gridRow: "92 / span 30" }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs/5 hover:bg-pink-100"
                  >
                    <p className="order-1 font-semibold text-pink-700">
                      Flight to Paris
                    </p>
                    <p className="order-1 text-pink-500 group-hover:text-pink-700">
                      John F. Kennedy International Airport
                    </p>
                    <p className="text-pink-500 group-hover:text-pink-700">
                      <time dateTime="2022-01-22T07:30">7:30 AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative mt-px flex"
                  style={{ gridRow: "134 / span 18" }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-indigo-50 p-2 text-xs/5 hover:bg-indigo-100"
                  >
                    <p className="order-1 font-semibold text-indigo-700">
                      Sightseeing
                    </p>
                    <p className="order-1 text-indigo-500 group-hover:text-indigo-700">
                      Eiffel Tower
                    </p>
                    <p className="text-indigo-500 group-hover:text-indigo-700">
                      <time dateTime="2022-01-22T11:00">11:00 AM</time>
                    </p>
                  </a>
                </li> */}
              </ol>
            </div>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate as SelectSingleEventHandler}
          required={true}
        ></Calendar>
      </div>
    </div>
  );
}
