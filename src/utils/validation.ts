export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone: string) => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Check if it has exactly 10 digits and is not a simple sequence
  if (digits.length !== 10) return false;
  if (digits === '1234567890') return false;
  if (/^(\d)\1+$/.test(digits)) return false; // Block repeated digits like 0000000000
  return true;
};

export const validatePassword = (password: string) => {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char (any symbol)
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return strongPasswordRegex.test(password);
};

export const getPasswordStrength = (password: string): string => {
  if (!password) return '';
  let score = 0;
  if (password.length >= 8) score++;
  if (password.match(/[A-Z]/)) score++;
  if (password.match(/[a-z]/)) score++;
  if (password.match(/[0-9]/)) score++;
  if (password.match(/[@$!%*?&]/)) score++;

  if (score < 3) return 'Weak';
  if (score < 5) return 'Medium';
  return 'Strong';
};
