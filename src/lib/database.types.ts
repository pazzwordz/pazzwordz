export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      DeviceEntry: {
        Row: {
          data: Json
          fingerprint: string
          userId: string
        }
        Insert: {
          data: Json
          fingerprint: string
          userId: string
        }
        Update: {
          data?: Json
          fingerprint?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "DeviceEntry_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      PasswordEntry: {
        Row: {
          encryptedPassword: string
          id: string
          location: string
          user: string
          userId: string
        }
        Insert: {
          encryptedPassword: string
          id?: string
          location: string
          user: string
          userId: string
        }
        Update: {
          encryptedPassword?: string
          id?: string
          location?: string
          user?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "PasswordEntry_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      UserData: {
        Row: {
          premium: boolean
          stripeCustomerId: string | null
          userId: string
        }
        Insert: {
          premium?: boolean
          stripeCustomerId?: string | null
          userId: string
        }
        Update: {
          premium?: boolean
          stripeCustomerId?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserData_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      VaultKey: {
        Row: {
          id: string
          vaultKeyHash: string
        }
        Insert: {
          id: string
          vaultKeyHash: string
        }
        Update: {
          id?: string
          vaultKeyHash?: string
        }
        Relationships: [
          {
            foreignKeyName: "VaultKey_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
