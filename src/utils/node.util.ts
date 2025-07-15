import { ts } from 'ts-morph';

export function nodeHasDecorator(node: ts.Node | ts.HasModifiers): boolean {
    return ts.getModifiers(node as ts.HasModifiers)?.some(modifier => ts.isDecorator(modifier));
}

export function getNodeDecorators(node: ts.Node | ts.HasModifiers): ts.Decorator[] {
    return ts.getModifiers(node as ts.HasModifiers).filter(modifier => ts.isDecorator(modifier));
}
