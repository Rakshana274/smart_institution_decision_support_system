// Shared API-based data manager for staff, students, and assignments

export interface StaffMember {
  id: string; // mapped from _id by mongoose toJSON
  name: string;
  department: string;
  role: string;
  status: string;
  email: string;
  phone: string;
  joinDate: string;
  rating: number;
}

export interface Student {
  id: string; // mapped from _id by mongoose toJSON
  name: string;
  regNo: string;
  department: string;
  semester: number;
  cgpa: number;
  attendance: number;
  status: 'active' | 'at-risk';
  assignedStaffId: string | null;
}

const API_BASE = 'http://localhost:5000/api';

// Staff CRUD
export async function getStaffList(): Promise<StaffMember[]> {
  try {
    const res = await fetch(`${API_BASE}/staff`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch staff list", err);
    return [];
  }
}

export async function addStaff(staff: Omit<StaffMember, 'id'>): Promise<StaffMember> {
  const res = await fetch(`${API_BASE}/staff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(staff)
  });
  return await res.json();
}

export async function removeStaff(id: string): Promise<void> {
  await fetch(`${API_BASE}/staff/${id}`, { method: 'DELETE' });
}

export async function updateStaff(id: string, updates: Partial<StaffMember>): Promise<StaffMember> {
  const res = await fetch(`${API_BASE}/staff/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return await res.json();
}

export async function getStaffById(staffId: string): Promise<StaffMember | undefined> {
  const list = await getStaffList();
  return list.find(s => s.id === staffId);
}

// Student CRUD
export async function getStudentList(): Promise<Student[]> {
  try {
    const res = await fetch(`${API_BASE}/students`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch student list", err);
    return [];
  }
}

export async function addStudent(student: Omit<Student, 'id'>): Promise<Student> {
  const res = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  return await res.json();
}

export async function removeStudent(id: string): Promise<void> {
  await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
}

// Assignment
export async function assignStudentToStaff(studentId: string, staffId: string | null): Promise<void> {
  await fetch(`${API_BASE}/students/${studentId}/assign`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staffId })
  });
}

export async function getStudentsByStaff(staffId: string): Promise<Student[]> {
  try {
    const res = await fetch(`${API_BASE}/students/staff/${staffId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch students for staff", err);
    return [];
  }
}
