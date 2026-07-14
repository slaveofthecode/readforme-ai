import { prisma } from './prisma';
import fs from 'fs/promises';

const FILE_TTL_HOURS = parseInt(process.env.FILE_TTL_HOURS || '24', 10);

export async function cleanupExpiredFiles(): Promise<number> {
	const ttlMs = FILE_TTL_HOURS * 60 * 60 * 1000;
	const cutoff = new Date(Date.now() - ttlMs);

	const expiredFiles = await prisma.file.findMany({
		where: {
			createdAt: { lt: cutoff },
			deletedAt: null,
		},
	});

	let deletedCount = 0;

	for (const file of expiredFiles) {
		try {
			if (file.filePath) {
				await fs.unlink(file.filePath).catch(() => {});
			}

			await prisma.file.update({
				where: { id: file.id },
				data: { deletedAt: new Date() },
			});

			deletedCount++;
		} catch {
			console.error(`Failed to cleanup file ${file.id}`);
		}
	}

	return deletedCount;
}

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

export function startCleanupScheduler(): void {
	if (cleanupInterval) return;

	const intervalMs = Math.max(FILE_TTL_HOURS * 60 * 60 * 1000, 60 * 60 * 1000);

	cleanupInterval = setInterval(async () => {
		const deleted = await cleanupExpiredFiles();
		if (deleted > 0) {
			console.log(`Cleanup: removed ${deleted} expired file(s)`);
		}
	}, intervalMs);
}

export function stopCleanupScheduler(): void {
	if (cleanupInterval) {
		clearInterval(cleanupInterval);
		cleanupInterval = null;
	}
}
