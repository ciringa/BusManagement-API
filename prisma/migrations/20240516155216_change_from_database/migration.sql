-- CreateTable
CREATE TABLE "Bus" (
    "Id" TEXT NOT NULL,
    "Model" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Passager" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Target" TEXT NOT NULL,
    "BusId" TEXT NOT NULL,
    "position" INTEGER,

    CONSTRAINT "Passager_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Passager" ADD CONSTRAINT "Passager_BusId_fkey" FOREIGN KEY ("BusId") REFERENCES "Bus"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
