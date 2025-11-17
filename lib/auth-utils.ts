/**
 * Authentication Utilities
 * Contains helper functions for authentication and authorization
 */

export function isAgentRole(role?: string): boolean {
  return role === "agent"
}

export function isAdminRole(role?: string): boolean {
  return role === "admin"
}

export function hasAccessToDashboard(role?: string): boolean {
  return isAgentRole(role) || isAdminRole(role)
}

export function hasAdminAccess(role?: string): boolean {
  return isAdminRole(role)
}

export function canUploadStudents(role?: string): boolean {
  return isAgentRole(role)
}
