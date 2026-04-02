"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const run = async (prisma) => {
    try {
        const permissions = [
            { name: "View Dashboard", key: "dashboard.view", description: "View the main dashboard" },
            { name: "List Attendees", key: "attendee.list", description: "View the list of attendees" },
            { name: "View Attendee", key: "attendee.view", description: "View attendee details" },
            { name: "Create Attendee", key: "attendee.create", description: "Create a new attendee" },
            { name: "Update Attendee", key: "attendee.update", description: "Update an existing attendee" },
            { name: "Delete Attendee", key: "attendee.delete", description: "Delete an attendee" },
            { name: "Scan Attendee", key: "attendee.scan", description: "Scan attendee QR codes" },
            { name: "Toggle Attendee QR Task", key: "attendee.qr_task_toggle", description: "Toggle tasks from Scanner" },
            { name: "Toggle Attendee Task", key: "attendee.task_toggle", description: "Toggle tasks from List" },
            {
                name: "Generate All ID Cards",
                key: "attendee.all_id_cards",
                description: "Generate ID cards for all attendees",
            },
            { name: "List Sponsors", key: "sponsor.list", description: "View the list of sponsors" },
            { name: "View Sponsor", key: "sponsor.view", description: "View sponsor details" },
            { name: "Create Sponsor", key: "sponsor.create", description: "Create a new sponsor" },
            { name: "Update Sponsor", key: "sponsor.update", description: "Update an existing sponsor" },
            { name: "Delete Sponsor", key: "sponsor.delete", description: "Delete a sponsor" },
            { name: "List Tasks", key: "task.list", description: "View the list of tasks" },
            { name: "View Task", key: "task.view", description: "View task details" },
            { name: "Create Task", key: "task.create", description: "Create a new task" },
            { name: "Update Task", key: "task.update", description: "Update an existing task" },
            { name: "Delete Task", key: "task.delete", description: "Delete a task" },
            { name: "List Users", key: "user.list", description: "View the list of users" },
            { name: "View User", key: "user.view", description: "View user details" },
            { name: "Create User", key: "user.create", description: "Create a new user" },
            { name: "Update User", key: "user.update", description: "Update an existing user" },
            { name: "Delete User", key: "user.delete", description: "Delete a user" },
            { name: "Revoke User Sessions", key: "user.session.revoke", description: "Revoke all sessions for a user" },
            { name: "List Roles", key: "role.list", description: "View the list of roles" },
            { name: "View Role", key: "role.view", description: "View role details" },
            { name: "Create Role", key: "role.create", description: "Create a new role" },
            { name: "Update Role", key: "role.update", description: "Update an existing role" },
            { name: "Delete Role", key: "role.delete", description: "Delete a role" },
        ];
        const result = await prisma.permission.createMany({
            data: permissions,
            skipDuplicates: true,
        });
        console.log(`Permissions seeded! Added ${result.count} new permissions.`);
        const superAdminRole = await prisma.role.upsert({
            where: { name: "Super Admin" },
            update: {},
            create: {
                name: "Super Admin",
                description: "Full access to all system features",
                createdBy: "SYSTEM",
            },
        });
        const allPermissions = await prisma.permission.findMany();
        const rolePermissions = allPermissions.map((perm) => ({
            roleId: superAdminRole.id,
            permissionId: perm.id,
        }));
        const rolePermissionResult = await prisma.rolePermission.createMany({
            data: rolePermissions,
            skipDuplicates: true,
        });
        console.log(`Super Admin role updated! Linked ${rolePermissionResult.count} new permissions to role.`);
    }
    catch (err) {
        console.error("Error Seeding Permissions!", err);
    }
};
exports.run = run;
//# sourceMappingURL=Permissions.seeder.js.map