"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ROLES = void 0;
exports.ADMIN_ROLES = (process.env.ADMIN_ROLES || 'admin,administrator,super admin,superadmin,manager')
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean);
//# sourceMappingURL=admin-roles.js.map