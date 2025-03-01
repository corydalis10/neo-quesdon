import { NextRequest } from 'next/server';
import { FollowingService } from '../../../_service/following/following-service';

const service = FollowingService.get();
export async function POST(req: NextRequest) {
  return await service.getFollowing(req);
}
