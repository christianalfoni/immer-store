import { Immutable, Draft } from 'immer'

export type Options = {
  debug: boolean
}

// A type which can be extended by
// interface Action<Payload> extends IAction<Payload, typeof state, typeof effects> {}
export interface IAction<Payload, S extends State, E extends BaseEffects> {
  (
    context: {
      state: S
      effects: E
    },
    payload?: Payload
  ): any
}

export interface Store<S extends State, A extends BaseActions<any, any>> {
  state: Immutable<Draft<S>>
  actions: ActionsWithoutContext<A>
  subscribe(paths: Set<string>, update: () => void, name: string)
}

export interface Config<
  S extends State,
  E extends BaseEffects,
  A extends BaseActions<S, E>
> {
  state: S
  effects?: E
  actions?: A
}

export enum LogType {
  RENDER = 'RENDER',
  MUTATIONS = 'MUTATIONS',
  COMPONENT_PATHS = 'COMPONENT PATHS',
}

export interface State {
  [key: string]: State | string | number | boolean | object | null | undefined
}

export interface BaseActions<S extends State, E extends BaseEffects> {
  [key: string]: IAction<any, S, E>
}

type Func = (...args: any[]) => any

export interface BaseEffects {
  [key: string]: BaseEffects | Func
}

export type ActionsWithoutContext<U extends BaseActions<any, any>> = {
  [N in keyof U]: U[N] extends (context: any) => any
    ? () => ReturnType<U[N]>
    : U[N] extends (context: any, payload: infer P) => any
    ? (payload: P) => ReturnType<U[N]>
    : U[N] extends BaseActions<any, any>
    ? ActionsWithoutContext<U[N]>
    : never
}
