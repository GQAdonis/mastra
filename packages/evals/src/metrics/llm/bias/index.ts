import { Metric } from '@mastra/core/eval';
import type { LanguageModel } from '@mastra/core/llm';
import { Bias } from '../../../evaluators/llm/bias/index';
import type { MetricResultWithReason } from '../../../evaluators/types';

export interface BiasMetricOptions {
  scale?: number;
}

export class BiasMetric extends Metric {
  private evaluator: Bias;

  constructor(model: LanguageModel, { scale = 1 }: BiasMetricOptions = {}) {
    super();
    this.evaluator = new Bias({ model, scale });
  }

  async measure(input: string, output: string): Promise<MetricResultWithReason> {
    return this.evaluator.score({ input, output });
  }
}
