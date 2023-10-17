"use client"

import { useEffect } from "react"

import {Crisp} from "crisp-sdk-web"

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("7269b043-c5d7-44fb-9f83-a716a1d16278");
    }, []);

    return null;
}