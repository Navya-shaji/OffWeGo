import { OAuth2Client } from "google-auth-library";
import { UserModel } from "../../../framework/database/Models/userModel";
import { User } from "../../../domain/entities/UserEntity";
import { IAuthRepository } from "../../../domain/interface/UserRepository/IauthRepository";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthRepository implements IAuthRepository {
  async signupWithGoogle(googleToken: string): Promise<User> {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Invalid Google token");
    }
    const userDoc = await UserModel.findOneAndUpdate(
      { email: payload.email },
      {
        $setOnInsert: {
          name: payload.name,
          email: payload.email,
          profileImage: payload.picture,
          isGoogleUser: true,
        },
      },
      { new: true, upsert: true }
    ).lean();

    if (!userDoc) {
      throw new Error("User creation or retrieval failed");
    }
    return userDoc;
  }
}
