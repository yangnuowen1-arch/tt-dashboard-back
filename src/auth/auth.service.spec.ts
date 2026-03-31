import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("AuthService", () => {
  let service: AuthService;
  const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

  const prismaServiceMock = {
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it("should hash password and create user on register", async () => {
    prismaServiceMock.users.findUnique.mockResolvedValue(null);
    prismaServiceMock.users.create.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      password: "hashed-password",
      name: "tester",
      role: "user",
      is_active: true,
      created_at: new Date("2026-03-31T00:00:00.000Z"),
      updated_at: new Date("2026-03-31T00:00:00.000Z"),
    });

    bcryptMock.hash.mockResolvedValue("hashed-password");

    const result = await service.register({
      email: "USER@example.com",
      password: "123456",
      username: "tester",
    });

    expect(prismaServiceMock.users.create).toHaveBeenCalledWith({
      data: {
        email: "user@example.com",
        password: "hashed-password",
        name: "tester",
      },
    });
    expect(bcryptMock.hash).toHaveBeenCalledWith("123456", 12);
    expect(result.email).toBe("user@example.com");
    expect(result.username).toBe("tester");
  });

  it("should throw when email already exists on register", async () => {
    prismaServiceMock.users.findUnique.mockResolvedValue({
      id: 1,
    });

    await expect(
      service.register({
        email: "user@example.com",
        password: "123456",
        username: "tester",
      }),
    ).rejects.toThrow(ConflictException);
  });

  it("should return jwt token on login", async () => {
    prismaServiceMock.users.findUnique.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      password: "hashed-password",
      name: "tester",
      role: "user",
      is_active: true,
      created_at: new Date("2026-03-31T00:00:00.000Z"),
      updated_at: new Date("2026-03-31T00:00:00.000Z"),
    });

    bcryptMock.compare.mockResolvedValue(true);
    jwtServiceMock.signAsync.mockResolvedValue("jwt-token");

    const result = await service.login({
      email: "user@example.com",
      password: "123456",
    });

    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
      sub: 1,
      email: "user@example.com",
    });
    expect(result.token).toBe("jwt-token");
    expect(result.user.email).toBe("user@example.com");
  });

  it("should throw when password is invalid", async () => {
    prismaServiceMock.users.findUnique.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      password: "hashed-password",
      is_active: true,
    });

    bcryptMock.compare.mockResolvedValue(false);

    await expect(
      service.login({
        email: "user@example.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
