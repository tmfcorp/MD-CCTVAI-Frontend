"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MongoAbility } from "@casl/ability";
import { Spin } from "antd";
import { abilityFor, buildAbility } from "@/lib/ability";
import { useAuth } from "./AuthContext";
import { permissionsAPI } from "@/services/api/permissionsAPI";

interface AbilityContextType {
  ability: MongoAbility | null;
  permissions: string[];
  loading: boolean;
  abilityFor: (subject: string) => {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
}

const AbilityContext = createContext<AbilityContextType | null>(null);

export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error("useAbility must be used inside AbilityProvider");
  }
  return context;
};

export const AbilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [ability, setAbility] = useState<MongoAbility | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.user_id;

  useEffect(() => {
    if (!userId) return;

    const fetchPermissions = async () => {
      try {
        const res = await permissionsAPI.getUserPermissionsById({ user_id: userId });

        if (res.success) {
          console.log("PERMISSIONS", res.data);
          setPermissions(res.data);
          setAbility(buildAbility(res.data));
        }
      } catch (error) {
        console.error("Permission fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [userId]);

  return (
    <AbilityContext.Provider
      value={{
        ability,
        permissions,
        loading,
        abilityFor: (subject: string) => abilityFor(ability, subject),
      }}
    >
      {children}
    </AbilityContext.Provider>
  );
};