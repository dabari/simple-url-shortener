import { BehaviorSubject, Observable } from "rxjs";

/**
 * Observable state store
 */
export class StateStore<T> {
	private stateSubject$: BehaviorSubject<T>;
	public readonly state$: Observable<T>;

	/**
	 * Create new state store with initial state
	 * @param state
	 */
	constructor(state: T) {
		this.stateSubject$ = new BehaviorSubject(state);
		this.state$ = this.stateSubject$.asObservable();
	}

	/**
	 * Get the current state
	 */
	get state(): T {
		return this.stateSubject$.getValue();
	}

	/**
	 * Set the new state
	 * @param nextState
	 */
	setState(nextState: T): void {
		this.stateSubject$.next(nextState);
	}
}
