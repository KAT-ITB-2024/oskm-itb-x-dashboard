import { z } from "zod";

export function calculateOverDueTime(
  deadline: Date | undefined,
  submiission: Date | undefined,
) {
  if (deadline === undefined || submiission === undefined) {
    return null;
  }

  return submiission > deadline
    ? Math.floor((submiission.getTime() - deadline.getTime()) / 1000)
    : 0;
}

// Time interpreted as GMT+7 timezone
export const z_time = z.string().refine(
  (v) => {
    try {
      const [h, m, s, ...rest] = v.split(":");
      if (!h || !m || !s || rest.length > 0) return false;
      const hour = parseInt(h);
      const minute = parseInt(m);
      const seconds = parseInt(s);
      if (isNaN(hour) || isNaN(minute) || isNaN(seconds)) return false;

      if (hour < 0 || hour > 23) return false;
      if (minute < 0 || minute > 59) return false;
      if (seconds < 0 || seconds > 59) return false;
      return true;
    } catch (_) {
      return false;
    }
  },
  {
    message:
      "Invalid time format, correct format HH:MM:SS (tips: use ISO string)",
  },
);

// ISO String format (again, interpreted as GMT+7 timezone)
export const z_date = z.string().refine(
  (v) => {
    try {
      const [y, m, d, ...rest] = v.split("-");
      if (!y || !m || !d || rest.length > 0) return false;
      return true;
    } catch (_) {
      return false;
    }
  },
  {
    message:
      "Invalid date format, correct format YYYY-MM-DD (tips: use ISO string)",
  },
);
