-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "items" TEXT NOT NULL DEFAULT '[]',
    "subtotal" REAL NOT NULL,
    "shipping" REAL NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("address", "city", "country", "createdAt", "customerEmail", "customerName", "customerPhone", "id", "items", "notes", "postalCode", "shipping", "status", "subtotal", "total", "updatedAt") SELECT "address", "city", "country", "createdAt", "customerEmail", "customerName", "customerPhone", "id", "items", "notes", "postalCode", "shipping", "status", "subtotal", "total", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "storeName" TEXT NOT NULL DEFAULT 'SUN KISSED YOU',
    "storeEmail" TEXT NOT NULL DEFAULT 'contact@sunkissed.com',
    "currency" TEXT NOT NULL DEFAULT '£',
    "shippingFee" REAL NOT NULL DEFAULT 5.0,
    "freeShipMin" REAL NOT NULL DEFAULT 100.0,
    "heroTitle" TEXT NOT NULL DEFAULT 'SUN KISSED YOU',
    "heroSubtitle" TEXT NOT NULL DEFAULT '18K Gold Plated Jewellery · High Quality & Affordable',
    "footerText" TEXT NOT NULL DEFAULT '© 2024 SUN KISSED YOU. All rights reserved.'
);
INSERT INTO "new_Settings" ("currency", "footerText", "freeShipMin", "heroSubtitle", "heroTitle", "id", "shippingFee", "storeEmail", "storeName") SELECT "currency", "footerText", "freeShipMin", "heroSubtitle", "heroTitle", "id", "shippingFee", "storeEmail", "storeName" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
