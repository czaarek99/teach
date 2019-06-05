import { IViewModel } from "mobx-utils";

export type ViewModel<T> = IViewModel<T> & T;