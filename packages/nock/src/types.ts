/**
 * Replaces primitive literals with primitive deeply
 */
export type DeepReplacePrimitiveLiteralsWithPrimitive<T> = T extends string
    ? string
    : T extends boolean
    ? boolean
    : T extends number
    ? number
    : // eslint-disable-next-line @typescript-eslint/ban-types
    T extends object
    ? {
          [P in keyof T]: DeepReplacePrimitiveLiteralsWithPrimitive<T[P]>;
      }
    : T extends Array<infer U>
    ? Array<DeepReplacePrimitiveLiteralsWithPrimitive<U>>
    : T;
