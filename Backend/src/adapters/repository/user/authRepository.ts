import { OAuth2Client } from "google-auth-library";
import { UserModel } from "../../../framework/database/Models/userModel";
import { IAuthRepository } from "../../../domain/interface/UserRepository/IauthRepository";
import { User } from "../../../domain/entities/UserEntity";


let client: OAuth2Client | null = null;

const getOAuthClient = (): OAuth2Client => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID environment variable is not set");
  }
  if (!client) {
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return client;
};

export class AuthRepository implements IAuthRepository {
  async signupWithGoogle(googleToken: string): Promise<User> {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error("Google Client ID is not configured");
    }
    
    try {
      const oauthClient = getOAuthClient();
      const ticket = await oauthClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new Error("Invalid Google token - missing email");
      }
      
      const userDoc = await (UserModel).findOneAndUpdate(
      { email: payload.email },
      {
        $setOnInsert: {
          name: payload.name || payload.email?.split('@')[0] || 'User',
          email: payload.email,
          isGoogleUser: true,
          status: 'active',
          role: 'user',
        },
        $set: {
          imageUrl: payload.picture || '',
        }
      },
      { new: true, upsert: true }
    ).lean();

      if (!userDoc) {
        throw new Error("User creation or retrieval failed");
      }
      return userDoc;
    } catch (error) {
      if (error.message) {
        throw error;
      }
      throw new Error(`Google authentication failed: ${error?.message || 'Unknown error'}`);
    }
  }
}
