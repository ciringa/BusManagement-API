-- CreateTable
CREATE TABLE "Bus" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "Model" TEXT NOT NULL,
    "color" TEXT
);

-- CreateTable
CREATE TABLE "Passager" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Target" TEXT NOT NULL,
    "BusId" TEXT NOT NULL,
    CONSTRAINT "Passager_BusId_fkey" FOREIGN KEY ("BusId") REFERENCES "Bus" ("Id") ON DELETE RESTRICT ON UPDATE CASCADE
);
