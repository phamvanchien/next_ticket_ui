import { toast } from 'react-toastify';

export interface HolidayInYear {
  day: number
  month: number
  title: string
}

export const currency = (number: number) => {
  return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export const formatTime = (date: Date) => {
  const monthVietNam = date.getMonth() + 1;
  const hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours().toString();
  const minute = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes().toString();
  const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate().toString();
  const month = monthVietNam >= 10 ? monthVietNam : '0' + monthVietNam.toString();
  const year = date.getFullYear();
  const now = new Date();

  if (
    now.getDate() === (date.getDate() + 1) &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  ) {
    return `Yesterday ${hour}:${minute}`;
  }

  if (
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear() &&
    now.getHours() === date.getHours() &&
    now.getMinutes() === date.getMinutes()
  ) {
      return `Now ${hour}:${minute}`;
  }

  if (
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  ) {
    return `Today ${hour}:${minute}`;
  }

  return `${day}/${month}/${year}`;
}

export const formatToTimestampString = (date: Date) => {
  const currencyMonth = date.getMonth() + 1;
  const month = currencyMonth >= 10 ? currencyMonth : '0' + currencyMonth.toString();
  const year = date.getFullYear();
  const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate().toString();
  return `${year}-${month}-${day}`;
}

export const rangeColor = () => {
  return [  "#F4A3D2", "#B1FF8C", "#1296FF", "#FFB832", "#8D2FCE",   "#3CFAE8", "#B32A50", "#FA9C12", "#15A1D4", "#DF83EE",   "#ABC234", "#719DFF", "#F31C7E", "#2AD984", "#7C5EFA",   "#D83F13", "#AFA81B", "#EB69B4", "#356A5E", "#9E32CF"];
}

export const randomNumber = (num: number) => {
  let arr = Array.from({ length: 10 }, (v, k) => k + 1);
  let result = [];
  let clonedArray = [...arr];
  for (let i = 0; i < num; i++) {
    let randomIndex = Math.floor(Math.random() * clonedArray.length);
    result.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return result;
}

export const notify = (content: string, type: 'info' | 'success' | 'warning' | 'error' | 'default', icon?: JSX.Element) => {
  toast(content, {
    type: type,
    draggable: true,
    icon: icon
  });
}

export const rangeNumber = (start: number, end: number): number[] => {
  return Array.from(
    { length: Math.ceil(((end) - start) / 1) },
    (_, i) => start + i * 1
  );
}

export const isFutureDate = (date: Date): boolean => {
  const now = new Date();
  return now.getTime() > date.getTime();
}

export const holidayNotOff = () => {
  return [
    {
      day: 14, month: 2, title: 'Ngày Valentine'
    },
    {
      day: 8, month: 3, title: 'Ngày Quốc tế Phụ nữ'
    },
    {
      day: 1, month: 4, title: 'Ngày Cá tháng Tư'
    },
    {
      day: 1, month: 6, title: 'Ngày Quốc tế Thiếu nhi'
    },
    {
      day: 20, month: 10, title: 'Ngày Phụ nữ Việt Nam'
    },
    {
      day: 20, month: 11, title: 'Ngày nhà giáo Việt Nam'
    },
    {
      day: 24, month: 12, title: 'Ngày giáng sinh'
    },
    {
      day: 25, month: 12, title: 'Ngày giáng sinh'
    }
  ]
}

export const holidayOff = () => {
  return [
    {
      day: 1, month: 1, title: 'Tết Dương lịch'
    },
    {
      day: 30, month: 4, title: 'Ngày Giải phóng miền Nam, Thống nhất đất nước'
    },
    {
      day: 1, month: 5, title: 'Ngày Quốc tế Lao động'
    },
    {
      day: 2, month: 9, title: 'Ngày Quốc khánh'
    }
  ]
}

export const iconFile = (extFile: string) => {
  const fileData = [
    {
      ext: 'application/pdf',
      icon: '/img/icon/pdf-file.png'
    },
    {
      ext: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      icon: '/img/icon/word-file.png'
    },
    {
      ext: 'application/msword',
      icon: '/img/icon/word-file.png'
    },
    {
      ext: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      icon: '/img/icon/excel-file.png'
    },
    {
      ext: 'application/vnd.ms-excel',
      icon: '/img/icon/excel-file.png'
    },
    {
      ext: 'text/plain',
      icon: '/img/icon/txt-file.png'
    },
    {
      ext: 'application/json',
      icon: '/img/icon/json-file.png'
    },
    {
      ext: 'application/sql',
      icon: '/img/icon/sql-file.png'
    }
  ]
  return fileData.find(f => f.ext === extFile)?.icon;
}

export const getStatusDone = () => {
  return [
    'done', 'finish', 'xong', 'hoàn tất', 'hoàn thành'
  ];
}

export const priorityId = (priority: "high" | "medium" | "low") => {
  return priorityRange().find(r => r.title === priority)?.id;
}

export const priorityRange = () => {
  const range = [
    {
      id: 1,
      title: "High",
      color: '#e35d6a'
    },
    {
      id: 2,
      title: "Medium",
      color: '#ffcd39'
    },
    {
      id: 3,
      title: "Low",
      color: '#479f76'
    }
  ];
  return range;
}

export const colorCode = (
  color: "blue" | "purple" | "red" | "orange" | "yellow" | "green", level: 100 | 200 | 300 | 400 | 500
) => {
  const colorFind = colorRange().find(r => r.color === color && r.level === level);
  return colorFind ? colorFind.code : null
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

export const dateToString = (date: Date, character = '/') => {
  const month = date.getMonth() + 1;
  return `${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate().toString()}/${month >= 10 ? month : '0' + month.toString()}/${date.getFullYear()}`;
}

export const dateToStamptimeString = (date: Date) => {
  const month = date.getMonth() + 1;
  return `${date.getFullYear()}-${month >= 10 ? month : '0' + month.toString()}-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate().toString()}`;
}

export const taskType = (typeId?: number) => {
  const types = [
    {
      id: 1,
      title: 'Task'
    },
    // {
    //   id: 2,
    //   title: 'Subtask'
    // },
    {
      id: 3,
      title: 'New feature',
    },
    {
      id: 4,
      title: 'Bug'
    },
    {
      id: 5,
      title: 'Improvement'
    },
    {
      id: 6,
      title: 'Test case'
    }
  ];

  if (typeId) {
    return types.filter(t => t.id === typeId);
  }

  return types;
}