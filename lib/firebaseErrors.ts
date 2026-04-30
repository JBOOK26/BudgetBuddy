// Firebase error messages mapper
export const getFirebaseErrorMessage = (code: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'Email already in use.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/operation-not-allowed': 'Operation not allowed.',
    'auth/too-many-requests': 'Too many failed login attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid credentials.',
    'auth/missing-email': 'Email is required.',
    'auth/missing-password': 'Password is required.',
  };

  return errorMessages[code] || 'An error occurred. Please try again.';
};
