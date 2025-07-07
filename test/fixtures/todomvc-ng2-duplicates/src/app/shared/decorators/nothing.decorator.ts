export function Nothing() {
    return <T extends { new (...args: any[]): {} }>(targetClassConstructor: T) => {};
}
