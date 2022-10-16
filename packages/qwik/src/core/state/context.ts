import type { OnRenderFn } from '../component/component.public';
import { destroyWatch, SubscriberEffect } from '../use/use-watch';
import type { QRLInternal } from '../qrl/qrl-class';
import type { QRL } from '../qrl/qrl.public';
import type { StyleAppend } from '../use/use-core';
import type { ProcessedJSXNode } from '../render/dom/render-dom';
import type { QwikElement, VirtualElement } from '../render/dom/virtual-element';
import type { SubscriptionManager } from './common';
import type { Listener } from './listeners';

export const Q_CTX = '_qc_';

export interface QContextEvents {
  [eventName: string]: QRL | undefined;
}

export interface QContext {
  $element$: QwikElement;
  $refMap$: any[];
  $dirty$: boolean;
  $needAttachListeners$: boolean;
  $id$: string;
  $mounted$: boolean;
  $props$: Record<string, any> | null;
  $componentQrl$: QRLInternal<OnRenderFn<any>> | null;
  li: Listener[];
  $seq$: any[] | null;
  $watches$: SubscriberEffect[] | null;
  $contexts$: Map<string, any> | null;
  $appendStyles$: StyleAppend[] | null;
  $scopeIds$: string[] | null;
  $vdom$: ProcessedJSXNode | null;
  $slots$: ProcessedJSXNode[] | null;
  $parent$: QContext | null;
}

export const tryGetContext = (element: QwikElement): QContext | undefined => {
  return (element as any)[Q_CTX];
};

export const getContext = (element: Element | VirtualElement): QContext => {
  let ctx = tryGetContext(element)!;
  if (!ctx) {
    (element as any)[Q_CTX] = ctx = {
      $dirty$: false,
      $mounted$: false,
      $needAttachListeners$: false,
      $id$: '',
      $element$: element,
      $refMap$: [],
      li: [],
      $watches$: null,
      $seq$: null,
      $slots$: null,
      $scopeIds$: null,
      $appendStyles$: null,
      $props$: null,
      $vdom$: null,
      $componentQrl$: null,
      $contexts$: null,
      $parent$: null,
    };
  }
  return ctx;
};

export const cleanupContext = (elCtx: QContext, subsManager: SubscriptionManager) => {
  const el = elCtx.$element$;
  elCtx.$watches$?.forEach((watch) => {
    subsManager.$clearSub$(watch);
    destroyWatch(watch);
  });
  if (elCtx.$componentQrl$) {
    subsManager.$clearSub$(el);
  }
  elCtx.$componentQrl$ = null;
  elCtx.$seq$ = null;
  elCtx.$watches$ = null;
  elCtx.$dirty$ = false;

  (el as any)[Q_CTX] = undefined;
};