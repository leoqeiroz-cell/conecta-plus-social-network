import bcrypt from "bcryptjs";
import { PostCategory, PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Conecta@123", 10);

  const [admin, ana, bruno, clara] = await Promise.all(
    [
      {
        name: "Leonardo Queiroz",
        email: "admin@conectamais.edu",
        course: "Desenvolvimento Full Stack",
        bio: "Administrador da comunidade Conecta+.",
        role: UserRole.ADMIN,
        points: 140
      },
      {
        name: "Ana Silva",
        email: "ana@conectamais.edu",
        course: "Analise e Desenvolvimento de Sistemas",
        bio: "Gosto de ajudar em logica, APIs e organizacao de estudos.",
        role: UserRole.USER,
        points: 88
      },
      {
        name: "Bruno Lima",
        email: "bruno@conectamais.edu",
        course: "Engenharia de Software",
        bio: "Compartilho projetos, oportunidades e materiais.",
        role: UserRole.USER,
        points: 72
      },
      {
        name: "Clara Mendes",
        email: "clara@conectamais.edu",
        course: "Sistemas para Internet",
        bio: "Foco em UI, acessibilidade e comunidades de aprendizagem.",
        role: UserRole.USER,
        points: 64
      }
    ].map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: user,
        create: { ...user, passwordHash }
      })
    )
  );

  await prisma.groupMember.deleteMany();
  await prisma.studyGroup.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();

  await Promise.all(
    ["estudos", "projetos", "emprego", "duvidas"].map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  const posts = [
    {
      title: "Trilha de estudos para API REST com Express",
      content:
        "Organizei um roteiro com HTTP, middlewares, validacao com Zod, Prisma e testes basicos. Quem quiser revisar comigo pode comentar aqui.",
      category: PostCategory.ESTUDOS,
      authorId: ana.id,
      tags: ["estudos", "duvidas"]
    },
    {
      title: "Projeto de extensao: mapa de oportunidades locais",
      content:
        "Estamos criando um pequeno painel para divulgar vagas, bolsas e eventos da comunidade. A ideia e conectar estudantes a oportunidades reais.",
      category: PostCategory.PROJETOS,
      authorId: bruno.id,
      tags: ["projetos", "emprego"]
    },
    {
      title: "Como melhorar contraste e leitura no dark mode?",
      content:
        "Estou ajustando uma tela com PrimeVue e Tailwind. Quais boas praticas voces usam para acessibilidade em temas escuros?",
      category: PostCategory.DUVIDAS,
      authorId: clara.id,
      tags: ["duvidas", "projetos"]
    }
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        authorId: post.authorId,
        tags: {
          create: post.tags.map((name) => ({
            tag: { connect: { name } }
          }))
        },
        comments: {
          create: [
            {
              content: "Excelente contribuicao para a comunidade.",
              authorId: admin.id
            }
          ]
        },
        likes: {
          create: [{ authorId: admin.id }]
        }
      }
    });
  }

  await Promise.all(
    [
      {
        name: "Grupo Full Stack",
        description: "Encontros semanais para estudar frontend, backend e deploy.",
        category: PostCategory.ESTUDOS
      },
      {
        name: "Projetos de Impacto Social",
        description: "Espaco para tirar ideias do papel e testar solucoes comunitarias.",
        category: PostCategory.PROJETOS
      },
      {
        name: "Carreira e Empregabilidade",
        description: "Compartilhamento de vagas, portfolio, curriculo e entrevistas.",
        category: PostCategory.EMPREGO
      }
    ].map((group) =>
      prisma.studyGroup.create({
        data: {
          ...group,
          members: {
            create: [{ userId: ana.id }, { userId: bruno.id }]
          }
        }
      })
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
