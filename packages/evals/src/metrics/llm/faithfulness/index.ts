import { Metric } from '@mastra/core/eval';
import type { LanguageModel } from '@mastra/core/llm';
import { Faithfulness } from '../../../evaluators/llm/faithfulness/index';
import type { MetricResultWithReason } from '../types';

export interface FaithfulnessMetricOptions {
  scale?: number;
  context: string[];
}

export class FaithfulnessMetric extends Metric {
  private evaluator: Faithfulness;

  constructor(model: LanguageModel, { scale = 1, context }: FaithfulnessMetricOptions) {
    super();
    this.evaluator = new Faithfulness({ model, scale, context });
  }

  async measure(input: string, output: string): Promise<MetricResultWithReason> {
    return this.evaluator.score({ input, output });
  }
}
