import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
	const email = 'noamkadosh91@gmail.com'

	// cleanup the existing database
	await prisma.user.delete({ where: { email } }).catch(() => {
		// no worries if it doesn't exist yet
	})

	const hashedPassword = await bcrypt.hash('reallyHardPassword', 10)

	const user = await prisma.user.create({
		data: {
			email,
			password: {
				create: {
					hash: hashedPassword
				}
			}
		}
	})

	await prisma.note.create({
		data: {
			title: 'My first note',
			body: 'Hello, world!',
			userId: user.id
		}
	})

	await prisma.note.create({
		data: {
			title: 'My second note',
			body: 'Hello, world!',
			userId: user.id
		}
	})

	console.log(`Database has been seeded. 🌱`)
}

// eslint-disable-next-line promise/catch-or-return
seed()
	.catch(error => {
		console.error(error)
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
