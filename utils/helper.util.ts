import { APP_CONFIG } from "@/configs/app.config";
import { APP_ERROR } from "@/enums/app.enum";
import { BaseResponseType } from "@/types/base.type";
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

export const dateToString = (date: Date, character = '/') => {
  const month = date.getMonth() + 1;
  return `${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate().toString()}/${month >= 10 ? month : '0' + month.toString()}/${date.getFullYear()}`;
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