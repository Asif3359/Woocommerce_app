import { RealmProvider as RealmProviderBase } from "@realm/react";
import React from "react";
interface RealmProviderProps {
  children: React.ReactNode;
}

export function RealmProvider({ children }: RealmProviderProps) {
  return (
    <RealmProviderBase schema={[]} schemaVersion={1}>
      {children}
    </RealmProviderBase>
  );
}
