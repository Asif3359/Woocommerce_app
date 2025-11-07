import { Cart } from "@/models/Cart";
import { RealmProvider as RealmProviderBase } from "@realm/react";
import React from "react";
interface RealmProviderProps {
  children: React.ReactNode;
}

export default function RealmProvider({ children }: RealmProviderProps) {
  return (
    <RealmProviderBase schema={[Cart]} schemaVersion={1}>
      {children}
    </RealmProviderBase>
  );
}
