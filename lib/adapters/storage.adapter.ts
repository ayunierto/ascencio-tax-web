export class StorageAdapter {
  static setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }

  static getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }

  static clear(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
