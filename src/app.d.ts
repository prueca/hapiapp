// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import accountTypes from '$lib/config/account.types'
import userRoles from '$lib/config/user.roles'

declare global {
    interface Json {
        [key: string]: any
    }

    interface Data<T> {
        data: T
    }

    interface AuthUser {
        id: string
        role: (typeof userRoles)[keyof typeof userRoles]
        username: string
        firstName: string
        middleName: string
        lastName: string
    }

    interface AuthAccount {
        id: string
        type: (typeof accountTypes)[keyof typeof accountTypes]
        name: string
        address: string
        companyCode: string
    }

    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}

        interface Locals {
            user: AuthUser | null
            account: AuthAccount | null
            isAuthenticated: boolean
        }
    }
}

export {}
