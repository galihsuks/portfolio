"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getMyProfileApi,
    updateMyProfileApi,
} from "../../_services/api/user.api";

export function useMyProfileQuery() {
    return useQuery({
        queryKey: ["my-profile"],
        queryFn: getMyProfileApi,
    });
}

export function useUpdateMyProfileMutation() {
    return useMutation({
        mutationFn: updateMyProfileApi,
    });
}
