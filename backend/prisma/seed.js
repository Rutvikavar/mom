require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.users.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'admin',
        },
    });

    const convener = await prisma.users.upsert({
        where: { email: 'convener@example.com' },
        update: {},
        create: {
            email: 'convener@example.com',
            name: 'Meeting Convener',
            password: hashedPassword,
            role: 'meeting_convener',
        },
    });

    const staff = await prisma.users.upsert({
        where: { email: 'staff@example.com' },
        update: {},
        create: {
            email: 'staff@example.com',
            name: 'Staff Member',
            password: hashedPassword,
            role: 'staff',
        },
    });

    console.log({ admin, convener, staff });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
