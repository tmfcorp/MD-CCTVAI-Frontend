import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";

export type Actions = "read" | "create" | "update" | "delete";
export type Subjects = string | "all";

export const buildAbility = (permissions: string[]): MongoAbility => {
  const { can, build } = new AbilityBuilder<MongoAbility>(createMongoAbility);

  permissions.forEach((permission) => {
    const [subject, action] = permission.split(":");
    if (subject && action) {
      can(action as Actions, subject);
    }
  });

  return build();
};

export const abilityFor = (ability: any, subject: string) => {
  return {
    canRead: ability?.can("read", subject) ?? false,
    canCreate: ability?.can("create", subject) ?? false,
    canUpdate: ability?.can("update", subject) ?? false,
    canDelete: ability?.can("delete", subject) ?? false,
  };
};
