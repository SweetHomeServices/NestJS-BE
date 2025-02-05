import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { Campaign } from "../entities/campaign.entity";
import { format, parse } from "date-fns";

export const isWithinWorkingHours =  (campaign: Campaign): boolean  => {

    const TIMEZONE_MAP: Record<string, string> = {
      "pacific time": 'America/Los_Angeles',
      "mountain time": 'America/Denver',
      "central time": 'America/Chicago',
      "eastern time": 'America/New_York',
    };
    // 1) Convert custom timezone code to IANA
    const ianaZone = TIMEZONE_MAP[campaign.timezone?.toLowerCase()] ?? 'America/Los_Angeles';
  
    // 2) "Now" in UTC, plus "zonedNow" as the local time in the campaign's zone
    const nowUtc = new Date();
    const zonedNow = toZonedTime(nowUtc, ianaZone);
  
    // 3) Determine the day-of-week, e.g. "monday", "tuesday"
    const dayOfWeek = format(zonedNow, 'EEEE').toLowerCase(); // e.g. "monday"
  
    // 4) Get today's working hours config
    const dayHours = campaign.workingHours[dayOfWeek];
    if (!dayHours || dayHours.closed) {
      return false; // treat as closed if the day is missing or explicitly closed
    }
  
    // e.g. "9:00 AM", "5:00 PM"
    const openStr = dayHours.opens;
    const closeStr = dayHours.closes;
  
    // We'll parse these times as if they're happening "today" in the campaign's local zone
    const dateString = format(zonedNow, 'yyyy-MM-dd'); // e.g. "2025-02-05"
  
    // 5) Parse "yyyy-MM-dd 9:00 AM" => yields a "naive" Date in system local time
    const openNaive = parse(`${dateString} ${openStr}`, 'yyyy-MM-dd h:mm a', new Date());
    // interpret that naive date as local in ianaZone => convert to real UTC
    const openUtc = fromZonedTime(openNaive, ianaZone);
  
    // 6) Same for close time
    const closeNaive = parse(`${dateString} ${closeStr}`, 'yyyy-MM-dd h:mm a', new Date());
    const closeUtc = fromZonedTime(closeNaive, ianaZone);
  
    // 7) Compare: is the current UTC time between openUtc and closeUtc?
    return nowUtc >= openUtc && nowUtc <= closeUtc;
  }