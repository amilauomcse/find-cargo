import { NestFactory } from "@nestjs/core";
import { AppModule } from "../apps/api/src/app.module";
import { AuthService } from "../apps/auth/src/auth.service";

async function createRootUser() {
  console.log("🚀 Creating root user...");

  try {
    // Create a minimal app context
    const app = await NestFactory.createApplicationContext(AppModule);

    // Get the auth service
    const authService = app.get(AuthService);

    // Create root user
    const rootUser = await authService.createRootUser();

    console.log("✅ Root user created successfully!");
    console.log("📧 Email: root");
    console.log("🔑 Password: 123");
    console.log("👤 Name:", rootUser.fullName);
    console.log("🔐 Role:", rootUser.role);

    // Close the app
    await app.close();
  } catch (error) {
    console.error("❌ Failed to create root user:", error.message);
    process.exit(1);
  }
}

// Run the script
createRootUser();
