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
