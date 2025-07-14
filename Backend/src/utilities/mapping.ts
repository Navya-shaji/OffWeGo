export function mapNumericRoleToString(role: number): 'user' | 'vendor' | 'admin' {
  switch (role) {
    case 0:
      return 'user';
    case 1:
      return 'vendor';
    case 2:
      return 'admin';
    default:
      throw new Error('Invalid role value from database');
  }
}
