-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ReservationType" AS ENUM ('EXPORT', 'IMPORT');

-- CreateTable
CREATE TABLE "User" (
    "ID" SERIAL NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Name" TEXT,
    "Role" "Role" NOT NULL DEFAULT E'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Camion" (
    "ID" SERIAL NOT NULL,
    "matricule" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Camion_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "ID" SERIAL NOT NULL,
    "CamionID" INTEGER NOT NULL,
    "UpdatedAt" TIMESTAMP(3),
    "UserID" INTEGER NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Type" "ReservationType" NOT NULL,
    "ContainerMatricule" TEXT NOT NULL,
    "Status" "ReservationStatus" NOT NULL DEFAULT E'PENDING',
    "Dimension" TEXT,
    "ContainerType" TEXT,
    "Imdg" BOOLEAN DEFAULT false,
    "Postion" TEXT,
    "Block" TEXT,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Container" (
    "ID" SERIAL NOT NULL,
    "Matricule" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Imdg" BOOLEAN NOT NULL,
    "Postion" TEXT NOT NULL,
    "Block" TEXT NOT NULL,
    "userID" INTEGER,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Camion_matricule_key" ON "Camion"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "Container_Matricule_key" ON "Container"("Matricule");

-- AddForeignKey
ALTER TABLE "Camion" ADD CONSTRAINT "Camion_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_CamionID_fkey" FOREIGN KEY ("CamionID") REFERENCES "Camion"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE SET NULL ON UPDATE CASCADE;
