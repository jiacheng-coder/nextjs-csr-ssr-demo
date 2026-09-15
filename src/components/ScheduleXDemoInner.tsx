"use client";

import { useState } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { translations } from "@schedule-x/translations";
import { Temporal } from "temporal-polyfill";
import "@schedule-x/theme-default/dist/index.css";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** 生成相对今天的日期字符串，保证日历打开就能看到演示事件 */
function dateStr(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Schedule-X v3+ 底层全面迁移到 Temporal API，
 * v4.8 中事件时间必须使用 Temporal 对象（不再接受字符串）：
 * - ZonedDateTime：带时区的具体时刻（会议、约会）
 * - PlainDate：无时区的纯日期（全天事件、假期）
 */
function zoned(offsetDays: number, time: string) {
  return Temporal.ZonedDateTime.from(
    `${dateStr(offsetDays)}T${time}:00+08:00[Asia/Shanghai]`
  );
}

function plain(offsetDays: number) {
  return Temporal.PlainDate.from(dateStr(offsetDays));
}

/**
 * Schedule-X 日历（v4.8.0 最新版）
 * - MIT 协议免费商用，底层基于 Temporal API（v3 起）
 * - 内置拖拽/缩放/多视图/国际化/暗色模式
 */
export default function ScheduleXDemoInner() {
  const [isDark, setIsDark] = useState(false);

  const calendar = useCalendarApp({
    locale: "zh-CN",
    translations,
    selectedDate: plain(0),
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [
      {
        id: 1,
        title: "项目评审",
        start: zoned(0, "10:00"),
        end: zoned(0, "12:00"),
      },
      {
        id: 2,
        title: "跨国会议（东京团队）",
        start: zoned(1, "14:00"),
        end: zoned(1, "15:30"),
      },
      {
        id: 3,
        title: "团队建设（全天）",
        start: plain(3),
        end: plain(3),
      },
      {
        id: 4,
        title: "性能优化周报",
        start: zoned(5, "16:00"),
        end: zoned(5, "17:00"),
      },
    ],
    plugins: [createEventsServicePlugin()],
    callbacks: {
      onEventClick(event) {
        console.log("[Schedule-X] 点击事件:", event);
      },
    },
  });

  // useCalendarApp 初始化完成前返回 null，等待其就绪
  if (!calendar) {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          onClick={() => {
            const next = !isDark;
            setIsDark(next);
            calendar.setTheme(next ? "dark" : "light");
          }}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 active:scale-95"
        >
          切换为{isDark ? "浅色" : "暗色"}模式
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-orange-200 bg-white dark:border-orange-800">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
  );
}
