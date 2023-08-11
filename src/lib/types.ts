import type {Database} from "$lib/database.types";

export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];


export type PasswordEntry = Row<"PasswordEntry">
export type PasswordEntryView = Omit<PasswordEntry, "encryptedPassword" | "userId">