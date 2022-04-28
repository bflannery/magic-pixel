export function isEnumValue<K extends string, T extends string>(enumType: { [P in K]: T }, value: string): value is T {
  return Object.values(enumType).includes(value)
}

export function isNonNull<T extends unknown | null | undefined>(t: T): t is NonNullable<T> {
  return t !== undefined && t !== null
}

// creates a new type taking all members that are of type U
// ex: OnlyMembersOfType<{ a: string, b: number }, string> = interface { a: 'a' }
export type OnlyMembersOfType<T, U> = { [P in keyof T]: T[P] extends U ? P : never }

// grabs union type of all types of values of T
// ex: ValueOf<{ a: string, b: 'a', c: number }> = string | 'a' | number
export type ValueOf<T> = T[keyof T]

// grabs all key values where the value type is of type U
// ex: KeysWithValuesOf<{ a: string, b: number, c: Person }, string> = "a"
export type KeysWithValuesOf<T, U> = ValueOf<OnlyMembersOfType<T, U>>

// returns a type w/ props only of type U
// ex: SubOfType<{ a: string, b: number, c: string }, number> = { b: number }
export type SubOfType<F, U> = { [K in KeysWithValuesOf<F, U>]: U }
