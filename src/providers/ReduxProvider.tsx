// src/providers/ReduxProvider.tsx   (or app/providers/ReduxProvider.tsx)
"use client";                                 // ← THIS IS THE KEY

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ReactNode } from "react";

export function ReduxProvider({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}