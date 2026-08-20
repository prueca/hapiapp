// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    interface PlainObject {
        [key: string]: any
    }

    interface Data<T> {
        data: T
    }

    interface User {
        id: string
        role: string
        username: string
        firstName: string
        middleName: string
        lastName: string
    }

    interface Account {
        id: string
        type: string
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
            user: User | null
            account: Account | null
            isAuthenticated: boolean
        }
    }
}

export {}
