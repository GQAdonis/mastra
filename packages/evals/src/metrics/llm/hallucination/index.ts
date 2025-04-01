import { Metric } from '@mastra/core/eval';
import type { LanguageModel } from '@mastra/core/llm';
import { Hallucination } from '../../../evaluators/llm/hallucination/index';
import type { MetricResultWithReason } from '../../../evaluators/types';

export interface HallucinationMetricOptions {
  scale?: number;
  context: string[];
}

export class HallucinationMetric extends Metric {
  private evaluator: Hallucination;

  constructor(model: LanguageModel, { scale = 1, context }: HallucinationMetricOptions) {
    super();
    this.evaluator = new Hallucination({ model, scale, context });
  }

  async measure(input: string, output: string): Promise<MetricResultWithReason> {
    return this.evaluator.score({ input, output });
  }
}
