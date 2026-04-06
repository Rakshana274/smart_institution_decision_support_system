export type UserRole = 'admin' | 'staff' | 'management';

export interface User {
  id: string; // Will map from _id in backend
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profileData?: any;
}

const USER_KEY = 'sidss_current_user';
const API_URL = 'http://localhost:5000/api';

export function initializeUsers() {
  // No longer needed for localStorage
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) return null;
    
    const user: User = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Login Error:", error);
    return null;
  }
}

export async function register(name: string, email: string, password: string, role: UserRole): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    
    if (!res.ok) return null;
    
    const user: User = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Register Error:", error);
    return null;
  }
}

export async function updateProfile(id: string, data: Partial<User>): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/auth/profile/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) return null;
    
    const user: User = await res.json();
    // Update local storage so the session remains current
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Update Profile Error:", error);
    return null;
  }
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}
