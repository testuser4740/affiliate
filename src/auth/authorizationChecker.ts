import { Action } from 'routing-controllers';

export interface AuthUser {
    id: string;
    role: 'admin' | 'ambassador' | 'public';
    ambassadorId?: string | null;
    email?: string;
    name?: string | null;
}

export function authorizationChecker(_connection: any): (action: Action, roles: string[]) => boolean {
    return (action: Action, roles: string[]): boolean => {
        const user = action.request.user as AuthUser | undefined;
        if (!user) {
            return false;
        }
        if (roles && roles.length > 0) {
            return roles.includes(user.role);
        }
        return true;
    };
}

export function currentUserChecker(_connection: any): (action: Action) => AuthUser | undefined {
    return (action: Action): AuthUser | undefined => action.request.user;
}
