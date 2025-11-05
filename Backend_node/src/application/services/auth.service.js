import { LoginUseCase } from "../useCases/auth/cognito/login.useCase";

import { cognitoRepository } from "../../infrastructure/auth/cognito.repository";
import { tokenRepository } from "../../infrastructure/auth/token.repository";

import { LogoutUseCase } from "../useCases/auth/cognito/logout.useCase";
import { GetUserDataUseCase } from "../useCases/auth/cognito/getUserData.useCase";
import { SaveResfreshTokenUseCase } from "../useCases/auth/tokens/saveRefreshToken.useCase";
import { InvalidateTokenUseCase } from "../useCases/auth/tokens/invalidateToken.useCase";
import { DecodeAccessTokenUseCase } from "../useCases/auth/tokens/decodeAccessToken.useCase";
import { RefreshUseCase } from "../useCases/auth/cognito/refresh.useCase";
import { UpdateResfreshTokenUseCase } from "../useCases/auth/tokens/updateRefreshToken.useCase";

export class AuthService {
  constructor() {
    this.cognitoRepository = cognitoRepository;
    this.tokenRepository = tokenRepository;
  }

  async login(username, password) {
    const login = new LoginUseCase(this.cognitoRepository);

    const userData = await login.execute(username, password);

    //TODO: Create SNS and Invoke instead of adding stuff here
    //Save to logs
    await this.saveRefreshToken(
      userData.sub,
      userData.refreshToken,
      userData.expiresIn
    );

    return userData;
  }

  async logout(accessToken) {
    const logout = new LogoutUseCase(this.cognitoRepository);

    const loggedOut = await logout.execute(accessToken);

    if (loggedOut) {
      const userData = this.getUserData(accessToken);

      if (userData) await this.invalidateTokens(accessToken);

      return loggedOut;
    }

    return loggedOut;
  }

  async refresh(refreshToken) {
    const refresh = new RefreshUseCase(this.cognitoRepository);

    const newData = await refresh.execute(refreshToken);

    if (newData.ok) {
      await this.updateRefreshToken(
        newData.sub,
        newData.refreshToken,
        newData.expiresIn
      );

      return newData;
    } else {
      return null;
    }
  }

  async getUserData(accessToken) {
    const getUserData = new GetUserDataUseCase(this.cognitoRepository);

    const userData = await getUserData.execute(accessToken);

    return userData;
  }

  async saveRefreshToken(id, refreshToken, expiration) {
    const saveRefreshToken = new SaveResfreshTokenUseCase(this.tokenRepository);
    return await saveRefreshToken.execute(id, refreshToken, expiration);
  }

  async invalidateTokens(accessToken) {
    const invalidateToken = new InvalidateTokenUseCase(this.tokenRepository);

    const data = this.decodeAccessToken(accessToken);

    return await invalidateToken.execute(data.userId);
  }

  decodeAccessToken(accessToken) {
    const decodeToken = new DecodeAccessTokenUseCase(this.tokenRepository);

    return decodeToken.execute(accessToken);
  }

  async updateRefreshToken(id, newToken, newExpireTime) {
    const updateRefreshToken = new UpdateResfreshTokenUseCase(
      this.tokenRepository
    );

    return await updateRefreshToken.execute(id, newToken, newExpireTime);
  }
}
