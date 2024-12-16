export enum RedisMapper {
  MQ_PUBLIC = "MATCH_QUEUE_PUBLIC",
  MQ_PRIVATE = "MATCH_QUEUE_PRIVATE",
  MR_PUBLIC = "MATCH_ROOM_PUBLIC",
  MR_PRIVATE = "MATCH_ROOM_PRIVATE",
}

export const MapRedisConstant = (mapper: RedisMapper, userId: string) => {
  return `${mapper}_${userId}`;
};
