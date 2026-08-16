import bcrypt from "bcrypt";
import dotenv from "dotenv";
import sequelize from "./shared/database/connection.js";
import {
  UserModel,
  PatientModel,
  AlertModel,
  SightingModel,
} from "./shared/database/models/index.js";

dotenv.config();

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    await sequelize.sync({ force: true });
    console.log("Database synced (all tables recreated).");

    const password_hash = await bcrypt.hash("password123", 10);

    const admin = await UserModel.create({
      name: "Agendra",
      email: "agendra@gmail.com",
      password_hash,
      role: "admin",
    });

    const adminTwo = await UserModel.create({
      name: "Admin",
      email: "admin@gmail.com",
      password_hash,
      role: "admin",
    });

    const yanzi = await UserModel.create({
      name: "Yanzi",
      email: "yanzi@gmail.com",
      password_hash,
      phone: "9800000001",
      role: "caregiver",
    });

    const hemant = await UserModel.create({
      name: "Hemant",
      email: "hemant@gmail.com",
      password_hash,
      phone: "9800000002",
      role: "community",
    });

    const patientOne = await PatientModel.create({
      name: "Ram Bahadur",
      date_of_birth: "1942-03-15",
      medical_notes: "Mild Alzheimer's",
      caregiver_id: yanzi.id,
      photo_url: null,
    });

    const patientTwo = await PatientModel.create({
      name: "Sita Devi",
      date_of_birth: "1938-07-22",
      medical_notes: "Stage 2",
      caregiver_id: yanzi.id,
      photo_url: null,
    });

    const activeAlert = await AlertModel.create({
      patient_id: patientOne.id,
      created_by: yanzi.id,
      status: "active",
      description: "Last seen near Thamel, Kathmandu. Wearing a blue jacket.",
    });

    await AlertModel.create({
      patient_id: patientTwo.id,
      created_by: yanzi.id,
      status: "resolved",
      description: "Last seen near Baneshwor, Kathmandu. May be confused.",
      resolved_at: new Date(),
    });

    await SightingModel.create({
      alert_id: activeAlert.id,
      reported_by: hemant.id,
      location_text: "Near Thamel Chowk",
      notes: "Wearing blue jacket",
    });

    await SightingModel.create({
      alert_id: activeAlert.id,
      reported_by: hemant.id,
      location_text: "Kathmandu Mall entrance",
      notes: "Looked confused",
    });

    console.log("\nSeed completed successfully!\n");
    console.log("Test accounts (password: password123):");
    console.log("  Admin:     agendra@gmail.com");
    console.log("  Admin:     admin@gmail.com");
    console.log("  Caregiver: yanzi@gmail.com");
    console.log("  Community: hemant@gmail.com");
    console.log(`\nAdmin IDs: ${admin.id}, ${adminTwo.id}`);

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seed();
