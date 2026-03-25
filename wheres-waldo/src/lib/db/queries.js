import { prisma } from "../prisma";

export const createMap = async (mapData, imageData) => {
  const {
    name,
    waldoCoordinates,
    wendaCoordinates,
    odlawCoordinates,
    wizardCoordinates,
  } = mapData;
  return await prisma.image.create({
    data: {
      name,
      data: JSON.stringify(imageData),
      waldo: waldoCoordinates,
      wenda: wendaCoordinates,
      odlaw: odlawCoordinates,
      wizard: wizardCoordinates,
    },
  });
};

export const getAllMaps = async () => {
  return await prisma.image.findMany();
};

export const getMapById = async (id) => {
  return await prisma.image.findUnique({
    where: { id },
  });
};

export const createUser = async (name) => {
  return await prisma.user.create({
    data: { name },
  });
};

export const getUserByName = async (name) => {
  return await prisma.user.findUnique({
    where: { name },
  });
};

export const createScore = async (userId, imageId) => {
  return await prisma.score.create({
    data: {
      userId,
      imageId,
    },
  });
};

export const finishScore = async (scoreId) => {
  return await prisma.score.update({
    where: { id: scoreId },
    data: {
      finishAt: new Date(),
    },
  });
};

export const submitScore = async (scoreId) => {
  return await prisma.score.update({
    where: { id: scoreId },
    data: {
      submitted: true,
    },
  });
};

// getting the rank of a score by calculating time finished and time started and returning a numbered rank
export const getRankById = async (scoreId) => {
  const result = await prisma.$queryRaw`
    SELECT rank FROM (
      SELECT id, RANK() OVER (
        PARTITION BY "imageId"
        ORDER BY ("finishAt" - "startedAt") ASC
      ) AS rank
      FROM "Score"
      WHERE "finishAt" IS NOT NULL
        AND (submitted IS TRUE OR id = ${scoreId})
    ) ranked
    WHERE id = ${scoreId}
  `;
  return result[0]?.rank ? Number(result[0].rank) : null;
};

export const getOrderedLevels = async () => {
  return await prisma.image.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const getTopScoresForImage = async (imageId) => {
  const result = await prisma.$queryRaw`
    SELECT
      "s"."id" AS id,
      "s"."userId" AS "userId",
      "s"."startedAt" AS "startedAt",
      "s"."finishAt" AS "finishAt",
      "u"."name" AS name
    FROM "Score" "s"
    INNER JOIN "User" "u" ON "s"."userId" = "u"."id"
    WHERE "s"."imageId" = ${imageId}
      AND "s"."finishAt" IS NOT NULL
      AND "s"."submitted" IS TRUE
    ORDER BY ("s"."finishAt" - "s"."startedAt") ASC
    LIMIT 30
  `;
  return result;
};
