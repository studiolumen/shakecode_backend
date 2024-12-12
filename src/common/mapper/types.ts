import { v4 as uuid } from "uuid";

import { numberPermission } from "../utils/permission.util";

export const LoginTypeValues = ["password"] as const;
export type LoginType = (typeof LoginTypeValues)[number];

export const CompilerTypeValues = ["gcc", "node", "python"] as const;
export type CompilerType = (typeof CompilerTypeValues)[number];

export const ProblemCategoryValues = ["basic"] as const;
export type ProblemCategory = (typeof ProblemCategoryValues)[number];

export const UploadBufferIdentifierValues = ["problem_testcase_upload"] as const;
export type UploadBufferIdentifier = (typeof UploadBufferIdentifierValues)[number];

export const PermissionValidationTypeValues = ["permission", "permission_group"] as const;
export type PermissionValidationType = (typeof PermissionValidationTypeValues)[number];

export const GameModeValues = ["1VS1"] as const;
export type GameMode = (typeof GameModeValues)[number];

export type UserJWT = {
  id: string;
  email: string;
  name: string;
  nickname: string;
  lvl: number;
  rating: number;
  permission: number;
  refresh: boolean;
  sessionIdentifier: string;
};

export type SocketUser = {
  userId: string;
  socketId: string | null;
};

export type RoomStatus = "waiting_owner" | "waiting" | "starting" | "playing";

export type MatchQueueElement = {
  connected: boolean;
  websocketInitId: string;
  user: string;
  rating: number;
};

export type MatchRoomElement = {
  websocketInitId: string;
  roomId: string;
  gameMode: GameMode;
  players: SocketUser[];
  maxPlayer: number;
  roomOwner: SocketUser;
  roomStatus: RoomStatus;
  issued: number;
};
