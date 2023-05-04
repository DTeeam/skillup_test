import { Injectable, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { JwtService } from '@nestjs/jwt'
import { User } from 'entities/user.entity'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()])
    const request = context.switchToHttp().getRequest()

    if (isPublic) return true

    try {
      const access_token = request.cookies['access_token']
      return !!this.jwtService.verify(access_token)
    } catch (error) {
      return false
    }
  }
}
