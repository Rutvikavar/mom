import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.users.findUnique({
            where: { email },
        });

        if (user) {
            // Check if password matches. 
            // If you are using plain text for testing, change this.
            // But bcrypt is standard.
            const isMatch = await bcrypt.compare(pass, user.password || '');
            if (isMatch) {
                const { password, ...result } = user;
                return result;
            }

            // Temporary fallback for plain text if bcrypt fails (remove in production)
            if (user.password === pass) {
                const { password, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.user_id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async directResetPassword(email: string, pass: string) {
        const user = await this.prisma.users.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('User with this email does not exist');
        }

        const hashedPassword = await bcrypt.hash(pass, 10);

        await this.prisma.users.update({
            where: { email },
            data: {
                password: hashedPassword,
                reset_token: null,
                reset_token_expiry: null,
            },
        });

        return { message: 'Password has been updated successfully' };
    }
}
