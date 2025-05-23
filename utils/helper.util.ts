import { APP_CONFIG } from "@/configs/app.config";
import { APP_ERROR } from "@/enums/app.enum";
import { message, notification } from "antd"

export const displayMessage = (type: 'error' | 'success' | 'warning', message?: string, duration: number = 5) => {
  const messageShow = APP_CONFIG.ENVIROMENT === 'develop' ? (message ?? APP_ERROR.SERVER_ERROR) : APP_ERROR.SERVER_ERROR;
  if (type === 'error') {
    notification.error({
      message: messageShow,
      duration: duration,
      style: {borderLeft: '3px solid #dc3545'}
    });
  }
  if (type === 'success') {
    notification.success({
      message: messageShow,
      duration: duration,
      style: {borderLeft: '3px solid #198754'}
    });
  }
  if (type === 'warning') {
    notification.warning({
      message: messageShow,
      duration: duration,
      style: {borderLeft: '3px solid #ffc107'}
    });
  }
};

export const displaySmallMessage = (type: 'error' | 'success' | 'warning', messageInput?: string) => {
  const messageShow = APP_CONFIG.ENVIROMENT === 'develop' ? (messageInput ?? APP_ERROR.SERVER_ERROR) : APP_ERROR.SERVER_ERROR;
  if (type === 'error') {
    message.error(messageShow);
  }
  if (type === 'success') {
    message.success(messageShow);
  }
  if (type === 'warning') {
    message.warning(messageShow);
  }
}

export const formatToTimestampString = (date: Date) => {
  const currencyMonth = date.getMonth() + 1;
  const month = currencyMonth >= 10 ? currencyMonth : '0' + currencyMonth.toString();
  const year = date.getFullYear();
  const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate().toString();
  return `${year}-${month}-${day}`;
}

export const dateToString = (date: Date, character = '/', time?: boolean) => {
  const month = date.getMonth() + 1;
  return `${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate().toString()}${character}${month >= 10 ? month : '0' + month.toString()}${character}${date.getFullYear()} ${time ? `${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}` : ''}`;
}

export const colorRange = () => {
  return [
    {
      color: 'blue',
      level: 100,
      code: '#cfe2ff'
    },
    {
      color: 'blue',
      level: 200,
      code: '#9ec5fe'
    },
    {
      color: 'blue',
      level: 300,
      code: '#6ea8fe'
    },
    {
      color: 'blue',
      level: 400,
      code: '#3d8bfd'
    },
    {
      color: 'blue',
      level: 500,
      code: '#0d6efd'
    },


    {
      color: 'purple',
      level: 100,
      code: '#e2d9f3'
    },
    {
      color: 'purple',
      level: 200,
      code: '#c5b3e6'
    },
    {
      color: 'purple',
      level: 300,
      code: '#a98eda'
    },
    {
      color: 'purple',
      level: 400,
      code: '#8c68cd'
    },
    {
      color: 'purple',
      level: 500,
      code: '#6f42c1'
    },


    {
      color: 'red',
      level: 100,
      code: '#f8d7da'
    },
    {
      color: 'red',
      level: 200,
      code: '#f1aeb5'
    },
    {
      color: 'red',
      level: 300,
      code: '#ea868f'
    },
    {
      color: 'red',
      level: 400,
      code: '#e35d6a'
    },
    {
      color: 'red',
      level: 500,
      code: '#dc3545'
    },


    {
      color: 'orange',
      level: 100,
      code: '#ffe5d0'
    },
    {
      color: 'orange',
      level: 200,
      code: '#fecba1'
    },
    {
      color: 'orange',
      level: 300,
      code: '#feb272'
    },
    {
      color: 'orange',
      level: 400,
      code: '#fd9843'
    },
    {
      color: 'orange',
      level: 500,
      code: '#fd7e14'
    },


    {
      color: 'yellow',
      level: 100,
      code: '#fff3cd'
    },
    {
      color: 'yellow',
      level: 200,
      code: '#ffe69c'
    },
    {
      color: 'yellow',
      level: 300,
      code: '#ffda6a'
    },
    {
      color: 'yellow',
      level: 400,
      code: '#ffcd39'
    },
    {
      color: 'yellow',
      level: 500,
      code: '#ffc107'
    },


    {
      color: 'green',
      level: 100,
      code: '#d1e7dd'
    },
    {
      color: 'green',
      level: 200,
      code: '#a3cfbb'
    },
    {
      color: 'green',
      level: 300,
      code: '#75b798'
    },
    {
      color: 'green',
      level: 400,
      code: '#479f76'
    },
    {
      color: 'green',
      level: 500,
      code: '#198754'
    }
  ];
}

export const getDaysDifference = (dateFrom: Date, dateTo: Date = new Date()): number => {
  dateFrom.setHours(0, 0, 0, 0);
  dateTo.setHours(0, 0, 0, 0);

  if (dateTo > dateFrom) {
    return -1;
  }

  if (dateFrom === dateTo) {
    return 0;
  }

  return 1;
};

export const rangeNumber = (start: number, end: number): number[] => {
  return Array.from(
    { length: Math.ceil(((end) - start) / 1) },
    (_, i) => start + i * 1
  );
}

export const removeQueryParamUrl = (paramKey: string) => {
  const params = new URLSearchParams(paramKey);
  params.delete("openInvite");
  const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
  window.history.replaceState(null, "", newUrl);
}

export function formatRelativeTime(dateString: string): {number: number | string, type: string} {
  const now = new Date();
  const inputDate = new Date(dateString);
  const diffMs = now.getTime() - inputDate.getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return {
      number: diffSeconds || 1,
      type: 's'
    };
  } else if (diffMinutes < 60) {
    return {
      number: diffMinutes,
      type: 'm'
    };
  } else if (diffHours < 24) {
    return {
      number: diffHours,
      type: 'h'
    };
  } else if (diffDays <= 30) {
    return {
      number: diffDays,
      type: 'd'
    };
  } else {
    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear();
    return {
      number: `${day}/${month}/${year}`,
      type: ''
    };
  }
}

export const isJsonLike = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const formatTimeToHourString = (date: Date): string => {
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

export const formatMinutesToHourMinute = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let result = '';
  if (hours > 0) result += `${hours}h`;
  if (minutes > 0) result += `${minutes}m`;
  if (result === '') result = '0m';

  return result;
}

export const formatHourStringToDate = (hour: string) => {
  const now = new Date();
  const hourArray = hour.split(':');
  if (hourArray.length > 0) {
    now.setHours(Number(hourArray[0]));
    now.setMinutes(Number(hourArray[1]));
  }
  return now;
}

export const monthList = (lang?: string) => {
  if (lang === 'vi') {
    return rangeNumber(1, 12).map(number => {
      return {
        id: number,
        text: `Tháng ${number >= 10 ? number : '0' + number}`
      }
    });
  }
  if (lang === 'ja') {
    return rangeNumber(1, 12).map(number => {
      return {
        id: number,
        text: `${number >= 10 ? number : '0' + number}月`
      }
    });
  }

  return [
    { id: 1, text: "January" },
    { id: 2, text: "February" },
    { id: 3, text: "March" },
    { id: 4, text: "April" },
    { id: 5, text: "May" },
    { id: 6, text: "June" },
    { id: 7, text: "July" },
    { id: 8, text: "August" },
    { id: 9, text: "September" },
    { id: 10, text: "October" },
    { id: 11, text: "November" },
    { id: 12, text: "December" }
  ];
}