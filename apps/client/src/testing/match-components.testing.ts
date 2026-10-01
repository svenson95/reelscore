import type { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type {
  EvaluationAnalyses,
  EventWithResult,
} from '@reelscore-sdk/models';

import { EXAMPLE_FIXTURE } from './fixtures.mock';

export function renderComponent<T>(
  componentType: Type<T>,
  inputValues: Record<string, unknown>
) {
  const componentFixture = TestBed.createComponent(componentType);

  for (const [inputName, inputValue] of Object.entries(inputValues)) {
    componentFixture.componentRef.setInput(inputName, inputValue);
  }

  componentFixture.detectChanges();

  return componentFixture;
}

export function readElementText(element: Element): string {
  const textContent = element.textContent ?? '';

  return textContent.replace(/\s+/g, ' ').trim();
}

export function readElementTexts(
  rootElement: Element,
  selector: string
): string[] {
  const matchingElements = Array.from(rootElement.querySelectorAll(selector));

  return matchingElements.map(readElementText);
}

export function createMatchEvent(
  overrides: Partial<EventWithResult> = {}
): EventWithResult {
  return {
    time: { elapsed: 20, extra: null },
    team: { ...EXAMPLE_FIXTURE.teams.home, goals: 1 },
    player: { id: 10, name: 'Scorer' },
    assist: { id: null, name: null },
    type: 'Goal',
    detail: 'Normal Goal',
    comments: '',
    result: { home: 1, away: 0 },
    ...overrides,
  };
}

export function createFixtureAnalysis(
  overrides: Partial<EvaluationAnalyses> = {}
): EvaluationAnalyses {
  return {
    minute: 20,
    type: 'GOAL',
    level: 'LUCKY',
    comments: 'Comment',
    player: 'Player',
    ...overrides,
  };
}
