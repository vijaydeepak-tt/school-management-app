# School Management App

## Prisma commands used

- `npx prisma init` - to create a schema file
- `npx prisma migrate dev --name <commit-name>` - to create or update tables based on schema file
- `npx prisma studio` - GUI for prisma DB
- `npx prisma db push --force-reset` - resets the DB if made mistake in schema, if have see, run the seed cmd again
- `npx prisma db seed` - run a seed file for dummy data
- `npx prisma migrate reset` - Resetting the tables based on updated schema
