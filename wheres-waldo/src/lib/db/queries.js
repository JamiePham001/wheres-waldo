import { prisma } from "../prismaClient.js";

export const createMap = async (mapData) => {
  const {
    name,
    data,
    waldoCoordinates,
    wendaCoordinates,
    odlawCoordinates,
    wizardCoordinates,
  } = mapData;
  return await prisma.map.create({
    data: {
      name: name,
      data: data,
      waldo: JSON.stringify(waldoCoordinates),
      wenda: JSON.stringify(wendaCoordinates),
      odlaw: JSON.stringify(odlawCoordinates),
      wizard: JSON.stringify(wizardCoordinates),
    },
  });
};
