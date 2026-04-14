import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
    await prisma.$executeRawUnsafe(
        'TRUNCATE TABLE "Cards", "Sprints", "Workflows" RESTART IDENTITY CASCADE',
    );

    const [todo, inProgress, review, done] = await Promise.all([
        prisma.workflows.create({ data: { title: 'To Do', order: 1 } }),
        prisma.workflows.create({ data: { title: 'In Progress', order: 2 } }),
        prisma.workflows.create({ data: { title: 'Review', order: 3 } }),
        prisma.workflows.create({ data: { title: 'Done', order: 4 } }),
    ]);

    const day = 24 * 60 * 60 * 1000;
    const now = Date.now();

    const [sprintDone, sprintActive, sprintPlanned] = await Promise.all([
        prisma.sprints.create({
            data: {
                title: 'Sprint 23',
                status: 'DONE',
                startDate: new Date(now - 28 * day),
                endDate: new Date(now - 14 * day),
            },
        }),
        prisma.sprints.create({
            data: {
                title: 'Sprint 24',
                status: 'IN_PROGRESS',
                startDate: new Date(now - 7 * day),
                endDate: new Date(now + 7 * day),
            },
        }),
        prisma.sprints.create({
            data: {
                title: 'Sprint 25',
                status: 'PLANNED',
                startDate: new Date(now + 14 * day),
                endDate: new Date(now + 28 * day),
            },
        }),
    ]);

    type Seed = {
        title: string;
        workflowId: number;
        sprintId: number | null;
        type: 'EPIC' | 'STORY' | 'TASK' | 'SUB_TASK' | 'BUG';
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
    };

    const seeds: Seed[] = [
        // Sprint 23 (DONE) — 전부 Done workflow
        { title: '로그인 화면 리뉴얼', workflowId: done.id, sprintId: sprintDone.id, type: 'STORY', priority: 'HIGH' },
        { title: 'OAuth 토큰 갱신 버그', workflowId: done.id, sprintId: sprintDone.id, type: 'BUG', priority: 'HIGH' },
        { title: '회원가입 이메일 인증', workflowId: done.id, sprintId: sprintDone.id, type: 'STORY', priority: 'MEDIUM' },

        // Sprint 24 (IN_PROGRESS) — 각 workflow에 분배
        { title: '대시보드 스키마 설계', workflowId: done.id, sprintId: sprintActive.id, type: 'TASK', priority: 'HIGH' },
        { title: 'Cards 조회 API', workflowId: review.id, sprintId: sprintActive.id, type: 'TASK', priority: 'HIGH' },
        { title: '보드 드래그앤드롭 UI', workflowId: inProgress.id, sprintId: sprintActive.id, type: 'STORY', priority: 'MEDIUM' },
        { title: '스프린트 필터 구현', workflowId: inProgress.id, sprintId: sprintActive.id, type: 'TASK', priority: 'MEDIUM' },
        { title: '카드 상세 모달', workflowId: todo.id, sprintId: sprintActive.id, type: 'STORY', priority: 'MEDIUM' },
        { title: '레이블 필터 사이드바', workflowId: todo.id, sprintId: sprintActive.id, type: 'TASK', priority: 'LOW' },

        // Sprint 25 (PLANNED) — 전부 To Do
        { title: '알림 시스템 설계', workflowId: todo.id, sprintId: sprintPlanned.id, type: 'EPIC', priority: 'HIGH' },
        { title: '모바일 반응형 대응', workflowId: todo.id, sprintId: sprintPlanned.id, type: 'STORY', priority: 'MEDIUM' },

        // Backlog (sprintId: null)
        { title: '성능 모니터링 대시보드', workflowId: todo.id, sprintId: null, type: 'EPIC', priority: 'LOW' },
        { title: '다국어(i18n) 지원', workflowId: todo.id, sprintId: null, type: 'STORY', priority: 'LOW' },
        { title: '접근성 감사', workflowId: todo.id, sprintId: null, type: 'TASK', priority: 'MEDIUM' },
    ];

    const orderMap = new Map<string, number>();
    for (const seed of seeds) {
        const groupKey = `${seed.workflowId}:${seed.sprintId ?? 'null'}`;
        const nextOrder = (orderMap.get(groupKey) ?? 0) + 1;
        orderMap.set(groupKey, nextOrder);

        const card = await prisma.cards.create({
            data: {
                title: seed.title,
                workflowId: seed.workflowId,
                sprintId: seed.sprintId,
                type: seed.type,
                priority: seed.priority,
                order: nextOrder,
                key: '__tmp__',
            },
        });
        await prisma.cards.update({
            where: { id: card.id },
            data: { key: `BOARD-${card.id}` },
        });
    }

    console.log('Seed complete:', {
        workflows: 4,
        sprints: 3,
        cards: seeds.length,
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
