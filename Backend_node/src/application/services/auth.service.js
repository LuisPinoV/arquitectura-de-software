//Use cases
import { LoginUseCase } from "../useCases/auth/cognito/login.useCase.js";
import { LogoutUseCase } from "../useCases/auth/cognito/logout.useCase.js";
import { GetUserDataUseCase } from "../useCases/auth/cognito/getUserData.useCase.js";
import { SaveResfreshTokenUseCase } from "../useCases/auth/tokens/saveRefreshToken.useCase.js";
import { InvalidateTokenUseCase } from "../useCases/auth/tokens/invalidateToken.useCase.js";
import { DecodeAccessTokenUseCase } from "../useCases/auth/tokens/decodeAccessToken.useCase.js";
import { RefreshUseCase } from "../useCases/auth/cognito/refresh.useCase.js";
import { UpdateResfreshTokenUseCase } from "../useCases/auth/tokens/updateRefreshToken.useCase.js";
import { CreateUserUseCase } from "../useCases/auth/cognito/createUser.useCase.js";
import { PublishCreateUserUseCase } from "../useCases/auth/sns/publishCreateUser.useCase.js";

//Repositories
import { cognitoRepository } from "../../infrastructure/auth/cognito.repository.js";
import { tokenRepository } from "../../infrastructure/auth/token.repository.js";
import { AuthEventsRepository } from "../../infrastructure/auth/auth-events.repository.js";

export class AuthService {
  constructor() {
    this.cognitoRepository = cognitoRepository;
    this.tokenRepository = tokenRepository;

    this.createdUserTopicArn = process.env.CREATE_USER_TOPIC_SNS_ARN ?? null;
    this.loggedInUserTopicArn = process.env.CREATE_USER_TOPIC_SNS_ARN ?? null;
    
    this.authEventsRepository = new AuthEventsRepository(this.createdUserTopicArn, this.loggedInUserTopicArn);
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

      return ({
        accessToken: newData.accessToken,
        idToken: newData.idToken
      });
    } else {
      return null;
    }
  }

  async createUser(username, password, name = null, companyName = null, spaceName = null) {
    const createUser = new CreateUserUseCase(this.cognitoRepository);

    const newUserData = await createUser.execute(username, password, name, companyName, spaceName);

    const publishCreateUser = new PublishCreateUserUseCase(
      this.authEventsRepository
    );

    try {
      await publishCreateUser.execute(username, newUserData.userId);
    } catch (err) {
      console.log("Error publishing message from created new user: ", err);
    }

    return newUserData;
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
