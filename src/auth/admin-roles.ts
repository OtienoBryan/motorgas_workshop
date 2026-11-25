// Roles allowed to manage staff accounts and delete records; override with ADMIN_ROLES (comma-separated)
export const ADMIN_ROLES = (process.env.ADMIN_ROLES || 'admin,administrator,super admin,superadmin,manager')
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean);
