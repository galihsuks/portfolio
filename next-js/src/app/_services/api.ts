import { Type_ApiLoginRes, Type_ApiSignupRes } from "./interface";
import { envVar } from "./utils";

export async function login(email: string, sandi: string) {
    const fetching = await fetch(`${envVar.backendURL}/auth/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, sandi }),
    });
    const response = (await fetching.json()) as Type_ApiLoginRes;
    return {
        status: fetching.status,
        data: response,
    };
}

export async function signup(email: string, nama: string, sandi: string) {
    const fetching = await fetch(`${envVar.backendURL}/auth/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, sandi, nama }),
    });
    const response = (await fetching.json()) as Type_ApiSignupRes;
    return {
        status: fetching.status,
        data: response,
    };
}
