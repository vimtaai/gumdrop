import { useTry } from "./use-try.js";

/** @typedef {(path: string) => Promise<string>} Loader */
/** @typedef {(content: string) => string} Sanitizer */
/** @typedef {{ loadFile: Loader, sanitize: Sanitizer, root: string }} Dependencies */
/** @typedef {{ dataTransformer: Transformer, documentTransformer: Transformer }} Transformers */
/** @typedef {{ dependencies: Dependencies, transformers: Transformers }} TransformerContext */
/** @typedef {(resource: Resource, context?: TransformerContext) => Promise<Resource>} Transformation */

export class Transformer {
  /** @type {Transformation[]} */
  #transformations;
  /** @type {Partial<TransformerContext>} */
  #context;

  /**
   * @param {Transformation[]} [transformations]
   * @param {Partial<TransformerContext>} [context]
   */
  constructor(transformations = [], context = {}) {
    this.#transformations = transformations;
    this.#context = context;
    this.transform = this.transform.bind(this);
    useTry(this.transform);
  }

  /** @param {Transformation} transformation */
  use(transformation) {
    return new Transformer([...this.#transformations, transformation], this.#context);
  }

  /** @param {Partial<TransformerContext>} context */
  setContext(context) {
    return new Transformer(this.#transformations, { ...this.#context, ...context });
  }

  /** @param {Resource} resource */
  async transform(resource) {
    return this.#transformations.reduce(
      async (result, transformation) => transformation(await result, this.#context),
      resource,
    );
  }
}
