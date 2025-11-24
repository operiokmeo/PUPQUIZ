# Database Configuration

The application has been configured to use SQLite instead of MySQL to avoid database connection issues.

## Required .env Changes

Please update your `.env` file with the following settings:

```
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Session and Cache (optional, already set in config files)
SESSION_DRIVER=file
CACHE_STORE=file
```

## What Was Changed

1. **config/database.php** - Default connection changed from 'mysql' to 'sqlite'
2. **config/session.php** - Session driver changed from 'database' to 'file'
3. **config/cache.php** - Cache store changed from 'database' to 'file'
4. **login_otp table** - Created in SQLite database

## To Switch Back to MySQL

If you want to use MySQL later:
1. Start your MySQL service
2. Update `.env` with your MySQL credentials
3. Revert the config file defaults or set them in `.env`

## Current Status

✅ SQLite database configured
✅ File-based sessions (no database needed)
✅ File-based cache (no database needed)
✅ login_otp table created
✅ Application should now work without MySQL





