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
          id: string
          userId: string
        }
        Insert: {
          data: Json
          fingerprint: string
          id?: string
          userId: string
        }
        Update: {
          data?: Json
          fingerprint?: string
          id?: string
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
      ProjectStats: {
        Row: {
          createdAt: string
          gitStars: number
          managedPasswords: number
          pageViews: number
          totalUsers: number
        }
        Insert: {
          createdAt?: string
          gitStars: number
          managedPasswords: number
          pageViews: number
          totalUsers: number
        }
        Update: {
          createdAt?: string
          gitStars?: number
          managedPasswords?: number
          pageViews?: number
          totalUsers?: number
        }
        Relationships: []
      }
      SharedPasswords: {
        Row: {
          encrypted: string
          expiresAt: string
          id: string
        }
        Insert: {
          encrypted: string
          expiresAt: string
          id?: string
        }
        Update: {
          encrypted?: string
          expiresAt?: string
          id?: string
        }
        Relationships: []
      }
      UserData: {
        Row: {
          mainDeviceId: string | null
          premium: boolean
          stripeCustomerId: string | null
          userId: string
        }
        Insert: {
          mainDeviceId?: string | null
          premium?: boolean
          stripeCustomerId?: string | null
          userId: string
        }
        Update: {
          mainDeviceId?: string | null
          premium?: boolean
          stripeCustomerId?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserData_mainDeviceId_fkey"
            columns: ["mainDeviceId"]
            referencedRelation: "DeviceEntry"
            referencedColumns: ["id"]
          },
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
      decrypted_VaultKey: {
        Row: {
          decrypted_vaultKeyHash: string | null
          id: string | null
          vaultKeyHash: string | null
        }
        Insert: {
          decrypted_vaultKeyHash?: never
          id?: string | null
          vaultKeyHash?: string | null
        }
        Update: {
          decrypted_vaultKeyHash?: never
          id?: string | null
          vaultKeyHash?: string | null
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
    Functions: {
      user_exists: {
        Args: {
          email: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
