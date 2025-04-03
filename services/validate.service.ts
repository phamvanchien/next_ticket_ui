export const isEmpty = (value?: string) => {
  if (!value || value === '') {
    return true;
  }
  return false;
}

export const isEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};