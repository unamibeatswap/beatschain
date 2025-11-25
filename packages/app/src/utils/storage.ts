/**
 * Safe storage utility for handling localStorage with proper error handling
 * and expiration support
 */

interface StorageItem<T> {
  value: T;
  expiry?: number; // Unix timestamp in milliseconds
}

/**
 * Set an item in localStorage with optional expiration
 * @param key Storage key
 * @param value Value to store
 * @param expiryDays Optional expiration in days
 */
export function setStorageItem<T>(key: string, value: T, expiryDays?: number): boolean {
  try {
    const item: StorageItem<T> = {
      value
    };
    
    // Add expiration if specified
    if (expiryDays) {
      const now = new Date();
      item.expiry = now.setDate(now.getDate() + expiryDays);
    }
    
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error('Error setting localStorage item:', error);
    return false;
  }
}

/**
 * Get an item from localStorage, respecting expiration
 * @param key Storage key
 * @returns The stored value or null if expired or not found
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const itemStr = localStorage.getItem(key);
    
    // Return null if item doesn't exist
    if (!itemStr) {
      return null;
    }
    
    const item: StorageItem<T> = JSON.parse(itemStr);
    
    // Check if the item has expired
    if (item.expiry && Date.now() > item.expiry) {
      // Delete the expired item
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return null;
  }
}

/**
 * Remove an item from localStorage
 * @param key Storage key
 */
export function removeStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing localStorage item:', error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}