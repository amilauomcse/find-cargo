# Root User Setup

This document explains how the default root user is created and managed in the Cargo Management System.

## Default Root User

The system automatically creates a default root user with the following credentials:

- **Email**: `root`
- **Password**: `123`
- **Role**: `ROOT`
- **Name**: Root Admin

## How It Works

### 1. Automatic Creation on Startup

The root user is automatically created when the auth module initializes. This happens in `apps/auth/src/auth.module.ts`:

```typescript
export class AuthModule implements OnModuleInit {
  async onModuleInit() {
    const rootUser = await this.authService.createRootUser();
    console.log('✅ Root user initialized:', rootUser.email);
  }
}
```

### 2. Migration Script

A TypeORM migration script is available at `migrations/1700000000000-CreateRootUser.ts` that can be run manually to create the root user.

### 3. Manual Creation Script

You can manually create the root user using the provided script:

```bash
# From the backend directory
yarn create-root
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Change Default Password**: The default password `123` should be changed immediately after first login
2. **Production Environment**: In production, consider disabling automatic root user creation
3. **Access Control**: Root users have full system access - use with caution
4. **Environment Variables**: Consider using environment variables for root user credentials in production

## Commands

### Create Root User Manually
```bash
yarn create-root
```

### Run Migrations (includes root user creation)
```bash
yarn run-migrations
```

### Check Root User Status
```bash
# Check if root user exists in database
psql -h localhost -U postgres -d auth_db -c "SELECT email, role, status FROM \"user\" WHERE email = 'root';"
```

## Root User Permissions

The root user has the following permissions:

- ✅ Create and manage organizations
- ✅ Create and manage all user types (ROOT, ADMIN, MANAGER, EMPLOYEE)
- ✅ Access all system features
- ✅ Manage system settings
- ✅ View all data across organizations

## First Time Setup

1. Start the application
2. Navigate to the login page
3. Use credentials:
   - Email: `root`
   - Password: `123`
4. **Immediately change the password** after first login
5. Create your organization and admin user
6. Log out and log in with your organization admin account

## Troubleshooting

### Root User Not Created
If the root user is not created automatically:

1. Check database connection
2. Run manual creation: `yarn create-root`
3. Check application logs for errors

### Cannot Login with Root
1. Verify the user exists in the database
2. Check if the user status is 'ACTIVE'
3. Ensure the password is correct
4. Check JWT configuration

### Migration Issues
1. Ensure database is running
2. Check database credentials
3. Run migrations manually: `yarn run-migrations` 